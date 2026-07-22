import { useState } from 'react';
import './App.css'

const moles = [
  { id: 0, imageid: '🐹' },
  { id: 1, imageid: '🐹' },
  { id: 2, imageid: '🐹' },
  { id: 3, imageid: '🐹' },
  { id: 4, imageid: '🐹' },
  { id: 5, imageid: '🐹' },
  { id: 6, imageid: '🐹' },
  { id: 7, imageid: '🐹' },
  { id: 8, imageid: '🐹' },
];

const lives = '❤️';

function Hole(props: { imageid: string; onClick: () => void }) {
  return (
    <li className='box' onClick={props.onClick}>
      {props.imageid}
    </li>
  );
}

export default function App() {
  const [score, setScore] = useState(0);
  const [sisiHoleId] = useState(() => Math.floor(Math.random() * 9));
  const [live, setLive] = useState(3);

  function handleHit() {
    setScore(currentScore => currentScore + 1);
  }

  function handleLive() {
    setLive(currentLive => Math.max(currentLive - 1, 0));
  }

  const listMoles = moles.map(mole => {
    const isSisi = mole.id === sisiHoleId;

    return (
      <Hole
        key={mole.id}
        imageid={isSisi ? '👧' : mole.imageid}
        onClick={isSisi ? handleLive : handleHit}
      />
    );
  });

  return (
    <main>
      <header>
        <h1>Score: {score}</h1>
        <h2>Lives: {lives.repeat(live)}</h2>
      </header>
      <ul className='board'>{listMoles}</ul>
    </main>
  );
}
