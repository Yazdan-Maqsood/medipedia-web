Medipedia — Project Documentation

1) Project Overview
- Frontend: Next.js (app router) + React
- Public assets: static CSS/JS/images under `public/assets`
- Backend: external PHP API. Base URL is defined in `src/app/config/constant.jsx` as `apiUrl`.

2) Base API URL
- Location: `src/app/config/constant.jsx`
- Value: `https://medipedia-web-api.desired-techs.com` (used as `apiUrl`)

3) Discovered API endpoints (called by frontend)
Note: endpoints are appended to the base `apiUrl` as `${apiUrl}/<endpoint>` unless a full URL is used in code.

- `profile-data.php` — POST (FormData: `user_id`) — returns profile JSON. (Used in `src/app/config/constant.jsx`)
- `profile-update.php` — POST (FormData: profile fields) — used by change-profile forms.
- `login.php` — POST (FormData: `user_email`, `user_pass`) — authentication (used by NextAuth route).
- `register.php` — POST (FormData: `user_name`, `user_email`, `user_pass`, `user_no`).
- `verify.php` — GET with `?code=` — account verification (used in `src/app/verify/[code]/page.jsx`).
- `recoverpasswordverify.php` / `recoverpassword.php` — password recovery (some calls use a full absolute URL `https://desired-techs.com/docapp/...`).
- `books.php` — GET (list books) — used by guide/book pages.
- `book-code.php` — GET/POST (used in `book-code` pages to fetch book code data).
- `book-prices.php` — GET (book pricing listings).
- `apply-for-code.php` — POST (apply for codes/forms).
- `code-verify.php` — POST (verify provided codes for books/bundles).
- `save-quiz.php` — POST (save quiz results).
- `saved-quiz.php` — GET/POST (fetch saved quizzes) — used in saved-quiz pages.
- `search.php` — GET (search endpoint used by search pages).
- `report.php` — POST/GET (report generation called from components/Reprt.jsx).
- `feedback.php` — POST (feedback form submissions).
- `contact.php` — POST (contact-us form submissions).
- `history.php` — POST/GET (user history retrieval).

4) Where to find more endpoints in the code
- Search for `${apiUrl}/` across the `src/` folder to find all usages and exact request patterns (method, body fields, query params). Example quick grep:

  - Search string: `${apiUrl}/`
  - Files: many places under `src/app/*` (guide, quiz, register, profile, components, etc.)

5) Folder structure (top-level highlights)
- `public/` — static assets (css, js, images, fonts)
- `src/`
  - `app/`
    - `layout.jsx`, `page.jsx`, `sitemap.js`
    - `api/` — Next.js API routes (NextAuth route at `api/auth/[...nextauth]/route.jsx`)
    - pages and folders: `about-us/`, `apply-code/`, `book-code/`, `book-price/`, `change-email/`, `change-password/`, `change-phone-number/`, `change-profile-name/`, `components/`, `config/`, `contact-us/`, `customer-support/`, `dmca-policy/`, `faq/`, `feedback/`, `forgot-password/`, `guide/` (book pages, bundles, mock-bundle), `hints/`, `history/`, `how-to-apply/`, `login/`, `privacy-policy/`, `profile/`, `quiz/`, `recover-password/`, `register/`, `saved-quiz/`, `search/`, `success/`, `verify/`
  - `middleware.js`

(For the full tree, see your workspace file listing — the `src/app/` directory contains many nested route folders.)

6) How to extend/update API base URL
- Edit `src/app/config/constant.jsx` and change `export const apiUrl = "..."`.
- Some legacy calls use absolute URLs (check `recover-password` pages).

7) Recommendations & next steps
- I can generate a more detailed markdown that:
  - lists each frontend file that calls an endpoint and the exact method + params
  - generates a CSV of endpoint, method, file(s), param names
  - or create a dedicated `docs/API.md` with example requests and expected responses.

Tell me which of the next steps you want (detailed per-file endpoint list, CSV, or full API docs).