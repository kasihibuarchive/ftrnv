# FTRN #5 Website Worklog

---
Task ID: 1-7
Agent: Main Agent
Task: Redesign FTRN #5 to Japanese minimalist zen + liquid glass + nature background

Work Log:
- Redesigned globals.css with Japanese nature palette (matcha, kinari, sumi, sakura, moss, kusa)
- Created zen liquid glass classes (glass-zen, glass-zen-strong, glass-zen-nav, etc.) with blur(40-50px) saturate(120-150%)
- Nature background with soft green gradients and floating blobs
- Rebuilt page.tsx with zen layout, kanji logo (葉), max-w-2xl centered, bottom nav with labels
- Rebuilt BerandaPage with zen spacing, Japanese section labels (おしらせ, あたらしい), zen-divider
- Rebuilt BlogPage with zen search, category pills, clean card list
- Rebuilt KontakPage with zen profile, Japanese quote, clean contact rows
- Rebuilt BlogDetail with zen article view, zen-divider
- Rebuilt AdminPage with kanji styling (管理パネル), zen login gate, clean blog list
- Rebuilt BlogEditor with Japanese labels, zen glass inputs, matcha accent buttons
- Updated layout.tsx with zen toast styling
- All lint checks pass, server running, 3 blogs intact
- Admin access: tap logo 5x (葉 icon)

