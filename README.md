<div align="center">

<img src="./public/poster.jpg" alt="X-Stream Banner" width="100%" />

<br />

# X-Stream

### A Highly Realistic, Premium Cinematic Streaming Platform

<br />

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)](https://vitejs.dev/)
[![Supabase](https://img.shields.io/badge/Supabase-181818?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white)](https://www.framer.com/motion/)
[![Live Demo](https://img.shields.io/badge/Live_Demo-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://x-stream-tau.vercel.app/)

<br />

[![Stars](https://img.shields.io/github/stars/ShadowByte01/x-stream?style=flat-square&color=f43f5e&label=Stars)](https://github.com/ShadowByte01/x-stream/stargazers)
[![Forks](https://img.shields.io/github/forks/ShadowByte01/x-stream?style=flat-square&color=8b5cf6&label=Forks)](https://github.com/ShadowByte01/x-stream/network/members)
[![Issues](https://img.shields.io/github/issues/ShadowByte01/x-stream?style=flat-square&color=22c55e&label=Issues)](https://github.com/ShadowByte01/x-stream/issues)
[![License](https://img.shields.io/github/license/ShadowByte01/x-stream?style=flat-square&color=0ea5e9&label=License)](./LICENSE)
[![Last Commit](https://img.shields.io/github/last-commit/ShadowByte01/x-stream?style=flat-square&color=eab308&label=Last%20Commit)](https://github.com/ShadowByte01/x-stream/commits/main)

<br />

**[Explore the Demo »](https://x-stream-tau.vercel.app/)**

<sub>[About](#about) · [Features](#features) · [Tech Stack](#tech-stack) · [Installation](#installation--setup) · [Shortcuts](#keyboard-shortcuts) · [Contributing](#contributing)</sub>

</div>

<br />

---

<br />

## About

**X-Stream** is a meticulously crafted streaming platform built to deliver a premium, cinematic experience on par with industry-leading video-on-demand services. Engineered with modern web tooling, it pairs fluid motion design with a responsive, dark-mode-first interface and a genuinely robust media playback layer underneath.

Browse movies, dive into TV shows, explore actor filmographies, or queue up trailers — X-Stream brings an immersive, app-like feel straight to the browser, no install required.

<br />

## Features

<table>
<tr>
<td width="50%" valign="top">

### Interface & Design
- **Cinematic dark theme** with subtle glassmorphism throughout
- **Dynamic color extraction** — the hero section adapts its palette to match the featured poster
- **7 accent themes** selectable from the Settings modal
- **Fully responsive** across mobile, tablet, and desktop, with a dedicated mobile bottom nav

### Motion & Interaction
- **Framer Motion** driven page transitions, scroll reveals, and spring-physics hover states
- **Blur-up lazy loading** on every poster and card image
- **Smart search** — debounced queries, infinite scroll, and media-type filters

</td>
<td width="50%" valign="top">

### Playback
- **30+ streaming servers** with live redundancy and health checks
- **Keyboard-first controls** — see [shortcuts](#keyboard-shortcuts) below
- **Interactive hero banner** with auto-play and thumbnail-strip navigation

### Content & Discovery
- **Genre filtering** across Movies, Series, and Anime
- **Actor pages** with full biography and filmography
- **Studio pages** covering production companies and catalogs
- **Top 10 rows** with the oversized transparent numbering seen on major platforms
- **Color-coded ratings** — green (8+), yellow (6+), red (below 6)

</td>
</tr>
</table>

### Authentication & Safety
Authentication runs on **Supabase**, with dedicated user profiles and session handling. **Cloudflare Turnstile** sits in front of sign-up to keep bot traffic out.

<br />

## Tech Stack

<div align="center">

| Layer | Technology | Purpose |
|:--|:--|:--|
| Frontend | React 18, Vite | Fast rendering and instant builds |
| Animation | Framer Motion | Page transitions, scroll reveals, spring physics |
| Styling | Vanilla CSS | Hand-tuned, variable-driven custom styling |
| Color Engine | Fast Average Color | Extracts dominant tones from posters in real time |
| Image Loading | React Lazy Load | Blur-up loading for perceived performance |
| Routing | React Router DOM | Client-side routing with AnimatePresence |
| Backend & Auth | Supabase | Authentication and data persistence |
| Bot Protection | Cloudflare Turnstile | CAPTCHA and abuse prevention |
| Deployment | Vercel | Global edge deployment |

</div>

<br />

## Installation & Setup

### Prerequisites
[Node.js](https://nodejs.org/) installed locally.

### Local Development

**1. Clone the repository**
```bash
git clone https://github.com/ShadowByte01/x-stream.git
```

**2. Move into the project directory**
```bash
cd x-stream
```

**3. Install dependencies**
```bash
npm install
```

**4. Configure environment variables**

Create a `.env.local` file in the project root:
```env
VITE_TMDB_API_KEY=your_tmdb_api_key
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_CAPTCHA_SITE_KEY=your_captcha_key
```

**5. Run the dev server**
```bash
npm run dev
```
> Runs by default at `http://localhost:5173`

**6. Build for production**
```bash
npm run build
```

<br />

## Keyboard Shortcuts

| Key | Action |
|:--:|:--|
| `F` | Toggle fullscreen *(Watch page)* |
| `S` | Switch to next server *(Watch page)* |
| `N` | Next episode *(TV shows only)* |

<br />

## Privacy & Security

X-Stream is a frontend client application — it does not store sensitive payment or personal data on unencrypted external databases outside of explicit backend configuration.

- **Authentication** is fully delegated to Supabase's secure auth service
- **API traffic** is routed exclusively over HTTPS

<br />

## Star History

<div align="center">

[![Star History Chart](https://api.star-history.com/svg?repos=ShadowByte01/x-stream&type=Date)](https://star-history.com/#ShadowByte01/x-stream&Date)

</div>

<br />

## Repo Activity

<div align="center">

<img src="https://github-readme-stats.vercel.app/api/pin/?username=ShadowByte01&repo=x-stream&theme=dark&hide_border=true&bg_color=0d1117&title_color=f43f5e&icon_color=8b5cf6" alt="X-Stream repo card" />

</div>

<br />

## Contributing

Contributions are what make open source genuinely great — they're always welcome here.

1. Fork the project
2. Create your feature branch — `git checkout -b feature/AmazingFeature`
3. Commit your changes — `git commit -m 'Add some AmazingFeature'`
4. Push to the branch — `git push origin feature/AmazingFeature`
5. Open a Pull Request

<br />

## License

Distributed under the MIT License. See [`LICENSE`](./LICENSE) for details.

<br />

---

<div align="center">
<sub>Built by <a href="https://github.com/ShadowByte01">Abhinit Kumar</a></sub>
</div>
