# WatcherML landing page

A polished, responsive static landing page for **WatcherML**. It is designed for GitHub Pages and uses only HTML, CSS, and vanilla JavaScript, with no runtime dependencies or external assets.

## Preview locally

From this directory, run:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

## Deploy to GitHub Pages

1. Create a GitHub repository, for example `watcherml-site`.
2. Upload all files from this folder to the repository root.
3. Commit and push to the `main` branch.
4. Open **Settings → Pages** in the repository.
5. Under **Build and deployment**, choose **Deploy from a branch**.
6. Select `main` and `/ (root)`, then save.
7. GitHub will publish the site at a URL similar to:

   `https://<your-username>.github.io/watcherml-site/`

The site uses relative asset paths, so it works under a GitHub Pages repository subpath without additional configuration.

## Before publishing

Edit `index.html` and replace:

- `https://github.com/Rohan5manza/watcherml` if your repository URL differs.
- Any claims or API snippets that do not yet match the implementation.

The site deliberately labels the product as an **open-source preview** and the API as an **alpha preview**. Keep those labels until the package and autonomous campaign features are usable.

## Files

- `index.html` — page structure and copy
- `styles.css` — complete responsive visual design
- `script.js` — navigation, animated preview, tabs, copy controls, and reveal effects
- `assets/favicon.svg` — favicon
- `.nojekyll` — prevents GitHub Pages from applying Jekyll processing

## Custom domain

After the site is live, add a custom domain through **Settings → Pages → Custom domain**. GitHub can create the necessary `CNAME` file automatically.
