# Brief Desain Google Stitch — Website Sekar Agny

> Referensi UI/UX: **https://a24.raviklaassens.com/** (konsep A24, karya Ravi Klaassens)
> Adaptasi: **katalog film → katalog lagu/single Sekar Agny**
> Versi 2: sudah dicek langsung (Home, scroll, drag, Index, klik disc → halaman detail, trailer, Television). Screenshot ada di [`docs/reference/`](./reference).

---

## 0. Cara Pakai di Google Stitch

1. Buka **stitch.withgoogle.com** → pilih mode **Web**, gunakan model **Experimental/Pro**.
2. **Upload screenshot referensi** dari folder `docs/reference/` bersama prompt-nya. Ini jauh lebih akurat daripada teks saja. Pasangan gambar ↔ prompt tertulis di tiap bagian.
3. Tempel **PROMPT 1** dulu (Home). Setelah cocok, lanjutkan PROMPT 2, 3, dst. **di proyek yang sama**, satu layar per prompt.
4. Kalau hasil melenceng, pakai prompt revisi singkat di bagian 9.
5. Prompt sengaja ditulis dalam **bahasa Inggris** karena Stitch lebih akurat dengan bahasa Inggris.

> [!NOTE]
> Stitch hanya membuat **desain statis**. Animasi (preloader, disc 3D, coretan lingkaran, transisi, reveal) dicatat di bagian 10 untuk tahap coding.

---

## 1. Hasil Pengamatan Website Referensi

### Home (`02_home.png`, `03_home_active_scribble.png`)
- Latar **off-white bertekstur grain** (`#F2F2F2`), tanpa section lain. Satu layar penuh.
- **Navigasi**: teks polos tanpa latar, di tengah atas: logo `A24` · **Films** (aktif, ada titik kecil di bawahnya) · Television (abu-abu) · Index ⌄.
- **Panel info di kiri atas** (±300px lebar): judul film **UPPERCASE serif** (±32px), lalu 3 baris dengan garis 1px: label kecil (DIRECTED BY / YEAR / STARRING) di kiri, nilai sans di kanan (rata kanan, bisa beberapa baris).
- **Galeri CD 3D**: piringan **CD** (bukan vinyl) dengan poster film dicetak penuh di permukaan, lubang tengah transparan, tepi perak mengkilap, nama pemain tercetak melingkar di tepi. Disusun **diagonal dari kiri bawah ke kanan atas**: CD aktif besar di tengah, CD berikutnya terpotong di kanan atas, CD sebelumnya di kiri bawah. Semua miring dalam perspektif 3D.
- **Coretan tangan**: CD aktif dilingkari **coretan spidol hitam** seperti dilingkari pena (`03_home_active_scribble.png`).
- **Review di tengah bawah**: 2 kolom, masing-masing berisi bintang kecil, nama media (uppercase kecil), dan kutipan **UPPERCASE serif dalam tanda kutip** (“…”).

### Interaksi Home
- **Scroll** → CD meluncur di sepanjang garis diagonal, CD berikutnya masuk ke tengah, teks panel menghilang/muncul per baris (`04_…`).
- **Drag** → CD aktif **terbalik/berputar** memperlihatkan sisi bawah hitam, coretan lingkaran ikut bergerak (`04_home_drag_flip.png`).
- **Preloader** (`01_preloader.png`): teks kecil "A24 Projecting ◌" di atas tengah, "A24 Films" di kiri tengah, **angka tahun yang menghitung naik** (2012 → sekarang) di kanan tengah, logo besar serif di bawah.

### Index (`05_index_dropdown.png`)
- Panel **putih** persegi (±340px) turun dari nav, latar halaman jadi **abu-abu redup**.
- Label "Index" berubah jadi **jumlah item "12 ^"**.
- Daftar judul sans kecil. Item aktif **diblok hitam (inverse)** dengan tahun di kanan. Item bawah memudar. Ada scrollbar hitam tipis di kanan.

### Transisi klik CD (`06_…`, `07_…`)
1. Nav menghilang, CD lain **mengecil dan menjauh**, coretan lingkaran memudar.
2. Muncul label "A24 Developing ◌" di atas.
3. Halaman detail muncul: **garis-garis horizontal ditarik dari kiri** dengan panjang berbeda, teks muncul per baris, tombol muncul dari garis tebalnya.

