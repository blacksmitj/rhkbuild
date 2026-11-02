# PRD Final — SKP Builder



Kebutuhan dikonfirmasi

Versi 1.1



SKP Builder adalah aplikasi penyusunan dan pencatatan Sasaran Kinerja Pegawai (SKP) tahunan dengan pengisian rencana aksi dan realisasi setiap akhir bulan.

Fokus utama produk adalah mempermudah pegawai:

1. Menyusun struktur SKP satu kali setiap tahun.
2. Mengisi rencana aksi dan realisasi setiap akhir bulan.
3. Melihat referensi rencana aksi pegawai lain dalam satu instansi.
4. Menyalin rencana aksi dari bulan sebelumnya atau referensi pegawai lain.
5. Memindahkan rencana aksi ke IKI yang sesuai.
6. Memantau akumulasi realisasi terhadap target tahunan.

## 1. Keputusan bisnis final

Berikut ketentuan yang menjadi dasar seluruh rancangan database dan UI/UX.

| Aspek                   | Keputusan final                                 |
| ----------------------- | ----------------------------------------------- |
| Periode SKP             | Satu tahun                                      |
| Struktur SKP            | Diisi sekali setahun                            |
| Rencana aksi            | Dibuat baru setiap bulan                        |
| Realisasi               | Diisi bersamaan dengan rencana aksi             |
| Penggunaan rencana aksi | Tidak berulang lintas bulan                     |
| Referensi               | Semua pegawai dalam satu instansi               |
| Copy rencana aksi       | Bulan sebelumnya, bulan lain, atau pegawai lain |
| Verifikasi atasan       | Belum masuk MVP                                 |
| Bukti dukung            | Maksimal satu per rencana aksi                  |
| Akumulasi realisasi     | Otomatis berdasarkan IKI                        |

Perubahan arsitektur penting: Rencana aksi bukan lagi objek yang digunakan berulang kali. Setiap rencana aksi merupakan catatan bulanan yang berdiri sendiri, memiliki satu bulan, satu IKI, satu realisasi, dan maksimal satu bukti dukung.

## 2. Struktur hierarki data

SKP Tahunan — 2026

Milik satu pegawai

RHK Pimpinan yang Diintervensi

RHK Individu

IKI

Target: 20 JPL | Satuan: JPL

Rencana Aksi Bulanan

Januari — 3 JPL

Rencana Aksi Bulanan

Februari — 4 JPL

Rencana Aksi Bulanan

Maret — 2 JPL

Setiap bulan memiliki record rencana aksi sendiri, bukan menggunakan record bulan sebelumnya.

Akumulasi realisasi IKI

# 9 / 20 JPL

## 3. Ruang lingkup produk

### MVP — Fitur wajib

| Modul             | Fitur                                       |
| ----------------- | ------------------------------------------- |
| Dashboard         | Ringkasan SKP dan progres tahunan           |
| SKP Tahunan       | CRUD struktur RHK dan IKI                   |
| Target IKI        | Target tahunan dan satuan                   |
| Pengisian Bulanan | Input rencana aksi dan realisasi            |
| Bukti Dukung      | Satu tautan atau satu file per rencana aksi |
| Referensi         | Pencarian rencana aksi satu instansi        |
| Copy              | Salin data dari bulan atau pegawai lain     |
| Pindahkan         | Pindahkan rencana aksi ke IKI lain          |
| Rekapitulasi      | Akumulasi realisasi per IKI dan bulanan     |

### Di luar MVP

- Verifikasi dan persetujuan atasan.
- Penilaian kinerja oleh pejabat penilai.
- Integrasi dengan sistem kepegawaian eksternal.
- Tanda tangan elektronik.
- Workflow keberatan atau revisi penilaian.

# 4. Spesifikasi UI/UX

## A. Dashboard

