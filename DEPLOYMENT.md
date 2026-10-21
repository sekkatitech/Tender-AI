# TenderPilot AI deployment guide

## 1) Push the project to GitHub

From the project root:

```bash
git add .
git commit -m "Initial project setup"
git branch -M main
git remote add origin <your-github-repo-url>
git push -u origin main
```

If GitHub is already connected, use:

```bash
git remote set-url origin <your-github-repo-url>
git push -u origin main
```

## 2) Deploy to Netlify

1. Log in to Netlify.
2. Click Add new site > Import an existing project.
3. Connect the GitHub repository.
4. Set the build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
5. Add environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_PUBLISHABLE_KEY`
6. Deploy the site.

## 3) Connect a custom domain

In Netlify:

1. Open the site.
2. Go to Domain settings.
3. Add your custom domain, for example `app.yourdomain.com`.
4. Copy the DNS values Netlify shows.
5. Add those records in your domain registrar or DNS provider.

Typical DNS setup:

- A record or CNAME pointing to Netlify's hostname
- `www` CNAME if you want a branded subdomain

Netlify will issue SSL automatically once DNS propagates.

## 4) Important runtime notes

- The app relies on Supabase credentials from environment variables.
- The `public/_redirects` file ensures client-side routes work correctly for React Router on Netlify.
- If your production environment needs additional env vars later, add them in Netlify site settings.
