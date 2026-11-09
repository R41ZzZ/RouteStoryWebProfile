# LAPORAN TUGAS BESAR MANAJEMEN INDUSTRI TEKNOLOGI INFORMASI
## SELLING PRODUCT (PRJ03)

---

### **IDENTIFIKASI DAN STRATEGI PENJUALAN PRODUK/JASA PADA PLATFORM DIGITAL**
**RouteStory — Layanan Pengolahan, Visualisasi Data Aktivitas GPS, dan Memorabilia Fisik**

**Disusun Oleh: Kelompok RouteStory**
1. **ALEXANDER AGUNG WIDHI P.** — NIM: 245150300111054 *(CIO / Head of Project)*
2. **MUHAMMAD RAIZ BELYAA** — NIM: 245150307111055 *(Project Manager)*
3. **BIMO SATRIO** — NIM: 245150307111060 *(System & Data Analyst)*
4. **KEIRIO OMAR ATTALLAH** — NIM: 245150307111061 *(3D Designer & Production)*

**PROGRAM STUDI TEKNIK KOMPUTER**  
**DEPARTEMEN TEKNIK INFORMATIKA**  
**FAKULTAS ILMU KOMPUTER**  
**UNIVERSITAS BRAWIJAYA**  
**2026**

---

## **DAFTAR ISI**
1. **RINGKASAN EKSEKUTIF & VALUE PROPOSITION**
2. **TUJUAN DAN DASAR PENJUALAN PRODUK (SELLING STRATEGY)**
3. **STRUKTUR KATALOG PRODUK DAN LAYANAN TI (RS-01 s.d RS-07)**
4. **DETAIL SPESIFIKASI PRODUK, DELIVERABLES, DAN PRICING**
5. **IMPLEMENTASI FITUR PENJUALAN & USER ENGAGEMENT PADA WEBSITE**
6. **ALUR PENGERJAAN PROYEK & TAHAP OPERASIONAL (SIKLUS PDCA)**
7. **MEDIA PROMOSI PEMASARAN DIGITAL (INTERACTIVE 3D POSTER)**
8. **ESTIMASI BIAYA, KETENTUAN LAYANAN (SLA), DAN STRATEGI KOMERSIAL**
9. **KESIMPULAN**

---

### **1. RINGKASAN EKSEKUTIF & VALUE PROPOSITION**
RouteStory adalah inisiatif bisnis berbasis **Teknologi Informasi** yang mengintegrasikan pengolahan data geospasial aktivitas olahraga (dari platform seperti Strava, Garmin, berkas GPX/FIT) dengan fabrikasi digital modern. RouteStory mentransformasikan data angka digital yang semula pasif menjadi tiga spektrum produk bernilai jual tinggi: **Data & Analitik Tervalidasi**, **Aset Visual & Web Interaktif**, serta **Memorabilia Fisik (Bingkai Relief 3D)**.

Dalam konteks mata kuliah Manajemen Industri TI pada penugasan *Selling Product (PRJ03)*, fokus utama ditekankan pada transisi dari *ideation* menuju *commercialization*. RouteStory tidak memosisikan diri sebagai toko kerajinan konvensional, melainkan sebagai **Penyedia Solusi TI Berbasis Proyek (*Project-Based IT Organization*)**. Keunggulan kompetitif (Business Value) RouteStory terletak pada integritas algoritma ekstraksi data, simplifikasi rute, pemodelan 3D parametrik, dan personalisasi tingkat tinggi yang dikawal menggunakan metodologi **Plan-Do-Check-Action (PDCA)**.

---

