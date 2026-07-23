# Oops, Not Sisi!

**Whack Groundhogs. Protect Someone You Love. Survive the Chaos.**

Oops, Not Sisi! is a playful browser-based whack-a-mole game built with React, TypeScript, and CSS. Players earn points by hitting different groundhogs, but must avoid hitting the protected character. By default, the protected character is Sisi, but players can replace Sisi with a local photo of a friend, family member, pet, or group.

The game starts simple, then becomes more chaotic over time: Sisi appears normally, then starts wearing a badly cut groundhog mask, then multiple protected characters appear to be chaotic.

## Tech Stack

- React
- TypeScript
- Vite
- CSS
- Local Storage
- Browser FileReader API
- HTML Audio
- ESLint

## Core Features

- Score-based whack-a-mole gameplay with multiple groundhog types
- Protected-character mechanic with lives, ghost ending, and mistake feedback
- Local photo and name customization for replacing Sisi with someone personal
- Progressive chaos system where the protected character appears normally, disguised, and in larger numbers over time
- Streak bonus system that rewards accurate play with extra time
- Persistent best score saved in the browser
- Polished arcade feel with animations, sound effects, hammer cursor, and visual hit feedback

## Preview

<table>
  <tr>
    <td align="center" width="50%">
      <strong>Start & Customization Screen</strong><br><br>
      <img src="./docs/start-customization.png" alt="Start and customization screen" width="100%">
    </td>
    <td align="center" width="50%">
      <strong>Gameplay</strong><br><br>
      <img src="./docs/gameplay.png" alt="Gameplay screen" width="100%">
    </td>
  </tr>
</table>

<table>
  <tr>
    <td align="center" width="100%">
      <strong>Masked Protected Character</strong><br><br>
      <img src="./docs/masked-character.png" alt="Protected character wearing a groundhog mask" width="100%">
    </td>
  </tr>
</table>

## Game Rules

- Hit groundhogs to gain points.
- Do not hit the protected character.
- Hitting the protected character removes one life.
- When lives reach 0, the ghost appears and the game ends.
- Hit 3 groundhogs in a row to earn +3 seconds.
- Hitting the protected character resets the streak.
- Try to beat your saved best score.

## Use Cases

- Demonstrates interactive React state management with timers, score, lives, and game phases
- Shows user-focused UI polish through animation, sound, feedback, and customization
- Highlights browser-only personalization with local photo handling and saved best score

## Running Locally

```bash
npm install
npm run dev
```

The app runs at:

```text
http://localhost:5173
```

## Build

```bash
npm run build
```

## Lint

```bash
npm run lint
```

## Preview Production Build

```bash
npm run preview
```

## Privacy Note

Custom photos are read with the browser FileReader API and stored locally in the browser. The app does not upload the selected image to a server.
