# Integrasi formulir Pesan Kendaraan

Halaman: `/pesan/` → setelah kirim ke `/terima-kasih/`
Kode: `assets/js/site.js`, blok `formulir pesan (/pesan/)`

## Mode pengiriman

Diatur lewat atribut `data-endpoint` di `<form id="orderForm">` pada `pesan/index.html`:

| `data-endpoint` | Perilaku |
|---|---|
| kosong (default saat ini) | Pesan disusun dan dibuka di WhatsApp 0888-1111-508, lalu pindah ke `/terima-kasih/` dengan status "Satu langkah lagi: kirim pesan di WhatsApp". **Data tidak tersimpan di sistem.** |
| diisi URL API, mis. `https://api.jennete.com/pesan` | `POST` JSON (di bawah). Respons 2xx → `/terima-kasih/` dengan status "Permintaan Anda sudah kami terima". Selain itu → pesan galat di formulir + tautan kirim lewat WhatsApp. |

Kalau API berada di domain lain, server perlu mengizinkan CORS untuk `POST` dengan `Content-Type: application/json`.

## Skema data (POST JSON)

```json
{
  "jalur": "perusahaan",                       // "perusahaan" | "perorangan"
  "kendaraan": { "jenis": "mobil", "merek": "Toyota", "model": "Alphard" },   // merek/model null = minta rekomendasi
  "kebutuhan": {                               // jalur = perusahaan
    "jumlah": 5, "durasi_bulan": 12, "sopir": true,
    "lokasi": "Jakarta Selatan", "mulai": "2026-12"           // opsional → null
  },
  "catatan": null,
  "kontak": { "nama": "Budi", "telepon": "0812 3456 7890", "email": "budi@perusahaan.co.id", "perusahaan": "PT Contoh" },
  "sumber": "https://…/pesan/?unit=toyota-alphard",
  "dikirim": "2026-10-21T06:30:00.000Z"
}
```

Untuk `jalur: "perorangan"`, `kebutuhan` berisi:

```json
{ "alamat": "Jl. …", "jemput": "2026-10-23T09:00", "kembali": "2026-10-26T09:00" }
```

dan `kontak.email` boleh `null`, `kontak.perusahaan` selalu `null`.

Validasi sisi klien sudah ada (nama, telepon format Indonesia, email, alamat ≥ 10 karakter, waktu jemput di masa depan, kembali setelah jemput). **Server tetap wajib memvalidasi ulang.**

## Prefill lewat URL

`/pesan/?jalur=perusahaan&unit=toyota-alphard` atau `&jenis=mobil&merek=Chery&model=Tiggo%208%20CSH&jumlah=3&durasi=36&sopir=1`
`unit` = slug merek + model (huruf kecil, spasi → `-`). Dipakai oleh link "Isi formulir lengkap" di modal Minta Penawaran.

## Formulir kontak (`/kontak/`)

Atribut sama: `data-endpoint` pada `<form id="contactForm">` di `kontak/index.html`. Kosong → WhatsApp; terisi → `POST` JSON:

```json
{
  "jenis": "kontak",
  "topik": "Pertanyaan umum",          // Pertanyaan umum | Penawaran sewa | Layanan dan servis | Kerja sama | Lainnya
  "pesan": "…",
  "kontak": { "nama": "Budi", "telepon": "0812 3456 7890", "email": null, "perusahaan": null },
  "sumber": "https://…/kontak/",
  "dikirim": "2026-10-21T06:30:00.000Z"
}
```

Prefill topik lewat URL: `/kontak/?topik=Kerja%20sama`. Endpoint boleh sama dengan formulir pesan; bedakan lewat field `jenis`.
