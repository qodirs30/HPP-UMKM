# Product Requirement Document (PRD)
## Kalkulaku - Universal HPP & Recipe Costing SaaS for F&B

---

### 1. Product Overview
Kalkulaku adalah aplikasi web kalkulator Harga Pokok Penjualan (HPP) dan penetapan harga jual makanan/minuman yang fleksibel dan modular. Aplikasi dirancang serbaguna untuk berbagai skala bisnis F&B (bakery, cloud kitchen, katering, coffee shop, camilan tradisional) dengan dukungan penuh untuk kategori dinamis, sub-resep, kemasan, serta kalkulasi margin otomatis.

---

### 2. Problem Statement
* Fluktuasi harga bahan mentah sering tidak terdeteksi dampaknya pada margin keuntungan menu per porsi.
* Kebanyakan kalkulasi UMKM melupakan alokasi biaya packaging (dus, mika, stiker, seal cup, sendok/garpu plastik).
* Pengelompokan kategori menu di aplikasi kaku (hardcoded), padahal tiap lini bisnis F&B memiliki struktur kategori dan varian topping yang berbeda-beda.
* Menghitung ulang harga HPP di spreadsheet manual saat satu bahan baku naik harga sangat lambat dan rawan salah input (*human error*).

---

### 3. User Personas
* **F&B Business Owner:** Membutuhkan transparansi margin kotor per menu, deteksi cepat menu boncos, dan panduan menaikkan harga jual berbasis data.
* **Kitchen / Production Lead:** Mengelola resep standar (Bill of Materials), takaran gramasi, sub-resep (adonan dasar/sirup premix), dan biaya bahan per batch.

---

### 4. Functional Requirements

#### 4.1 Master Kategori Dinamis (Custom Categories)
* Pengguna bebas membuat, mengedit, dan menghapus kategori produk tanpa batasan (contoh: *Kue Basah*, *Pastry*, *Minuman Kopi*, *Paket Bundling*).
* Tiap kategori memiliki metadata opsional: deskripsi dan warna label/tag.

#### 4.2 Master Bahan Baku & Kemasan
* Tambah/edit/hapus data komponen dengan 2 tipe utama:
  * `raw_material` (Bahan Baku)
  * `packaging` (Kemasan & Aksesori)
* Input fleksibel:
  * Nama bahan
  * Kategori bahan (opsional)
  * Satuan beli: `kg`, `gram`, `liter`, `ml`, `pcs`, `pack`, `dus`
  * Harga beli dan kuantitas per kemasan
* Sistem otomatis mengonversi ke satuan dasar (`base_unit`) dan menghitung harga per satuan dasar:
  * $\text{Gram} = \text{Harga Beli} / (\text{Kg} \times 1000)$
  * $\text{Ml} = \text{Harga Beli} / (\text{Liter} \times 1000)$
  * $\text{Pcs} = \text{Harga Beli} / \text{Jumlah Pcs}$

#### 4.3 Manajemen Sub-Resep (Base Recipe / Pre-Mix)
* Kemampuan membuat resep perantara (misal: "Adonan Dasar Tiwul 1 Kg", "Simple Syrup 1 Liter", "Saus Coklat Ganache").
* Sub-resep dapat dipanggil kembali sebagai satu item bahan pada resep menu akhir dengan perhitungan biaya proporsional.

#### 4.4 Recipe Costing & Bill of Materials (BOM)
* Form pembuatan resep menu:
  * Nama menu & pilihan Kategori (dari master kategori pengguna).
  * Porsi per sajian (`yield_qty`, default: 1).
  * Komposisi Bahan: Pilih bahan/sub-resep + input takaran (gram/ml/pcs).
  * Komposisi Kemasan: Pilih dus/cup/stiker/alat makan + kuantitas.
* Perhitungan otomatis:
  * Subtotal HPP Bahan Mentah
  * Subtotal HPP Kemasan
  * Total HPP per Porsi = $(\text{HPP Bahan} + \text{HPP Kemasan}) / \text{Yield}$

#### 4.5 Simulasi Margin & Pricing Recommendation
* Input Target Margin Kotor (`target_margin_pct`, contoh 50% atau 65%).
* Rumus rekomendasi harga jual:
  $$\text{Harga Rekomendasi} = \frac{\text{Total HPP per Porsi}}{1 - (\text{Target Margin} / 100)}$$
* Evaluasi Harga Jual Riil:
  $$\text{Margin Riil (\%)} = \frac{\text{Harga Jual Riil} - \text{Total HPP}}{\text{Harga Jual Riil}} \times 100$$
* Label status margin instan:
  * **Sehat / Untung:** Margin $\ge 50\%$
  * **Tipis / Waspada:** Margin $30\% - 49,9\%$
  * **Boncos / Rugi:** Margin $< 30\%$

#### 4.6 Real-Time Auto-Cascade Price Update
* Ketika harga beli pada master bahan baku/kemasan diubah, sistem secara reaktif menghitung ulang HPP seluruh resep dan sub-resep yang bergantung pada bahan tersebut.

---

### 5. Data Architecture & Types (TypeScript)

```typescript
export interface Category {
  id: string;
  name: string;
  color?: string;
  createdAt: string;
}

export type ItemType = 'raw_material' | 'packaging';
export type BaseUnit = 'gram' | 'ml' | 'pcs';
export type PurchaseUnit = 'kg' | 'gram' | 'liter' | 'ml' | 'pcs' | 'pack';

export interface Ingredient {
  id: string;
  name: string;
  type: ItemType;
  purchasePrice: number;
  purchaseQty: number;
  purchaseUnit: PurchaseUnit;
  baseUnit: BaseUnit;
  costPerBaseUnit: number;
  updatedAt: string;
}

export interface RecipeItem {
  id: string;
  ingredientId: string;
  isSubRecipe?: boolean;
  quantity: number;
  calculatedCost: number;
}

export interface Recipe {
  id: string;
  name: string;
  categoryId: string;
  isSubRecipe: boolean;
  yieldQty: number;
  currentSellingPrice: number;
  targetMarginPct: number;
  items: RecipeItem[];
  totalRawCost: number;
  totalPackagingCost: number;
  totalHppPerPortion: number;
  recommendedPrice: number;
  realMarginPct: number;
  createdAt: string;
  updatedAt: string;
}
6. Non-Functional RequirementsOffline / Local Persistence: Mendukung penyimpanan lokal (LocalStorage / IndexedDB) sebelum sinkronisasi backend.Kecepatan Komputasi: Kalkulasi ulang HPP dan margin bersifat synchronous dan instan ($< 50\text{ ms}$).Aksesibilitas Perangkat: Desain sepenuhnya adaptif untuk penggunaan single-hand pada layar smartphone saat di dapur.