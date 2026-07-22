import { useState, useEffect } from 'react';
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
const SISI_COUNT = 2;

function getRandomSisiHoleIds(count: number) {
  const randomIds: number[] = [];

  while (randomIds.length < count) {
    const randomId = Math.floor(Math.random() * holes.length);

    // If randomId is not yet exist, add it to the randomId lst
    if (!randomIds.includes(randomId)) {
      randomIds.push(randomId);
    }
  }

  return randomIds;
}

function Hole(props: { imageid: string; onClick: () => void }) {
  return (
    <li className='box' onClick={props.onClick}>
      {props.imageid}
    </li>
  );
}

export default function App() {
  const [score, setScore] = useState(0);
  const [sisiHoleIds, setSisiHoleIds] = useState<number[]>(() =>
    getRandomSisiHoleIds(SISI_COUNT)
  );
  const emptyHoleIds = [0, 3, 7];

  const [livesCount, setLivesCount] = useState(3);
  const [timeLeft, setTimeLeft] = useState(10); // count time

  // GameOver is true when livesCount or timer becomes 0
  const isGameOver = livesCount === 0 || timeLeft === 0;


  function handleHit() {
    if (isGameOver) return;
    setScore(currentScore => currentScore + 1);
  }

  function handleLive() {
    if (isGameOver) return;
    setLivesCount(currentLive => Math.max(currentLive - 1, 0));
  }

  // Reset game
  function resetGame() {
    setScore(0);
    setLivesCount(3);
    setTimeLeft(10);
    setSisiHoleIds(getRandomSisiHoleIds(SISI_COUNT));
  }

  // Handles timer decrease effect
  useEffect(() => {
    // If game is over, do not start timer
    if (isGameOver) return;

    const intervalId = setInterval(() => {
      setTimeLeft(currentCount => Math.max(currentCount - 1, 0)); // currentCount should be > 0 
    }, 1000);

    // Recheck if game over changes
    return () => clearInterval(intervalId);
  }, [isGameOver]); // if game is already over, don't start a timer
  
    // Handles sisi shuffle effect
    useEffect(() => {
    // If game is over, do not start timer
    if (isGameOver) return;

    const intervalId = setInterval(() => {
      setSisiHoleIds(getRandomSisiHoleIds(SISI_COUNT)); // shuffle sisi every 3 seconds
    }, 3000);

    // Recheck if game over changes
    return () => clearInterval(intervalId);
  }, [isGameOver]);


  const listHoles = holes.map(hole => {
    const isSisi = sisiHoleIds.includes(hole.id);
    const isEmpty = emptyHoleIds.includes(hole.id);

    // Set if conditions: empty, sisi, mole
    const imageid = isEmpty ? '' : isSisi ? '👧' : hole.imageid;
    const onClick = isEmpty ? () => {} : isSisi ? handleLive : handleHit;
 
    return (
      <Hole
        key={hole.id}
        imageid={imageid}
        onClick={onClick}
      />
    );
  });

  return (
    <main>
      <header>
        <h1>Score: {score}</h1>
        <h2>Time: {timeLeft}</h2>
        <h2>Lives: {lives.repeat(livesCount)}</h2>
        
        { isGameOver && <h2>Game Over</h2>}
        { isGameOver && <button onClick={resetGame}>Play Again</button>}

      </header>
      <ul className='board'>{listHoles}</ul>
    </main>
  );
}
