<div align="center">
  <img src="./public/poster.jpg" alt="Xstream Banner" width="100%" />

  <br />
  <br />

  <h1>🎬 Xstream</h1>

  <b>A Premium, Privacy-First Cinematic Streaming Experience</b>

  <br />
  <br />

  [![React](https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
  [![Vite](https://img.shields.io/badge/Vite-6.0-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)](https://vitejs.dev/)
  [![PWA](https://img.shields.io/badge/PWA_Ready-5B9BD5?style=for-the-badge&logo=pwa&logoColor=white)](https://web.dev/progressive-web-apps/)
  [![Framer Motion](https://img.shields.io/badge/Framer_Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white)](https://www.framer.com/motion/)
  [![No Backend Required](https://img.shields.io/badge/No_Backend-32CD32?style=for-the-badge&logo=serverless&logoColor=white)]()
  [![Live Demo](https://img.shields.io/badge/Live_Demo-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://x-stream-tau.vercel.app/)

  <br />

  [About](#-about-xstream) • [Features](#-features) • [Tech Stack](#-tech-stack) • [Installation](#️-installation--setup) • [Contributing](#-contributing)

</div>

---

## 📖 About Xstream

**Xstream** is a meticulously crafted streaming platform designed to deliver a premium, cinematic user experience — with a unique focus on **privacy**. There are no accounts, no sign-ups, and no backend databases. Everything is stored locally in your browser using cookies and localStorage, gated behind a clear consent prompt on first visit.

Engineered with React 19, Vite, and Framer Motion, it features fluid animations, dynamic color theming, a responsive dark cinematic aesthetic, and robust media playback with 30+ streaming servers.

---

## 🚀 Features

### 🎨 Modern & Premium UI/UX
* **Cinematic Dark Theme:** Deep-black aesthetic with ambient radial gradients, glassmorphism elements, and a Bebas Neue display font.
* **Dynamic Color Extraction:** Hero section adapts its color palette dynamically based on the featured movie poster.
* **Accent Color Theming:** Choose from preset accent colors via the Settings modal — the entire UI updates instantly, including CSS variable-driven glow effects.
* **Fully Responsive:** Pixel-perfect design optimized for mobile, tablets, and desktops with a dedicated mobile bottom navigation.

### ⚡ Fluid Animations & Interactions
* **Framer Motion Powered:** Smooth page transitions, scroll-reveal animations, spring-physics hover effects, and animated hero content.
* **Hover Trailer Previews:** Movie cards reveal YouTube trailers on hover with a smooth scale-up transition.
* **Lazy Loading:** Blur-up lazy loading on all movie card images for lightning-fast perceived performance.
* **Smart Search:** Instant results with debounced queries, infinite scroll pagination, and media type filters. Press `/` to focus search from anywhere.

### 🔒 Privacy-First Personalization
* **Cookie Consent Gate:** A full-screen consent modal appears on first visit. Users must accept or decline before browsing.
* **No Accounts Required:** Everything runs locally — watch history, watchlist, likes, ratings, and view counts are stored in your browser only.
* **Cross-Tab Sync:** Custom events + native `storage` API keep data synchronized across browser tabs in real-time.
* **Complete Data Control:** Clear all personal data instantly from Settings or Profile. Declining cookies blocks all storage.

### 📺 Rich Content Browsing
* **Continue Watching:** Resume where you left off with progress bars on movie cards — powered by Peachify progress events.
* **Most Viewed on Xstream:** The most-watched title on your browser gets an animated flame badge with shine-sweep effect.
* **My List & Liked Tabs:** Add movies to your watchlist or like them — all reflected on the Home page and Profile.
* **5-Star Ratings:** Rate any movie and see your rating on the Details page.
* **Genre Filtering:** Browse Movies, Series, and Anime by genre with pill-based filters.
* **Actor & Studio Pages:** Click any cast member to see their biography and filmography. Explore production companies.
* **Top 10 Numbered Rows:** Giant transparent numbers for trending content, just like major streaming platforms.
* **Color-Coded Ratings:** Green (8+), yellow (6+), red (below 6).

### 🎬 Advanced Media Playback
* **30+ Streaming Servers:** Multiple redundant sources (VidLink, VidSrc, SuperEmbed, Peachify) with live health checking.
* **Next Episode Button:** Overlaid in the player for TV shows — press `N` or click to advance.
* **Keyboard Shortcuts:** `F` for fullscreen, `S` to switch servers, `N` for next episode.

### 📱 Progressive Web App
* **Installable:** Add Xstream to your home screen for an app-like experience.
* **Offline Caching:** Service worker caches TMDB images and static assets for instant repeat visits.

---

## 💻 Tech Stack

| Category | Technology | Description |
| :--- | :--- | :--- |
| **Frontend Framework** | React 19, Vite 6 | Latest React with ultra-fast build tooling. |
| **Animations** | Framer Motion | Spring physics, page transitions, scroll-reveal. |
| **Styling** | Vanilla CSS | Custom CSS with variables, glassmorphism, clamp(). |
| **Dynamic Colors** | Fast Average Color | Extracts dominant colors from movie posters for hero theming. |
| **Routing** | React Router DOM | Client-side routing with AnimatePresence transitions. |
| **API** | TMDB via Axios | All movie/TV metadata from The Movie Database. |
| **Streaming** | Iframe Embeds | 30+ servers — fully client-side, no backend needed. |
| **PWA** | vite-plugin-pwa | Service worker, manifest, workbox image caching. |
| **Deployment** | Vercel | Edge-optimized global static hosting. |

---

## 🛠️ Installation & Setup

### Prerequisites

[Node.js](https://nodejs.org/) (v18+) installed on your machine.

### Local Development

1. **Clone the repository:**
   ```bash
   git clone https://github.com/ShadowByte01/x-stream.git
   cd x-stream
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up Environment Variables:**
   Create a `.env.local` file in the root directory:
   ```env
   VITE_TMDB_API_KEY=your_tmdb_api_key_here
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```
   *Opens at `http://localhost:5173`*

5. **Build for production:**
   ```bash
   npm run build
   ```

---

## ⌨️ Keyboard Shortcuts

| Key | Action |
| :---: | :--- |
| `/` | Focus search bar (from any page) |
| `F` | Toggle fullscreen (Watch page) |
| `S` | Switch to next server (Watch page) |
| `N` | Next episode (TV shows only) |

---

## 🔒 Privacy

Xstream is a **fully client-side** application. No user data is ever sent to a server.

* **No accounts or sign-ups** — your browser is your profile.
* **All personalization data** (history, watchlist, likes, ratings, view counts) lives in `localStorage` under the `xs_` namespace.
* **Cookie consent** is required before any data is written. Declining cookies blocks all storage.
* **You can wipe everything** instantly from Settings or Profile.
* **API calls** to TMDB go over HTTPS and contain no personal data.

---

## 🤝 Contributing

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

Distributed under the MIT License. See `LICENSE` for more information.

<br />

<div align="center">
  <b>Made with ❤️ by Abhinit Kumar</b>
</div>