### Halaman Detail (`08_…` s/d `12_…`)
1. **Hero** (off-white): judul **UPPERCASE serif ±80px di tengah**, garis penuh, lalu kredit **satu paragraf rata tengah** (label kecil + nama: DIRECTED BY …, WRITTEN BY …, STARRING …). Di bawahnya **4 baris metadata penuh lebar** (YEAR, GENRE, LANGUAGES, RUNTIME), label kiri dan nilai kanan, dipisah garis 1px. Ruang kosong besar, lalu tombol **WATCH ONLINE** (serif uppercase ±40px diapit **garis tebal ±4px** atas-bawah). Tanda **"+"** kecil di tepi kiri & kanan layar.
2. **Reveal gambar**: di bawah hero, still film muncul dengan **tepi organik seperti robekan/cairan** yang naik (`09_detail_reveal_edge.png`).
3. **Section kutipan trailer** (`10_…`): foto full-bleed, **garis putih tipis penuh lebar** berjarak sama seperti kertas bergaris. Kutipan dialog dipecah per kata/frasa dan **diletakkan zig-zag** di atas garis yang berbeda (contoh: "I" kanan, "LIKE" kiri, "IT IN" kanan, "HERE" tengah-kiri). Serif putih tipis ±64px. Tombol **WATCH TRAILER** di tengah dengan garis atas-bawah.
4. **Sinopsis** (`11_…`): latar **abu batu `#D6D3D1`**. Paragraf sinopsis sans ±24px di kiri atas (±5 kolom). **Logotype judul film** (versi logo poster) kecil di kiri bawah, lalu garis penuh.
5. **Up Next** (`12_…`): latar abu batu, garis horizontal penuh berjarak sama. Judul film berikutnya dipecah zig-zag ("MARTY" kiri, "SUPREME" kanan). **CD film berikutnya muncul dari bawah layar** dan berputar. Kredit kecil "AN EXPERIMENT BY RAVI KLAASSENS" + ikon di kanan bawah.
6. Di halaman detail, nav hanya berisi logo · Films · Television (tanpa Index). Warna nav menyesuaikan latar (putih di atas foto).

### Lightbox Trailer (`13_…`, `14_…`)
- Panel **hitam** muncul **menyisakan bingkai tipis** dari foto di belakang, lalu mengembang memenuhi layar.
- Kiri atas: kredit kecil (DIRECTED BY … WRITTEN BY … STARRING …). Kanan atas: **CLOSE**.
- Video 16:9 di tengah dengan tombol pause bulat transparan.
- Bawah: **PAUSE** · timecode `00:01 / 02:17` · garis timeline tipis panjang · **SOUND** · **MAXIMIZE**. Semua label serif uppercase kecil, tanpa ikon.

### Television (`15_television.png`)
- Layout identik dengan Home, hanya datanya serial TV dan "Television" yang aktif. → Untuk Sekar Agny dipakai sebagai **"Collabs"**.

---

## 2. Pemetaan Konten Film → Lagu

| Referensi | Sekar Agny |
|---|---|
| Logo A24 | Wordmark/monogram **SEKAR AGNY** / **SA** |
| Films / Television / Index | **Songs** / **Collabs** / **Index** |
| CD bergambar poster film | **CD bergambar cover single**, kredit melingkar di tepi |
| DIRECTED BY / YEAR / STARRING | **WRITTEN BY / YEAR / FEATURING** (atau PRODUCED BY) |
| Review media + bintang | Kutipan media/pendengar + bintang |
| GENRE / LANGUAGES / RUNTIME | GENRE / LANGUAGE / **DURATION** |
| WATCH ONLINE | **LISTEN NOW** (Spotify/Apple Music/YouTube Music) |
| Kutipan dialog trailer | **Potongan lirik** dipecah zig-zag |
| WATCH TRAILER | **WATCH MUSIC VIDEO** |
| Sinopsis + logotype film | **Cerita di balik lagu** + logotype judul lagu |
| Preloader "Projecting" + hitung tahun | "Tuning ◌" + hitung tahun dari debut → sekarang |
| "Developing ◌" | "Pressing ◌" (seperti mencetak CD) |
| "An experiment by Ravi Klaassens" | Kredit desainer/label |

---

## 3. Design System

