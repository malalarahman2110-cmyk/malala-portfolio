# Mahmuda Khatun (Malala) — Personal Portfolio Website

A modern, responsive personal portfolio website showcasing the creative works, AI visuals, motion graphics, video commercial productions, playable HTML5 games, and verified academic credentials of **Mahmuda Khatun (Malala)**.

Built using all visual and media assets from your Desktop folders (`malala1` and `malala2`).

---

## 🌟 Key Features

1. **Prominent Hero Logo Presentation**:
   - Displays your authentic personal logo (**Mahmuda Khatun — AI —**) with its royal gold crown, floral wreath, and calligraphy preserved at full fidelity.
   - Smooth loading intro sequence with glowing rings, pulsating halo, and 3D parallax tilt.
2. **Curated Creative Works**:
   - Hand-picked spotlight featuring the best visual art, character animations, games, and brand identities.
3. **Comprehensive Image Gallery (37 Visuals)**:
   - Full categorization: AI Art & Nature, Branding & Product Design, Portraits & Fashion, Architecture & Interiors.
   - Instant live search by keyword, tag, or description.
   - Full-screen Lightbox with zoom, previous/next controls, keyboard navigation (Left/Right/Escape), and direct file downloads.
4. **Video Gallery (17 Motion Productions)**:
   - Custom high-resolution poster thumbnails extracted directly from the video stream using `ffmpeg`.
   - Desktop hover preview: smoothly plays muted video previews on mouse hover.
   - Built-in video player modal with full playback controls, duration badges, and download options.
5. **Playable Games & Interactive Web Apps**:
   - **Bear Chase Run 🐻**: Action-packed HTML5 Canvas arcade runner with procedural graphics and Web Audio API synthesizer sounds. Playable directly in-modal or in a new browser tab.
   - **Precision Glassmorphism Calculator**: Tactile, dark-themed responsive calculator with keyboard support.
6. **Academic & Professional Documents**:
   - **Official Curriculum Vitae (PDF)**: Highlighting Master's and Bachelor's degrees from Government Rajendra College (Faridpur), web design experience, and office application skills.
   - **Technology Knowledge Assessment Report**: Verified Digital Assessment (Score: 60%, ID: `AGY-D0EBY8WY`).
   - **AI-Based Basic Technology Training Module (PDF)**: Syllabus covering ChatGPT, Copilot, DeepSeek, and prompt engineering.
7. **Interactive Mouse Hover & 3D Tilt**:
   - Smooth 3D card tilt that tracks mouse coordinates with realistic depth and specular lighting.
   - Ambient cursor-following electric cyan glow.
   - Touch device optimization for tablets and smartphones.
8. **Contact & Communication**:
   - Direct phone number (`+880 1765 770196`), permanent address (Bhagolpur, Goalundo, Rajbari, Bangladesh), and interactive contact form.

---

## 📁 Project Directory Structure

```text
c:\Users\USER\Desktop\malala-portfolio\
├── index.html                  # Semantic, accessible HTML5 structure
├── style.css                   # Dark cinematic glassmorphism stylesheet
├── script.js                   # Interactive logic, 3D tilt, modals, search
├── portfolio-data.js           # Auto-generated JSON/JS manifest of all assets
├── start-portfolio.bat         # 1-click Windows desktop batch launcher
├── README.md                   # Documentation, setup & hosting guide
├── scripts\
│   └── prepare_portfolio.py    # Automated scanner, deduplicator & thumbnail generator
└── assets\
    ├── logo\
    │   └── mahmuda_khatun_logo.jpg # Original personal logo
    ├── images\                 # 37 deduplicated high-res visual assets
    ├── videos\                 # 17 MP4 video creations
    ├── thumbnails\             # 17 video poster thumbnails generated via ffmpeg
    ├── games\
    │   ├── bear-chase-game.html # Playable HTML5 Canvas arcade runner
    │   └── calculator.html      # Interactive glassmorphism calculator
    └── docs\
        ├── MAHMUDA-Resume.pdf   # Official academic & professional CV
        └── AI-Training-Module.pdf # AI training curriculum
```

---

## 🚀 How to Run on Windows Desktop

### Method 1: One-Click Desktop Launcher (Recommended)
Simply double-click the included file:
```
start-portfolio.bat
```
This automatically starts a local Python web server and opens the portfolio website in your default web browser at `http://localhost:3000`.

### Method 2: PowerShell / Command Prompt
Open PowerShell in the `malala-portfolio` folder and run:
```powershell
cd C:\Users\USER\Desktop\malala-portfolio
python -m http.server 3000
```
Then open your browser and navigate to `http://localhost:3000`.

### Method 3: Direct File Opening
You can double-click `index.html` to open it directly in Google Chrome, Microsoft Edge, or Firefox.

---

## 🔄 Adding New Files from `malala1` or `malala2`

Whenever you add new images, videos, games, or documents to your desktop folders:
1. Put the new files into `malala-1` or `malala-2`.
2. Open PowerShell in `malala-portfolio` and run:
   ```powershell
   python scripts/prepare_portfolio.py
   ```
3. The script will automatically:
   - Detect new files and ignore duplicates (via SHA-256 hashes).
   - Generate custom poster thumbnails for any new videos using `ffmpeg`.
   - Update `portfolio-data.js` with titles, categories, dimensions, and tags.
   - Refresh the website seamlessly!

---

## 🌐 How to Host Your Website Online (Free)

### Option 1: Netlify (Easiest — Drag & Drop)
1. Go to [Netlify Drop](https://app.netlify.com/drop).
2. Sign in with your free account.
3. Drag and drop the entire `malala-portfolio` folder into the upload box.
4. Your website will be live worldwide in seconds with a free `.netlify.app` URL and custom domain support!

### Option 2: GitHub Pages
1. Create a free GitHub repository (e.g. `malala-portfolio`).
2. Push the files from `c:\Users\USER\Desktop\malala-portfolio`:
   ```bash
   git init
   git add .
   git commit -m "Launch Mahmuda Khatun portfolio"
   git branch -M main
   git remote add origin https://github.com/<your-username>/malala-portfolio.git
   git push -u origin main
   ```
3. In repository **Settings** → **Pages**, select branch `main` and root `/`.
4. Your website is live at `https://<your-username>.github.io/malala-portfolio/`.

### Option 3: Vercel
1. Install Vercel CLI: `npm i -g vercel`.
2. Inside `malala-portfolio`, run `vercel`.
3. Follow the 2-step prompt to deploy instantly with edge caching.

---

## 🛡️ Final Quality Check Verification

| Item | Verified Status | Notes |
| :--- | :---: | :--- |
| **Personal Logo** | ✅ Verified | Prominently displayed in hero with halo animation and original colors |
| **Image Gallery** | ✅ Verified | 37 unique images with 3D tilt, search, category filters & Lightbox |
| **Video Gallery** | ✅ Verified | 17 videos with custom ffmpeg poster thumbnails & hover previews |
| **Playable Games** | ✅ Verified | Bear Chase Run 🐻 and Glass Calculator fully playable in modal & tab |
| **Documents** | ✅ Verified | Official CV PDF, Verified Tech Assessment & AI Syllabus downloadable |
| **Deduplication** | ✅ Verified | SHA-256 duplicate elimination across malala1 and malala2 |
| **Responsive Design**| ✅ Verified | Optimized for Desktop, Tablet, and Mobile devices with drawer menu |
| **Local Offline Run**| ✅ Verified | Fully self-contained relative paths, zero broken links |

