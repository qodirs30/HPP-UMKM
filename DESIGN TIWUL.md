---

### `DESIGN.md`

```markdown
# UI/UX Design System & Layout Structure (`DESIGN.md`)
## Kalkulaku - Universal Recipe Costing

---

### 1. Information Architecture & Navigation

[Kalkulaku]
├── 📊 Dashboard (Ringkasan margin, alert menu boncos, stats)
├── 🏷️ Kategori (Kelola kategori kustom: Tambah, Hapus, Edit Tag)
├── 🌾 Bahan & Dus (Master Bahan Baku & Kemasan dengan konversi satuan)
├── 📝 Resep Menu (Kalkulator BOM, Sub-resep, Margin & Rekomendasi Harga)
└── ⚙️ Pengaturan Bisnis (Profil toko, target default margin)


* **Mobile Interface:** Bottom Navigation Bar tetap (Sticky) dengan 4 menu utama.
* **Desktop Interface:** Collapsible Left Sidebar dengan status aktif indikator amber.

---

### 2. Screen Specifications & Key Flows

#### 2.1 Screen: Master Kategori (Custom Categories)
* **Header:** Judul + Tombol `+ Kategori Baru`.
* **Category List (Data Grid / List):**
  * Card ringkas menampilkan: Nama Kategori, Jumlah Menu Terkait, Badge Warna.
  * Opsi Aksi: Ubah Nama, Ganti Warna, Hapus Kategori (dengan proteksi jika kategori masih dipakai menu).

#### 2.2 Screen: Master Bahan Baku & Kemasan
* **Top Filter Bar:**
  * Segmented Control: `Semua` | `Bahan Baku (Raw)` | `Kemasan (Packaging)`.
  * Search Bar untuk mencari nama bahan secara instan.
* **Item Card / Table Row:**
  * Nama bahan + Badge Kategori.
  * Harga Beli: `Rp 24.000 / 1 kg`.
  * Biaya Terkonversi (Monospace): `Rp 24 / g`.
  * Tombol Aksi cepat: Edit Harga Beli (otomatis memperbarui semua resep terkait).

#### 2.3 Screen: Recipe Costing Builder (Core Feature)
Antarmuka dibagi menjadi 3 zona kerja:

1. **Zona 1 - Meta Menu & Kategori:**
   * Input: Nama Produk (contoh: *Tiwul Jumbo Spesial Chocolatos*).
   * Selector: Dropdown Kategori Kustom pengguna.
   * Toggle: `Resep Menu Jual` vs `Sub-Resep (Bahan Olahan Dasar)`.
   * Input: Jumlah Porsi yang Dihasilkan (`yield_qty`, default: 1 porsi).

2. **Zona 2 - Komposisi Dynamic Builder:**
   * **Seksi A: Bahan Baku**
     * Dropdown pencarian bahan baku.
     * Input angka gramasi/ml.
     * Subtotal kalkulasi otomatis per baris (`Qty * CostPerBaseUnit`).
     * Tombol `+ Tambah Baris Bahan`.
   * **Seksi B: Kemasan & Perlengkapan**
     * Dropdown pilihan packaging (dus, mika, garpu, stiker label).
     * Input jumlah unit (pcs).
     * Subtotal kalkulasi packaging otomatis.
     * Tombol `+ Tambah Baris Kemasan`.

3. **Zona 3 - Financial & Margin Calculator Panel (Sticky Bottom / Side Panel):**
   * Ringkasan Biaya:
     * HPP Bahan: `Rp xx.xxx`
     * HPP Packaging: `Rp xx.xxx`
     * **Total HPP per Porsi: `Rp xx.xxx`**
   * Kontrol Target Margin: Slider / Input persentase (misal default 60%).
   * Kalkulasi Rekomendasi Harga Jual: `Rp xx.xxx` (angka tebal/prominen).
   * Input Harga Jual Riil: Masukkan harga yang saat ini dipasang di menu.
   * Live Margin Comparison Badge: Menampilkan persentase margin riil saat ini lengkap dengan warna status (Aman / Tipis / Boncos).

#### 2.4 Screen: Dashboard & Margin Alert
* **Summary Metric Cards:**
  * Total Menu Terdaftar
  * Rata-rata Margin Bisnis (%)
  * Jumlah Menu Boncos (Margin < 30%)
* **Daftar Pantau "Prioritas Evaluasi Harga":**
  * Menampilkan menu-menu dengan profit terendah.
  * Tombol aksi satu-klik untuk menyesuaikan harga jual mengikuti target margin rekomendasi.

---

### 3. Component Interaction States
* **Form Inputs:** Input numerik mata uang otomatis memformat pemisah ribuan saat pengguna mengetik (`25000` $\rightarrow$ `25.000`).
* **Instant Calculation Feedback:** Semua subtotal dan persentase margin bereaksi seketika (*zero-delay*) saat nilai gramasi atau harga diubah tanpa perlu menekan tombol simpan terlebih dahulu.