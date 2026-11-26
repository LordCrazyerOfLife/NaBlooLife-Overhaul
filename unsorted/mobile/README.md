# YourLife: APK and IPA

`.github/workflows/mobile-build.yml` builds both on every push to `main` (Actions tab -> the run -> Artifacts).

- **Android:** `YourLife-debug.apk` installs on any phone (allow "unknown sources"). With the keystore secrets set it also makes a signed `YourLife-release.apk`.
- **iOS:** `YourLife-unsigned.ipa` is NOT signed. Install it with Sideloadly, AltStore or TrollStore (they sign it with your Apple ID; free accounts need re-signing every 7 days). A real signed IPA / TestFlight needs a paid Apple Developer account plus a certificate and provisioning profile stored as secrets.

How it works: `prepare-www.mjs` copies the game into `mobile/www` (skipping `packs/`, `sw.js`, art sources and scratch), the workflow creates the native projects with Capacitor (`npx cap add android|ios`) and builds them. Nothing generated is committed. App id and name are in `capacitor.config.json`.

Local check of what gets packed: `node mobile/prepare-www.mjs --dry`.

Size: about 370 MB of game files, so the APK/IPA are large (fine for sideloading, too big for the Play Store limit without splitting the assets).
