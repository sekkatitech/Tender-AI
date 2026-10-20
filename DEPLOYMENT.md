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

## 2) Deploy to Vercel

1. Log in to Vercel.
2. Click New Project.
3. Import the GitHub repository.
4. Set the framework to Vite.
5. Keep the default build settings:
   - Build command: `npm run build`
   - Output directory: `dist`
6. Add environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_PUBLISHABLE_KEY`
7. Deploy.

## 3) Connect a custom domain

In Vercel:

1. Open the project.
2. Go to Settings > Domains.
3. Add your custom domain, for example `app.yourdomain.com`.
4. Copy the DNS values Vercel shows.
5. Add those records in your domain registrar or DNS provider.

Typical DNS setup:

- A record or ALIAS pointing to Vercel's IPs
- CNAME record for `www` to the Vercel domain

Once DNS propagates, Vercel will issue a valid SSL certificate automatically.

## 4) Important runtime notes

- The app relies on Supabase credentials from environment variables.
- The `vercel.json` file ensures client-side routes work correctly for React Router.
- If your production environment needs additional env vars later, add them in Vercel project settings.
