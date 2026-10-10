# Libra-Read App

A Wattpad-style reading app for classic fairy tales. Browse stories, search by title, author or genre, read chapters with adjustable text and themes, and keep a personal library with saved stories and reading progress.

Built with **React Native (Expo + Expo Router)** and powered by the [Libra-Read API](https://github.com/YOUR-USERNAME/libraread-api) (Laravel).

> ADET Midterm Project

## Features

- **Home:** featured story, popular stories, and genre browsing
- **Discover:** live search plus genre filters
- **Story details:** cover, synopsis, genres, read count, and Start/Continue reading
- **Reader:** adjustable font size, Paper / Sepia / Night themes, and a reading progress bar
- **Library:** saved stories and "Continue reading", stored on the device
- **Author and Genre pages:** all stories by an author or in a genre

## Tech Stack

- React Native with Expo (SDK 57) and Expo Router (file-based routing)
- TypeScript
- Axios for API calls
- AsyncStorage for the saved library and reading progress
- Expo Linear Gradient, Expo Google Fonts (Lora and Inter)

## Prerequisites

- Node.js (LTS) and npm
- The Libra-Read API running (see its README)
- Expo Go on your phone, or an Android emulator, or a web browser

## Getting Started

```bash
git clone https://github.com/YOUR-USERNAME/libraread-app.git
cd libraread-app
npm install
```

### Configure the API URL

Open `src/constants/config.ts` and set `PC_IP` to your computer's local IPv4 address. Run `ipconfig` on Windows and use the IPv4 address under your Wi-Fi adapter.

```ts
const PC_IP = "192.168.1.5"; // <- your IPv4 address
```

| Where you run the app       | URL used                    |
| --------------------------- | --------------------------- |
| Browser (web)               | `http://localhost:8000/api` |
| Expo Go on a physical phone | `http://<PC_IP>:8000/api`   |

Rules for Expo Go on a phone:

- Do **not** use `localhost`, `127.0.0.1` or `10.0.2.2` on a phone.
- The phone and the computer must be on the **same Wi-Fi network**.
- Start Laravel with `php artisan serve --host=0.0.0.0 --port=8000`.

Each teammate uses their own IP. Please do not commit your personal `PC_IP` change.

### Run the app

```bash
npx expo start -c
```

Then press `w` to open it in the browser, or scan the QR code with Expo Go.

## Project Structure

```
src/
  app/                 Screens (Expo Router)
    (tabs)/            Home, Discover, Library tabs
    story/[id].tsx     Story details
    read/[id].tsx      Reader
    author/[id].tsx    Author page
    genre/[name].tsx   Genre page
    _layout.tsx        Root layout (fonts, providers)
  api/stories.ts       API calls and data normalizers
  components/          StoryCover, StoryCard, Center
  constants/           config.ts (API URL), tokens.ts (colors, gradients)
  context/             LibraryContext (saved stories, progress)
  hooks/               useFetch
  utils/               text.ts (text cleanup), images.ts (image URL helpers)
```

## How It Handles the API

All the API's raw shape is cleaned in one place, `src/api/stories.ts`, so the screens never see it:

- Keys with spaces (`Book Cover`, `Sample Read Counts`) are renamed to `coverUrl` and `reads`.
- Backticks in the text are converted to proper apostrophes.
- The chapters endpoint returns a single chapter object, which is wrapped into an array.

## Troubleshooting

| Problem                                  | Fix                                                                                 |
| ---------------------------------------- | ----------------------------------------------------------------------------------- |
| "Could not load. Is the server running?" | Start Laravel with `--host=0.0.0.0`, check `PC_IP`, and use the same Wi-Fi          |
| Works on the PC but not the phone        | Allow port 8000 (or `php.exe`) in Windows Firewall                                  |
| Red errors on `router.push(...)`         | Run `npx expo start -c`, then restart the TypeScript server in VS Code              |
| `Unable to resolve "@/..."`              | Check `tsconfig.json` has `"paths": { "@/*": ["./src/*"] }`, then restart with `-c` |
| Real cover or author images missing      | Expected sometimes. A gradient or initials fallback is shown instead                |

## Team

- Member 1: role
- Member 2: role
- Member 3: role
- Member 4: role
- Member 5: role

## License

See [LICENSE](LICENSE).
