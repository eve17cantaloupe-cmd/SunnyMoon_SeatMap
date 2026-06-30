# JuniorMark SunnyMoon Concert — Seat Map

A live, shared seat-registration map for the concert (Aug 7/8/9, Bitec Live).
Anyone with the link can click a section, enter a username, and add an emoji
or photo — it appears pinned on that section for everyone, in real time
(refreshes every 5 seconds).

## What's inside

- **Next.js** app (App Router)
- **Vercel KV** (Redis) for shared, persistent storage — so everyone who
  opens the link sees the same data
- `app/page.js` — the whole UI (seat map, registration modal, list view, admin panel)
- `lib/sections.js` — the clickable zone coordinates over the seat map image,
  plus the emoji set and show dates
- `public/seatmap.jpg` — your uploaded seat map
- `app/api/register/route.js` — register / fetch entries
- `app/api/admin/route.js` — password-protected delete

## 1. Push this to GitHub

1. Go to [github.com/new](https://github.com/new), create a new repository
   (e.g. `seatmap-app`), keep it empty (no README/license).
2. On your computer, in this project folder, run:
   ```
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/seatmap-app.git
   git push -u origin main
   ```
   (No terminal experience? You can also drag-and-drop every file/folder from
   this project into GitHub's "Add file → Upload files" page in your browser.)

## 2. Import into Vercel

1. Go to [vercel.com/new](https://vercel.com/new) and import the GitHub repo
   you just created. Vercel auto-detects Next.js — just click **Deploy**.
2. The first deploy will likely succeed, but registrations won't save yet
   because the database isn't connected. That's step 3.

## 3. Add a database (Upstash Redis, via Vercel Marketplace)

Vercel's old built-in "KV" product is deprecated, so this app uses
[Upstash Redis](https://vercel.com/marketplace/upstash) instead — same idea,
free tier, a few clicks to set up.

1. In your Vercel project dashboard, go to the **Storage** tab.
2. Click **Create Database**, choose **Upstash → Redis** (or search
   "Redis" in the marketplace), pick the free tier, and create it.
3. Click **Connect Project** and select this project — Vercel automatically
   adds `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` as
   environment variables for you (the app's code already expects these
   exact names via `Redis.fromEnv()`).
4. Go to **Settings → Environment Variables** and add one more:
   - `ADMIN_PASSWORD` = a password of your choice (used to remove entries
     from the Admin panel in the app).
5. Go to **Deployments**, click the latest deployment's **⋯ menu → Redeploy**
   so the new environment variables take effect.

You'll now have a live link like `https://seatmap-app-yourname.vercel.app`
that you can share — everyone who opens it sees the same live seat map.

## 4. Fine-tuning the clickable zones (optional)

The clickable boxes over each section (A1, B2, etc.) are defined in
`lib/sections.js` as percentages of the image's width/height. They're a
close estimate based on your seat map, but if any box feels slightly
off when you click around, just nudge the `top` / `left` / `width` / `height`
numbers for that section and push the change — Vercel redeploys
automatically on every GitHub push.

## 5. Local testing (optional)

If you want to preview changes on your own computer before pushing:
```
npm install
npm run dev
```
Note: without Upstash Redis env vars set locally, registrations won't
persist — that part only works once deployed (or by running
`vercel env pull` to fetch your Vercel env vars to `.env.local`, then
`npm run dev` again).

## Notes

- Photos are resized to small thumbnails (80×80) in the visitor's browser
  before being saved, so the database stays lightweight.
- Each show date (Aug 7 / 8 / 9) has its own separate set of registrations.
- The Admin panel (bottom-right gear icon) lets you remove incorrect or
  spam entries using the `ADMIN_PASSWORD` you set.