### Warna
| Token | Hex | Fungsi |
|---|---|---|
| `paper` | `#F2F2F2` | Latar utama off-white + grain |
| `stone` | `#D6D3D1` | Latar section sinopsis & Up Next |
| `ink` | `#000000` | Teks, garis, blok aktif |
| `muted` | `#8A8A8A` | Nav tidak aktif, item memudar |
| `night` | `#000000` | Lightbox |
| `accent` | `#891A20` | Marun (aksen sangat jarang: seleksi teks/hover) |

### Tipografi (pengganti Google Fonts)
| Peran | Font asli | Pengganti | Penggunaan |
|---|---|---|---|
| Display | PP Eiko | **Instrument Serif** (alt: Bodoni Moda) | Judul, kutipan, tombol. Selalu UPPERCASE, letter-spacing −4%, line-height 1 |
| Body | PP Neue Montreal | **Inter Tight** Medium | Nav, nilai kredit, sinopsis, daftar Index. Letter-spacing −2.5% |
| Label | PP Museum | **Cormorant SC** / Instrument Serif UPPERCASE | Label super kecil (9–10px), letter-spacing +20% |

### Aturan layout
- Padding halaman sangat tipis (±6px desktop). Garis divider menyentuh hampir ujung layar.
- Tanpa card, tanpa bayangan, tanpa radius, tanpa gradient UI.
- Garis: 1px untuk divider, **4px** untuk tombol.
- Banyak ruang kosong; komposisi seperti katalog museum/poster.

---

## 4. PROMPT 1 — Home (upload: `02_home.png`, `03_home_active_scribble.png`)

```text
Design the home screen of a personal website for "Sekar Agny", an Indonesian singer. Desktop 1440x900, one single full-viewport screen with no scrolling content. Recreate the layout and mood of the attached reference images exactly, replacing films with songs.

STYLE: off-white paper background #F2F2F2 with subtle film-grain noise. Black #000 text and 1px black lines. No cards, no shadows, no rounded corners, no UI gradients. Display font: "Instrument Serif", always UPPERCASE, tight letter-spacing. Body font: "Inter Tight" medium. Tiny labels: small-caps serif, 9px, wide letter-spacing.

NAVIGATION: plain text with no background, centered at the very top: a small serif wordmark "SA", then "Songs" (black, with a tiny black dot under it to mark it active), "Collabs" (grey), and "Index" with a small chevron. 14px.

TOP-LEFT INFO PANEL (about 300px wide, touching the top-left corner with 6px padding): the song title "SWAY" in uppercase serif 32px. Below, three rows each separated by a 1px black line; tiny label on the left, value right-aligned in sans 14px:
- WRITTEN BY — COLORCODE
- YEAR — 2026
- FEATURING — Sekar Agny
(values may wrap to multiple right-aligned lines)

CENTER: a 3D gallery of compact discs (CDs, not vinyl). Each CD has the single's cover artwork printed edge-to-edge on its surface, a transparent center hole with a clear plastic ring, a thin glossy silver rim, and tiny credits printed in a circle near the edge. The CDs are arranged on a diagonal line rising from bottom-left to top-right, all tilted in 3D perspective: the active CD is large in the exact center, the next CD is cropped at the top-right corner, the previous CD is cropped at the bottom-left. Draw a loose hand-drawn black marker scribble circling around the active CD, like it was circled with a pen.

BOTTOM CENTER: two press quotes side by side, centered text. Each: a row of small black stars, a tiny uppercase publication name, and an uppercase serif quote of 24px inside curly quotes, e.g. “A BITTERSWEET POP-PUNK ACHE” and “HONEST, HAUNTING, UNFORGETTABLE”.

Feeling: quiet, luxurious, editorial, like a record-label art catalogue.
```

---

## 5. PROMPT 2 — Index Dropdown (upload: `05_index_dropdown.png`)

```text
Same home screen and style. Show the "Index" menu open. The whole page behind is dimmed with a flat grey overlay. A plain white rectangular panel (about 340px wide, no rounded corners, no shadow) drops down from the top center, containing the nav row at its top; the "Index" label is replaced by the song count "8" with a small up-chevron. Below is a vertical list of song titles in Inter Tight 14px, left-aligned: "Sway", "[Song 2]", "[Song 3]", "[Song 4]", "[Song 5]", "[Song 6]", "[Song 7]", "[Song 8]". The active item ("Sway") is a solid black bar with white text and the year "2026" right-aligned inside it. The last visible items fade to grey. On the right edge of the panel, a thin black vertical scrollbar.
```

---

