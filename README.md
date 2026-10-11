# Go Wheels

Go Wheels is a vehicle rental application built with Next.js and MySQL.

## Local development

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy `.env.example` to `.env.local` and set your MySQL connection values. Keep `.env.local` private; it is ignored by Git.

3. Set `AUTH_SECRET` to a long, random value. For example:

   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('base64url'))"
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000).

## Production

Set `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `DB_PORT`, and `AUTH_SECRET` in the deployment environment. Do not use or publish real database credentials in `.env.example`, source files, or GitHub.

## Other commands

```bash
npm run lint
npm run build
```

## SEO configuration

The app generates metadata, `robots.txt`, and a sitemap. Set `NEXT_PUBLIC_SITE_URL` to the canonical site origin, including the scheme (for example, `https://www.example.com`), in the production build environment. The canonical URL, social preview image URLs, and sitemap entries are omitted until this value is configured.
