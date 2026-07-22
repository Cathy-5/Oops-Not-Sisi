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
const MOLE_COUNT = 3;

function getRandomHoleIds(count: number, blockedIds: number[] = []) {
  const randomIds: number[] = [];

  while (randomIds.length < count) {
    const randomId = Math.floor(Math.random() * holes.length);

    // If randomId is not yet exist and not blocked, add it to the randomIds list
    if (!randomIds.includes(randomId) && !blockedIds.includes(randomId)) {
      randomIds.push(randomId);
    }
  }

  return randomIds;
}

function getRandomHoleId(blockedIds: number[]) {
  const availableIds = holes
    .map(hole => hole.id)
    .filter(id => !blockedIds.includes(id));

  const randomIndex = Math.floor(Math.random() * availableIds.length);

  return availableIds[randomIndex];
}

function getInitialBoardPositions() {
  const sisiHoleIds = getRandomHoleIds(SISI_COUNT);
  const moleHoleIds = getRandomHoleIds(MOLE_COUNT, sisiHoleIds);

  return { sisiHoleIds, moleHoleIds };
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
  const [boardPositions, setBoardPositions] = useState(() =>
    getInitialBoardPositions()
  );
  const { sisiHoleIds, moleHoleIds } = boardPositions;
  const [cryingHoleId, setCryingHoleId] =  useState <number | null>();

  const [livesCount, setLivesCount] = useState(3);
  const [timeLeft, setTimeLeft] = useState(30); // count time

  // GameOver is true when livesCount or timer becomes 0
  const isGameOver = livesCount === 0 || timeLeft === 0;


  function handleHit() {
    if (isGameOver) return;
    setScore(currentScore => currentScore + 1);
  }

  function handleLive(holdId: number) {
    if (isGameOver) return;

    setLivesCount(currentLive => Math.max(currentLive - 1, 0));
    setCryingHoleId(holdId); // pass in the number for the crying holeId

    // Clear crying emoji
    setTimeout(() => {
      setCryingHoleId(null)
    }, 700);
  }

  // Reset game
  function resetGame() {
    setScore(0);
    setLivesCount(3);
    setTimeLeft(30);
    setBoardPositions(getInitialBoardPositions());
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
    // If game is over, do not start sisi shuffle
    if (isGameOver) return;

    const intervalIds = sisiHoleIds.map((_, index) => {
      return setInterval(() => {
        setBoardPositions(currentBoard => {
          const blockedIds = [
            ...currentBoard.moleHoleIds,
            ...currentBoard.sisiHoleIds.filter((_, sisiIndex) => sisiIndex !== index),
          ];
          const nextSisiHoleIds = [...currentBoard.sisiHoleIds];

          nextSisiHoleIds[index] = getRandomHoleId(blockedIds);

          return {
            ...currentBoard,
            sisiHoleIds: nextSisiHoleIds,
          };
        });
      }, 3000 + index * 700);
    });

    // Recheck if game over changes
    return () => intervalIds.forEach(intervalId => clearInterval(intervalId));
  }, [isGameOver, sisiHoleIds.length]);

  // Handles mole shuffle effect
  useEffect(() => {
    // If game is over, do not start mole shuffle
    if (isGameOver) return;

    const intervalIds = moleHoleIds.map((_, index) => {
      return setInterval(() => {
        setBoardPositions(currentBoard => {
          const blockedIds = [
            ...currentBoard.sisiHoleIds,
            ...currentBoard.moleHoleIds.filter((_, moleIndex) => moleIndex !== index),
          ];
          const nextMoleHoleIds = [...currentBoard.moleHoleIds];

          nextMoleHoleIds[index] = getRandomHoleId(blockedIds);

          return {
            ...currentBoard,
            moleHoleIds: nextMoleHoleIds,
          };
        });
      }, 2000 + index * 500);
    });

    // Recheck if game over changes
    return () => intervalIds.forEach(intervalId => clearInterval(intervalId));
  }, [isGameOver, moleHoleIds.length]);


  const listHoles = holes.map(hole => {
    const isSisi = sisiHoleIds.includes(hole.id);
    const isMole = moleHoleIds.includes(hole.id);
    const isCrying = cryingHoleId === hole.id;

    // Set if conditions: empty, sisi, mole
    const imageid = isCrying ? '😭' : isSisi ? '👧' : isMole ? hole.imageid : '';
    const onClick = isSisi ? () => handleLive(hole.id) : isMole ? handleHit : () => {};
 
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
