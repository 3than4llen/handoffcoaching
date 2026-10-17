# Handoff website: put it online with GitHub Pages (free)

This is a plain static site: `index.html`, `styles.css`, `script.js` and an `assets/` folder. There's no build step and nothing to install.

## 1. Turn on the contact form (5 minutes, free)

The form uses **Web3Forms**. It's free for 250 messages a month and needs no server or account password.

1. Go to https://web3forms.com and click **Create your Access Key**.
2. Enter the email address where you want inquiries delivered. They email you an access key, which looks like `a1b2c3d4-...`.
3. Open `index.html` and find this line:
   `<input type="hidden" name="access_key" value="YOUR_ACCESS_KEY_HERE">`
4. Replace `YOUR_ACCESS_KEY_HERE` with your key and save the file.

The key is safe to publish. It only lets people send messages *to* you.
After you upload the site, send yourself a test message. In the Web3Forms dashboard you can also limit the form to your own domain.

## 2. Publish on GitHub Pages

1. Sign in at github.com and click **New repository**.
   - For the address `https://YOURNAME.github.io`, name the repository exactly `YOURNAME.github.io`.
   - Any other name also works. The site will then be at `https://YOURNAME.github.io/REPO-NAME`.
2. Make it **Public**, then click **Create repository**.
3. Click **uploading an existing file**. Drag in everything inside this `website` folder: `index.html`, `styles.css`, `script.js`, `README.md` and the whole `assets` folder. Then click **Commit changes**.
4. Go to **Settings → Pages**. Under *Build and deployment*, set Source to **Deploy from a branch**, Branch to **main**, and folder to **/(root)**. Click **Save**.
5. Wait a minute or two, then refresh. The page shows your live URL.

## 3. Optional: use your own domain (e.g. handoffai.com)

1. Buy the domain from any registrar, such as Cloudflare, Porkbun or Namecheap. Expect about $10–15 a year.
2. In GitHub, go to **Settings → Pages → Custom domain**, enter the domain and save. Then tick **Enforce HTTPS**.
3. At your registrar, follow GitHub's DNS instructions. Point the domain to GitHub with four `A` records, and add a `CNAME` record for `www` → `YOURNAME.github.io`.

## Editing the site

- **Colors and fonts:** change the variables at the top of `styles.css`.
- **Prices and wording:** edit them directly in `index.html`. Each section is labeled with a comment.
- **Your photo:** in the About section, replace `assets/handoff-mark.svg` with a headshot, e.g. `assets/ethan.jpg`. A real face builds trust for a local service.
- **Service area:** search `index.html` for "Bay Area" to adjust it.