### **2. TUJUAN DAN DASAR PENJUALAN PRODUK (SELLING STRATEGY)**
Tujuan perancangan modul penjualan produk (*selling product*) pada platform RouteStory adalah:
1. **Menghadirkan Rantai Nilai TI Transparan:** Mengedukasi calon pelanggan bahwa produk fisik merupakan muara akhir dari rangkaian komputasi data (parsing XML/GPX, filtering derau GPS, kalkulasi haversine, dan konversi STL).
2. **Fleksibilitas Portofolio Produk:** Menyediakan pilihan layanan bertingkat (*tiered pricing*) mulai dari kebutuhan individual berbiaya rendah (pembersihan data dan poster digital) hingga produk mewah (*bespoke 3D shadowbox frame*) serta paket skala besar untuk event/komunitas lari.
3. **Mengurangi Hambatan Konversi (Lowering Friction):** Memfasilitasi calon pembeli dengan fitur uji coba mandiri langsung di browser (*client-side demo engine*) dan kalkulator estimasi biaya interaktif (*Project Estimator*).
4. **Membangun Kepercayaan (Trust Building):** Menampilkan transparansi tim pengembang, standar kualitas (SLA terukur), serta garansi kepuasan bentuk rute 100% presisi sebelum tahap manufaktur fisik.

---

### **3. STRUKTUR KATALOG PRODUK DAN LAYANAN TI**

| Kategori Layanan | Fokus & Nilai Jual | Contoh Deliverable / Format Keluaran |
|---|---|---|
| **Data & Analitik** | Pembersihan, validasi, filtering gap sinyal GPS, dan standardisasi telemetri. | GeoJSON, JSON Statistik, CSV Laps, Laporan QC PDF. |
| **Visualisasi & 3D** | Konversi koordinat rute menjadi karya visual resolusi tinggi dan model 3D cetak. | SVG Vektor, PNG 300 DPI, Berkas STL, 3MF. |
| **Platform & Integrasi** | Penyajian pencapaian lari berbasis web interaktif dan pipeline pemrosesan massal. | Microsite URL, QR Code, Paket Web Statis, Batch Output. |
| **Produk Fisik (Tangible)** | Fabrikasi relief rute timbul menggunakan 3D Printer dirakit dalam bingkai kayu eksklusif. | Bingkai Shadowbox 3D Akrilik/PLA+, Plat Logam Seri. |

---

### **4. DETAIL SPESIFIKASI PRODUK, DELIVERABLES, DAN PRICING**

Katalog resmi RouteStory menggunakan kodefikasi unik terstandar:

#### **4.1. RS-01 — GPX Data Processing & Validation**
* **Deskripsi:** Layanan pembersihan data mentah GPS untuk mengatasi masalah *signal drift*, titik loncat, elevasi anomali, dan duplikasi timestamp.
* **Input:** Berkas GPX, TCX, FIT, atau tautan aktivitas publik Strava.
* **Output / Deliverables:** File GeoJSON tervalidasi, file CSV/JSON telemetri (jarak moving time, elevasi bersih), serta dokumen Laporan QC (PDF).
* **Harga & SLA:** Mulai **Rp 52.500 / aktivitas** | Estimasi: 1 hari kerja.

#### **4.2. RS-02 — Route Visualization & Digital Poster**
* **Deskripsi:** Perancangan poster digital tipografi modern yang memadukan garis vektor rute GPS dengan catatan statistik personal (Pace, Waktu, Bib Number, Event).
* **Input:** Data rute GPS tervalidasi dan preferensi palet warna/tema.
* **Output / Deliverables:** Berkas vektor SVG, file cetak PNG Ultra-HD 300 DPI, dan PDF Siap Cetak (A4/A3).
* **Harga & SLA:** Mulai **Rp 87.500 / desain** | Estimasi: 2 hari kerja (termasuk 2x putaran revisi).

#### **4.3. RS-03 — 3D Route Modeling (GPX ke STL)**
* **Deskripsi:** Transformasi koordinat 2D garis rute menjadi model topografi tiga dimensi dengan profil ketebalan dan dinding solid yang memenuhi toleransi mesin 3D printer.
* **Input:** Data koordinat rute, dimensi target (skala mm), dan ketebalan relief.
* **Output / Deliverables:** File 3D siap cetak (.STL / .3MF), file render 3D pratinjau (PNG), dan lembar kelayakan cetak (*printability report*).
* **Harga & SLA:** Mulai **Rp 140.000 / model** | Estimasi: 2–3 hari kerja.

