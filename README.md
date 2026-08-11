# ARISE. — ICC Trading Environment PWA

This repository is a plain static Progressive Web App version of the existing ARISE. single-file application. It has no framework, package manager, build step, backend, environment variables, API keys, or database.

## GitHub Pages deployment

1. Create or open your GitHub repository.
2. Upload **the contents of the generated ZIP**, not the ZIP itself.
3. Make sure `index.html` is in the repository root.
4. Commit the files to the `main` branch.
5. Open **Repository → Settings → Pages**.
6. Set the publishing source to **Deploy from a branch**.
7. Select:

   ```text
   Branch: main
   Folder: / (root)
   ```

8. Save.
9. Wait for GitHub Pages to publish the URL.
10. Open that HTTPS URL on your iPhone.

For a project repository, the URL will normally look like:

```text
https://USERNAME.github.io/REPOSITORY-NAME/
```

All PWA paths in this project are relative so the app can also work at `username.github.io` or on a later custom domain.

## Install on iPhone

```text
Open the published site on iPhone.
Open the browser Share menu.
Choose “Add to Home Screen”.
Confirm ARISE.
Launch ARISE. from the new Home Screen icon.
```

## Updating ARISE. later

1. Replace or update the repository files.
2. Commit the changes to `main`.
3. Let GitHub Pages redeploy.
4. The service worker uses network-first navigation, so the installed app receives a fresh `index.html` whenever the network is available while retaining an offline fallback.
5. If you change the service worker's pre-cached shell behavior or want to force removal of an older ARISE cache immediately, increment `CACHE_NAME` in `service-worker.js` (for example, from `arise-pwa-v1` to `arise-pwa-v2`). Obsolete `arise-pwa-*` caches are deleted during activation.

## Local-first data behavior

ARISE. continues to use the exact LocalStorage key:

```text
arise_trades_v1
```

No database or cloud sync was introduced. Journal/trade data remains stored by the browser/Home Screen installation on that device. GitHub Pages deployment does not back up that local data.

## Project contents

```text
/
├── index.html
├── manifest.webmanifest
├── service-worker.js
├── pwa-register.js
├── .nojekyll
├── README.md
└── icons/
    ├── icon-192.png
    ├── icon-512.png
    ├── icon-maskable-192.png
    ├── icon-maskable-512.png
    ├── apple-touch-icon.png
    └── favicon.png
```
