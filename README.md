# NPTEL Studyroom

A React and Vite practice app for the NPTEL course **Industry 4.0 and Industrial Internet of Things**. Choose one or more weeks, configure an Easy, Medium/Hard, or Mixed test, answer the full test before submitting, then review the score and explanations.

## Getting started

```sh
npm install
npm run dev
```

Run a production build with `npm run build`, or lint the app with `npm run lint`.

## Question data

Place week files in `src/data` using the `weekN_questions.json` naming pattern. Each file should contain a `week` number and a `topics` array. A `topic_title` is optional; when omitted, the app uses the first topic's name as the week label. Each topic should have a `topic_name` and a `questions` array. Questions need a `difficulty` (`Easy` or `Medium/Hard`), `question`, `options`, `correct_answer`, and `justification`.

The app loads matching week files automatically and keeps questions in their original order. Test setup is a two-step flow: select one or more weeks, then set difficulty, total question count, and time limit. The total must divide evenly across the selected weeks, and the per-week count cannot exceed the availability in the least-populated selected week for that difficulty. Mixed tests balance Easy and Medium/Hard questions as evenly as possible, falling back to the available difficulty when one category runs short. Questions are selected in source order within each difficulty. The Complete paper shortcut selects every week and starts with one mixed question per week (12 total for the current course); its question-count input advances in 12-question steps. Other tests advance in steps equal to the number of selected weeks. The timer is selected in five-minute increments. Answers can be changed until submission; selecting an answer advances to the next question, while previous/next navigation remains available. The score is calculated only after the user submits. At timeout, answers are locked and the user can submit their current answers; unanswered questions count as incorrect.

## Progress and offline support

Setup choices, the active test, answers, current question, and test deadline are saved locally in the browser. Reloading resumes the saved screen and an active timer continues against its original deadline. At timeout, the test remains available for manual submission. Clearing browser storage or using a different browser/device removes access to that local progress.

The production app registers a service worker that caches the app shell and same-origin assets after the first online visit. This allows the app to reopen during a brief network interruption. The first visit still needs a connection so the app can be cached; deploy the site over HTTPS (or localhost) for service-worker support. Network interruptions do not affect saved answers; if a browser reloads while offline, the cached app shell is used.

The app uses hash-based React Router routes for `#/setup/weeks`, `#/setup/paper`, `#/quiz/:questionNumber`, and `#/results`. Hash routing and Vite's relative asset base support static hosting on GitHub Pages, including repository subpaths. Quiz and setup screens are loaded on demand.

## Publish on GitHub Pages

The project is a static client-side app; it does not require a server, API keys, or secrets. The repository can be uploaded to GitHub, and GitHub Pages can host the built app:

1. Push the source to a GitHub repository.
2. In the repository, open **Settings → Pages** and choose **GitHub Actions** as the build and deployment source.
3. Use a Pages workflow that installs dependencies with `npm ci`, runs `npm run build`, uploads the `dist` directory as the Pages artifact, and deploys it with the official Pages actions.

Alternatively, build with `npm run build` and publish the contents of `dist` using any static host. Keep `node_modules` and `dist` out of source control (they are ignored). Saved tests and answers stay in the visitor's browser rather than being uploaded to a server. Service-worker/offline support requires HTTPS and only works after the first successful online visit.

## Project structure

- `src/App.jsx` mounts the route tree.
- `src/app` contains the shared layout and route configuration.
- `src/app/routes` contains the routed setup and error screens.
- `src/features/studyroom` contains shared state management, context, and local persistence.
- `src/data/courseData.js` loads week files and contains question-selection helpers.
- `src/components` contains shared UI such as the sidebar and icons.
- `src/features/setup` contains the week-selection and paper-setup steps.
- `src/features/quiz` contains the quiz and results screens.
- `public/sw.js` caches the production app shell and same-origin static assets.
