### `STYLE.md`

```markdown
# Style Guide (`STYLE.md`)
## Kalkulaku - Design Language & Style Tokens

---

### 1. Visual Personality
* **Clean & Pragmatic:** Tanpa dekorasi berlebih, memprioritaskan keterbacaan angka dan data rasio keuangan.
* **Warm Professional:** Nuansa amber/slate yang memberikan aura profesional F&B tanpa terkesan kaku seperti software akuntansi lawas.

---

### 2. Color Palette (Tailwind CSS Tokens)

#### 2.1 Primary & Neutral Colors
* **Primary (Warm Amber):**
  * `primary-50`: `#FFFBEB`
  * `primary-100`: `#FEF3C7`
  * `primary-500`: `#F59E0B`
  * `primary-600`: `#D97706` (Aksen utama, tombol aksi)
  * `primary-700`: `#B45309`
* **Neutral Slate / Gray:**
  * Background Utama: `#F8FAFC` (`slate-50`)
  * Surface Card: `#FFFFFF` (`white`)
  * Border / Divider: `#E2E8F0` (`slate-200`)
  * Text Primary: `#0F172A` (`slate-900`)
  * Text Secondary: `#64748B` (`slate-500`)
  * Disabled / Muted: `#94A3B8` (`slate-400`)

#### 2.2 Financial Margin Indicators
* **Safe / High Profit ($\ge 50\%$):**
  * BG: `#ECFDF5` (`emerald-50`)
  * Text & Border: `#059669` (`emerald-600`)
* **Moderate / Warning ($30\% - 49,9\%$):**
  * BG: `#FFFBEB` (`amber-50`)
  * Text & Border: `#D97706` (`amber-600`)
* **Danger / Boncos ($< 30\%$):**
  * BG: `#FEF2F2` (`red-50`)
  * Text & Border: `#DC2626` (`red-600`)

---

### 3. Typography Hierarchy
* **Primary Font (UI & Label):** `Plus Jakarta Sans`, `Inter`, atau system sans-serif.
* **Financial & Metric Font:** `JetBrains Mono`, `Roboto Mono`, atau tabular monospace numerals.
  * Wajib diterapkan pada seluruh komponen input nominal harga, kuantitas gramasi, dan hasil persentase margin agar angka sejajar secara vertikal.

```css
/* Kelas Utilitas Angka Rapi */
.font-mono-numeric {
  font-family: 'JetBrains Mono', monospace;
  font-variant-numeric: tabular-nums;
}
4. Spacing & Elevation
Radius Tokens:

Kontainer & Card: rounded-2xl (16px)

Button & Form Field: rounded-xl (12px)

Tag & Badges: rounded-full

Elevation / Shadows:

Card standard: shadow-sm border border-slate-200

Modal & Floating Bottom Action: shadow-lg border border-slate-100

5. UI Micro-Copy Standards
Mata Uang: Format Indonesia dengan pemisah ribuan titik (Rp 25.000).

Satuan: Menggunakan singkatan baku huruf kecil (g, ml, pcs, kg).

Status Badge: Gunakan label lugas (Margin Aman, Margin Tipis, Boncos).