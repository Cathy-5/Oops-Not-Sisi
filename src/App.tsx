import { useState } from 'react';
import './App.css'

const holes = [
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
  const [sisiHoleIds] = useState<number[]>([1, 5]); // ids of holes containing sisi: an array of numbers, now 1 and 5 shows sisi
  const [livesCount, setLivesCount] = useState(3);

  function handleHit() {
    setScore(currentScore => currentScore + 1);
  }

  function handleLive() {
    setLivesCount(currentLive => Math.max(currentLive - 1, 0));
  }

  const listMoles = holes.map(hole => {
    const isSisi =sisiHoleIds.includes(hole.id); // check if current hole's id inside Sisi List

    return (
      <Hole
        key={hole.id}
        imageid={isSisi ? '👧' : hole.imageid}
        onClick={isSisi ? handleLive : handleHit}
      />
    );
  });

  return (
    <main>
      <header>
        <h1>Score: {score}</h1>
        <h2>Lives: {lives.repeat(livesCount)}</h2>
      </header>
      <ul className='board'>{listMoles}</ul>
    </main>
  );
}