Stage Summary:
- Complete redesign to Japanese minimalist zen aesthetic
- Nature green palette (#7C9A72 matcha, #A8C5A0 matcha-light, #F5F0E8 kinari)
- Liquid glass with blur(40-50px) over nature gradient background
- Japanese typography: tracking-wide, font-light, 10px uppercase labels
- Zen elements: 間 (breathing space), zen-divider, kanji accents
- Subtle floating nature blobs with gentle animations

---
Task ID: 1
Agent: Bug Fix Agent
Task: Fix critical bugs in FTRN #5 website

Work Log:
1. **Fixed BlogEditor stale state closure bug** (src/components/BlogEditor.tsx)
   - Changed `insertAtCursor` to use functional state update `setContent(prev => ...)` instead of `setContent(content.substring(...))` to avoid stale closure over `content` state
   - Removed `content` from `useCallback` dependency array since functional update pattern doesn't need it
   - Fixed `handleToolbarAction` to read selected text from `ta.value.substring(s, e)` (DOM) instead of stale `content.substring(s, e)` state
   - Added comments explaining the fixes

2. **Fixed unpublished blog leak** (src/app/api/blogs/[id]/route.ts)
   - GET endpoint now checks if blog is published
   - If unpublished, requires valid admin auth token via Authorization header
   - Returns 404 (not 401/403) for unauthorized access to unpublished blogs to avoid leaking existence
   - Uses same AdminSession validation pattern as PUT/DELETE endpoints

3. **Added SSRF protection** (src/app/api/proxy-image/route.ts)
   - DNS resolution check: resolves hostname and blocks private/internal IPs
   - Blocks: 127.0.0.0/8, 10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16 (private ranges)
   - Blocks: 169.254.0.0/16 (link-local / cloud metadata)
   - Blocks: 0.0.0.0/8, localhost, ::1, .internal, .local domains
   - Blocks: 100.64.0.0/10 (CGNAT), 198.18.0.0/15 (benchmark), multicast, reserved ranges
   - Blocks non-standard ports (only 80/443 allowed)
   - Blocks URLs with userinfo (credentials in URL)
   - If DNS resolution fails, blocks the request by default (safe default)

4. **Created shared utility** (src/lib/utils-shared.ts)
   - Extracted `timeAgo()` function (was duplicated in BerandaPage and BlogPage)
   - Added `readingTime()` function that estimates reading time at 200 words/min (Indonesian)
   - Returns formatted string like "3 menit baca"

5. **Refactored BerandaPage and BlogPage** to use shared utils
   - Removed inline `timeAgo` and `readingTime` functions
   - Imported from @/lib/utils-shared
   - Updated template usage to match new `readingTime` return format (string instead of number)

Lint: 0 errors, 2 warnings (pre-existing unused eslint-disable directives)
Dev server: running, pre-existing Turso env var errors unrelated to changes

---
Task ID: 4, 5, 6
Agent: Sub Agent
Task: Add share button, reading time, and improve mobile performance

Work Log:
- BlogDetail.tsx: Added Share2 + Clock icon imports, readingTime helper (~200 words/min), handleShare function (Web Share API → clipboard fallback with toast "Link disalin!"), share row below title with "Bagikan" button and "~X menit baca"
- globals.css: Reduced blur/saturate for all glass classes (glass-zen: 60→30px, glass-zen-strong: 80→40px, glass-zen-card: 50→25px, glass-zen-nav: 60→30px, glass-zen-header: 60→30px, glass-zen-input: 40→20px, headline-card: 50→25px); added @media (prefers-reduced-motion: reduce) block disabling animations and transitions; added safe-area-inset-bottom padding to body
- page.tsx: Reduced blob sizes (600→400px, 500→350px, 400→300px) and blur (80→40px, 90→50px, 70→35px)
- BerandaPage.tsx: Added Clock import, readingTime helper, "~X menit baca" next to timeAgo on headline card and featured cards
- BlogPage.tsx: Added Clock import, readingTime helper, "~X menit baca" next to timeAgo on blog cards
- Lint: 0 errors, 2 pre-existing warnings (unused eslint-disable directives)

Stage Summary:
- Share functionality with Web Share API / clipboard fallback
- Reading time estimates on all blog cards and detail view
- Mobile GPU performance improved via reduced blur/saturate values
- Accessibility: prefers-reduced-motion support
- Safe-area padding for notched devices

---
Task ID: 2 & 3
Agent: Main Agent
Task: Add Pendaftaran (Registration) and Jadwal (Schedule) tabs to FTRN #5

Work Log:
1. **Created PendaftaranPage component** (`src/components/PendaftaranPage.tsx`)
   - Full registration form with 8 fields: Nama Lengkap, Nama Grup/Institusi, Email, No. WhatsApp, Kategori Pertunjukan, Judul Pertunjukan, Durasi Pertunjukan, Nomor Surat (optional)
   - Kategori uses badge-matcha pill selection (Teater Tradisional Murni / Teater Kreasi Baru)
   - Durasi uses styled select dropdown (5-15 menit options)
   - Uses glass-zen-strong for form container, glass-zen-input for inputs, badge-matcha for category pills, cta-button for submit
   - Client-side validation for required fields
   - Success state with CheckCircle icon and "Daftar Lagi" button
   - Loading state with spinner during submission
   - Error display with badge-urgent styling
   - POSTs to /api/pendaftaran endpoint

2. **Created /api/pendaftaran route** (`src/app/api/pendaftaran/route.ts`)
   - POST: validates required fields, kategori, and durasi values; creates Pendaftaran table if not exists; inserts registration data; returns success message
   - GET: returns all registrations ordered by createdAt DESC (for admin use)
   - Uses getTurso() from @/lib/turso

3. **Updated /api/setup route** (`src/app/api/setup/route.ts`)
   - Added CREATE_PENDAFTARAN_TABLE SQL definition with fields: id, namaLengkap, namaGrup, email, whatsapp, kategori, judulPertunjukan, durasi, nomorSurat, createdAt
   - Added `await libsql.execute(CREATE_PENDAFTARAN_TABLE)` in runSetup function

4. **Created JadwalPage component** (`src/components/JadwalPage.tsx`)
   - Vertical timeline with 7 events: Pendaftaran Dibuka (1 Mei), Batas Pendaftaran (15 Juni), Technical Meeting (20 Juni), Gladi Bersih (25 Juni), Hari 1 Pentas Teater Tradisional (28 Juni), Hari 2 Pentas Teater Kreasi Baru (29 Juni), Penghargaan & Penutupan (30 Juni)
   - Matcha-colored vertical line connecting timeline dots
   - Each event as glass-zen-card with date, title, description
   - "Segera!" badge with badge-urgent + animate-pulse-soft on Pendaftaran Dibuka
   - Highlight events (pentas & penutupan) with green-glow-soft and matcha border
   - Footer note about schedule changes

5. **Updated page.tsx** (`src/app/page.tsx`)
   - Added imports: ClipboardList, CalendarDays from lucide-react; PendaftaranPage, JadwalPage components
   - Updated Tab type to 'beranda' | 'jadwal' | 'pendaftaran' | 'blog' | 'kontak'
   - Tab order: Beranda, Jadwal, Daftar, Blog, Kontak
   - Rendered JadwalPage and PendaftaranPage in tab content area
   - Adjusted bottom nav for 5 tabs: icon size w-[18px] h-[18px], label text-[9px], padding p-1 rounded-lg

Lint: 0 errors, 2 pre-existing warnings (unused eslint-disable directives)
Dev server: running