#### **4.4. RS-04 — Interactive Race Recap (Web Microsite)**
* **Deskripsi:** Halaman web personal interaktif yang memvisualisasikan perjalanan rute lari dengan animasi garis lintasan, grafik profil elevasi interaktif, dan tabel split kilometer yang dapat dibagikan melalui link / kode QR pada medali.
* **Input:** File aktivitas GPS, nama event, foto dokumentasi lomba (opsional).
* **Output / Deliverables:** Live URL Microsite pribadi (hosting aktif 12 bulan), aset grafis QR code vektor, dan arsip source code web statis.
* **Harga & SLA:** Mulai **Rp 175.000 / microsite** | Estimasi: 3 hari kerja.

#### **4.5. RS-05 — Event & Community Batch Pipeline**
* **Deskripsi:** Solusi B2B dan komunitas untuk pemrosesan data rute massal ratusan peserta lomba marathon/cycling secara terotomatisasi dengan keseragaman template visual.
* **Input:** Kumpulan arsip GPX peserta dari panitia penyelenggara dan pedoman grafis lomba.
* **Output / Deliverables:** Koleksi file visual individual tiap peserta, rekapitulasi data analitik race, dan integrasi link sertifikat digital.
* **Harga & SLA:** Mulai **Rp 24.500 / peserta** (disesuaikan dengan volume order dan kompleksitas).

#### **4.6. RS-07 — 3D Printed Route Frame (Produk Fisik Unggulan)**
* **Deskripsi:** Produk fisik memorabilia mewah berupa bingkai shadowbox kayu dengan relief rute timbul hasil 3D printing (elevasi 8mm), passe-partout matting galeri, ukiran statistik telemetri, dan segel sertifikat studio RouteStory bernomor seri unik.
* **Input:** Data GPX aktivitas, opsi dimensi bingkai (20x25 cm s.d 30x40 cm), warna filamen relief, dan nama finisher.
* **Output / Deliverables:** Bingkai fisik utuh lengkap dengan kaca pelindung, gantungan dinding kuningan presisi, packaging aman anti-benturan (*wooden/bubble crate*), dan stiker sertifikat studio resmi berstempel QC PASSED.
* **Harga & SLA:** Mulai **Rp 245.000 / unit** | Estimasi: 4–7 hari kerja (bergantung pada antrean manufaktur).

---

### **5. IMPLEMENTASI FITUR PENJUALAN & ENGAGEMENT PADA WEBSITE**
Untuk memaksimalkan konversi penjualan, website RouteStory (`https://route-story-web-profile.vercel.app/`) dibekali fitur penunjang penjualan:
1. **Interactive Client-Side GPX Engine ("Coba Dulu"):**
   Calon pembeli dapat mengunggah file `.gpx` aktivitas mereka sendiri secara gratis dan instan. Browser akan memproses koordinat menggunakan formula Haversine dan algoritma *Ramer-Douglas-Peucker* untuk menampilkan bentuk rute, grafik elevasi, dan split pace secara *real-time* tanpa mengunggah data ke server pihak ketiga (menjamin privasi data pelanggan).
2. **Project Cost Estimator (Kalkulator Harga Interaktif):**
   Memungkinkan calon pembeli memilih paket (Digital / Fisik), ukuran bingkai, opsi personalisasi tambahan, dan jumlah kuantitas, dengan kalkulasi total biaya serta perkiraan waktu pengerjaan yang terbarukan otomatis secara transparan.
3. **Katalog & Modal Spesifikasi Lengkap:**
   Setiap kartu produk memiliki tombol rincian teknis (*technology stack*, format deliverable, dan alur pengerjaan) serta *call-to-action* langsung menuju konsultasi pesanan.

---

### **6. ALUR PENGERJAAN PROYEK & TAHAP OPERASIONAL (SIKLUS PDCA)**
RouteStory menjalankan setiap pesanan dengan pendekatan manajemen proyek 8 tahap yang dipetakan ke dalam siklus **PDCA**:
* **PLAN (Perencanaan & Validasi Lingkup):**
  1. *Tahap Ingest & Validasi Awal:* Pemeriksaan integritas data GPS mentah pelanggan.
  2. *Tahap Scope & Budgeting:* Penentuan spesifikasi desain, jenis bahan, ukuran, biaya, dan target jadwal penyerahan.
