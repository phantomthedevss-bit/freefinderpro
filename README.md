# ⚡ FreeFinder — Type anything. Get it FREE. Legally.

Search for any object, game, app, book, course, tool or digital thing and FreeFinder hunts the internet for the legit free version + exactly how to pick it up.

## Live Demo
Deploy this folder to Vercel and you get:
- Frontend at `/` — crazy good UI, search, filters, saved items, pickup guide modal
- Backend at `/api/search?q=photoshop&category=all` — aggregates 7+ free sources, no API keys

## Quick Deploy (2 minutes)

1. Push this folder to GitHub (or `vercel` CLI)
2. Go to vercel.com → Add New → Project → Import your repo
3. Framework: **Other** / Root Directory: `.`
4. Click **Deploy** — done. No env vars needed.

Or CLI:
```
npm i -g vercel
vercel
vercel --prod
```

Local dev:
```
vercel dev
# or just open index.html — it falls back to direct public APIs if backend is offline
# then visit http://localhost:3000
```

## How it works

User types `photoshop` → Backend runs in parallel:
- FreeToGame API for games
- Open Library + Gutenberg (Gutendex) for books
- GitHub search for open-source tools
- iTunes Search for free apps
- Curated Free Alternatives map (Photoshop→Photopea/GIMP, Spotify→Spotify Free, Notion→Obsidian, etc)
- Physical Stuff sources: Freecycle, Craigslist Free, Olio, Freegle, Nextdoor with constructed search URLs

Every result is normalized to:
```json
{ "title": "...", "description": "...", "source": "Gutenberg", "url": "...", "image": "...", "category": "books", "platforms": ["Web"], "price": "Free", "license": "Public Domain", "rating": 4.8, "pickupSteps": ["...", "..."], "safety": "Verified Legal", "tags": [] }
```

Pickup steps are generated per source type:
- Games: Claim → Create free account → Add to library → Download launcher → Install
- Books: Open link → Choose EPUB/PDF → Download or read in browser → Send to Kindle
- GitHub: Open repo → Read README → Download Release or Clone → Follow install
- Physical: Message giver → Confirm pickup time → Meet in public → Inspect → Take it

## API

`GET /api/search?q=QUERY&category=all|games|apps|books|courses|media|physical`

Query params:
- `q` — required, e.g. `?q=minecraft`
- `category` — optional filter
- `limit` — optional, default 24

Response: `{ query, category, count, sourcesChecked, results: [...] }`

`GET /api/health` → `{ ok: true }`

## Safety

FreeFinder ONLY links to legal free sources. No piracy, no cracks, no keygens, no shady downloads. If a query looks like it wants pirated content, it returns legal alternatives + a note.

## Customize

- Add alternatives in `api/search.js` → `ALTERNATIVES` map
- Add physical sources in `PHYSICAL_SOURCES`
- Tweak colors in `style.css` → `:root` variables
- Add your own logo / domain in Vercel → Settings → Domains

Built for fun. Go find free stuff.
