# App Bazaar Studio — Admin (`/admin`)

Secure CMS for portfolio projects, media, downloads, categories, and contact inquiries.

## URLs

- Login: `/admin/login.html`
- Dashboard: `/admin/index.html`

## Setup order

1. Create Firebase project **`app-bazaar-studio`** (see `../../firebase/README.md`).
2. Paste Web config into `js/firebase-config.js` and `../data/firebase-public.js`.
3. Create Auth user `asankarobar.officials@gmail.com`.
4. Create Firestore doc `admins/{uid}` for that user.
5. Deploy rules from `../../firebase`.
6. Sign in → Dashboard → **Seed from JSON**.

## Security

- Auth is Firebase Email/Password (not frontend-only checks).
- Writes require `admins/{uid}`.
- Passwords and service-account keys never belong in this folder.