[Employee HR Management Dashboard - SAAS by Vektora UIUX for Vektora on Dribbble](https://images.openai.com/static-rsc-4/uLxAtxkWjZYSr9NRn7IU62yO3ARRHrJO9SEqKsXWS9QzpB6dLqOpcpmEEXr9OlUzJq8Zi3mSsS_opmjjVwTFv5YUTQ06tIpWBXladfuRnYY2EPWQJzzIjQ3Yy20dtK5n-xBipyaBjTs-zWaww7ImzYJJ_q851NCsGuOguUpz8B8?purpose=inline)

[dribbble.com](https://dribbble.com/shots/24249563-Employee-HR-Management-Dashboard-SAAS?utm_source=chatgpt.com)

Dashboard harus menjawab tiga pertanyaan:

- Bagaimana progres SKP tahun ini?
- Bulan mana yang sudah dan belum diisi?
- IKI mana yang realisasinya masih kurang?

Komponen:

| Komponen           | Informasi                           |
| ------------------ | ----------------------------------- |
| SKP Aktif          | Tahun dan status SKP                |
| Total RHK          | Jumlah RHK individu                 |
| Total IKI          | Jumlah indikator                    |
| Total Rencana Aksi | Jumlah seluruh rencana aksi tahunan |
| Realisasi          | Akumulasi realisasi                 |
| Progres Target     | Persentase pencapaian               |

Bagian bawah menampilkan tabel progres bulanan.

| Bulan    | Rencana Aksi | Status      |
| -------- | ------------ | ----------- |
| Januari  | 8            | Selesai     |
| Februari | 6            | Selesai     |
| Maret    | 7            | Selesai     |
| April    | 0            | Belum diisi |

Status ini merupakan status kelengkapan pengisian, bukan status persetujuan atasan.

## B. Halaman SKP Tahunan

[Complex Table by Shivam Kumar on Dribbble](https://images.openai.com/static-rsc-4/joE-9tBYW3WF5ptYfatc2xDPpoRdZveWibf6oFerufPJnBCdTukID9aCgemtXESbsD8T-7kMbbtqWFHT27jD70FpDar-rsUwvcvledBfn7CcTkQUqamoXGCj4IpOuR8QvJXCnDNwpYKWu_VDNxJJkGHISd22SYURVYIPmendPwY?purpose=inline)

[dribbble.com](https://dribbble.com/shots/22359030-Complex-Table?utm_source=chatgpt.com)

Tujuan: Menyusun seluruh struktur SKP untuk satu tahun.

Layout yang disarankan:

SKP Tahunan

2026

Struktur SKP

\+ Tambah RHK Pimpinan

1\. Meningkatnya kualitas penyelenggaraan pelatihan

2 RHK Individu

2 IKI

RHK 1. Terlaksananya pelatihan kompetensi

IKI: Jumlah jam pelajaran pelatihan

Target: 20 JPL

12 JPL tercapai

\+ Tambah RHK / IKI

Struktur harus mendukung:

- Tambah, edit, hapus RHK Pimpinan.
- Tambah, edit, hapus RHK individu.
- Tambah, edit, hapus IKI.
- Menentukan target tahunan dan satuan.
- Expand/collapse setiap tingkat hierarki.
- Duplikasi struktur SKP tahun sebelumnya.

Validasi: SKP tahunan yang sudah memiliki rencana aksi atau realisasi harus memiliki perlindungan terhadap penghapusan dan perubahan IKI yang berpotensi merusak histori.

## C. Halaman Pengisian Bulanan

Halaman utama aplikasi

[KPI dashboard by Anna Logacheva on Dribbble](https://images.openai.com/static-rsc-4/QnC_UUucWa90AcEK0CbqeH861fqeIfO5PfuNRppsn3OJt1D1XYF3ed50OD7iv7i1UGJbCxHzsUO9wWdbuH6xwmp1I_fSPsxkHcjqdvh7uXMraURQxMAnnhpiQWL-35DFYm-WKlVb3-LsyyaxNxaHAuU6_c9AVk5sOlnG0xj604o?purpose=inline)

[dribbble.com](https://dribbble.com/shots/25974500-KPI-dashboard?utm_source=chatgpt.com)

Halaman ini menjadi tempat kerja utama pengguna.

### Susunan halaman

Pengisian Bulanan

2026

Pilih bulanNovember

Total IKI

# 8

Rencana Aksi

# 12

IKI 01 — Jumlah jam pelajaran pelatihan

Target tahunan: 20 JPL

Realisasi sebelumnya: 6 JPL

Rencana Aksi November

Melaksanakan pelatihan teknis bagi peserta pelatihan.

Bukti: Dokumentasi kegiatan pelatihan

Realisasi bulan ini

3 JPL

Edit

\+ Rencana AksiCari Referensi

Contoh interaksi konseptual, bukan data tersimpan.

### Struktur tabel sebenarnya

Sebaiknya gunakan pengelompokan berdasarkan IKI, bukan satu tabel besar berisi semua rencana aksi.

| Rencana Aksi           | Bukti Dukung           | Realisasi |
| ---------------------- | ---------------------- | --------- |
| Melaksanakan pelatihan | Dokumentasi pelatihan  | 3 JPL     |
| Melakukan koordinasi   | Dokumentasi koordinasi | 2 JPL     |
| Menyusun laporan       | Laporan kegiatan       | 1 JPL     |

Setiap kelompok IKI menampilkan:

- Nama IKI.
- Target tahunan.
- Akumulasi realisasi sampai bulan sebelumnya.
- Realisasi bulan berjalan.
- Daftar rencana aksi bulan berjalan.
- Tombol tambah rencana aksi.

Dengan begitu, pengguna dapat langsung memahami kontribusi setiap aktivitas terhadap target IKI.

## D. Form Tambah Rencana Aksi

Form ini harus sederhana dan tidak terlalu panjang.

Tambah Rencana Aksi

IKI

Jumlah jam pelajaran pelatihan

Rencana Aksi

Melaksanakan pelatihan teknis bagi peserta pelatihan

Bukti Dukung

Link Bukti Dukung

Satu link atau satu file bukti dukung.

Realisasi Bulan Ini

JPL

Satuan otomatis mengikuti IKI yang dipilih.

Simpan Rencana Aksi (simulasi)

Aturan form:

- IKI otomatis terisi dari kelompok yang dipilih.
- Satuan realisasi otomatis mengikuti IKI.
- Realisasi wajib berupa angka non-negatif untuk IKI kuantitatif.
- Bukti dukung maksimal satu objek.
- Bukti dukung dapat berupa satu URL atau satu file.
- Nama bukti dukung dan link/file disimpan dalam satu entitas bukti.
- Bulan dan tahun otomatis mengikuti halaman yang sedang dibuka.

## E. Referensi Rencana Aksi

[Complete Dropbox Pricing Guide With Comparisons & Alternatives](https://images.openai.com/static-rsc-4/c59GLpi2jrM4aUmSAdxq8zehYtORBOjd5mOcz1citm8mhH_3lRss5ZeW4qtnXFIHSfvQMyqxWV_wRNAHGIBgLAMM68zgovkJz4j6oW5kj58Zfgn3GpJyqw3iVhc1-nR9m_bVRosDV8HBtu2mCkiXTZliQaxaTZLRDui3thAjpAo?purpose=inline)

[larksuite.com](https://www.larksuite.com/en_us/blog/dropbox-pricing?utm_source=chatgpt.com)

Referensi harus terintegrasi langsung dengan halaman pengisian bulanan.

Alur:

1. Pengguna membuka IKI.
2. Menekan tombol Cari Referensi.
3. Sistem mencari rencana aksi dari IKI yang sama milik pegawai satu instansi.
4. Pengguna dapat memfilter bulan, tahun dan unit kerja.
5. Pengguna melihat detail rencana aksi.
6. Pengguna menyalin rencana aksi.
7. Sistem membuat record baru di bulan yang sedang diisi.

Contoh panel referensi:

| Informasi    | Isi                            |
| ------------ | ------------------------------ |
| IKI          | Jumlah jam pelajaran pelatihan |
| Pemilik      | Pegawai A                      |
| Unit kerja   | Bidang Pelatihan               |
| Periode      | Oktober 2026                   |
| Rencana Aksi | Melaksanakan pelatihan teknis  |
| Bukti dukung | Dokumentasi pelatihan          |
| Realisasi    | 3 JPL                          |

Tombol utama: Salin ke November 2026.

Ketika disalin:

- Teks rencana aksi disalin.
- Nama bukti dukung disalin.
- Link bukti dukung sebaiknya tidak langsung digunakan sebagai bukti milik pengguna baru; tampilkan sebagai referensi yang perlu diganti atau dikonfirmasi.
- Realisasi tidak disalin sebagai nilai realisasi bulan baru. Form realisasi diisi ulang.
- Pemilik referensi dan sumbernya tidak berubah.

Catatan privasi: Karena semua pegawai dalam satu instansi dapat melihat referensi, sediakan kebijakan berbagi dan jangan menampilkan informasi pribadi yang tidak diperlukan. Referensi hanya menampilkan data yang relevan untuk pekerjaan.

## F. Copy Rencana Aksi

Sediakan satu tombol dengan tiga sumber penyalinan:

Salin Rencana Aksi

Bulan sebelumnya

Salin aktivitas bulan Oktober ke November.

Copy

Bulan lainnya

Pilih bulan dan tahun sumber.

Copy

Referensi pegawai

Ambil dari pegawai lain dalam instansi.

Copy

Ada satu hal yang perlu diperhatikan: sistem harus mengizinkan beberapa rencana aksi dengan teks serupa jika memang aktivitasnya berbeda. Namun, perlu memberikan peringatan jika pengguna menyalin rencana aksi yang identik dua kali dalam bulan dan IKI yang sama.

## G. Pindahkan Rencana Aksi

Fitur ini tersedia pada menu tiga titik setiap rencana aksi.

Pilihan:

- Edit.
- Salin.
- Pindahkan ke IKI lain.
- Hapus.

Ketika memilih pindahkan:

1. Tampilkan IKI asal.
2. Pilih IKI tujuan.
3. Validasi kesesuaian satuan.
4. Tampilkan konfirmasi.
5. Pindahkan rencana aksi beserta bukti dan realisasinya.

Jika satuan berbeda, jangan melakukan konversi otomatis tanpa aturan konversi yang jelas. Berikan pesan bahwa pengguna harus memperbaiki nilai realisasi atau memilih IKI yang sesuai.

# 5. Rekapitulasi dan perhitungan otomatis

Halaman rekapitulasi harus menampilkan pencapaian setiap IKI.

Contoh:

| Bulan        | Realisasi |
| ------------ | --------- |
| Januari      | 3 JPL     |
| Februari     | 4 JPL     |
| Maret        | 2 JPL     |
| April        | 0 JPL     |
| Mei–Desember | 0 JPL     |
| Total        | 9 JPL     |

IKI: Jumlah Jam Pelajaran Pelatihan

# 9 JPL

dari target 20 JPL

# 45%

Pencapaian

# 9

Realisasi

# 11

Sisa target

Rumus:

\\[ \text{Total Realisasi} = \sum\_{i=1}^{12} \text{Realisasi Bulan}\_i \\]

\\[ \text{Pencapaian} = \frac{\text{Total Realisasi}}{\text{Target Tahunan}}\times100\\% \\]

Jika target nol, satuan tidak kompatibel, atau target bukan numerik, sistem tidak boleh menghitung persentase secara sembarangan.

# 6. Status pengisian bulanan

Saya menyarankan hanya tiga status pada MVP.

| Status        | Keterangan                                           |
| ------------- | ---------------------------------------------------- |
| Belum diisi   | Belum ada rencana aksi                               |
| Draft         | Sudah ada data tetapi belum ditandai selesai         |
| Selesai diisi | Pengguna menyatakan pengisian bulan tersebut selesai |

Tidak ada status disetujui atau ditolak karena verifikasi atasan belum masuk ruang lingkup MVP.

Pengguna tetap dapat mengedit data setelah menandai selesai, tetapi sistem perlu memperbarui status menjadi Draft jika perubahan membuat pengisian belum lengkap.

# 7. Spesifikasi database final

Saya menyarankan desain database menggunakan PostgreSQL dan Drizzle ORM.

Ada perubahan penting dari rancangan sebelumnya: tidak perlu tabel rencana aksi induk yang dipakai lintas bulan. Setiap rencana aksi langsung terhubung dengan IKI dan periode bulanan.

## Struktur tabel

| Tabel                  | Fungsi                             |
| ---------------------- | ---------------------------------- |
| users                  | Pengguna aplikasi                  |
| organizations          | Instansi dan unit kerja            |
| skp_periods            | SKP pengguna per tahun             |
| skp_lead_interventions | RHK pimpinan                       |
| skp_work_plans         | RHK individu                       |
| skp_indicators         | IKI, target dan satuan             |
| skp_monthly_periods    | Periode pengisian bulanan          |
| skp_action_plans       | Rencana aksi bulanan               |
| skp_evidences          | Satu bukti dukung per rencana aksi |
| skp_reference_settings | Pengaturan visibilitas referensi   |
| skp_activity_logs      | Histori perubahan data penting     |

## Relasi database

\#chatgpt-mermaid-\_r_pp\_{font-family:-apple-system-body,ui-sans-serif,-apple-system,system-ui,"Segoe UI",Helvetica,"Apple Color Emoji",Arial,sans-serif,"Segoe UI Emoji","Segoe UI Symbol";font-size:16px;fill:rgb(237, 237, 237);}@keyframes edge-animation-frame{from{stroke-dashoffset:0;}}@keyframes dash{to{stroke-dashoffset:0;}}#chatgpt-mermaid-\_r_pp\_ .edge-animation-slow{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 50s linear infinite;stroke-linecap:round;}#chatgpt-mermaid-\_r_pp\_ .edge-animation-fast{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 20s linear infinite;stroke-linecap:round;}#chatgpt-mermaid-\_r_pp\_ .error-icon{fill:rgb(48, 48, 48);}#chatgpt-mermaid-\_r_pp\_ .error-text{fill:rgb(237, 237, 237);stroke:rgb(237, 237, 237);}#chatgpt-mermaid-\_r_pp\_ .edge-thickness-normal{stroke-width:1px;}#chatgpt-mermaid-\_r_pp\_ .edge-thickness-thick{stroke-width:3.5px;}#chatgpt-mermaid-\_r_pp\_ .edge-pattern-solid{stroke-dasharray:0;}#chatgpt-mermaid-\_r_pp\_ .edge-thickness-invisible{stroke-width:0;fill:none;}#chatgpt-mermaid-\_r_pp\_ .edge-pattern-dashed{stroke-dasharray:3;}#chatgpt-mermaid-\_r_pp\_ .edge-pattern-dotted{stroke-dasharray:2;}#chatgpt-mermaid-\_r_pp\_ .marker{fill:rgb(175, 175, 175);stroke:rgb(175, 175, 175);}#chatgpt-mermaid-\_r_pp\_ .marker.cross{stroke:rgb(175, 175, 175);}#chatgpt-mermaid-\_r_pp\_ svg{font-family:-apple-system-body,ui-sans-serif,-apple-system,system-ui,"Segoe UI",Helvetica,"Apple Color Emoji",Arial,sans-serif,"Segoe UI Emoji","Segoe UI Symbol";font-size:16px;}#chatgpt-mermaid-\_r_pp\_ p{margin:0;}#chatgpt-mermaid-\_r_pp\_ .entityBox{fill:rgb(9, 23, 44);stroke:rgb(31, 78, 148);}#chatgpt-mermaid-\_r_pp\_ .relationshipLabelBox{fill:rgb(48, 48, 48);opacity:0.7;background-color:rgb(48, 48, 48);}#chatgpt-mermaid-\_r_pp\_ .relationshipLabelBox rect{opacity:0.5;}#chatgpt-mermaid-\_r_pp\_ .labelBkg{background-color:rgba(48, 48, 48, 0.5);}#chatgpt-mermaid-\_r_pp\_ .edgeLabel{background-color:rgb(0, 0, 0);}#chatgpt-mermaid-\_r_pp\_ .edgeLabel .label rect{fill:rgb(0, 0, 0);}#chatgpt-mermaid-\_r_pp\_ .edgeLabel .label text{fill:rgb(237, 237, 237);}#chatgpt-mermaid-\_r_pp\_ .edgeLabel .label{fill:rgb(31, 78, 148);font-size:14px;}#chatgpt-mermaid-\_r_pp\_ .label{font-family:-apple-system-body,ui-sans-serif,-apple-system,system-ui,"Segoe UI",Helvetica,"Apple Color Emoji",Arial,sans-serif,"Segoe UI Emoji","Segoe UI Symbol";color:rgb(237, 237, 237);}#chatgpt-mermaid-\_r_pp\_ .edge-pattern-dashed{stroke-dasharray:8,8;}#chatgpt-mermaid-\_r_pp\_ .node rect,#chatgpt-mermaid-\_r_pp\_ .node circle,#chatgpt-mermaid-\_r_pp\_ .node ellipse,#chatgpt-mermaid-\_r_pp\_ .node polygon{fill:rgb(9, 23, 44);stroke:rgb(31, 78, 148);stroke-width:1px;}#chatgpt-mermaid-\_r_pp\_ .relationshipLine{stroke:rgb(175, 175, 175);stroke-width:1px;fill:none;}#chatgpt-mermaid-\_r_pp\_ .marker{fill:none!important;stroke:rgb(175, 175, 175)!important;stroke-width:1;}#chatgpt-mermaid-\_r_pp\_ [data-look=neo].labelBkg{background-color:rgba(48, 48, 48, 0.5);}#chatgpt-mermaid-\_r_pp\_ .node .neo-node{stroke:rgb(31, 78, 148);}#chatgpt-mermaid-\_r_pp\_ [data-look="neo"].node rect,#chatgpt-mermaid-\_r_pp\_ [data-look="neo"].cluster rect,#chatgpt-mermaid-\_r_pp\_ [data-look="neo"].node polygon{stroke:url(#chatgpt-mermaid-\_r_pp\_-gradient);filter:drop-shadow( 1px 2px 2px rgba(185,185,185,1));}#chatgpt-mermaid-\_r_pp\_ [data-look="neo"].swimlane.cluster rect{filter:none;}#chatgpt-mermaid-\_r_pp\_ [data-look="neo"].node path{stroke:url(#chatgpt-mermaid-\_r_pp\_-gradient);stroke-width:1px;}#chatgpt-mermaid-\_r_pp\_ [data-look="neo"].node .outer-path{filter:drop-shadow( 1px 2px 2px rgba(185,185,185,1));}#chatgpt-mermaid-\_r_pp\_ [data-look="neo"].node .neo-line path{stroke:rgb(31, 78, 148);filter:none;}#chatgpt-mermaid-\_r_pp\_ [data-look="neo"].node circle{stroke:url(#chatgpt-mermaid-\_r_pp\_-gradient);filter:drop-shadow( 1px 2px 2px rgba(185,185,185,1));}#chatgpt-mermaid-\_r_pp\_ [data-look="neo"].node circle .state-start{fill:#000000;}#chatgpt-mermaid-\_r_pp\_ [data-look="neo"].icon-shape .icon{fill:url(#chatgpt-mermaid-\_r_pp\_-gradient);filter:drop-shadow( 1px 2px 2px rgba(185,185,185,1));}#chatgpt-mermaid-\_r_pp\_ [data-look="neo"].icon-shape .icon-neo path{stroke:url(#chatgpt-mermaid-\_r_pp\_-gradient);filter:drop-shadow( 1px 2px 2px rgba(185,185,185,1));}#chatgpt-mermaid-\_r_pp\_ :root{--mermaid-font-family:-apple-system-body,ui-sans-serif,-apple-system,system-ui,"Segoe UI",Helvetica,"Apple Color Emoji",Arial,sans-serif,"Segoe UI Emoji","Segoe UI Symbol";}ORGANIZATIONSUSERSSKP_PERIODSSKP_LEAD_INTERVENTIONSSKP_WORK_PLANSSKP_INDICATORSSKP_MONTHLY_PERIODSSKP_ACTION_PLANSSKP_EVIDENCESSKP_ACTIVITY_LOGScontainsownscontainscontainscontainshascontainsreceiveshasrecords

## Field penting

skp_periods

- id
- user_id
- year
- status
- created_at
- updated_at

Unique: `user_id + year`.

skp_indicators

- id
- work_plan_id
- indicator_name
- annual_target
- unit
- measurement_type
- sort_order

skp_monthly_periods

- id
- skp_period_id
- month
- status
- completed_at

Unique: `skp_period_id + month`.

skp_action_plans

- id
- monthly_period_id
- indicator_id
- action_description
- realization_value
- source_action_id (nullable)
- created_at
- updated_at

skp_evidences

- id
- action_plan_id
- evidence_name
- evidence_type
- evidence_url atau file_key
- created_at

Unique: `action_plan_id`, untuk menjamin maksimal satu bukti dukung.

`source_action_id` digunakan untuk mengetahui asal salinan, bukan sebagai relasi yang membuat kedua data saling bergantung.

## Catatan teknis

1. Nilai realisasi disimpan sebagai angka desimal, bukan teks.
2. Satuan disimpan sebagai referensi atau kode satuan yang konsisten.
3. Akumulasi tahunan dihitung dari seluruh rencana aksi pada IKI yang sama.
4. Penghapusan IKI yang sudah memiliki histori harus dibatasi.
5. Pemindahan IKI harus menggunakan transaksi database.
6. Sumber referensi harus tetap tercatat untuk kebutuhan audit.
7. Gunakan soft delete untuk data penting yang sudah memiliki histori.

# 8. Aturan bisnis final

Berikut aturan yang harus menjadi dasar implementasi backend.

| ID    | Aturan                                                                 |
| ----- | ---------------------------------------------------------------------- |
| BR-01 | Satu pengguna memiliki satu SKP per tahun.                             |
| BR-02 | SKP memiliki banyak RHK pimpinan yang diintervensi.                    |
| BR-03 | Setiap RHK pimpinan dapat memiliki banyak RHK individu.                |
| BR-04 | Setiap RHK individu dapat memiliki banyak IKI.                         |
| BR-05 | Setiap IKI memiliki target tahunan dan satuan.                         |
| BR-06 | Setiap bulan merupakan periode pengisian tersendiri.                   |
| BR-07 | Rencana aksi wajib terkait dengan satu IKI dan satu periode bulanan.   |
| BR-08 | Rencana aksi bulan sebelumnya tidak digunakan kembali secara langsung. |
| BR-09 | Copy menghasilkan record baru.                                         |
| BR-10 | Satu rencana aksi hanya memiliki satu bukti dukung.                    |
| BR-11 | Realisasi dimasukkan bersamaan dengan rencana aksi.                    |
| BR-12 | Realisasi diakumulasikan berdasarkan IKI.                              |
| BR-13 | Referensi dapat dilihat pegawai dalam instansi yang sama.              |
| BR-14 | Pengguna hanya dapat mengubah data SKP miliknya sendiri.               |
| BR-15 | Pengguna dapat memindahkan rencana aksi ke IKI lain dengan validasi.   |
| BR-16 | Copy tidak menyalin nilai realisasi.                                   |
| BR-17 | Penghapusan data yang memiliki histori harus dibatasi.                 |
| BR-18 | Perubahan penting dicatat dalam audit log.                             |

# 9. Hak akses pengguna

Untuk MVP, cukup gunakan dua role.

| Fitur                            | Pegawai | Admin |
| -------------------------------- | ------- | ----- |
| Membuat SKP                      | Ya      | Ya    |
| Mengedit SKP sendiri             | Ya      | Ya    |
| Mengisi realisasi                | Ya      | Ya    |
| Melihat referensi instansi       | Ya      | Ya    |
| Menyalin referensi               | Ya      | Ya    |
| Memindahkan rencana aksi sendiri | Ya      | Ya    |
| Mengelola pengguna               | Tidak   | Ya    |
| Mengelola instansi               | Tidak   | Ya    |
| Mengelola satuan                 | Tidak   | Ya    |

Admin tidak otomatis memiliki hak mengubah SKP pegawai tanpa mekanisme otorisasi yang jelas.

# 10. Acceptance Criteria

Fitur dianggap selesai apabila memenuhi pengujian berikut.

| Fitur             | Kriteria keberhasilan                                            |
| ----------------- | ---------------------------------------------------------------- |
| SKP tahunan       | Pengguna dapat membuat SKP untuk satu tahun.                     |
| Hierarki          | RHK dan IKI tersimpan dengan relasi benar.                       |
| Target            | Target dan satuan dapat ditentukan.                              |
| Pengisian bulanan | Pengguna dapat membuat beberapa rencana aksi pada IKI yang sama. |
| Realisasi         | Nilai realisasi tersimpan sesuai satuan IKI.                     |
| Bukti dukung      | Maksimal satu bukti per rencana aksi.                            |
| Copy bulan lalu   | Menghasilkan record baru tanpa menyalin realisasi.               |
| Copy referensi    | Hanya menampilkan data satu instansi.                            |
| Pindahkan         | Data dipindahkan tanpa kehilangan histori.                       |
| Rekapitulasi      | Total realisasi otomatis dihitung dengan benar.                  |
| Status bulan      | Status berubah sesuai kelengkapan pengisian.                     |
| Keamanan          | Pengguna tidak dapat mengubah SKP pengguna lain.                 |

# 11. Rekomendasi urutan pengerjaan

Saya menyarankan pengembangan dilakukan dengan urutan berikut.

Sprint 1 — Fondasi

Prioritas 1

- Autentikasi dan profil.
- Pengelolaan instansi.
- Struktur SKP tahunan.
- CRUD RHK dan IKI.
- Target dan satuan.

Sprint 2 — Pengisian Bulanan

Prioritas 1

- Pemilihan bulan.
- CRUD rencana aksi bulanan.
- Bukti dukung.
- Input realisasi.
- Rekapitulasi otomatis.
- Status pengisian.

Sprint 3 — Referensi

Prioritas 2

- Pencarian referensi.
- Filter IKI, bulan, tahun dan unit kerja.
- Copy bulan sebelumnya.
- Copy bulan lainnya.
- Copy referensi pegawai.

Sprint 4 — Penyempurnaan

Prioritas 3

- Pindahkan rencana aksi.
- Audit log.
- Export PDF/Excel.
- Optimasi UX.
- Pengujian akses dan keamanan.

# 12. Keputusan desain tambahan yang saya rekomendasikan

Ada empat keputusan teknis yang sebaiknya langsung diterapkan agar aplikasi tidak perlu dirombak setelah digunakan.

1\. Referensi berdasarkan kesamaan IKI: Prioritaskan referensi dari IKI yang sama. Jangan hanya mengandalkan pencarian teks karena dua indikator yang namanya mirip belum tentu memiliki satuan dan tujuan yang sama.

2\. Satuan terstandarisasi: Gunakan master satuan, bukan input teks bebas. Misalnya `JPL`, `Kegiatan`, `Dokumen`, `Orang`, dan `Laporan`. Ini penting untuk perhitungan dan pemindahan rencana aksi.

3\. Histori copy: Simpan informasi sumber rencana aksi sehingga pengguna dapat mengetahui apakah aktivitas dibuat sendiri atau disalin dari pegawai lain.

4\. Perlindungan data tahunan: Perubahan struktur IKI setelah ada realisasi harus memiliki mekanisme validasi agar rekapitulasi lama tidak berubah secara tidak sengaja.

# 13. Kesimpulan rancangan produk

Menurut saya, bentuk aplikasi yang paling tepat adalah:

# SKP Builder

Personal Performance Management

SKP Tahunan

Susun RHK, IKI dan target satu kali setahun.

Pengisian Bulanan

Buat rencana aksi, bukti dukung dan realisasi.

Copy & Referensi

Manfaatkan pekerjaan bulan lalu dan referensi rekan kerja.

Rekapitulasi

Pantau realisasi dan target tahunan secara otomatis.

Prinsip UX terpenting: Jangan membuat pengguna merasa sedang mengisi formulir administrasi yang panjang. Buat pengalaman seperti mengelola daftar pekerjaan bulanan dengan konteks IKI dan target tahunan yang selalu terlihat.

Dengan desain ini, SKP Builder memiliki fondasi yang cukup kuat untuk dikembangkan menjadi aplikasi multi-pengguna satu instansi, tanpa harus membangun ulang struktur utamanya ketika fitur verifikasi atasan ditambahkan nanti.