## 6. PROMPT 3 — Song Detail Page (upload: `08_detail_hero.png`, `10_detail_trailer_quote.png`, `11_detail_synopsis.png`, `12_detail_up_next.png`)

```text
Design the song detail page for "SWAY" in the same style (off-white #F2F2F2 with grain, black, Instrument Serif uppercase display, Inter Tight body, tiny small-caps labels, 1px lines, no cards). Long vertical scroll. Navigation at top center is plain text: "SA" · "Songs" · "Collabs" (no Index on this page). Match the attached references closely.

SECTION 1 — HERO (off-white, full viewport)
- Song title "SWAY" uppercase serif 80px, centered, about 150px from the top.
- A full-width 1px line directly under the title.
- Credits as one centered paragraph, max 2 lines: tiny label "WRITTEN BY" + "COLORCODE", "PERFORMED BY" + "COLORCODE", "FEATURING" + "Sekar Agny" (names in sans 14px, separated by commas).
- Four full-width metadata rows separated by 1px lines, tiny label on the far left, value on the far right: YEAR "2026", GENRE "Pop-Punk", LANGUAGE "Indonesian", DURATION "3:42".
- Large empty space. Then one centered text button "LISTEN NOW" in uppercase serif 40px, framed by a thick 4px black bar above and below (no background).
- Small black "+" marks at the far left and far right edges of the screen, at mid-height and near the bottom.
- At the bottom edge, a photo begins to appear with an organic torn / liquid-like irregular top edge.

SECTION 2 — LYRIC QUOTE (full-bleed photo)
- Full-bleed cinematic still from the music video: moody, warm, grainy, a young Indonesian woman singer in soft light.
- Four thin white 1px lines span the full width at equal vertical intervals like ruled paper.
- A lyric split into fragments, each sitting on a different line in a zig-zag composition, white thin uppercase serif 64px: "MASIH" on the right of line 1, "TERBAYANG" on the left of line 2, "WAJAHMU" on the right of line 3 (placeholder lyric).
- A centered text button "WATCH MUSIC VIDEO" in white uppercase serif 32px with thin white bars above and below.

SECTION 3 — STORY (stone grey background #D6D3D1)
- Top-left, about 5 columns wide: the story behind the song in Inter Tight 24px, black: "A song about someone you can't stop missing, long after it's over. Part of COLORCODE's debut album Constant Change."
- Large empty space, then at bottom-left a small bold logotype of the song title "SWAY" (as it appears on the cover art), followed by a full-width 1px black line.

SECTION 4 — UP NEXT (stone grey #D6D3D1, full viewport)
- Four full-width 1px black lines at equal intervals.
- The next song title split across lines in zig-zag: first word on the left-center of line 1, second word on the right-center of line 2, uppercase serif 64px, e.g. "[SONG]" / "[TWO]".
- A large 3D CD of the next song with its cover art, rising from the bottom edge of the screen, only the top half visible, centered.
- Bottom-right corner: tiny small-caps credit "DESIGNED BY [NAME]" with a tiny icon.
```

---

## 7. PROMPT 4 — Music Video Lightbox (upload: `14_lightbox_player.png`)

```text
Design a fullscreen music video player overlay in the same style. Entire screen black #000. The plain-text navigation stays at top center in white. Top-left: credits in two lines, tiny small-caps labels with white sans names: "WRITTEN BY COLORCODE  PERFORMED BY COLORCODE  FEATURING Sekar Agny". Top-right: "CLOSE" in small white uppercase serif. Center: a large 16:9 video frame (about 90% width) showing a still from the music video, with a small round semi-transparent pause button in the middle. Bottom row, white, small uppercase serif: "PAUSE" on the left, timecode "00:01 / 03:42", then a very thin long white timeline line stretching across, then "SOUND" and "MAXIMIZE" on the right. No icons, no backgrounds, cinematic and minimal.
```

---

## 8. PROMPT Opsional

### 8a. Preloader (upload: `01_preloader.png`)
```text
Design the loading screen in the same style: empty off-white grain background. Top center: small serif wordmark "SA" followed by "Tuning" and a tiny spinning circle. Middle-left edge: small text "Sekar Agny Music". Middle-right edge: a year counter "2019" (counting up to the current year). Lower left-of-center: a very large serif wordmark "SEKAR AGNY" about 80px.
```

