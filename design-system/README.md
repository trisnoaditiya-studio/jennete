# Jennete Rent Design System v1.0

Design system yang diambil dari situs yang sudah berjalan (`index.html`, `solusi-bisnis.html`, `wuling-cortez-darion.html`).
Style: Corporate Professional + aksen ungu premium · Font: Albert Sans · Light mode.

## Jalankan styleguide

```bash
cd ~/Documents/GitHub/jennete && python3 -m http.server 8000
```

Buka http://127.0.0.1:8000/design-system/

## File

| File | Isi |
|---|---|
| `tokens/design-tokens.json` | **Single source of truth** (format DTCG) |
| `tokens/tokens.css` | CSS custom properties (generated) + alias lama (`--ink`, `--brand`, `--r` …) |
| `tokens/tokens.js` | Token untuk styleguide (generated) |
| `build-tokens.py` | Generator JSON → CSS/JS |
| `components.css` | Semua komponen, 100% memakai `var()` |
| `index.html` | Styleguide interaktif |
| `assets/` | Logo & foto yang diekstrak dari situs |

## Hubungan dengan situs

CSS situs ada di `../assets/css/style.css`, satu file untuk semua halaman. Variabel `:root` di sana (`--ink`, `--brand`, `--wa`, …) bernilai sama dengan token di sini. Kalau warna brand diubah, ubah di keduanya.

## Ubah token

1. Edit `tokens/design-tokens.json`
2. `python3 design-system/build-tokens.py`

## Catatan terbuka

- **Tombol WhatsApp**: `green.600` sudah diganti ke `#1A7F45` (sekitar 5.0:1, lolos AA). Sebelumnya `#1F8F4E` (4.12:1).
- Komponen **Toast**, **Dropdown**, **Tabs underline**, dan **Badge status** belum ada di situs. Komponen ini dirancang baru dengan bahasa visual yang sama.
- Panah `<select>` memakai data-URI SVG dengan warna `#626A71` hardcoded, karena CSS var tidak bisa dipakai di dalam data-URI.
