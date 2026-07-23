# Oops, Not Sisi!

**Whack Groundhogs. Protect Someone You Love. Survive the Chaos.**

Oops, Not Sisi! is a playful browser-based whack-a-mole game built with React, TypeScript, and CSS. Players earn points by hitting different groundhogs, but must avoid hitting the protected character. By default, the protected character is Sisi, but players can replace Sisi with a local photo of a friend, family member, pet, or group.

The game starts simple, then becomes more chaotic over time: Sisi appears normally, then starts wearing a badly cut groundhog mask, then multiple protected characters appear as the round turns into disaster mode.

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

- Whack groundhogs to earn points
- Different groundhog types give different scores: +1, +2, and +3
- Avoid hitting the protected character
- Protected character loses a life when hit
- Final hit triggers a ghost animation and game over
- 3 groundhog hits in a row add +3 seconds to the timer
- Best score is saved in the browser
- Players can customize the protected character name
- Players can replace the protected character with a local photo
- Uploaded photos stay local in the browser
- Custom photos are visually shaped with a curved lower edge so they appear to come out of the hole
- Sisi/protected character can disguise herself with a badly cut groundhog mask
- Sound effects, hammer cursor, hit feedback, and animations make the game feel more interactive

## Preview

> Screenshots can be added later in the `docs/` folder.

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
    <td align="center" width="50%">
      <strong>Masked Protected Character</strong><br><br>
      <img src="./docs/masked-character.png" alt="Protected character wearing a groundhog mask" width="100%">
    </td>
    <td align="center" width="50%">
      <strong>Game Over & Best Score</strong><br><br>
      <img src="./docs/game-over.png" alt="Game over screen with best score" width="100%">
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

- Demonstrates React state management through score, timer, lives, streaks, and game-over state
- Shows TypeScript usage for game entities, props, and feedback types
- Uses browser APIs for local image customization and audio feedback
- Applies CSS animation for pop-in characters, hit effects, mask reveal, ghost movement, and hammer interaction
- Highlights user-focused polish: privacy note, local photo handling, best score, and immediate visual feedback
- Works as a portfolio project beyond games because it shows UI logic, user interaction design, local data persistence, and incremental product polish

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

## Future Improvements

- Add a short legend explaining groundhog point values before the game starts
- Add mobile touch optimization
- Add pause/resume
- Add optional difficulty selection
- Add more end-game titles based on performance
- Add automated UI tests for core game interactions