### 8b. Collabs (upload: `15_television.png`)
```text
Duplicate the home screen exactly, but "Collabs" is the active nav item (with the dot) and "Songs" is grey. The CDs show featured/collaboration songs. Left panel labels: ARTIST "COLORCODE", YEAR "2026", ROLE "Featured Vocalist".
```

### 8c. Mobile
```text
Mobile version (390x844) of the home screen in the same style. Plain-text nav at top center. The song title and the 3 info rows sit below the nav, full width. The CD gallery runs diagonally across the middle with the active CD large and centered and neighbours cropped at the screen edges, with the hand-drawn scribble circle. One press quote centered at the bottom.
```

---

## 9. Prompt Revisi (bila hasil kurang tepat)
- `Remove all cards, panels, shadows and rounded corners. Use only plain text and 1px black lines on the off-white background.`
- `The navigation must be plain text with no background bar or pill.`
- `Move the song info panel to the top-left corner, small and compact, like a museum label.`
- `The discs must be compact discs (CDs) with the cover art printed on them, arranged diagonally from bottom-left to top-right, tilted in 3D, neighbours cropped by the screen edge.`
- `Add a loose hand-drawn black marker scribble circling the center CD.`
- `All headings, quotes and buttons must be UPPERCASE high-contrast serif.`
- `Increase empty space; it should feel like an art catalogue, not a landing page.`

---

## 10. Catatan Animasi untuk Tahap Coding

| Momen | Perilaku (sesuai referensi) |
|---|---|
| Preloader | Label "Tuning ◌" + angka tahun menghitung naik; logo besar; lalu UI muncul |
| Galeri CD | Three.js/WebGL; CD tersusun diagonal; **scroll/swipe** menggeser ke lagu berikutnya; **drag** memutar/membalik CD (sisi bawah hitam) |
| Coretan lingkaran | SVG path digambar ulang (stroke-dashoffset) setiap CD baru aktif |
| Ganti lagu | Teks panel & review keluar/masuk per baris (mask reveal) |
| Index | Panel putih turun, latar meredup, item aktif diblok hitam, klik → galeri meluncur ke lagu itu |
| Klik CD | CD lain mengecil & menjauh → label "Pressing ◌" → halaman detail |
| Hero detail | Garis ditarik dari kiri (panjang berbeda), teks reveal per baris, garis tombol membentang |
| Foto | Muncul dengan **mask tepi organik/cair** yang naik, parallax saat scroll |
| Lirik zig-zag | Tiap fragmen muncul bergantian saat scroll |
| Nav | Warna berubah otomatis (hitam di latar terang, putih di atas foto) |
| Lightbox | Panel hitam mengembang dari bingkai tipis → video YouTube, kontrol teks custom |
| Up Next | CD lagu berikutnya naik dari bawah & berputar; scroll terus → pindah ke lagu berikutnya |
| Grain | Overlay noise beranimasi halus |
| Aksesibilitas | Hormati `prefers-reduced-motion` |

**Stack yang disarankan:** Astro/Vite + Three.js + GSAP (ScrollTrigger, SplitText) + Lenis + Barba.js/View Transitions. Referensi dibuat dengan Astro + Webflow export + Barba.

---

## 11. Konten yang Perlu Disiapkan

Per lagu:
- [ ] Judul, tahun & tanggal rilis
- [ ] Penulis/produser/artis kolaborasi
- [ ] Genre, bahasa, durasi
- [ ] **Artwork cover persegi** (min. 1500×1500px) → dicetak di CD
- [ ] **Logotype judul lagu** (PNG transparan, jika ada)
- [ ] Link Spotify/Apple Music/YouTube Music
- [ ] Link music video + 1 still landscape resolusi tinggi
- [ ] 1 potongan lirik pendek (3–5 kata, untuk zig-zag)
- [ ] 1–2 kalimat cerita di balik lagu
- [ ] 2 kutipan media/pendengar (+ sumber & rating)

Umum:
- [ ] Wordmark/monogram "SEKAR AGNY" / "SA"
- [ ] Tahun debut (untuk penghitung tahun di preloader)
- [ ] Kontak booking & link media sosial

> [!IMPORTANT]
> Data "Sway" (COLORCODE ft. Sekar Agny, album *Constant Change*, 2026) hanya contoh dari pencarian web. Kutipan media di prompt adalah **karangan placeholder**. Ganti dengan data dan kutipan asli sebelum website dipublikasikan.
