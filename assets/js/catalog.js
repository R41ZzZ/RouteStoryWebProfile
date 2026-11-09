/*!
 * ============================================================================
 *  RouteStory — Katalog Layanan, Pipeline, dan Konfigurasi Estimator
 * ============================================================================
 *
 *  Seluruh isi katalog dipisah dari markup supaya tim non-teknis dapat
 *  menambah atau mengubah layanan tanpa menyentuh index.html.
 *
 *  Dipakai oleh : index.html (via <script src>), assets/js/main.js
 *
 *  PENTING — angka harga di berkas ini adalah ANGKA PLACEHOLDER untuk
 *  keperluan demonstrasi tugas. Ganti dengan harga resmi tim sebelum
 *  website dipakai untuk penawaran nyata.
 * ============================================================================
 */
(function (global) {
    'use strict';

    /* --------------------------------------------------------------------- *
     * Kategori layanan
     * --------------------------------------------------------------------- */

    var CATEGORIES = [
        { id: 'all',      label: 'Semua Layanan',        icon: 'fa-layer-group' },
        { id: 'data',     label: 'Data & Analitik',      icon: 'fa-database' },
        { id: 'visual',   label: 'Visualisasi & 3D',     icon: 'fa-cube' },
        { id: 'platform', label: 'Platform & Integrasi', icon: 'fa-server' },
        { id: 'physical', label: 'Produk Fisik',         icon: 'fa-box-open' }
    ];

    /* --------------------------------------------------------------------- *
     * Katalog layanan & produk
     * --------------------------------------------------------------------- */

    var SERVICES = [
        {
            id: 'RS-01',
            name: 'GPX Data Processing & Validation',
            tagline: 'Data aktivitas mentah dibersihkan, divalidasi, dan dinormalisasi.',
            category: 'data',
            icon: 'fa-database',
            priceFrom: 52500,
            unit: 'per aktivitas',
            duration: '1 hari kerja',
            pdca: 'Plan + Do',
            featured: true,
            summary:
                'Fondasi dari seluruh layanan kami. Berkas .gpx, .tcx, atau .fit dari ' +
                'jam tangan dan aplikasi pencatat aktivitas sering mengandung lompatan ' +
                'sinyal, titik duplikat, timestamp tidak berurutan, dan elevasi yang ' +
                'melonjak akibat derau barometer. Kami memprosesnya menjadi dataset ' +
                'bersih yang siap dipakai untuk visualisasi maupun pemodelan 3D.',
            deliverables: [
                'route.geojson — geometri rute ternormalisasi (standar RFC 7946)',
                'stats.json — jarak, durasi, pace, elevation gain, split per km',
                'qc-report.pdf — laporan quality control berisi temuan dan perlakuannya',
                'Berkas sumber asli tetap diarsipkan tanpa modifikasi'
            ],
            tech: ['JavaScript / Node.js', 'DOMParser XML', 'Formula Haversine',
                   'Ramer-Douglas-Peucker', 'JSON Schema validation', 'GeoJSON RFC 7946'],
            inputs: ['.gpx (GPX 1.0 / 1.1)', '.tcx', '.fit', 'Tautan aktivitas Strava publik'],
            outputs: ['GeoJSON', 'JSON', 'CSV', 'PDF laporan QC'],
            process: [
                'Terima berkas melalui portal klien atau WhatsApp.',
                'Parsing XML dan ekstraksi seluruh trackpoint beserta atributnya.',
                'Validasi: rentang koordinat, urutan waktu, deteksi gap sinyal, titik duplikat.',
                'Normalisasi satuan dan pembuangan titik yang tidak dapat dipakai.',
                'Perhitungan statistik dengan filter histeresis 1 m untuk elevasi.',
                'Penerbitan laporan QC dan persetujuan pelanggan.'
            ],
            sla: 'Akurasi jarak dalam toleransi 0,5% terhadap perhitungan aplikasi sumber.',
            note: 'Layanan ini otomatis tercakup dalam setiap paket lain — tidak perlu dibeli terpisah.'
        },

        {
            id: 'RS-02',
            name: 'Route Visualization & Digital Poster',
            tagline: 'Rute dirender menjadi poster vektor siap cetak 300 DPI.',
            category: 'visual',
            icon: 'fa-image',
            priceFrom: 87500,
            unit: 'per desain',
            duration: '2 hari kerja',
            pdca: 'Do + Check',
            featured: true,
            summary:
                'Rute hasil pemrosesan dirender secara terprogram menjadi karya ' +
                'visual: bukan tangkapan layar peta, melainkan geometri vektor yang ' +
                'dibangun ulang dari koordinat asli. Karena berbasis vektor, hasilnya ' +
                'tetap tajam dicetak pada ukuran apa pun, dari kartu pos sampai A1.',
            deliverables: [
                'Berkas SVG vektor (dapat diedit ulang selamanya)',
                'PNG 300 DPI untuk ukuran A4 / A3 / A2',
                'PDF siap cetak dengan bleed 3 mm',
                'Varian tema terang dan gelap',
                'Dua kali revisi desain termasuk dalam harga'
            ],
            tech: ['Generative SVG rendering', 'Proyeksi equirectangular + koreksi cos(lat)',
                   'Tipografi terprogram', 'Palet warna terkurasi', 'Ekspor 300 DPI'],
            inputs: ['Dataset hasil RS-01', 'Preferensi warna & tema',
                     'Teks personal (nama, tanggal, nama acara)'],
            outputs: ['SVG', 'PNG 300 DPI', 'PDF cetak'],
            process: [
                'Pemilihan tema, palet warna, dan tata letak bersama pelanggan.',
                'Rendering geometri rute ke kanvas vektor dengan rasio aspek asli.',
                'Penempatan blok statistik dan elemen tipografi.',
                'Pratinjau digital dikirim untuk persetujuan.',
                'Revisi (maksimal dua putaran), lalu ekspor berkas final.'
            ],
            sla: 'Pratinjau pertama dikirim maksimal 2 hari kerja setelah data disetujui.'
        },

        {
            id: 'RS-03',
            name: '3D Route Modeling (GPX ke STL)',
            tagline: 'Polyline rute dikonversi menjadi mesh 3D yang layak cetak.',
            category: 'visual',
            icon: 'fa-cubes',
            priceFrom: 140000,
            unit: 'per model',
            duration: '2-3 hari kerja',
            pdca: 'Do',
            featured: true,
            summary:
                'Tahap rekayasa paling menuntut: mengubah garis rute menjadi benda ' +
                'padat yang benar-benar dapat dicetak. Mesh harus watertight ' +
                '(manifold), ketebalan minimum harus di atas diameter nozzle, dan ' +
                'tikungan tajam harus tetap terbaca setelah dicetak. Semua diperiksa ' +
                'secara otomatis sebelum masuk ke printer.',
            deliverables: [
                'Berkas .stl dan .3mf siap slicing',
                'Render pratinjau 3D dari empat sudut pandang',
                'Laporan kelayakan cetak: ketebalan minimum, sudut overhang, volume filamen',
                'Berkas sumber parametrik agar ukuran dapat diubah di kemudian hari'
            ],
            tech: ['Parametric mesh generation', 'Ekstrusi polyline',
                   'Validasi manifold / watertight', 'Analisis overhang',
                   'Slicing profile (PrusaSlicer / Orca)'],
            inputs: ['Dataset hasil RS-01', 'Dimensi target cetak', 'Ketebalan relief yang diinginkan'],
            outputs: ['STL', '3MF', 'Render PNG', 'PDF laporan kelayakan'],
            process: [
                'Simplifikasi rute ke jumlah vertex optimal untuk produksi.',
                'Ekstrusi polyline menjadi badan 3D dengan profil relief terpilih.',
                'Pemeriksaan manifold, self-intersection, dan ketebalan dinding minimum.',
                'Penambahan basis, lubang gantung, dan plakat statistik.',
                'Uji slicing dan estimasi waktu serta volume filamen.'
            ],
            sla: 'Mesh dijamin watertight dan lolos pemeriksaan slicer sebelum diserahkan.'
        },

        {
            id: 'RS-04',
            name: 'Interactive Race Recap (Web Microsite)',
            tagline: 'Halaman web interaktif berisi rute beranimasi, split, dan grafik elevasi.',
            category: 'platform',
            icon: 'fa-chart-line',
            priceFrom: 175000,
            unit: 'per microsite',
            duration: '3 hari kerja',
            pdca: 'Do + Action',
            featured: true,
            summary:
                'Produk digital murni. Kami membangun halaman web ringan yang dapat ' +
                'dibagikan lewat tautan atau kode QR: rute digambar bertahap mengikuti ' +
                'progres lari, split per kilometer dapat ditelusuri, dan grafik elevasi ' +
                'ikut bergerak. Cocok diunggah ke media sosial atau ditempel di ' +
                'belakang bingkai fisik.',
            deliverables: [
                'Microsite di subdomain nama-anda.routestory.app, aktif 12 bulan',
                'Kode QR resolusi cetak menuju microsite',
                'Animasi rute progresif dan grafik elevasi interaktif',
                'Tabel split per kilometer',
                'Open Graph image agar tampil rapi saat dibagikan di media sosial'
            ],
            tech: ['HTML5 + SVG animation', 'Canvas chart rendering', 'Responsive layout',
                   'Static hosting (Vercel)', 'QR code generator', 'Open Graph meta'],
            inputs: ['Dataset hasil RS-01', 'Foto opsional', 'Teks narasi opsional'],
            outputs: ['URL microsite', 'PNG kode QR', 'Paket sumber HTML statis'],
            process: [
                'Pemilihan template dan penentuan subdomain.',
                'Penyuntikan dataset rute ke dalam template.',
                'Penyusunan animasi, grafik elevasi, dan tabel split.',
                'Uji tampilan pada perangkat seluler dan desktop.',
                'Publikasi, pembuatan kode QR, dan serah terima tautan.'
            ],
            sla: 'Hosting dan domain aktif 12 bulan, dapat diperpanjang tahunan.'
        },

        {
            id: 'RS-05',
            name: 'Event & Community Batch Pipeline',
            tagline: 'Pemrosesan massal ratusan peserta dengan satu template seragam.',
            category: 'platform',
            icon: 'fa-people-group',
            priceFrom: 24500,
            unit: 'per peserta (min. 50)',
            duration: '5-10 hari kerja',
            pdca: 'Plan + Do + Check',
            summary:
                'Dirancang untuk penyelenggara lomba dan komunitas olahraga. ' +
                'Alih-alih mengerjakan satu per satu, kami menjalankan satu template ' +
                'desain terhadap seluruh daftar peserta melalui batch job. Konsistensi ' +
                'terjaga, biaya per peserta turun drastis, dan progresnya dapat dipantau.',
            deliverables: [
                'Paket aset per peserta (poster digital dan/atau berkas 3D)',
                'Rekap CSV berisi status pemrosesan setiap peserta',
                'Dashboard progres batch untuk penyelenggara',
                'Laporan QC sampling (minimal 10% peserta diperiksa manual)',
                'Satu template desain bertema acara, hak pakai penuh'
            ],
            tech: ['Batch job runner', 'Ingestion CSV / Excel', 'Template engine',
                   'Penamaan berkas otomatis', 'Pelaporan progres', 'QC sampling statistik'],
            inputs: ['Daftar peserta (CSV / Excel)', 'Kumpulan berkas GPX peserta',
                     'Aset merek acara (logo, warna, font)'],
            outputs: ['Arsip ZIP per peserta', 'CSV rekap', 'Tautan dashboard batch'],
            process: [
                'Workshop penentuan template dan pemetaan kolom data peserta.',
                'Uji coba pada 5 peserta percontohan untuk disetujui penyelenggara.',
                'Eksekusi batch penuh dengan pencatatan log per peserta.',
                'QC sampling dan perbaikan peserta yang gagal diproses.',
                'Serah terima arsip, rekap, dan dokumentasi.'
            ],
            sla: 'Tingkat keberhasilan pemrosesan minimal 97%; peserta yang gagal diproses ulang tanpa biaya.'
        },

        {
            id: 'RS-07',
            name: '3D Printed Route Frame',
            tagline: 'Keluaran fisik dari pipeline digital — bingkai relief rute.',
            category: 'physical',
            icon: 'fa-image-portrait',
            priceFrom: 245000,
            unit: 'per unit',
            duration: '5-7 hari kerja',
            pdca: 'Do + Check + Action',
            featured: true,
            summary:
                'Produk fisik unggulan kami, dan sekaligus bukti bahwa pipeline ' +
                'digital bekerja: relief rute dicetak tiga dimensi, dirakit di dalam ' +
                'bingkai, lengkap dengan plakat statistik yang angkanya berasal ' +
                'langsung dari data aktivitas, bukan ditulis ulang secara manual.',
            deliverables: [
                'Bingkai 20x25 cm atau 30x40 cm, relief rute PLA+',
                'Plakat statistik (jarak, waktu, pace, elevasi, tanggal)',
                'Kait gantung dan penyangga meja',
                'Kemasan berlapis pelindung, aman untuk pengiriman ekspedisi',
                'Kartu kode QR menuju microsite (bila membeli RS-04)'
            ],
            tech: ['FDM 3D printing (PLA+)', 'Layer height 0,12 mm untuk detail rute',
                   'Post-processing manual', 'Perakitan bingkai', 'QC fisik berlapis'],
            inputs: ['Mesh hasil RS-03', 'Pilihan ukuran, warna filamen, dan jenis bingkai'],
            outputs: ['Produk fisik terkirim', 'Foto dokumentasi sebelum pengemasan'],
            process: [
                'Konfirmasi pratinjau desain dan ukuran akhir.',
                'Pencetakan 3D relief rute dan elemen plakat.',
                'Post-processing: pembersihan support, perapian tepi, pengecatan bila diminta.',
                'Perakitan ke dalam bingkai dan pemeriksaan kekokohan.',
                'QC akhir, dokumentasi foto, pengemasan, dan pengiriman.'
            ],
            sla: 'Penggantian penuh tanpa biaya bila produk rusak dalam pengiriman (klaim maks. 3x24 jam).'
        }
    ];

    /* --------------------------------------------------------------------- *
     * Pipeline teknologi — delapan tahap, dipetakan ke siklus PDCA
     * --------------------------------------------------------------------- */

    var PIPELINE = [
        {
            key: 'ingest',
            step: '01',
            name: 'Ingest',
            pdca: 'Plan',
            icon: 'fa-file-import',
            headline: 'Menerima data aktivitas dari mana pun sumbernya.',
            detail:
                'Pelanggan mengunggah berkas .gpx, .tcx, atau .fit melalui portal ' +
                'proyek, atau menghubungkan akun Strava sekali lewat OAuth agar ' +
                'aktivitas tersinkronisasi otomatis. Berkas sumber selalu diarsipkan ' +
                'apa adanya sebelum diproses, sehingga kami bisa kembali ke data ' +
                'asli kapan pun diperlukan.',
            activities: [
                'Penerimaan berkas via portal klien',
                'Alur OAuth 2.0 untuk akun / klub Strava',
                'Arsip berkas sumber tanpa modifikasi',
                'Pencatatan metadata: perangkat perekam, jenis aktivitas, waktu'
            ],
            tech: ['FileReader API', 'OAuth 2.0', 'Strava REST API', 'Object storage'],
            output: 'Berkas mentah terarsip + entri metadata proyek'
        },
        {
            key: 'validate',
            step: '02',
            name: 'Validate',
            pdca: 'Plan',
            icon: 'fa-clipboard-check',
            headline: 'Data diperiksa sebelum satu rupiah pun dibelanjakan.',
            detail:
                'Data GPS dari dunia nyata selalu kotor. Kami memeriksa rentang ' +
                'koordinat, urutan timestamp, titik duplikat, dan lompatan sinyal ' +
                'akibat gedung tinggi atau terowongan. Temuannya disusun menjadi ' +
                'laporan QC yang ditunjukkan ke pelanggan — inilah titik di mana ' +
                'masalah data ditemukan, bukan setelah bingkai dicetak.',
            activities: [
                'Validasi rentang lintang dan bujur',
                'Deteksi gap sinyal di atas 120 meter',
                'Pembuangan titik duplikat dan koordinat mustahil',
                'Pemeriksaan kelengkapan elevasi dan timestamp'
            ],
            tech: ['JSON Schema', 'Aturan validasi geospasial', 'Pelaporan QC'],
            output: 'Dataset bersih + laporan QC untuk persetujuan pelanggan'
        },
        {
            key: 'extract',
            step: '03',
            name: 'Extract',
            pdca: 'Do',
            icon: 'fa-calculator',
            headline: 'Statistik dihitung ulang dari koordinat, bukan disalin.',
            detail:
                'Angka yang nantinya tercetak di produk kami hitung sendiri dari ' +
                'koordinat memakai formula haversine, bukan menyalin tangkapan layar ' +
                'aplikasi. Elevation gain disaring dengan histeresis 1 meter supaya ' +
                'derau barometer tidak menggelembungkan angkanya. Split per kilometer ' +
                'dihitung dari jarak kumulatif, bukan dari pembagian rata-rata.',
            activities: [
                'Jarak kumulatif dengan formula haversine',
                'Durasi total dan waktu bergerak (moving time)',
                'Pace rata-rata dan split per kilometer',
                'Elevation gain / loss dengan filter derau',
                'Bounding box dan dimensi fisik rute'
            ],
            tech: ['Formula Haversine', 'Filter histeresis elevasi', 'Analisis split'],
            output: 'stats.json — seluruh metrik yang akan tercetak di produk'
        },
        {
            key: 'simplify',
            step: '04',
            name: 'Simplify',
            pdca: 'Do',
            icon: 'fa-compress',
            headline: 'Ribuan titik dipangkas tanpa mengubah bentuk rute.',
            detail:
                'Satu aktivitas lari bisa berisi lebih dari 3.000 trackpoint. Jumlah ' +
                'itu memberatkan proses slicing dan tidak memberi detail tambahan ' +
                'pada cetakan 20 sentimeter. Algoritma Ramer-Douglas-Peucker ' +
                'membuang titik yang tidak mengubah bentuk, dengan toleransi ' +
                'penyimpangan yang dapat diatur dalam satuan meter.',
            activities: [
                'Proyeksi koordinat ke bidang metrik lokal',
                'Ramer-Douglas-Peucker dengan toleransi terkonfigurasi',
                'Verifikasi bahwa bentuk rute tetap setia pada aslinya',
                'Penyesuaian jumlah vertex ke target produksi'
            ],
            tech: ['Ramer-Douglas-Peucker', 'Proyeksi equirectangular', 'Implementasi iteratif'],
            output: 'Polyline ringkas, umumnya 80-95% lebih sedikit titik'
        },
        {
            key: 'render',
            step: '05',
            name: 'Render',
            pdca: 'Do',
            icon: 'fa-pen-ruler',
            headline: 'Geometri rute dibangun ulang sebagai vektor.',
            detail:
                'Rute digambar ulang sebagai path SVG dengan rasio aspek asli ' +
                'dipertahankan — rute tidak boleh melar atau gepeng. Tipografi, blok ' +
                'statistik, dan palet warna disusun secara terprogram sehingga setiap ' +
                'keluaran konsisten, dan satu perubahan tema dapat diterapkan ke ' +
                'ratusan desain sekaligus.',
            activities: [
                'Pembangunan path SVG dari koordinat terproyeksi',
                'Penempatan blok statistik dan tipografi',
                'Penerapan tema warna terang / gelap',
                'Ekspor vektor dan raster 300 DPI'
            ],
            tech: ['Generative SVG', 'Tipografi terprogram', 'Ekspor 300 DPI'],
            output: 'Aset SVG / PNG / PDF siap cetak'
        },
        {
            key: 'model',
            step: '06',
            name: 'Model 3D',
            pdca: 'Do',
            icon: 'fa-cube',
            headline: 'Polyline menjadi benda padat yang layak dicetak.',
            detail:
                'Polyline diekstrusi menjadi mesh tiga dimensi, lalu diperiksa secara ' +
                'otomatis: apakah watertight, apakah ada permukaan yang saling ' +
                'menembus, apakah setiap dinding lebih tebal dari diameter nozzle, ' +
                'dan apakah ada overhang yang butuh support. Mesh yang gagal ' +
                'pemeriksaan tidak pernah sampai ke printer.',
            activities: [
                'Ekstrusi polyline menjadi badan 3D',
                'Pemeriksaan manifold dan self-intersection',
                'Verifikasi ketebalan dinding minimum',
                'Analisis overhang dan kebutuhan support',
                'Estimasi volume filamen dan waktu cetak'
            ],
            tech: ['Parametric mesh generation', 'Validasi watertight', 'Slicing profile'],
            output: 'Berkas STL / 3MF + laporan kelayakan cetak'
        },
        {
            key: 'preview',
            step: '07',
            name: 'Preview & Approve',
            pdca: 'Check',
            icon: 'fa-eye',
            headline: 'Tidak ada produksi sebelum pelanggan menekan setuju.',
            detail:
                'Pratinjau digital diunggah ke portal proyek. Pelanggan memeriksa ' +
                'bentuk rute, ejaan nama, tanggal, dan setiap angka statistik, lalu ' +
                'memberi persetujuan yang tercatat lengkap dengan waktunya. Persetujuan ' +
                'inilah gerbang menuju produksi — mencegah kesalahan cetak yang mahal ' +
                'dan tidak bisa ditarik kembali.',
            activities: [
                'Penerbitan pratinjau digital ke portal',
                'Pemeriksaan ejaan nama, tanggal, dan statistik',
                'Pencatatan persetujuan beserta waktunya',
                'Penanganan hingga dua putaran revisi'
            ],
            tech: ['Portal klien', 'Riwayat versi', 'Audit log persetujuan'],
            output: 'Persetujuan pelanggan terdokumentasi — gerbang menuju produksi'
        },
        {
            key: 'deliver',
            step: '08',
            name: 'Produce & Deliver',
            pdca: 'Action',
            icon: 'fa-truck-fast',
            headline: 'Produksi, QC akhir, serah terima, lalu evaluasi proyek.',
            detail:
                'Aset digital dipublikasikan dan produk fisik dicetak serta dirakit. ' +
                'Setelah QC akhir, seluruh keluaran diserahkan melalui portal dan ' +
                'ekspedisi. Proyek ditutup dengan dokumentasi hasil dan catatan ' +
                'masukan pelanggan, yang menjadi bahan perbaikan proyek berikutnya — ' +
                'inilah tahap Action pada siklus PDCA.',
            activities: [
                'Publikasi aset digital dan microsite',
                'Pencetakan 3D, post-processing, dan perakitan',
                'QC akhir dan dokumentasi foto',
                'Pengemasan dan pengiriman',
                'Penutupan proyek, evaluasi, dan penghapusan data sesuai retensi'
            ],
            tech: ['Static hosting (Vercel)', 'FDM 3D printing', 'Checklist QC',
                   'Kebijakan retensi data'],
            output: 'Produk terkirim + dokumentasi proyek + evaluasi untuk perbaikan berikutnya'
        }
    ];

    /* --------------------------------------------------------------------- *
     * Konfigurasi estimator proyek
     * --------------------------------------------------------------------- */

    var ESTIMATOR = {
        packages: [
            {
                id: 'digital',
                label: 'Paket Digital',
                desc: 'Pemrosesan data + poster digital',
                services: ['RS-01', 'RS-02'],
                price: 140000,
                days: 3
            },
            {
                id: 'interactive',
                label: 'Paket Interaktif',
                desc: 'Paket Digital + microsite race recap',
                services: ['RS-01', 'RS-02', 'RS-04'],
                price: 315000,
                days: 5
            },
            {
                id: 'physical',
                label: 'Paket Fisik',
                desc: 'Pemrosesan data + model 3D + bingkai tercetak',
                services: ['RS-01', 'RS-03', 'RS-07'],
                price: 437500,
                days: 8
            },
            {
                id: 'complete',
                label: 'Paket Lengkap',
                desc: 'Seluruh keluaran digital dan fisik sekaligus',
                services: ['RS-01', 'RS-02', 'RS-03', 'RS-04', 'RS-07'],
                price: 612500,
                days: 10
            }
        ],

        sizes: [
            { id: 'a4', label: '20 x 25 cm', multiplier: 1.0,  days: 0 },
            { id: 'a3', label: '30 x 40 cm', multiplier: 1.45, days: 2 },
            { id: 'a2', label: '40 x 50 cm', multiplier: 1.95, days: 3 }
        ],

        addons: [
            {
                id: 'rush',
                label: 'Pengerjaan prioritas',
                desc: 'Proyek dinaikkan ke antrean terdepan',
                type: 'percent',
                value: 0.3,
                days: -2
            },
            {
                id: 'revision',
                label: 'Putaran revisi tambahan',
                desc: 'Di luar dua revisi yang sudah termasuk',
                type: 'flat',
                value: 52500,
                days: 1
            },
            {
                id: 'source',
                label: 'Serah terima berkas sumber',
                desc: 'SVG editable dan sumber parametrik 3D',
                type: 'flat',
                value: 84000,
                days: 0
            }
        ],

        volumeTiers: [
            { min: 1,   discount: 0,    label: 'Harga satuan' },
            { min: 10,  discount: 0.10, label: 'Diskon komunitas 10%' },
            { min: 50,  discount: 0.22, label: 'Diskon batch 22%' },
            { min: 150, discount: 0.32, label: 'Diskon penyelenggara 32%' }
        ]
    };

    /* --------------------------------------------------------------------- *
     * Tumpukan teknologi yang dipakai perusahaan
     * --------------------------------------------------------------------- */

    var TECH_STACK = [
        { group: 'Pemrosesan Data', items: ['JavaScript / Node.js', 'Python (pandas, geopandas)', 'GeoJSON', 'PostGIS'] },
        { group: 'Visualisasi',     items: ['Generative SVG', 'HTML5 Canvas', 'Tailwind CSS', 'Proyeksi geospasial'] },
        { group: 'Pemodelan 3D',    items: ['Parametric mesh', 'STL / 3MF', 'PrusaSlicer / Orca', 'Validasi manifold'] },
        { group: 'Platform',        items: ['Vercel (static hosting)', 'OAuth 2.0', 'Strava REST API', 'PostgreSQL'] },
        { group: 'Operasional',     items: ['Portal proyek', 'Audit log', 'Enkripsi at-rest', 'Retensi data 90 hari'] }
    ];

    /* --------------------------------------------------------------------- *
     * Ekspor
     * --------------------------------------------------------------------- */

    global.RouteStoryCatalog = {
        categories: CATEGORIES,
        services: SERVICES,
        pipeline: PIPELINE,
        estimator: ESTIMATOR,
        techStack: TECH_STACK,

        /** Cari layanan berdasarkan kode, mis. 'RS-03'. */
        byId: function (id) {
            for (var i = 0; i < SERVICES.length; i++) {
                if (SERVICES[i].id === id) return SERVICES[i];
            }
            return null;
        }
    };
})(window);
