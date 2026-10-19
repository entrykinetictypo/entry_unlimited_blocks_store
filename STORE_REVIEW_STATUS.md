# Chrome Web Store submission check (2026-10-19)

This repository is the separate Chrome Web Store edition of **콘솔을 편하게**. The original extension repository is not modified by this checklist.

## Verified in the repository
- Manifest V3; extension name `콘솔을 편하게`; version `1.14.6`.
- Root files: `manifest.json`, `content.js`, `patch.js`, `popup.html`, `popup.js`, `README.md`.
- Icons: `icon16.png`, `icon32.png`, `icon48.png`, `icon128.png`.
- Both `unofficial/runtime.js` and `unofficial/public-runtime.js`.
- All 18 unofficial block JS files listed by `popup.js`.
- No Uncharted references in checked `manifest.json`, `content.js`, `popup.html`, `popup.js`, or unofficial runtime JS.

## Must still be checked before submission
- Install as an unpacked extension in `chrome://extensions` and perform end-to-end functional tests in Entry.
- Assess each unofficial block for CSP compatibility, execution of remotely retrieved JavaScript, and permissions used.
- Confirm licenses and authorship/distribution rights of included third-party blocks.
- Provide truthful descriptions, screenshots, privacy disclosures, and permissions justifications on the Chrome Web Store listing.
- Chrome Web Store review approval is **not guaranteed** by the above file checks.

Do not change the original repository to address store-specific review requirements.
