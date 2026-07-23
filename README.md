# Oops, Not Sisi!

**Whack groundhogs. Protect someone you love. Survive the chaos.**

A playful browser-based whack-a-mole game built with React and TypeScript. Hit groundhogs for points, but avoid your custom protected character—replace Sisi with a photo of someone or something that matters to you. The game escalates: your person starts normal, then disguises themselves in a badly cut groundhog mask, then multiplies. Things get weird fast.

## Features

- **Score-based gameplay** with multiple groundhog types and point variations
- **Personalization** via local photo upload—Sisi is just the default
- **Progressive difficulty** through disguises, multiple protected characters, and escalating chaos
- **Streak bonuses** reward accurate play with extra time
- **Polish** with animations, sound effects, hammer cursor, and visual feedback
- **Persistent scores** saved locally in browser
- **Ghost ending** when lives reach zero

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

## Tech Stack

- React
- TypeScript
- Vite
- CSS
- localStorage
- FileReader API
- HTML Audio

## How to Run

```bash
npm install
npm run dev
```

Visit http://localhost:5173

## Build & Deploy

```bash
npm run build        # Production build
npm run preview      # Preview production locally
npm run lint         # Check code
```

## Privacy

Photos are read via the browser FileReader API and stored locally. Nothing uploads to a server—your memories stay yours.
