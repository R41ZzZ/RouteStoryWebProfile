/*!
 * ============================================================================
 *  RouteStory Engine v1.0
 *  Pipeline pengolahan data aktivitas GPS (GPX) di sisi klien.
 * ============================================================================
 *
 *  Modul ini adalah inti teknologi informasi RouteStory. Modul ini menjalankan
 *  tahap INGEST -> VALIDATE -> EXTRACT -> SIMPLIFY -> RENDER dari pipeline
 *  perusahaan, seluruhnya di dalam browser pengguna.
 *
 *  Catatan privasi: tidak ada byte yang dikirim ke server. Semua perhitungan
 *  dilakukan secara lokal memakai FileReader + DOMParser.
 *
 *  Dipakai oleh : index.html (via <script src>), assets/js/main.js
 *  Dependensi   : tidak ada (vanilla JavaScript)
 * ============================================================================
 */
(function (global) {
    'use strict';

    /* --------------------------------------------------------------------- *
     * Konstanta geodesi
     * --------------------------------------------------------------------- */

    var R_EARTH = 6371008.8;      // radius rata-rata bumi (IUGG), meter
    var M_PER_DEG_LAT = 110540;   // meter per derajat lintang (aproksimasi lokal)
    var M_PER_DEG_LON = 111320;   // meter per derajat bujur di ekuator

    // Ambang batas untuk membersihkan derau GPS.
    var ELEV_NOISE_THRESHOLD = 1.0;   // meter — perubahan < 1 m diabaikan
    var GAP_DISTANCE_WARN = 120;      // meter — lompatan antar titik dianggap gap
    var MOVING_SPEED_MIN = 0.5;       // m/s  — di bawah ini dianggap berhenti

    /* --------------------------------------------------------------------- *
     * Util matematika
     * --------------------------------------------------------------------- */

    function toRad(deg) {
        return (deg * Math.PI) / 180;
    }

    /**
     * Jarak lingkaran besar antara dua titik {lat, lon} dalam meter.
     * Memakai formula haversine — akurat untuk jarak pendek antar trackpoint.
     */
    function haversine(a, b) {
        var phi1 = toRad(a.lat);
        var phi2 = toRad(b.lat);
        var dPhi = phi2 - phi1;
        var dLam = toRad(b.lon - a.lon);
        var h = Math.sin(dPhi / 2) * Math.sin(dPhi / 2) +
                Math.cos(phi1) * Math.cos(phi2) *
                Math.sin(dLam / 2) * Math.sin(dLam / 2);
        return 2 * R_EARTH * Math.asin(Math.min(1, Math.sqrt(h)));
    }

    /**
     * Proyeksi equirectangular ke bidang metrik lokal.
     * Koreksi cos(lat) wajib, kalau tidak bentuk rute akan gepeng.
     */
    function projectToMeters(points, originLat) {
        var kx = M_PER_DEG_LON * Math.cos(toRad(originLat));
        return points.map(function (p) {
            return { x: p.lon * kx, y: p.lat * M_PER_DEG_LAT, ref: p };
        });
    }

    /* --------------------------------------------------------------------- *
     * TAHAP 1 — INGEST: baca & parse berkas
     * --------------------------------------------------------------------- */

    function ParseError(message) {
        this.name = 'ParseError';
        this.message = message;
    }
    ParseError.prototype = Object.create(Error.prototype);

    /**
     * Mengurai teks GPX menjadi deret trackpoint ternormalisasi.
     * Toleran terhadap <trkpt>, <rtept>, maupun <wpt>, dan terhadap namespace
     * apa pun (getElementsByTagNameNS dengan wildcard).
     *
     * @param  {string} text  isi berkas .gpx
     * @return {{name: string, activityType: string, points: Array}}
     */
    function parseGPX(text) {
        if (!text || !text.trim()) {
            throw new ParseError('Berkas kosong.');
        }

        var doc = new DOMParser().parseFromString(text, 'application/xml');

        if (doc.getElementsByTagName('parsererror').length) {
            throw new ParseError(
                'Struktur XML tidak valid. Pastikan berkas benar-benar .gpx ' +
                'dan tidak terpotong saat diunduh.'
            );
        }

        var nodes = doc.getElementsByTagNameNS('*', 'trkpt');
        if (!nodes.length) nodes = doc.getElementsByTagNameNS('*', 'rtept');
        if (!nodes.length) nodes = doc.getElementsByTagNameNS('*', 'wpt');

        if (!nodes.length) {
            throw new ParseError(
                'Tidak ditemukan satu pun trackpoint (<trkpt>/<rtept>/<wpt>). ' +
                'Berkas ini mungkin hanya berisi metadata tanpa rute.'
            );
        }

        var points = [];
        for (var i = 0; i < nodes.length; i++) {
            var node = nodes[i];
            var lat = parseFloat(node.getAttribute('lat'));
            var lon = parseFloat(node.getAttribute('lon'));

            var eleNode = node.getElementsByTagNameNS('*', 'ele')[0];
            var timeNode = node.getElementsByTagNameNS('*', 'time')[0];

            var ele = eleNode ? parseFloat(eleNode.textContent) : NaN;
            var time = null;
            if (timeNode) {
                var parsed = Date.parse(timeNode.textContent);
                if (!isNaN(parsed)) time = parsed;   // epoch ms
            }

            points.push({
                lat: lat,
                lon: lon,
                ele: isFinite(ele) ? ele : null,
                time: time,
                raw: i
            });
        }

        return {
            name: firstText(doc, 'name') || 'Aktivitas tanpa nama',
            activityType: firstText(doc, 'type') || 'unknown',
            creator: doc.documentElement.getAttribute('creator') || 'unknown',
            points: points
        };
    }

    function firstText(doc, tag) {
        var n = doc.getElementsByTagNameNS('*', tag)[0];
        return n ? n.textContent.trim() : null;
    }

    /* --------------------------------------------------------------------- *
     * TAHAP 2 — VALIDATE: quality control data mentah
     * --------------------------------------------------------------------- */

    /**
     * Memeriksa kewarasan data dan membuang titik yang tidak dapat dipakai.
     * Menghasilkan laporan QC yang ditampilkan ke pelanggan sebelum produksi.
     *
     * @return {{clean: Array, report: Object}}
     */
    function validate(points) {
        var clean = [];
        var issues = [];
        var dropped = 0;
        var missingEle = 0;
        var missingTime = 0;
        var gaps = 0;
        var duplicates = 0;
        var timeDisorder = 0;

        for (var i = 0; i < points.length; i++) {
            var p = points[i];

            // Koordinat mustahil -> buang titiknya.
            if (!isFinite(p.lat) || !isFinite(p.lon) ||
                p.lat < -90 || p.lat > 90 || p.lon < -180 || p.lon > 180) {
                dropped++;
                continue;
            }

            if (p.ele === null) missingEle++;
            if (p.time === null) missingTime++;

            var prev = clean[clean.length - 1];
            if (prev) {
                var d = haversine(prev, p);

                // Titik kembar persis -> tidak menambah informasi.
                if (d < 0.0001) { duplicates++; continue; }

                if (d > GAP_DISTANCE_WARN) gaps++;
                if (prev.time !== null && p.time !== null && p.time < prev.time) {
                    timeDisorder++;
                }
            }

            clean.push(p);
        }

        if (dropped) {
            issues.push({
                level: 'error',
                text: dropped + ' titik dibuang karena koordinat di luar rentang valid.'
            });
        }
        if (duplicates) {
            issues.push({
                level: 'info',
                text: duplicates + ' titik duplikat dihapus.'
            });
        }
        if (gaps) {
            issues.push({
                level: 'warn',
                text: gaps + ' lompatan sinyal > ' + GAP_DISTANCE_WARN +
                      ' m terdeteksi (umum di area padat bangunan).'
            });
        }
        if (timeDisorder) {
            issues.push({
                level: 'warn',
                text: timeDisorder + ' timestamp tidak berurutan.'
            });
        }
        if (missingEle) {
            issues.push({
                level: 'warn',
                text: missingEle + ' titik tanpa data elevasi — profil elevasi tidak lengkap.'
            });
        }
        if (missingTime) {
            issues.push({
                level: 'warn',
                text: missingTime + ' titik tanpa timestamp — pace tidak dapat dihitung penuh.'
            });
        }
        if (!issues.length) {
            issues.push({ level: 'ok', text: 'Semua pemeriksaan lolos tanpa catatan.' });
        }

        if (clean.length < 2) {
            throw new ParseError(
                'Hanya ' + clean.length + ' titik valid yang tersisa. ' +
                'Minimal 2 titik dibutuhkan untuk membentuk rute.'
            );
        }

        var hasErr = issues.some(function (x) { return x.level === 'error'; });
        var hasWarn = issues.some(function (x) { return x.level === 'warn'; });

        return {
            clean: clean,
            report: {
                issues: issues,
                severity: hasErr ? 'error' : (hasWarn ? 'warn' : 'ok'),
                inputCount: points.length,
                validCount: clean.length,
                droppedCount: dropped + duplicates
            }
        };
    }

    /* --------------------------------------------------------------------- *
     * TAHAP 3 — EXTRACT: hitung statistik perjalanan
     * --------------------------------------------------------------------- */

    /**
     * Menghitung metrik yang dicetak pada produk: jarak, durasi, pace,
     * elevation gain, split per kilometer, dan bounding box.
     */
    function computeStats(points) {
        var distance = 0;
        var movingTime = 0;
        var elevGain = 0;
        var elevLoss = 0;
        var eleRef = null;           // referensi histeresis untuk filter derau
        var minEle = Infinity;
        var maxEle = -Infinity;
        var minLat = 90, maxLat = -90, minLon = 180, maxLon = -180;
        var splits = [];
        var nextSplitAt = 1000;
        var lastSplitTime = points[0].time;
        var lastSplitDistance = 0;

        for (var i = 0; i < points.length; i++) {
            var p = points[i];

            if (p.lat < minLat) minLat = p.lat;
            if (p.lat > maxLat) maxLat = p.lat;
            if (p.lon < minLon) minLon = p.lon;
            if (p.lon > maxLon) maxLon = p.lon;

            if (p.ele !== null) {
                if (p.ele < minEle) minEle = p.ele;
                if (p.ele > maxEle) maxEle = p.ele;

                // Filter histeresis: hanya hitung perubahan di atas ambang derau.
                if (eleRef === null) {
                    eleRef = p.ele;
                } else if (p.ele - eleRef > ELEV_NOISE_THRESHOLD) {
                    elevGain += p.ele - eleRef;
                    eleRef = p.ele;
                } else if (eleRef - p.ele > ELEV_NOISE_THRESHOLD) {
                    elevLoss += eleRef - p.ele;
                    eleRef = p.ele;
                }
            }

            if (i === 0) continue;

            var prev = points[i - 1];
            var d = haversine(prev, p);
            distance += d;

            if (prev.time !== null && p.time !== null) {
                var dt = (p.time - prev.time) / 1000;
                if (dt > 0 && dt < 600 && d / dt >= MOVING_SPEED_MIN) {
                    movingTime += dt;
                }
            }

            // Catat split setiap kelipatan 1 km.
            while (distance >= nextSplitAt && p.time !== null && lastSplitTime !== null) {
                var segSeconds = (p.time - lastSplitTime) / 1000;
                splits.push({
                    km: splits.length + 1,
                    seconds: segSeconds,
                    pace: segSeconds   // segmen tepat 1 km -> detik/km
                });
                lastSplitTime = p.time;
                lastSplitDistance = nextSplitAt;
                nextSplitAt += 1000;
            }
        }

        var first = points[0];
        var last = points[points.length - 1];
        var elapsed = (first.time !== null && last.time !== null)
            ? (last.time - first.time) / 1000
            : null;

        return {
            pointCount: points.length,
            distance: distance,                              // meter
            elapsed: elapsed,                                // detik | null
            movingTime: movingTime || null,                  // detik | null
            pace: (elapsed && distance > 0)                  // detik / km
                ? elapsed / (distance / 1000)
                : null,
            speed: (elapsed && elapsed > 0)                  // km / jam
                ? (distance / 1000) / (elapsed / 3600)
                : null,
            elevGain: elevGain,
            elevLoss: elevLoss,
            minEle: isFinite(minEle) ? minEle : null,
            maxEle: isFinite(maxEle) ? maxEle : null,
            bbox: { minLat: minLat, maxLat: maxLat, minLon: minLon, maxLon: maxLon },
            spanMetersX: haversine({ lat: minLat, lon: minLon }, { lat: minLat, lon: maxLon }),
            spanMetersY: haversine({ lat: minLat, lon: minLon }, { lat: maxLat, lon: minLon }),
            splits: splits,
            tailDistance: distance - lastSplitDistance,
            startTime: first.time,
            isLoop: haversine(first, last) < 150
        };
    }

    /* --------------------------------------------------------------------- *
     * TAHAP 4 — SIMPLIFY: Ramer-Douglas-Peucker
     * --------------------------------------------------------------------- */

    function perpendicularDistance(p, a, b) {
        var dx = b.x - a.x;
        var dy = b.y - a.y;
        var lenSq = dx * dx + dy * dy;
        if (lenSq === 0) return Math.sqrt((p.x - a.x) * (p.x - a.x) + (p.y - a.y) * (p.y - a.y));

        var t = ((p.x - a.x) * dx + (p.y - a.y) * dy) / lenSq;
        t = Math.max(0, Math.min(1, t));
        var ex = p.x - (a.x + t * dx);
        var ey = p.y - (a.y + t * dy);
        return Math.sqrt(ex * ex + ey * ey);
    }

    /**
     * Mengurangi jumlah titik tanpa mengubah bentuk rute secara kasat mata.
     * Penting untuk produksi: mesh 3D dengan 10.000 vertex berat untuk di-slice,
     * sedangkan ~200 vertex tetap terlihat identik pada cetakan 20 cm.
     *
     * Implementasi iteratif (bukan rekursif) agar aman untuk track panjang.
     *
     * @param {Array}  points     titik ternormalisasi
     * @param {number} toleranceM toleransi penyimpangan, dalam meter
     */
    function simplify(points, toleranceM) {
        if (points.length < 3) return points.slice();

        var projected = projectToMeters(points, points[0].lat);
        var keep = new Uint8Array(projected.length);
        keep[0] = 1;
        keep[projected.length - 1] = 1;

        var stack = [[0, projected.length - 1]];

        while (stack.length) {
            var range = stack.pop();
            var start = range[0];
            var end = range[1];
            var maxDist = -1;
            var index = -1;

            for (var i = start + 1; i < end; i++) {
                var d = perpendicularDistance(projected[i], projected[start], projected[end]);
                if (d > maxDist) { maxDist = d; index = i; }
            }

            if (maxDist > toleranceM && index !== -1) {
                keep[index] = 1;
                stack.push([start, index]);
                stack.push([index, end]);
            }
        }

        var out = [];
        for (var j = 0; j < projected.length; j++) {
            if (keep[j]) out.push(projected[j].ref);
        }
        return out;
    }

    /* --------------------------------------------------------------------- *
     * TAHAP 5 — RENDER: hasilkan geometri SVG
     * --------------------------------------------------------------------- */

    /**
     * Mengubah deret lat/lon menjadi path SVG yang pas di dalam viewBox,
     * dengan rasio aspek asli dipertahankan (rute tidak boleh melar).
     */
    function toSVGPath(points, width, height, padding) {
        padding = padding == null ? 12 : padding;

        var projected = projectToMeters(points, points[0].lat);
        var minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;

        projected.forEach(function (p) {
            if (p.x < minX) minX = p.x;
            if (p.x > maxX) maxX = p.x;
            if (p.y < minY) minY = p.y;
            if (p.y > maxY) maxY = p.y;
        });

        var spanX = Math.max(maxX - minX, 1e-6);
        var spanY = Math.max(maxY - minY, 1e-6);
        var innerW = width - padding * 2;
        var innerH = height - padding * 2;
        var scale = Math.min(innerW / spanX, innerH / spanY);

        // Pusatkan di dalam viewBox.
        var offsetX = padding + (innerW - spanX * scale) / 2;
        var offsetY = padding + (innerH - spanY * scale) / 2;

        var d = '';
        var coords = [];
        for (var i = 0; i < projected.length; i++) {
            var x = offsetX + (projected[i].x - minX) * scale;
            // sumbu Y SVG tumbuh ke bawah, lintang tumbuh ke atas -> dibalik
            var y = offsetY + (maxY - projected[i].y) * scale;
            d += (i === 0 ? 'M' : 'L') + x.toFixed(2) + ',' + y.toFixed(2);
            coords.push({ x: x, y: y });
        }

        return {
            d: d,
            coords: coords,
            start: coords[0],
            end: coords[coords.length - 1],
            scale: scale
        };
    }

    /**
     * Path area untuk grafik profil elevasi mini.
     */
    function toElevationPath(points, width, height) {
        var withEle = points.filter(function (p) { return p.ele !== null; });
        if (withEle.length < 2) return null;

        var min = Infinity, max = -Infinity;
        withEle.forEach(function (p) {
            if (p.ele < min) min = p.ele;
            if (p.ele > max) max = p.ele;
        });
        var span = Math.max(max - min, 1);

        var d = 'M0,' + height;
        withEle.forEach(function (p, i) {
            var x = (i / (withEle.length - 1)) * width;
            var y = height - ((p.ele - min) / span) * (height - 4) - 2;
            d += 'L' + x.toFixed(1) + ',' + y.toFixed(1);
        });
        d += 'L' + width + ',' + height + 'Z';

        return { d: d, min: min, max: max };
    }

    /* --------------------------------------------------------------------- *
     * Formatter tampilan
     * --------------------------------------------------------------------- */

    function pad(n) {
        return n < 10 ? '0' + n : '' + n;
    }

    var fmt = {
        km: function (meters) {
            return (meters / 1000).toFixed(2);
        },
        duration: function (seconds) {
            if (seconds == null) return '--';
            var s = Math.round(seconds);
            var h = Math.floor(s / 3600);
            var m = Math.floor((s % 3600) / 60);
            if (h > 0) return h + 'j ' + pad(m) + 'm';
            return m + 'm ' + pad(s % 60) + 's';
        },
        clock: function (seconds) {
            if (seconds == null) return '--:--';
            var s = Math.round(seconds);
            var h = Math.floor(s / 3600);
            var m = Math.floor((s % 3600) / 60);
            return (h > 0 ? h + ':' + pad(m) : String(m)) + ':' + pad(s % 60);
        },
        pace: function (secondsPerKm) {
            if (secondsPerKm == null) return '--:--';
            var m = Math.floor(secondsPerKm / 60);
            var s = Math.round(secondsPerKm % 60);
            if (s === 60) { m += 1; s = 0; }
            return m + ':' + pad(s);
        },
        date: function (epochMs) {
            if (!epochMs) return '--';
            try {
                return new Date(epochMs).toLocaleDateString('id-ID', {
                    day: 'numeric', month: 'long', year: 'numeric'
                });
            } catch (e) {
                return new Date(epochMs).toISOString().slice(0, 10);
            }
        },
        bytes: function (n) {
            if (n < 1024) return n + ' B';
            if (n < 1048576) return (n / 1024).toFixed(1) + ' KB';
            return (n / 1048576).toFixed(2) + ' MB';
        },
        int: function (n) {
            return Math.round(n).toLocaleString('id-ID');
        }
    };

    /* --------------------------------------------------------------------- *
     * Orkestrator pipeline
     * --------------------------------------------------------------------- */

    /**
     * Menjalankan seluruh pipeline dan mencatat durasi tiap tahap.
     * Nilai kembaliannya adalah "paket proyek" yang dipakai halaman untuk
     * membangun pratinjau, laporan QC, dan daftar deliverable.
     *
     * @param {string} text         isi berkas GPX
     * @param {Object} [options]    { toleranceM, filename, filesize }
     */
    function run(text, options) {
        options = options || {};
        var tolerance = options.toleranceM == null ? 4 : options.toleranceM;
        var stages = [];
        var clock = global.performance && global.performance.now
            ? global.performance
            : { now: function () { return Date.now(); } };

        function stage(label, fn) {
            var t0 = clock.now();
            var result = fn();
            stages.push({ label: label, ms: clock.now() - t0 });
            return result;
        }

        var parsed = stage('Ingest — baca & parse XML', function () {
            return parseGPX(text);
        });

        var validated = stage('Validate — quality control data', function () {
            return validate(parsed.points);
        });

        var stats = stage('Extract — hitung statistik perjalanan', function () {
            return computeStats(validated.clean);
        });

        var simplified = stage('Simplify — Ramer-Douglas-Peucker', function () {
            return simplify(validated.clean, tolerance);
        });

        var render = stage('Render — bangun geometri SVG', function () {
            return {
                route: toSVGPath(simplified, 300, 300, 16),
                elevation: toElevationPath(validated.clean, 300, 48)
            };
        });

        var totalMs = stages.reduce(function (a, s) { return a + s.ms; }, 0);

        return {
            meta: {
                name: parsed.name,
                activityType: parsed.activityType,
                creator: parsed.creator,
                filename: options.filename || 'contoh.gpx',
                filesize: options.filesize || text.length
            },
            report: validated.report,
            stats: stats,
            points: validated.clean,
            simplified: simplified,
            reduction: validated.clean.length > 0
                ? 1 - simplified.length / validated.clean.length
                : 0,
            render: render,
            timing: { stages: stages, totalMs: totalMs },
            tolerance: tolerance
        };
    }

    /* --------------------------------------------------------------------- *
     * Ekspor
     * --------------------------------------------------------------------- */

    global.RouteStoryEngine = {
        version: '1.0',
        run: run,
        parseGPX: parseGPX,
        validate: validate,
        computeStats: computeStats,
        simplify: simplify,
        toSVGPath: toSVGPath,
        toElevationPath: toElevationPath,
        haversine: haversine,
        fmt: fmt,
        ParseError: ParseError
    };
})(window);
