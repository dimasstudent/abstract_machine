## Abstract Machine
---

# 📄 README: Simulator DFA & NFA Berbasis Web

> Aplikasi web interaktif untuk membuat, mengedit, dan mensimulasikan mesin DFA (Deterministic Finite Automaton) dan NFA (Non-deterministic Finite Automaton)

## 🔖 Deskripsi
Aplikasi ini dirancang untuk membantu mahasiswa dan penggemar teori komputasi dalam memahami konsep DFA dan NFA secara visual dan interaktif. Pengguna dapat:

- Menentukan states, alfabet, initial state, final state.
- Menambahkan transisi antar state.
- Mensimulasikan string input terhadap mesin.
- Melihat hasil apakah string diterima atau ditolak.
- Visualisasi graf transisi menggunakan library `vis.js`.

---

## 🛠 Teknologi yang Digunakan

| Komponen | Teknologi |
|----------|-----------|
| Frontend | HTML5, CSS3, JavaScript |
| Framework UI | Tailwind CSS |
| Visualisasi Graf | [Vis.js Network](https://visjs.github.io/vis-network/docs/network/) |
| Simulasi Mesin | DFA/NFA |

---

## 📁 Struktur File

```
dfa-nfa-simulator/
├── index.html              # Halaman utama dengan form dan visualisasi
├── assets/                 # Folder untuk aset tambahan (jika ada)
└── README.md               # Dokumentasi ini
```

---

## ▶ Cara Menjalankan Aplikasi

1. **Buka file `index.html`** di browser modern (Chrome, Firefox, Edge).
2. Masukkan:
   - States (contoh: `q0,q1,q2`)
   - Himpunan state (contoh: `0,1`)
   - Pilih Initial State dan Final State(s)
   - Tambahkan transisi dari state ke state dengan simbol tertentu
3. Input string pada kolom simulasi dan klik tombol **Simulasi**
4. Hasil akan muncul apakah string diterima oleh mesin DFA atau NFA.

---

## 🧪 Contoh Tuple Mesin DFA/NFA

Berikut adalah contoh tuple DFA/NFA beserta hasil simulasi yang bisa dicoba di aplikasi ini:

| No. | Tupel Mesin | Keterangan |
|-----|-------------|------------|
| 1   | **DFA**: <br>`Q = {q0, q1, q2}`<br>`Σ = {a, b}`<br>`q0`: initial<br>`F = {q2}`<br>`δ(q0,a)=q1`<br>`δ(q1,b)=q2`<br>`δ(q0,b)=q2` | String `"b"` → DITERIMA |
| 2   | **NFA**: <br>`Q = {q0, q1, q2}`<br>`Σ = {a, b}`<br>`q0`: initial<br>`F = {q2}`<br>`δ(q0,a)=q1`<br>`δ(q0,a)=q2`<br>`δ(q1,b)=q2` | String `"a"` → DITERIMA |
| 3   | **DFA**: <br>`Q = {q0, q1}`<br>`Σ = {0, 1}`<br>`q0`: initial<br>`F = {q1}`<br>`δ(q0,0)=q0`<br>`δ(q0,1)=q1`<br>`δ(q1,0)=q1`<br>`δ(q1,1)=q0` | String `"101"` → DITERIMA |
| 4   | **NFA**: <br>`Q = {q0, q1, q2}`<br>`Σ = {a}`<br>`q0`: initial<br>`F = {q2}`<br>`δ(q0,a)=q0`<br>`δ(q0,a)=q1`<br>`δ(q1,a)=q2` | String `"aaa"` → DITERIMA |

---

## ✅ Fitur Utama

| Fitur | Deskripsi |
|-------|-----------|
| **Input Dinamis** | Masukkan states, alphabet, dan transisi sesuai kebutuhan |
| **Visualisasi Graf** | Tampilkan diagram transisi otomatis |
| **Highlight Jalur** *(opsional)* | Bisa dikembangkan untuk menyoroti jalur eksekusi |
| **Deteksi Otomatis DFA/NFA** | Deteksi jenis mesin berdasarkan jumlah transisi |
| **Tombol Reset dan Lock Posisi** | Atur posisi node agar tetap saat layout ulang |

---

## 🧩 Catatan Pengembangan Lanjutan (TODO)

- [ ] Tambah dukungan transisi epsilon (`ε`) untuk NFA
- [ ] Tambah animasi jalur saat simulasi
- [ ] Ekspor/import konfigurasi mesin dalam format JSON
- [ ] Mode gelap (dark mode)
- [ ] Validasi lebih ketat untuk deteksi loop tak hingga

---

## 📝 Lisensi

MIT License – Lihat file `LICENSE` untuk detail.

---