* **DO (Eksekusi Rekayasa & Manufaktur):**
  3. *Tahap Data Extraction & Simplifikasi:* Ekstraksi koordinat dan filtering noise elevasi.
  4. *Tahap Rendering & 3D Modeling:* Konversi vektor SVG ke model solid 3D (STL).
  5. *Tahap Personalisasi & Fabrikasi:* Pencetakan rute menggunakan 3D printer dan perakitan bingkai fisik.
* **CHECK (Pengendalian Kualitas / QC):**
  6. *Tahap Digital Preview Approval:* Verifikasi persetujuan desain oleh pelanggan sebelum pencetakan massal/fisik.
  7. *Tahap Physical QC Inspection:* Pemeriksaan akurasi skala rute, ketepatan data angka telemetri, ejaan nama, kekuatan pengeleman, dan sertifikasi lolos uji.
* **ACTION (Penyerahan & Evaluasi Proyek):**
  8. *Tahap Delivery & Project Closing:* Pengemasan aman, pengiriman kurir ke alamat pembeli, penerimaan umpan balik (*customer satisfaction survey*), dan dokumentasi evaluasi proyek.

---

### **7. MEDIA PROMOSI PEMASARAN DIGITAL (INTERACTIVE 3D POSTER)**
Sebagai pelengkap strategi pemasaran digital, tim merancang **Poster Promosi Interaktif** (`https://route-story-web-profile.vercel.app/poster.html`):
1. **Model Bingkai 3D 360 Derajat Interaktif:** Menampilkan replika digital bingkai shadowbox yang berputar mulus dan dapat diputar bebas (*drag & rotate*) oleh pengunjung untuk menginspeksi tampak depan rute maupun tampak belakang bingkai (sertifikat studio, gantungan sawtooth, dan pengunci klip).
2. **Interactive Hover Hotspots:** Menyediakan penjelasan spesifikasi material saat kursor diarahkan ke judul plat, relief rute akrilik, maupun data telemetri.
3. **Penonjolan Harga (*Prominent Price Tag*):** Penempatan banner promo sentral *"HARGA MULAI DARI Rp 52.500 /paket"* di posisi tengah halaman untuk menarik perhatian audiens secara cepat.
4. **Distribusi Cetak & Offline:** Penyediaan file cetak resmi **RouteStory_Poster_A4.pdf** beresolusi tinggi dengan mockup tampak depan presisi dan kode QR dinamis yang menghubungkan materi cetak promosi langsung ke website resmi.

---

### **8. ESTIMASI BIAYA, KETENTUAN LAYANAN (SLA), DAN STRATEGI KOMERSIAL**
* **Struktur Biaya Komersial:** Harga demonstrasi dirancang dengan memperhitungkan biaya bahan baku (filamen PLA+, kayu bingkai, kaca, matboard), biaya operasional mesin 3D printer, biaya komputasi/server, alokasi waktu kerja teknis, serta target profit margin sebesar 35–45%.
* **SLA (Service Level Agreement):**
  * Produk digital (RS-01, RS-02) diserahkan maksimal dalam 1–2 hari kerja.
  * Produk fisik (RS-07) diproduksi dan diserahkan ke jasa logistik maksimal dalam 4–7 hari kerja setelah pratinjau disetujui.
* **Kebijakan & Privasi Data:** Seluruh koordinat GPS aktivitas pelanggan dijamin kerahasiaannya, tidak diperjualbelikan, dan hanya digunakan untuk keperluan visualisasi produk yang dipesan.

---

### **9. KESIMPULAN**
Penyusunan laporan penugasan *Selling Product (PRJ03)* ini menegaskan bahwa RouteStory berhasil mengonversi keahlian rekayasa perangkat lunak dan manajemen proyek teknologi informasi menjadi model bisnis yang konkret, terstruktur, dan memiliki daya tarik komersial tinggi. Melalui platform website yang dilengkapi mesin pengolah data langsung, katalog produk yang jelas, transparansi harga, media promosi interaktif 3D, serta struktur organisasi berbasis peran fungsional, RouteStory siap menjawab kebutuhan pasar olahragawan modern dalam mengabadikan rekam jejak perjuangan fisik mereka ke dalam karya seni teknologi bernilai abadi.
