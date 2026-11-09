/*!
 * ============================================================================
 *  RouteStory — lapisan interaksi halaman
 * ============================================================================
 *  Dipakai oleh : index.html (skrip terakhir yang dimuat)
 *  Bergantung   : window.RouteStoryCatalog     (assets/js/catalog.js)
 *                 window.RouteStoryEngine      (assets/js/gpx-engine.js)
 *                 window.ROUTESTORY_SAMPLE_GPX (assets/data/sample-gpx.js)
 * ============================================================================
 */
(function () {
    'use strict';

    var Catalog = window.RouteStoryCatalog;
    var Engine = window.RouteStoryEngine;
    var fmt = Engine.fmt;

    /* --------------------------------------------------------------------- *
     * Util
     * --------------------------------------------------------------------- */

    function $(id) { return document.getElementById(id); }

    /** Escape teks apa pun yang berasal dari luar (mis. nama berkas pengguna). */
    function esc(str) {
        return String(str == null ? '' : str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    function rupiah(n) {
        return 'Rp ' + Math.round(n).toLocaleString('id-ID');
    }

    /* --------------------------------------------------------------------- *
     * Tema terang / gelap
     * --------------------------------------------------------------------- */

    function initTheme() {
        var darkIcon = $('theme-toggle-dark-icon');
        var lightIcon = $('theme-toggle-light-icon');

        function syncIcons() {
            var isDark = document.documentElement.classList.contains('dark');
            if (darkIcon) darkIcon.classList.toggle('hidden', isDark);
            if (lightIcon) lightIcon.classList.toggle('hidden', !isDark);
        }

        function toggle() {
            var isDark = document.documentElement.classList.toggle('dark');
            localStorage.setItem('color-theme', isDark ? 'dark' : 'light');
            syncIcons();
        }

        syncIcons();
        var btn = $('theme-toggle');
        var btnMobile = $('theme-toggle-mobile');
        if (btn) btn.addEventListener('click', toggle);
        if (btnMobile) btnMobile.addEventListener('click', toggle);
    }

    /* --------------------------------------------------------------------- *
     * Menu seluler
     * --------------------------------------------------------------------- */

    function initMobileMenu() {
        var toggle = $('menu-toggle');
        var menu = $('mobile-menu');
        if (!toggle || !menu) return;

        function close() {
            menu.classList.add('hidden');
            toggle.setAttribute('aria-expanded', 'false');
            toggle.innerHTML = '<i class="fa-solid fa-bars text-brand-500"></i>';
        }

        toggle.addEventListener('click', function () {
            var isOpen = !menu.classList.contains('hidden');
            if (isOpen) {
                close();
            } else {
                menu.classList.remove('hidden');
                toggle.setAttribute('aria-expanded', 'true');
                toggle.innerHTML = '<i class="fa-solid fa-xmark text-brand-500"></i>';
            }
        });

        // Tutup menu setelah salah satu tautan diklik.
        menu.addEventListener('click', function (e) {
            if (e.target.tagName === 'A') close();
        });
    }

    /* --------------------------------------------------------------------- *
     * Preloader + AOS
     * --------------------------------------------------------------------- */

    function initPreloader() {
        window.addEventListener('load', function () {
            setTimeout(function () {
                var preloader = $('preloader');
                if (preloader) {
                    preloader.style.opacity = '0';
                    preloader.style.visibility = 'hidden';
                }
                setTimeout(function () {
                    if (window.AOS) {
                        AOS.init({ once: true, offset: 50, duration: 700 });
                    }
                }, 400);
            }, 2200);
        });
    }

    /* --------------------------------------------------------------------- *
     * Mockup bingkai 3D + jejak kursor
     * --------------------------------------------------------------------- */

    function initFrame3D() {
        var container = document.querySelector('.mockup-container');
        var frame = document.querySelector('.mockup-frame');
        if (!container || !frame) return;

        var isDragging = false;
        var prevX = 0, prevY = 0;
        var rotX = 5, rotY = -15;
        var spinSpeed = 0.3;

        function apply() {
            frame.style.transform = 'rotateX(' + rotX + 'deg) rotateY(' + rotY + 'deg)';
        }

        (function loop() {
            if (!isDragging) {
                rotY += spinSpeed;
                apply();
            }
            requestAnimationFrame(loop);
        })();

        function start(x, y) {
            isDragging = true;
            prevX = x;
            prevY = y;
            frame.style.transition = 'none';
        }

        function move(x, y, sensitivity) {
            rotY += (x - prevX) * sensitivity;
            rotX -= (y - prevY) * sensitivity;
            rotX = Math.max(-80, Math.min(80, rotX));
            prevX = x;
            prevY = y;
            apply();
        }

        function end() {
            if (!isDragging) return;
            isDragging = false;
            frame.style.transition = 'transform .2s ease-out';
            setTimeout(function () { frame.style.transition = 'none'; }, 200);
        }

        container.addEventListener('mousedown', function (e) { start(e.pageX, e.pageY); });
        window.addEventListener('mouseup', end);
        window.addEventListener('mousemove', function (e) {
            createTrail(e.pageX, e.pageY);
            if (!isDragging) return;
            e.preventDefault();
            move(e.pageX, e.pageY, 0.6);
        });

        container.addEventListener('touchstart', function (e) {
            start(e.touches[0].pageX, e.touches[0].pageY);
        }, { passive: true });
        window.addEventListener('touchend', end);
        window.addEventListener('touchmove', function (e) {
            if (!isDragging) return;
            e.preventDefault();
            move(e.touches[0].pageX, e.touches[0].pageY, 0.8);
        }, { passive: false });
    }

    var lastTrail = 0;
    function createTrail(x, y) {
        var now = Date.now();
        if (now - lastTrail < 30) return;
        lastTrail = now;

        var dot = document.createElement('div');
        dot.className = 'trail-dot';
        dot.style.left = (x - 5) + 'px';
        dot.style.top = (y - 5) + 'px';
        document.body.appendChild(dot);

        setTimeout(function () {
            dot.style.opacity = '0';
            dot.style.transform = 'scale(2.5)';
        }, 10);
        setTimeout(function () { dot.remove(); }, 500);
    }

    /* --------------------------------------------------------------------- *
     * Modal
     * --------------------------------------------------------------------- */

    var lastFocused = null;

    function openModal(html) {
        var modal = $('modal');
        $('modal-content').innerHTML = html;
        lastFocused = document.activeElement;
        modal.classList.add('open');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';

        var closeBtn = modal.querySelector('[data-modal-close]');
        if (closeBtn) closeBtn.focus();
    }

    function closeModal() {
        var modal = $('modal');
        modal.classList.remove('open');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        if (lastFocused && lastFocused.focus) lastFocused.focus();
    }

    function initModal() {
        var modal = $('modal');
        modal.addEventListener('click', function (e) {
            if (e.target === modal || e.target.closest('[data-modal-close]')) closeModal();
        });
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && modal.classList.contains('open')) closeModal();
        });
    }

    /* --------------------------------------------------------------------- *
     * Katalog layanan
     * --------------------------------------------------------------------- */

    var activeCategory = 'all';

    function categoryLabel(id) {
        for (var i = 0; i < Catalog.categories.length; i++) {
            if (Catalog.categories[i].id === id) return Catalog.categories[i].label;
        }
        return id;
    }

    function priceLabel(svc) {
        if (svc.priceFrom === 0) return 'Termasuk';
        return 'Mulai ' + rupiah(svc.priceFrom);
    }

    function renderFilters() {
        var wrap = $('service-filters');
        wrap.innerHTML = Catalog.categories.map(function (cat) {
            var count = cat.id === 'all'
                ? Catalog.services.length
                : Catalog.services.filter(function (s) { return s.category === cat.id; }).length;
            var isActive = cat.id === activeCategory;
            return '' +
                '<button type="button" role="tab" aria-selected="' + isActive + '"' +
                ' data-category="' + cat.id + '"' +
                ' class="filter-chip px-4 py-2.5 rounded-full text-sm font-bold border ' +
                (isActive
                    ? 'bg-brand-500 text-white border-brand-500 shadow-lg shadow-brand-500/25'
                    : 'bg-white dark:bg-darkbg-800 border-gray-200 dark:border-gray-700 hover:border-brand-500 hover:text-brand-500') +
                '">' +
                '<i class="fa-solid ' + cat.icon + ' mr-1.5"></i>' + esc(cat.label) +
                ' <span class="opacity-60">(' + count + ')</span>' +
                '</button>';
        }).join('');

        wrap.querySelectorAll('[data-category]').forEach(function (btn) {
            btn.addEventListener('click', function () {
                activeCategory = btn.getAttribute('data-category');
                renderFilters();
                renderGrid();
            });
        });
    }

    function renderGrid() {
        var grid = $('service-grid');
        var list = activeCategory === 'all'
            ? Catalog.services
            : Catalog.services.filter(function (s) { return s.category === activeCategory; });

        $('service-count').textContent =
            'Menampilkan ' + list.length + ' dari ' + Catalog.services.length + ' layanan' +
            (activeCategory === 'all' ? '' : ' — kategori ' + categoryLabel(activeCategory));

        grid.innerHTML = list.map(function (svc, i) {
            return '' +
            '<article tabindex="0" role="button" data-service="' + svc.id + '"' +
            ' class="service-card card-enter bg-white dark:bg-darkbg-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 flex flex-col"' +
            ' style="animation-delay:' + (i * 45) + 'ms"' +
            ' aria-label="Lihat detail ' + esc(svc.name) + '">' +

                '<div class="flex items-start justify-between mb-4">' +
                    '<span class="w-12 h-12 rounded-xl bg-brand-500/10 text-brand-500 flex items-center justify-center text-lg">' +
                        '<i class="fa-solid ' + svc.icon + '"></i>' +
                    '</span>' +
                    '<span class="mono text-[10px] font-bold text-gray-400 dark:text-gray-500 border border-gray-200 dark:border-gray-700 rounded-md px-2 py-1">' +
                        esc(svc.id) +
                    '</span>' +
                '</div>' +

                (svc.featured
                    ? '<span class="self-start mb-2 text-[10px] font-black uppercase tracking-wider text-brand-500 bg-brand-500/10 px-2 py-0.5 rounded">Unggulan</span>'
                    : '') +

                '<h4 class="font-black text-lg leading-snug mb-2">' + esc(svc.name) + '</h4>' +
                '<p class="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-4 flex-grow">' +
                    esc(svc.tagline) +
                '</p>' +

                '<div class="flex flex-wrap gap-1.5 mb-4">' +
                    svc.tech.slice(0, 3).map(function (t) {
                        return '<span class="text-[10px] font-semibold bg-gray-100 dark:bg-darkbg-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded">' + esc(t) + '</span>';
                    }).join('') +
                    (svc.tech.length > 3
                        ? '<span class="text-[10px] font-semibold text-gray-400 px-1 py-1">+' + (svc.tech.length - 3) + '</span>'
                        : '') +
                '</div>' +

                '<div class="pt-4 border-t border-gray-100 dark:border-gray-700 flex items-end justify-between gap-2">' +
                    '<div>' +
                        '<p class="font-black text-brand-500">' + priceLabel(svc) + '</p>' +
                        '<p class="text-[11px] text-gray-500 dark:text-gray-400">' + esc(svc.unit) + ' &middot; ' + esc(svc.duration) + '</p>' +
                    '</div>' +
                    '<span class="text-brand-500 text-sm font-bold whitespace-nowrap">Detail <i class="fa-solid fa-arrow-right text-xs"></i></span>' +
                '</div>' +
            '</article>';
        }).join('');

        grid.querySelectorAll('[data-service]').forEach(function (card) {
            card.addEventListener('click', function () {
                showServiceModal(card.getAttribute('data-service'));
            });
            card.addEventListener('keydown', function (e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    showServiceModal(card.getAttribute('data-service'));
                }
            });
        });
    }

    function bullets(items, icon, colour) {
        return '<ul class="space-y-2">' + items.map(function (it) {
            return '<li class="flex items-start gap-2.5 text-sm text-gray-600 dark:text-gray-300">' +
                '<i class="fa-solid ' + icon + ' ' + colour + ' mt-1 text-xs flex-shrink-0"></i>' +
                '<span>' + esc(it) + '</span></li>';
        }).join('') + '</ul>';
    }

    function chips(items) {
        return '<div class="flex flex-wrap gap-1.5">' + items.map(function (it) {
            return '<span class="text-xs font-semibold bg-gray-100 dark:bg-darkbg-700 text-gray-700 dark:text-gray-200 px-2.5 py-1 rounded-lg">' + esc(it) + '</span>';
        }).join('') + '</div>';
    }

    function showServiceModal(id) {
        var svc = Catalog.byId(id);
        if (!svc) return;

        openModal('' +
        '<div class="relative">' +
            '<button type="button" data-modal-close aria-label="Tutup detail"' +
            ' class="absolute top-5 right-5 w-10 h-10 rounded-full bg-gray-100 dark:bg-darkbg-700 hover:bg-brand-500 hover:text-white transition-colors flex items-center justify-center z-10">' +
                '<i class="fa-solid fa-xmark"></i>' +
            '</button>' +

            '<div class="p-7 md:p-9 border-b border-gray-200 dark:border-gray-700">' +
                '<div class="flex items-center gap-3 mb-4">' +
                    '<span class="w-12 h-12 rounded-xl bg-brand-500 text-white flex items-center justify-center text-lg">' +
                        '<i class="fa-solid ' + svc.icon + '"></i>' +
                    '</span>' +
                    '<div>' +
                        '<p class="mono text-xs font-bold text-brand-500">' + esc(svc.id) + '</p>' +
                        '<p class="text-xs text-gray-500 dark:text-gray-400">' + esc(categoryLabel(svc.category)) + '</p>' +
                    '</div>' +
                '</div>' +
                '<h3 id="modal-title" class="text-2xl md:text-3xl font-black mb-3 pr-12">' + esc(svc.name) + '</h3>' +
                '<p class="text-gray-600 dark:text-gray-300 leading-relaxed">' + esc(svc.summary) + '</p>' +

                '<div class="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">' +
                    '<div class="bg-gray-50 dark:bg-darkbg-700 rounded-xl p-3">' +
                        '<p class="text-[10px] uppercase tracking-wider font-bold text-gray-500 dark:text-gray-400">Harga</p>' +
                        '<p class="font-black text-brand-500 text-sm mt-0.5">' + priceLabel(svc) + '</p>' +
                    '</div>' +
                    '<div class="bg-gray-50 dark:bg-darkbg-700 rounded-xl p-3">' +
                        '<p class="text-[10px] uppercase tracking-wider font-bold text-gray-500 dark:text-gray-400">Satuan</p>' +
                        '<p class="font-bold text-sm mt-0.5">' + esc(svc.unit) + '</p>' +
                    '</div>' +
                    '<div class="bg-gray-50 dark:bg-darkbg-700 rounded-xl p-3">' +
                        '<p class="text-[10px] uppercase tracking-wider font-bold text-gray-500 dark:text-gray-400">Durasi</p>' +
                        '<p class="font-bold text-sm mt-0.5">' + esc(svc.duration) + '</p>' +
                    '</div>' +
                    '<div class="bg-gray-50 dark:bg-darkbg-700 rounded-xl p-3">' +
                        '<p class="text-[10px] uppercase tracking-wider font-bold text-gray-500 dark:text-gray-400">Tahap PDCA</p>' +
                        '<p class="font-bold text-sm mt-0.5">' + esc(svc.pdca) + '</p>' +
                    '</div>' +
                '</div>' +
            '</div>' +

            '<div class="p-7 md:p-9 grid md:grid-cols-2 gap-8">' +
                '<div>' +
                    '<h4 class="font-black mb-3 flex items-center gap-2"><i class="fa-solid fa-box-open text-brand-500"></i> Yang Anda Terima</h4>' +
                    bullets(svc.deliverables, 'fa-circle-check', 'text-emerald-500') +
                '</div>' +
                '<div>' +
                    '<h4 class="font-black mb-3 flex items-center gap-2"><i class="fa-solid fa-list-ol text-brand-500"></i> Alur Pengerjaan</h4>' +
                    '<ol class="space-y-2">' + svc.process.map(function (p, i) {
                        return '<li class="flex items-start gap-2.5 text-sm text-gray-600 dark:text-gray-300">' +
                            '<span class="w-5 h-5 rounded-full bg-brand-500/10 text-brand-500 text-[10px] font-black flex items-center justify-center flex-shrink-0 mt-0.5">' + (i + 1) + '</span>' +
                            '<span>' + esc(p) + '</span></li>';
                    }).join('') + '</ol>' +
                '</div>' +

                '<div>' +
                    '<h4 class="font-black mb-3 flex items-center gap-2"><i class="fa-solid fa-microchip text-brand-500"></i> Teknologi</h4>' +
                    chips(svc.tech) +
                '</div>' +
                '<div class="space-y-5">' +
                    '<div>' +
                        '<h4 class="font-black mb-3 flex items-center gap-2"><i class="fa-solid fa-right-to-bracket text-brand-500"></i> Format Masuk</h4>' +
                        chips(svc.inputs) +
                    '</div>' +
                    '<div>' +
                        '<h4 class="font-black mb-3 flex items-center gap-2"><i class="fa-solid fa-right-from-bracket text-brand-500"></i> Format Keluar</h4>' +
                        chips(svc.outputs) +
                    '</div>' +
                '</div>' +
            '</div>' +

            '<div class="px-7 md:px-9 pb-7 md:pb-9 space-y-3">' +
                '<div class="bg-brand-500/10 border border-brand-500/20 rounded-xl p-4">' +
                    '<p class="text-xs font-black uppercase tracking-wider text-brand-500 mb-1">' +
                        '<i class="fa-solid fa-handshake"></i> Jaminan Layanan</p>' +
                    '<p class="text-sm text-gray-700 dark:text-gray-200">' + esc(svc.sla) + '</p>' +
                '</div>' +
                (svc.note
                    ? '<p class="text-xs text-gray-500 dark:text-gray-400"><i class="fa-solid fa-circle-info"></i> ' + esc(svc.note) + '</p>'
                    : '') +
                '<div class="flex flex-wrap gap-3 pt-2">' +
                    '<a href="#estimator" data-modal-close class="bg-brand-500 hover:bg-brand-600 text-white font-bold py-3 px-6 rounded-full text-sm transition-colors inline-flex items-center gap-2">' +
                        '<i class="fa-solid fa-calculator"></i> Hitung estimasi biaya</a>' +
                    '<a href="#demo" data-modal-close class="border-2 border-gray-300 dark:border-gray-600 hover:border-brand-500 hover:text-brand-500 font-bold py-3 px-6 rounded-full text-sm transition-colors inline-flex items-center gap-2">' +
                        '<i class="fa-solid fa-play"></i> Lihat pratinjau rute</a>' +
                '</div>' +
            '</div>' +
        '</div>');
    }

    /* --------------------------------------------------------------------- *
     * Pipeline interaktif
     * --------------------------------------------------------------------- */

    var activeStage = 0;

    function renderPipelineSteps() {
        var wrap = $('pipeline-steps');
        wrap.innerHTML = Catalog.pipeline.map(function (st, i) {
            return '' +
            '<button type="button" role="tab" data-stage="' + i + '" aria-selected="' + (i === activeStage) + '"' +
            ' class="pipeline-step bg-white dark:bg-darkbg-700 border border-gray-200 dark:border-gray-600 rounded-xl p-3 text-center">' +
                '<p class="pipeline-step-num mono text-[10px] font-bold text-gray-400 dark:text-gray-500">' + st.step + '</p>' +
                '<i class="fa-solid ' + st.icon + ' my-1.5 block"></i>' +
                '<p class="text-xs font-black leading-tight">' + esc(st.name) + '</p>' +
                '<p class="pipeline-step-pdca text-[10px] text-gray-400 dark:text-gray-500 mt-0.5">' + esc(st.pdca) + '</p>' +
            '</button>';
        }).join('');

        wrap.querySelectorAll('[data-stage]').forEach(function (btn) {
            btn.addEventListener('click', function () {
                activeStage = parseInt(btn.getAttribute('data-stage'), 10);
                renderPipelineSteps();
                renderPipelineDetail();
            });
        });
    }

    function renderPipelineDetail() {
        var st = Catalog.pipeline[activeStage];
        $('pipeline-detail').innerHTML = '' +
        '<div class="pipeline-panel bg-white dark:bg-darkbg-700 border border-gray-200 dark:border-gray-600 rounded-3xl p-7 md:p-10 shadow-xl">' +
            '<div class="flex flex-wrap items-center gap-3 mb-5">' +
                '<span class="w-12 h-12 rounded-xl bg-brand-500 text-white flex items-center justify-center text-lg">' +
                    '<i class="fa-solid ' + st.icon + '"></i></span>' +
                '<div>' +
                    '<p class="mono text-xs font-bold text-brand-500">TAHAP ' + st.step + ' / 08</p>' +
                    '<h4 class="text-2xl font-black">' + esc(st.name) + '</h4>' +
                '</div>' +
                '<span class="ml-auto text-xs font-black uppercase tracking-wider bg-brand-500/10 text-brand-500 px-3 py-1.5 rounded-full">PDCA: ' + esc(st.pdca) + '</span>' +
            '</div>' +

            '<p class="text-lg font-bold mb-3">' + esc(st.headline) + '</p>' +
            '<p class="text-gray-600 dark:text-gray-300 leading-relaxed mb-7">' + esc(st.detail) + '</p>' +

            '<div class="grid md:grid-cols-2 gap-7">' +
                '<div>' +
                    '<h5 class="font-black text-sm uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3">Aktivitas di tahap ini</h5>' +
                    bullets(st.activities, 'fa-angle-right', 'text-brand-500') +
                '</div>' +
                '<div class="space-y-5">' +
                    '<div>' +
                        '<h5 class="font-black text-sm uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3">Teknologi</h5>' +
                        chips(st.tech) +
                    '</div>' +
                    '<div>' +
                        '<h5 class="font-black text-sm uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">Keluaran tahap</h5>' +
                        '<p class="text-sm bg-gray-50 dark:bg-darkbg-800 border border-gray-200 dark:border-gray-600 rounded-xl p-3.5 text-gray-700 dark:text-gray-200">' +
                            '<i class="fa-solid fa-arrow-right text-brand-500 mr-1.5"></i>' + esc(st.output) +
                        '</p>' +
                    '</div>' +
                '</div>' +
            '</div>' +

            '<div class="mt-7 pt-5 border-t border-gray-200 dark:border-gray-600 flex items-center justify-between gap-3">' +
                '<button type="button" data-nav="prev" ' + (activeStage === 0 ? 'disabled' : '') +
                ' class="text-sm font-bold text-brand-500 disabled:opacity-30 disabled:cursor-not-allowed inline-flex items-center gap-2">' +
                    '<i class="fa-solid fa-arrow-left"></i> Tahap sebelumnya</button>' +
                '<button type="button" data-nav="next" ' + (activeStage === Catalog.pipeline.length - 1 ? 'disabled' : '') +
                ' class="text-sm font-bold text-brand-500 disabled:opacity-30 disabled:cursor-not-allowed inline-flex items-center gap-2">' +
                    'Tahap berikutnya <i class="fa-solid fa-arrow-right"></i></button>' +
            '</div>' +
        '</div>';

        $('pipeline-detail').querySelectorAll('[data-nav]').forEach(function (btn) {
            btn.addEventListener('click', function () {
                activeStage += btn.getAttribute('data-nav') === 'next' ? 1 : -1;
                activeStage = Math.max(0, Math.min(Catalog.pipeline.length - 1, activeStage));
                renderPipelineSteps();
                renderPipelineDetail();
            });
        });
    }

    function renderTechStack() {
        $('tech-stack').innerHTML = Catalog.techStack.map(function (g) {
            return '' +
            '<div class="bg-gray-50 dark:bg-darkbg-700 border border-gray-200 dark:border-gray-600 rounded-2xl p-5">' +
                '<h5 class="font-black text-sm mb-3 text-brand-500">' + esc(g.group) + '</h5>' +
                '<ul class="space-y-1.5">' + g.items.map(function (it) {
                    return '<li class="text-xs text-gray-600 dark:text-gray-300 flex items-start gap-2">' +
                        '<i class="fa-solid fa-circle text-[4px] text-brand-500 mt-1.5"></i>' + esc(it) + '</li>';
                }).join('') + '</ul>' +
            '</div>';
        }).join('');
    }

    /* --------------------------------------------------------------------- *
     * Demo pipeline
     * --------------------------------------------------------------------- */

    var lastGpxText = null;
    var lastFilename = null;

    function log(html, cls) {
        var box = $('pipeline-log');
        var p = document.createElement('p');
        p.className = 'log-line ' + (cls || 'text-gray-400');
        p.innerHTML = html;
        box.appendChild(p);
        box.scrollTop = box.scrollHeight;
    }

    function clearLog() {
        $('pipeline-log').innerHTML = '';
    }

    function setStatus(text, cls) {
        var el = $('log-status');
        el.textContent = text;
        el.className = 'text-[10px] mono ' + (cls || 'text-gray-500');
    }

    function runPipeline(text, filename) {
        lastGpxText = text;
        lastFilename = filename;

        var tolerance = parseInt($('tolerance').value, 10);

        clearLog();
        setStatus('running', 'text-brand-500');
        log('$ routestory process --in "' + esc(filename) + '" --tolerance ' + tolerance + 'm',
            'text-brand-400 font-bold');
        log('&nbsp;&nbsp;ukuran berkas: ' + fmt.bytes(text.length));

        var result;
        try {
            result = Engine.run(text, {
                toleranceM: tolerance,
                filename: filename,
                filesize: text.length
            });
        } catch (err) {
            setStatus('failed', 'text-red-400');
            log('&nbsp;&nbsp;<span class="text-red-400">ERROR: ' + esc(err.message) + '</span>');
            renderDemoError(err);
            return;
        }

        result.timing.stages.forEach(function (s) {
            log('&nbsp;&nbsp;<span class="text-emerald-400">[OK]</span> ' + esc(s.label) +
                ' <span class="text-gray-600">(' + s.ms.toFixed(1) + ' ms)</span>');
        });

        log('&nbsp;&nbsp;titik: ' + fmt.int(result.report.validCount) +
            ' &rarr; ' + fmt.int(result.simplified.length) +
            ' <span class="text-brand-400">(-' + (result.reduction * 100).toFixed(1) + '%)</span>');
        log('$ selesai dalam ' + result.timing.totalMs.toFixed(1) + ' ms', 'text-brand-400 font-bold');

        setStatus('done in ' + result.timing.totalMs.toFixed(0) + 'ms', 'text-emerald-400');
        renderDemoResult(result);
    }

    function renderDemoError(err) {
        $('demo-result').className =
            'bg-white dark:bg-darkbg-800 border border-red-300 dark:border-red-800 rounded-2xl p-6 shadow-lg min-h-[520px] flex items-center justify-center';
        $('demo-result').innerHTML =
            '<div class="text-center max-w-sm">' +
                '<i class="fa-solid fa-triangle-exclamation text-4xl text-red-500 mb-4"></i>' +
                '<p class="font-black text-lg mb-2">Berkas tidak dapat diproses</p>' +
                '<p class="text-sm text-gray-600 dark:text-gray-400 mb-4">' + esc(err.message) + '</p>' +
                '<p class="text-xs text-gray-500">Inilah fungsi tahap <strong>Validate</strong>: masalah data ' +
                'ditemukan di awal, bukan setelah produk dicetak.</p>' +
            '</div>';
    }

    function statTile(label, value, unit) {
        return '' +
        '<div class="bg-gray-50 dark:bg-darkbg-700 border border-gray-200 dark:border-gray-600 rounded-xl p-3">' +
            '<p class="text-[10px] uppercase tracking-wider font-bold text-gray-500 dark:text-gray-400">' + esc(label) + '</p>' +
            '<p class="font-black text-lg mt-0.5">' + value +
                (unit ? ' <span class="text-xs text-brand-500 font-bold">' + esc(unit) + '</span>' : '') +
            '</p>' +
        '</div>';
    }

    /** Warna badge QC — kelas ditulis utuh agar tidak hilang saat di-purge. */
    var QC_BADGE = {
        ok:    'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
        warn:  'bg-amber-500/10 text-amber-600 dark:text-amber-400',
        error: 'bg-red-500/10 text-red-600 dark:text-red-400'
    };
    var QC_LABEL = {
        ok: 'Lolos',
        warn: 'Lolos dengan catatan',
        error: 'Perlu perhatian'
    };

    function renderDemoResult(r) {
        var s = r.stats;

        var maxPace = s.splits.length
            ? Math.max.apply(null, s.splits.map(function (x) { return x.pace; }))
            : 1;

        var splitRows = s.splits.slice(0, 12).map(function (sp) {
            var width = Math.max(8, (sp.pace / maxPace) * 100);
            return '' +
            '<div class="flex items-center gap-2 text-xs">' +
                '<span class="mono w-10 text-gray-500 dark:text-gray-400 flex-shrink-0">KM ' + sp.km + '</span>' +
                '<div class="flex-grow bg-gray-100 dark:bg-darkbg-700 rounded-full h-4 overflow-hidden">' +
                    '<div class="bg-brand-500 h-full rounded-full" style="width:' + width.toFixed(1) + '%"></div>' +
                '</div>' +
                '<span class="mono w-12 text-right font-bold flex-shrink-0">' + fmt.pace(sp.pace) + '</span>' +
            '</div>';
        }).join('');

        $('demo-result').className =
            'bg-white dark:bg-darkbg-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-lg';

        $('demo-result').innerHTML = '' +
        '<div class="flex flex-wrap items-start justify-between gap-3 mb-5 pb-5 border-b border-gray-200 dark:border-gray-700">' +
            '<div class="min-w-0">' +
                '<p class="text-[10px] uppercase tracking-widest font-bold text-brand-500">Hasil pemrosesan</p>' +
                '<h4 class="font-black text-xl truncate">' + esc(r.meta.name) + '</h4>' +
                '<p class="text-xs text-gray-500 dark:text-gray-400 mono truncate">' +
                    esc(r.meta.filename) + ' &middot; ' + fmt.bytes(r.meta.filesize) +
                    ' &middot; perekam: ' + esc(r.meta.creator) +
                '</p>' +
            '</div>' +
            '<span class="text-xs font-black uppercase tracking-wider px-3 py-1.5 rounded-full whitespace-nowrap ' +
                QC_BADGE[r.report.severity] + '">QC: ' + QC_LABEL[r.report.severity] + '</span>' +
        '</div>' +

        '<div class="grid sm:grid-cols-2 gap-6">' +

            '<div>' +
                '<div class="bg-darkbg-900 rounded-2xl p-5 border-4 border-gray-800">' +
                    '<p class="text-[9px] text-gray-500 uppercase tracking-[0.2em] mb-1">Pratinjau render vektor</p>' +
                    '<h5 class="text-white font-black text-base uppercase mb-3 truncate">' + esc(r.meta.activityType) + '</h5>' +
                    '<svg viewBox="0 0 300 300" class="w-full" aria-label="Visualisasi rute hasil pemrosesan">' +
                        '<path d="' + r.render.route.d + '" fill="none" stroke="#631e00" stroke-width="7"' +
                        ' stroke-linejoin="round" stroke-linecap="round" transform="translate(3,3)" />' +
                        '<path id="route-path" d="' + r.render.route.d + '" fill="none" stroke="#fc4c02" stroke-width="5"' +
                        ' stroke-linejoin="round" stroke-linecap="round" class="route-draw" />' +
                        '<circle cx="' + r.render.route.start.x + '" cy="' + r.render.route.start.y + '" r="5" fill="#fff" />' +
                        '<circle cx="' + r.render.route.end.x + '" cy="' + r.render.route.end.y + '" r="5" fill="#fc4c02" stroke="#fff" stroke-width="2" />' +
                    '</svg>' +
                    (r.render.elevation
                        ? '<div class="mt-3 pt-3 border-t border-gray-700">' +
                              '<p class="text-[9px] text-gray-500 uppercase tracking-widest mb-1">Profil elevasi ' +
                              Math.round(r.render.elevation.min) + '-' + Math.round(r.render.elevation.max) + ' m</p>' +
                              '<svg viewBox="0 0 300 48" class="w-full" aria-hidden="true">' +
                                  '<path d="' + r.render.elevation.d + '" fill="rgba(252,76,2,.3)" stroke="#fc4c02" stroke-width="1.5" />' +
                              '</svg>' +
                          '</div>'
                        : '') +
                    '<p class="text-[9px] text-gray-600 mt-3 text-center uppercase tracking-widest">' +
                        (s.isLoop ? 'Rute melingkar' : 'Rute titik ke titik') +
                        ' &middot; ' + (s.spanMetersX / 1000).toFixed(1) + ' x ' + (s.spanMetersY / 1000).toFixed(1) + ' km' +
                    '</p>' +
                '</div>' +
            '</div>' +

            '<div class="space-y-3">' +
                '<div class="grid grid-cols-2 gap-2.5">' +
                    statTile('Jarak', fmt.km(s.distance), 'km') +
                    statTile('Durasi', fmt.duration(s.elapsed), '') +
                    statTile('Pace rata-rata', fmt.pace(s.pace), '/km') +
                    statTile('Kecepatan', s.speed ? s.speed.toFixed(1) : '--', 'km/j') +
                    statTile('Elevation gain', fmt.int(s.elevGain), 'm') +
                    statTile('Elevation loss', fmt.int(s.elevLoss), 'm') +
                '</div>' +
                '<div class="bg-gray-50 dark:bg-darkbg-700 border border-gray-200 dark:border-gray-600 rounded-xl p-3 text-xs space-y-1.5">' +
                    '<div class="flex justify-between gap-2"><span class="text-gray-500 dark:text-gray-400">Tanggal aktivitas</span>' +
                        '<span class="font-bold">' + esc(fmt.date(s.startTime)) + '</span></div>' +
                    '<div class="flex justify-between gap-2"><span class="text-gray-500 dark:text-gray-400">Titik dibaca</span>' +
                        '<span class="font-bold mono">' + fmt.int(r.report.inputCount) + '</span></div>' +
                    '<div class="flex justify-between gap-2"><span class="text-gray-500 dark:text-gray-400">Titik valid</span>' +
                        '<span class="font-bold mono">' + fmt.int(r.report.validCount) + '</span></div>' +
                    '<div class="flex justify-between gap-2"><span class="text-gray-500 dark:text-gray-400">Vertex setelah simplifikasi</span>' +
                        '<span class="font-bold mono text-brand-500">' + fmt.int(r.simplified.length) +
                        ' (-' + (r.reduction * 100).toFixed(1) + '%)</span></div>' +
                    '<div class="flex justify-between gap-2"><span class="text-gray-500 dark:text-gray-400">Toleransi dipakai</span>' +
                        '<span class="font-bold mono">' + r.tolerance + ' m</span></div>' +
                    '<div class="flex justify-between gap-2"><span class="text-gray-500 dark:text-gray-400">Waktu proses</span>' +
                        '<span class="font-bold mono">' + r.timing.totalMs.toFixed(1) + ' ms</span></div>' +
                '</div>' +
            '</div>' +
        '</div>' +

        '<div class="mt-6 pt-5 border-t border-gray-200 dark:border-gray-700">' +
            '<h5 class="font-black text-sm mb-3 flex items-center gap-2">' +
                '<i class="fa-solid fa-clipboard-check text-brand-500"></i> Laporan Quality Control' +
            '</h5>' +
            '<ul class="space-y-1.5">' + r.report.issues.map(function (iss) {
                var map = {
                    ok:    ['fa-circle-check', 'text-emerald-500'],
                    info:  ['fa-circle-info', 'text-sky-500'],
                    warn:  ['fa-triangle-exclamation', 'text-amber-500'],
                    error: ['fa-circle-xmark', 'text-red-500']
                }[iss.level];
                return '<li class="flex items-start gap-2.5 text-xs text-gray-600 dark:text-gray-300">' +
                    '<i class="fa-solid ' + map[0] + ' ' + map[1] + ' mt-0.5"></i>' + esc(iss.text) + '</li>';
            }).join('') + '</ul>' +
        '</div>' +

        (s.splits.length
            ? '<div class="mt-6 pt-5 border-t border-gray-200 dark:border-gray-700">' +
                  '<h5 class="font-black text-sm mb-3 flex items-center gap-2">' +
                      '<i class="fa-solid fa-stopwatch text-brand-500"></i> Split per Kilometer' +
                      (s.splits.length > 12
                        ? ' <span class="text-xs font-normal text-gray-500">(12 pertama)</span>'
                        : '') +
                  '</h5>' +
                  '<div class="space-y-1.5">' + splitRows + '</div>' +
              '</div>'
            : '') +

        '<div class="mt-6 pt-5 border-t border-gray-200 dark:border-gray-700">' +
            '<h5 class="font-black text-sm mb-3 flex items-center gap-2">' +
                '<i class="fa-solid fa-box-open text-brand-500"></i> Pada proyek nyata, tahap ini menghasilkan' +
            '</h5>' +
            '<div class="flex flex-wrap gap-1.5">' +
                ['route.geojson', 'stats.json', 'qc-report.pdf', 'poster.svg',
                 'poster-300dpi.png', 'model.stl', 'model.3mf'].map(function (f) {
                    return '<span class="mono text-[10px] font-semibold bg-gray-100 dark:bg-darkbg-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded">' + f + '</span>';
                }).join('') +
            '</div>' +
            '<p class="text-[11px] text-gray-500 dark:text-gray-400 mt-3">' +
                'Pratinjau di halaman ini mencakup tahap 01-05. Tahap 06-08 (pemodelan 3D, ' +
                'persetujuan Anda, dan produksi) dikerjakan tim kami setelah pesanan masuk.' +
            '</p>' +
        '</div>';

        // Siapkan animasi gambar rute sesuai panjang path sebenarnya.
        var path = document.getElementById('route-path');
        if (path && path.getTotalLength) {
            try {
                path.style.setProperty('--route-len', path.getTotalLength());
            } catch (e) { /* abaikan pada browser lama */ }
        }
    }

    function readFile(file) {
        if (!file) return;
        var reader = new FileReader();
        reader.onload = function () {
            runPipeline(String(reader.result), file.name);
        };
        reader.onerror = function () {
            clearLog();
            setStatus('failed', 'text-red-400');
            log('&nbsp;&nbsp;<span class="text-red-400">ERROR: berkas gagal dibaca.</span>');
        };
        reader.readAsText(file);
    }

    function initDemo() {
        var dropzone = $('dropzone');
        var input = $('gpx-input');
        var slider = $('tolerance');

        dropzone.addEventListener('click', function () { input.click(); });
        dropzone.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); input.click(); }
        });

        ['dragenter', 'dragover'].forEach(function (ev) {
            dropzone.addEventListener(ev, function (e) {
                e.preventDefault();
                dropzone.classList.add('dragover');
            });
        });
        ['dragleave', 'drop'].forEach(function (ev) {
            dropzone.addEventListener(ev, function (e) {
                e.preventDefault();
                dropzone.classList.remove('dragover');
            });
        });
        dropzone.addEventListener('drop', function (e) {
            if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files.length) {
                readFile(e.dataTransfer.files[0]);
            }
        });

        input.addEventListener('change', function () {
            if (input.files && input.files.length) readFile(input.files[0]);
        });

        $('sample-btn').addEventListener('click', function () {
            if (!window.ROUTESTORY_SAMPLE_GPX) {
                clearLog();
                setStatus('failed', 'text-red-400');
                log('&nbsp;&nbsp;<span class="text-red-400">ERROR: contoh data tidak termuat. ' +
                    'Pastikan assets/data/sample-gpx.js tersedia.</span>');
                return;
            }
            runPipeline(window.ROUTESTORY_SAMPLE_GPX, 'sample-malang-10k.gpx');
        });

        // Geser toleransi -> jalankan ulang pipeline pada data yang sama.
        slider.addEventListener('input', function () {
            $('tolerance-value').textContent = slider.value + ' m';
        });
        slider.addEventListener('change', function () {
            if (lastGpxText) runPipeline(lastGpxText, lastFilename);
        });
    }

    /* --------------------------------------------------------------------- *
     * Estimator
     * --------------------------------------------------------------------- */

    var est = { pkg: 'digital', size: 'a4', addons: [], qty: 1 };

    function tierFor(qty) {
        var tiers = Catalog.estimator.volumeTiers;
        var found = tiers[0];
        for (var i = 0; i < tiers.length; i++) {
            if (qty >= tiers[i].min) found = tiers[i];
        }
        return found;
    }

    function findBy(list, id) {
        for (var i = 0; i < list.length; i++) {
            if (list[i].id === id) return list[i];
        }
        return list[0];
    }

    function renderEstimatorOptions() {
        var E = Catalog.estimator;

        $('est-packages').innerHTML = E.packages.map(function (p) {
            return '' +
            '<button type="button" data-pkg="' + p.id + '"' +
            ' class="option-card text-left bg-white dark:bg-darkbg-800 border-2 border-gray-200 dark:border-gray-600 rounded-xl p-4 relative' +
            (est.pkg === p.id ? ' selected' : '') + '">' +
                '<i class="option-check fa-solid fa-circle-check text-brand-500 absolute top-3 right-3"></i>' +
                '<p class="font-black text-sm pr-6">' + esc(p.label) + '</p>' +
                '<p class="text-xs text-gray-500 dark:text-gray-400 mt-1 mb-2">' + esc(p.desc) + '</p>' +
                '<p class="text-xs font-bold text-brand-500">' + rupiah(p.price) + ' &middot; ' + p.days + ' hari</p>' +
            '</button>';
        }).join('');

        $('est-sizes').innerHTML = E.sizes.map(function (sz) {
            return '' +
            '<button type="button" data-size="' + sz.id + '"' +
            ' class="option-card text-center bg-white dark:bg-darkbg-800 border-2 border-gray-200 dark:border-gray-600 rounded-xl p-4 relative' +
            (est.size === sz.id ? ' selected' : '') + '">' +
                '<i class="option-check fa-solid fa-circle-check text-brand-500 absolute top-2 right-2 text-xs"></i>' +
                '<p class="font-black text-sm">' + esc(sz.label) + '</p>' +
                '<p class="text-[11px] text-gray-500 dark:text-gray-400 mt-1">x' + sz.multiplier.toFixed(2) + '</p>' +
            '</button>';
        }).join('');

        $('est-addons').innerHTML = E.addons.map(function (a) {
            var on = est.addons.indexOf(a.id) !== -1;
            var cost = a.type === 'percent' ? '+' + (a.value * 100) + '%' : '+' + rupiah(a.value);
            return '' +
            '<button type="button" data-addon="' + a.id + '"' +
            ' class="option-card text-left bg-white dark:bg-darkbg-800 border-2 border-gray-200 dark:border-gray-600 rounded-xl p-4 relative' +
            (on ? ' selected' : '') + '">' +
                '<i class="option-check fa-solid fa-circle-check text-brand-500 absolute top-3 right-3"></i>' +
                '<p class="font-black text-sm pr-6">' + esc(a.label) + '</p>' +
                '<p class="text-xs text-gray-500 dark:text-gray-400 mt-1 mb-2">' + esc(a.desc) + '</p>' +
                '<p class="text-xs font-bold text-brand-500">' + cost +
                    (a.days !== 0 ? ' &middot; ' + (a.days > 0 ? '+' : '') + a.days + ' hari' : '') +
                '</p>' +
            '</button>';
        }).join('');

        $('est-packages').querySelectorAll('[data-pkg]').forEach(function (b) {
            b.addEventListener('click', function () {
                est.pkg = b.getAttribute('data-pkg');
                renderEstimatorOptions();
                computeEstimate();
            });
        });
        $('est-sizes').querySelectorAll('[data-size]').forEach(function (b) {
            b.addEventListener('click', function () {
                est.size = b.getAttribute('data-size');
                renderEstimatorOptions();
                computeEstimate();
            });
        });
        $('est-addons').querySelectorAll('[data-addon]').forEach(function (b) {
            b.addEventListener('click', function () {
                var id = b.getAttribute('data-addon');
                var idx = est.addons.indexOf(id);
                if (idx === -1) est.addons.push(id); else est.addons.splice(idx, 1);
                renderEstimatorOptions();
                computeEstimate();
            });
        });
    }

    function computeEstimate() {
        var E = Catalog.estimator;
        var pkg = findBy(E.packages, est.pkg);
        var size = findBy(E.sizes, est.size);

        var base = pkg.price * size.multiplier;
        var flat = 0;
        var percent = 0;
        var extraDays = 0;
        var rows = [];

        rows.push({ label: pkg.label, value: rupiah(pkg.price) });
        if (size.multiplier !== 1) {
            rows.push({ label: 'Ukuran ' + size.label, value: 'x' + size.multiplier.toFixed(2) });
        }

        est.addons.forEach(function (id) {
            var a = findBy(E.addons, id);
            extraDays += a.days;
            if (a.type === 'percent') {
                percent += a.value;
                rows.push({ label: a.label, value: '+' + (a.value * 100) + '%' });
            } else {
                flat += a.value;
                rows.push({ label: a.label, value: '+' + rupiah(a.value) });
            }
        });

        var unitPrice = base * (1 + percent) + flat;
        var tier = tierFor(est.qty);
        var subtotal = unitPrice * est.qty;
        var total = subtotal * (1 - tier.discount);

        if (tier.discount > 0) {
            rows.push({
                label: tier.label,
                value: '-' + rupiah(subtotal - total),
                negative: true
            });
        }

        // Jadwal: paket + ukuran + addon, ditambah waktu untuk produksi massal.
        var days = pkg.days + size.days + extraDays;
        days += Math.floor((est.qty - 1) / 25) * 2;
        days = Math.max(1, days);

        $('est-breakdown').innerHTML = rows.map(function (r) {
            return '<div class="flex justify-between gap-3">' +
                '<span class="text-gray-400">' + esc(r.label) + '</span>' +
                '<span class="font-bold whitespace-nowrap ' + (r.negative ? 'text-emerald-400' : '') + '">' +
                    r.value + '</span>' +
            '</div>';
        }).join('') +
        (est.qty > 1
            ? '<div class="flex justify-between gap-3 pt-2 border-t border-gray-800">' +
                  '<span class="text-gray-400">Jumlah unit</span>' +
                  '<span class="font-bold">x' + est.qty + '</span></div>'
            : '');

        var totalEl = $('est-total');
        totalEl.textContent = rupiah(total);
        totalEl.classList.remove('price-pulse');
        void totalEl.offsetWidth;          // paksa reflow agar animasi terulang
        totalEl.classList.add('price-pulse');

        $('est-unit-price').textContent = est.qty > 1
            ? rupiah(total / est.qty) + ' per unit'
            : '';

        $('est-days').textContent = days + ' hari kerja';

        $('est-services').innerHTML = pkg.services.map(function (sid) {
            var svc = Catalog.byId(sid);
            return '<li class="flex items-start gap-2">' +
                '<i class="fa-solid fa-circle-check text-brand-500 mt-0.5 text-[10px]"></i>' +
                '<span><span class="mono text-brand-500">' + esc(sid) + '</span> ' +
                esc(svc ? svc.name : sid) + '</span></li>';
        }).join('');

        $('est-tier').textContent = tier.discount > 0
            ? tier.label + ' aktif pada jumlah ini.'
            : 'Diskon komunitas mulai berlaku dari 10 unit.';
    }

    function initEstimator() {
        var qty = $('est-qty');
        qty.addEventListener('input', function () {
            est.qty = parseInt(qty.value, 10);
            $('est-qty-value').textContent = est.qty + ' unit';
            computeEstimate();
        });
        renderEstimatorOptions();
        computeEstimate();
    }

    /* --------------------------------------------------------------------- *
     * Bootstrap
     * --------------------------------------------------------------------- */

    function init() {
        initTheme();
        initMobileMenu();
        initPreloader();
        initFrame3D();
        initModal();

        renderFilters();
        renderGrid();

        renderPipelineSteps();
        renderPipelineDetail();
        renderTechStack();

        initDemo();
        initEstimator();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
