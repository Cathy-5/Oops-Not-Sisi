import { useState, useEffect, useRef } from 'react';
import holeImage from './assets/hole.png';
import innocentMoleImage from './assets/mole-innocent.png';
import annoyedMoleImage from './assets/mole-annoyed.png';
import pirateMoleImage from './assets/mole-pirate.png';
import sisiImage from './assets/sisi.png';
import ghostImage from './assets/ghost.png';
import hammerImage from './assets/hammer.png';
import gameSounds from './assets/game-sounds.mp3';
import sisiReactionSounds from './assets/sisi-reaction-sounds.mp3';
import scoreResultSounds from './assets/score-result-sounds.mp3';
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
const STARTING_SISI_COUNT = 1;
const MOLE_COUNT = 3;
const START_TIME = 30;
const HIT_SOUND_COOLDOWN = 700;
const HIDDEN_HOLE_ID = -1;
const HIDDEN_SISI_ID = -100;
const BEST_SCORE_KEY = 'oops-not-sisi-best-score';
const PROTECTED_NAME_KEY = 'oops-not-sisi-protected-name';
const PROTECTED_IMAGE_KEY = 'oops-not-sisi-protected-image';
const STREAK_GOAL = 3;
const STREAK_TIME_BONUS = 3;
type MoleKind = 'innocent' | 'annoyed' | 'pirate';

type MolePosition = {
  id: number;
  kind: MoleKind;
};

type HitFeedback = {
  holeId: number;
  text: string;
  type: 'score' | 'hurt' | 'time';
};

type RevealedSisi = {
  holeId: number;
  hadMask: boolean;
};

const molePoints: Record<MoleKind, number> = {
  innocent: 1,
  annoyed: 2,
  pirate: 3,
};

const moleImages: Record<MoleKind, string> = {
  innocent: innocentMoleImage,
  annoyed: annoyedMoleImage,
  pirate: pirateMoleImage,
};

function getRandomMoleKind() {
  const kinds: MoleKind[] = ['innocent', 'annoyed', 'pirate'];
  const randomIndex = Math.floor(Math.random() * kinds.length);

  return kinds[randomIndex];
}

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

function getTargetSisiCount(timeLeft: number) {
  if (timeLeft <= 15) return 2;

  return 1;
}

function getSisiPhase(timeLeft: number) {
  if (timeLeft <= 10) return 'Disaster';
  if (timeLeft <= 15) return 'Mixed';
  if (timeLeft <= 20) return 'Masked';

  return 'Regular';
}

function getSisiStatus(timeLeft: number, sisiIndex: number) {
  const phase = getSisiPhase(timeLeft);

  if (phase === 'Regular') return 'sisi';
  if (phase === 'Masked') return 'disguised-sisi';

  return sisiIndex % 2 === 0 ? 'disguised-sisi' : 'sisi';
}

function getRandomGroundhogHoleId(molePositions: MolePosition[], blockedIds: number[]) {
  const availableMoleIds = molePositions
    .map(mole => mole.id)
    .filter(id => id >= 0 && !blockedIds.includes(id));

  if (availableMoleIds.length === 0) {
    return getRandomHoleId(blockedIds);
  }

  const randomIndex = Math.floor(Math.random() * availableMoleIds.length);

  return availableMoleIds[randomIndex];
}

function getInitialBoardPositions() {
  const sisiHoleIds = getRandomHoleIds(STARTING_SISI_COUNT);
  const moleHoleIds = getRandomHoleIds(MOLE_COUNT, sisiHoleIds);
  const molePositions: MolePosition[] = moleHoleIds.map(id => ({
    id,
    kind: getRandomMoleKind(),
  }));

  return { sisiHoleIds, molePositions };
}

function getSavedBestScore() {
  const savedScore = Number(localStorage.getItem(BEST_SCORE_KEY));

  return Number.isNaN(savedScore) ? 0 : savedScore;
}

function getSavedProtectedName() {
  return localStorage.getItem(PROTECTED_NAME_KEY) || 'Sisi';
}

function getSavedProtectedImage() {
  return localStorage.getItem(PROTECTED_IMAGE_KEY) || sisiImage;
}

function getBetterScore(currentScore: number, previousBestScore: number) {
  return Math.max(currentScore, previousBestScore);
}

function playSoundPart(soundFile: string, startTime: number, endTime: number) {
  const sound = new Audio(soundFile);

  sound.currentTime = startTime;
  sound.play().catch(() => {
    // Some browsers block sound if it is not triggered by a user click
  });

  setTimeout(() => {
    sound.pause();
  }, (endTime - startTime) * 1000);
}

function playHitSound() {
  playSoundPart(gameSounds, 0.14, 0.72);
}

function playStartSound() {
  playSoundPart(gameSounds, 1.21, 1.67);
}

function playSisiCryingSound() {
  playSoundPart(sisiReactionSounds, 0, 1.15);
}

function playSisiGhostSound() {
  playSoundPart(sisiReactionSounds, 4.71, 8.56);
}

function playWinSound() {
  playSoundPart(scoreResultSounds, 0.22, 1.43);
}

function playLoseSound() {
  playSoundPart(scoreResultSounds, 1.92, 2.98);
}

function Hole(props: { imageid: string; status: string; isHit: boolean; protectedImage: string; protectedName: string; hasCustomProtectedImage: boolean; feedback?: HitFeedback; moleKind?: MoleKind; onClick: () => void }) {
  const protectedImageClass = `sisi-image ${props.hasCustomProtectedImage ? 'custom-protected-image' : ''}`;

  return (
    <li className={`box ${props.status} ${props.isHit ? 'hit' : ''}`} onClick={props.onClick}>
      {props.feedback && (
        <span className={`hit-feedback ${props.feedback.type}`}>
          {props.feedback.text}
        </span>
      )}
      <div className='character-layer'>
        {props.status === 'mole' && props.moleKind && (
          <img className='mole-image' src={moleImages[props.moleKind]} alt={`${props.moleKind} mole`} />
        )}
        {props.status === 'disguised-sisi' && (
          <>
            <img className={`${protectedImageClass} disguised-sisi-behind`} src={props.protectedImage} alt={`${props.protectedName} pretending to be a groundhog`} />
            <img className='mole-image disguise-mask' src={innocentMoleImage} alt='Suspicious groundhog mask' />
          </>
        )}
        {props.status === 'revealed-sisi' && (
          <img className={protectedImageClass} src={props.protectedImage} alt={`${props.protectedName} revealed`} />
        )}
        {props.status === 'revealed-masked-sisi' && (
          <>
            <img className={protectedImageClass} src={props.protectedImage} alt={`${props.protectedName} revealed`} />
            <img className='mole-image flying-mask' src={innocentMoleImage} alt='' />
          </>
        )}
        {props.status === 'sisi' && <img className={protectedImageClass} src={props.protectedImage} alt={props.protectedName} />}
        {props.status === 'ghost' && <img className='ghost-image' src={ghostImage} alt='Ghost' />}
        {props.status !== 'empty' && props.status !== 'mole' && props.status !== 'disguised-sisi' && props.status !== 'revealed-sisi' && props.status !== 'revealed-masked-sisi' && props.status !== 'sisi' && props.status !== 'ghost' && props.imageid}
      </div>
      <img className='hole-image' src={holeImage} alt='' />
    </li>
  );
}

export default function App() {
  const gameOverSoundPlayed = useRef(false);
  const canPlayHitSound = useRef(true);
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(() => getSavedBestScore());
  const [madeNewBestScore, setMadeNewBestScore] = useState(false);
  const [protectedName, setProtectedName] = useState(() => getSavedProtectedName());
  const [protectedImage, setProtectedImage] = useState(() => getSavedProtectedImage());
  const [boardPositions, setBoardPositions] = useState(() =>
    getInitialBoardPositions()
  );
  const { sisiHoleIds, molePositions } = boardPositions;
  const [ghostHoleId, setGhostHoleId] = useState<number | null>(null);
  const [hitHoleId, setHitHoleId] = useState<number | null>(null);
  const [revealedSisi, setRevealedSisi] = useState<RevealedSisi | null>(null);
  const [hitFeedback, setHitFeedback] = useState<HitFeedback | null>(null);

  const [livesCount, setLivesCount] = useState(3);
  const [timeLeft, setTimeLeft] = useState(START_TIME); // count time
  const [hitStreak, setHitStreak] = useState(0);
  const [hasGameStarted, setHasGameStarted] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHammerSwinging, setIsHammerSwinging] = useState(false);

  // GameOver is true when livesCount or timer becomes 0
  const isGameOver = hasGameStarted && (livesCount === 0 || timeLeft === 0);
  const isGameActive = hasGameStarted && !isGameOver;
  const targetSisiCount = getTargetSisiCount(timeLeft);
  const sisiMoveSpeed = timeLeft <= 10 ? 1500 : timeLeft <= 20 ? 2200 : 3000;
  const moleMoveSpeed = timeLeft <= 10 ? 3000 : timeLeft <= 20 ? 3800 : 4800;
  const hasCustomProtectedImage = protectedImage !== sisiImage;


  function showHitEffect(holeId: number) {
    setHitHoleId(holeId);

    setTimeout(() => {
      setHitHoleId(null);
    }, 350);
  }

  function showHitFeedback(feedback: HitFeedback) {
    setHitFeedback(feedback);

    setTimeout(() => {
      setHitFeedback(null);
    }, 650);
  }

  function playSoundWithCooldown(playSound: () => void) {
    if (!canPlayHitSound.current) return;

    canPlayHitSound.current = false;
    playSound();

    setTimeout(() => {
      canPlayHitSound.current = true;
    }, HIT_SOUND_COOLDOWN);
  }

  function hideMoleThenRespawn(holeId: number) {
    const hiddenMoleId = HIDDEN_HOLE_ID - holeId;

    setTimeout(() => {
      setBoardPositions(currentBoard => ({
        ...currentBoard,
        molePositions: currentBoard.molePositions.map(mole =>
          mole.id === holeId ? { ...mole, id: hiddenMoleId } : mole
        ),
      }));
    }, 220);

    setTimeout(() => {
      setBoardPositions(currentBoard => {
        const blockedIds = [
          ...currentBoard.sisiHoleIds,
          ...currentBoard.molePositions
            .filter(mole => mole.id >= 0)
            .map(mole => mole.id),
        ];

        return {
          ...currentBoard,
          molePositions: currentBoard.molePositions.map(mole =>
            mole.id === hiddenMoleId
              ? {
                  id: getRandomHoleId(blockedIds),
                  kind: getRandomMoleKind(),
                }
              : mole
          ),
        };
      });
    }, 900);
  }

  function hideSisiThenRespawn(holeId: number) {
    const hiddenSisiId = HIDDEN_SISI_ID - holeId;

    setTimeout(() => {
      setBoardPositions(currentBoard => ({
        ...currentBoard,
        sisiHoleIds: currentBoard.sisiHoleIds.map(sisiHoleId =>
          sisiHoleId === holeId ? hiddenSisiId : sisiHoleId
        ),
      }));
    }, 180);

    setTimeout(() => {
      setBoardPositions(currentBoard => {
        const blockedIds = currentBoard.sisiHoleIds.filter(sisiHoleId => sisiHoleId >= 0);
        const nextSisiHoleIds = currentBoard.sisiHoleIds.map(sisiHoleId =>
          sisiHoleId === hiddenSisiId ? getRandomGroundhogHoleId(currentBoard.molePositions, blockedIds) : sisiHoleId
        );

        return {
          ...currentBoard,
          sisiHoleIds: nextSisiHoleIds,
        };
      });
    }, 950);
  }

  function handleHit(holeId: number, points: number) {
    if (!hasGameStarted || isGameOver) return ;

    // Avoid too many sounds playing over each other
    playSoundWithCooldown(playHitSound);

    showHitEffect(holeId);
    showHitFeedback({
      holeId,
      text: `+${points}`,
      type: 'score',
    });
    setScore(currentScore => currentScore + points);
    setHitStreak(currentStreak => {
      const nextStreak = currentStreak + 1;

      if (nextStreak === STREAK_GOAL) {
        setTimeLeft(currentTime => currentTime + STREAK_TIME_BONUS);
        showHitFeedback({
          holeId,
          text: `+${STREAK_TIME_BONUS}s`,
          type: 'time',
        });

        return 0;
      }

      return nextStreak;
    });
    hideMoleThenRespawn(holeId);
  }

  function handleLife(holeId: number) {
    if (!hasGameStarted || isGameOver) return ;

    const clickedSisiIndex = sisiHoleIds.indexOf(holeId);
    const wasWearingMask = getSisiStatus(timeLeft, clickedSisiIndex) === 'disguised-sisi';
    const isFinalHit = livesCount <= 1;

    // Handlelife only runs when sisi is clicked
    // Avoid too many hit sounds playing over each other
    playSoundWithCooldown(playSisiCryingSound);

    showHitEffect(holeId);

    // Final hit is already dramatic enough with the ghost
    if (!isFinalHit) {
      setRevealedSisi({
        holeId,
        hadMask: wasWearingMask,
      });

      // If there was no mask, show the broken heart instead
      if (!wasWearingMask) {
        showHitFeedback({
          holeId,
          text: '💔',
          type: 'hurt',
        });
      }
    }

    setHitStreak(0);

    // CurrentLive is 1, nextLive is 0
    setLivesCount(currentLive => {
      const nextLive = Math.max(currentLive - 1, 0)

      if (nextLive === 0) {
        setTimeout(() => {
          setRevealedSisi(null);
          setGhostHoleId(holeId);
          playSisiGhostSound();
        }, 260);
      } else {
        hideSisiThenRespawn(holeId);
      }

      return nextLive;
    });

    setTimeout(() => {
      setRevealedSisi(null);
    }, 900);
  }

  function setFreshGame() {
    setScore(0);
    setMadeNewBestScore(false);
    setLivesCount(3);
    setHitStreak(0);
    setGhostHoleId(null);
    setHitHoleId(null);
    setRevealedSisi(null);
    setHitFeedback(null);
    setTimeLeft(START_TIME);
    setBoardPositions(getInitialBoardPositions());
  }

  // Start game
  function startGame() {
    gameOverSoundPlayed.current = false;
    canPlayHitSound.current = true;
    setFreshGame();
    setHasGameStarted(true);
    playStartSound();
  }

  // Reset game
  function resetGame() {
    startGame();
  }

  function changeCharacter() {
    setFreshGame();
    setHasGameStarted(false);
  }

  function handleMouseMove(event: React.MouseEvent<HTMLElement>) {
    setMousePosition({ x: event.clientX, y: event.clientY });
  }

  function handleMouseDown() {
    setIsHammerSwinging(true);

    setTimeout(() => {
      setIsHammerSwinging(false);
    }, 160);
  }

  function handleProtectedNameChange(event: React.ChangeEvent<HTMLInputElement>) {
    const nextName = event.target.value || 'Sisi';

    setProtectedName(nextName);
    localStorage.setItem(PROTECTED_NAME_KEY, nextName);
  }

  function handleProtectedImageChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      const imageData = String(reader.result);

      setProtectedImage(imageData);
      localStorage.setItem(PROTECTED_IMAGE_KEY, imageData);
    };

    // Read the image locally in the browser
    reader.readAsDataURL(file);
  }

  function resetProtectedCharacter() {
    setProtectedName('Sisi');
    setProtectedImage(sisiImage);
    localStorage.removeItem(PROTECTED_NAME_KEY);
    localStorage.removeItem(PROTECTED_IMAGE_KEY);
  }

  // Handles timer decrease effect
  useEffect(() => {
    // If game is over, do not start timer
    if (!hasGameStarted || isGameOver) return;

    const intervalId = setInterval(() => {
      setTimeLeft(currentCount => Math.max(currentCount - 1, 0)); // currentCount should be > 0 
    }, 1000);

    // Recheck if game over changes
    return () => clearInterval(intervalId);
  }, [hasGameStarted, isGameOver]); // if game is already over, don't start a timer
  

  // Handles sisi shuffle effect
  useEffect(() => {
    // If game is over, do not start sisi shuffle
    if (!hasGameStarted || isGameOver) return;

    const syncSisiCountId = setTimeout(() => {
      setBoardPositions(currentBoard => {
        if (currentBoard.sisiHoleIds.length === targetSisiCount) {
          return currentBoard;
        }

        if (currentBoard.sisiHoleIds.length > targetSisiCount) {
          return {
            ...currentBoard,
            sisiHoleIds: currentBoard.sisiHoleIds.slice(0, targetSisiCount),
          };
        }

        const nextSisiHoleIds = [...currentBoard.sisiHoleIds];

        while (nextSisiHoleIds.length < targetSisiCount) {
          const blockedIds = nextSisiHoleIds.filter(sisiHoleId => sisiHoleId >= 0);

          // New Sisi prefers replacing a current groundhog
          nextSisiHoleIds.push(getRandomGroundhogHoleId(currentBoard.molePositions, blockedIds));
        }

        return {
          ...currentBoard,
          sisiHoleIds: nextSisiHoleIds,
        };
      });
    }, 0);

    const intervalIds = sisiHoleIds.map((_, index) => {
      return setInterval(() => {
        setBoardPositions(currentBoard => {
          const blockedIds = [
            ...currentBoard.sisiHoleIds
              .filter((_, sisiIndex) => sisiIndex !== index)
              .filter(sisiHoleId => sisiHoleId >= 0),
          ];
          const nextSisiHoleIds = [...currentBoard.sisiHoleIds];

          // Sisi prefers replacing a groundhog, so she feels more sudden
          nextSisiHoleIds[index] = getRandomGroundhogHoleId(currentBoard.molePositions, blockedIds);

          return {
            ...currentBoard,
            sisiHoleIds: nextSisiHoleIds,
          };
        });
      }, sisiMoveSpeed + index * 700);
    });

    // Recheck if game over changes
    return () => {
      clearTimeout(syncSisiCountId);
      intervalIds.forEach(intervalId => clearInterval(intervalId));
    };
  }, [hasGameStarted, isGameOver, sisiHoleIds, sisiMoveSpeed, targetSisiCount]);

  // Handles mole shuffle effect
  useEffect(() => {
    // If game is over, do not start mole shuffle
    if (!hasGameStarted || isGameOver) return;

    const intervalIds = molePositions.map((_, index) => {
      return setInterval(() => {
        setBoardPositions(currentBoard => {
          const blockedIds = [
            ...currentBoard.sisiHoleIds,
            ...currentBoard.molePositions
              .filter((_, moleIndex) => moleIndex !== index)
              .map(mole => mole.id),
          ];
          const nextMolePositions = [...currentBoard.molePositions];

          nextMolePositions[index] = {
            id: getRandomHoleId(blockedIds),
            kind: getRandomMoleKind(),
          };

          return {
            ...currentBoard,
            molePositions: nextMolePositions,
          };
        });
      }, moleMoveSpeed + index * 500);
    });

    // Recheck if game over changes
    return () => intervalIds.forEach(intervalId => clearInterval(intervalId));
  }, [hasGameStarted, isGameOver, molePositions, moleMoveSpeed]);

  // Handles end game sound
  useEffect(() => {
    if (!isGameOver || gameOverSoundPlayed.current) return;

    gameOverSoundPlayed.current = true;
    setBestScore(currentBestScore => {
      const isBetterThanPast = score > currentBestScore;
      const nextBestScore = getBetterScore(score, currentBestScore);

      if (isBetterThanPast) {
        setMadeNewBestScore(true);
        playWinSound();
      } else {
        playLoseSound();
      }

      localStorage.setItem(BEST_SCORE_KEY, String(nextBestScore));

      return nextBestScore;
    });
  }, [isGameOver, score]);


  const listHoles = holes.map(hole => {
    const isSisi = sisiHoleIds.includes(hole.id);
    const sisiIndex = sisiHoleIds.indexOf(hole.id);
    const mole = molePositions.find(molePosition => molePosition.id === hole.id);
    const isMole = mole !== undefined;
    const isGhost = ghostHoleId === hole.id;
    const isRevealedSisi = revealedSisi?.holeId === hole.id;
    const isHit = hitHoleId === hole.id;
    const feedback = hitFeedback?.holeId === hole.id ? hitFeedback : undefined;

    // Set if conditions: empty, sisi, mole
    const imageid = isGhost ? '👻' : isRevealedSisi ? '👧' : isSisi ? '👧' : isMole ? hole.imageid : '';
    const status = isGhost ? 'ghost' : isRevealedSisi ? revealedSisi.hadMask ? 'revealed-masked-sisi' : 'revealed-sisi' : isSisi ? getSisiStatus(timeLeft, sisiIndex) : isMole ? 'mole' : 'empty';
    const onClick = isSisi ? () => handleLife(hole.id) : isMole ? () => handleHit(hole.id, molePoints[mole.kind]) : () => {};
 
    return (
      <Hole
        key={hole.id}
        imageid={imageid}
        status={status}
        isHit={isHit}
        protectedImage={protectedImage}
        protectedName={protectedName}
        hasCustomProtectedImage={hasCustomProtectedImage}
        feedback={feedback}
        moleKind={mole?.kind}
        onClick={onClick}
      />
    );
  });

  return (
    <main
      className={`game ${isGameActive ? 'hammer-mode' : ''}`}
      onMouseMove={handleMouseMove}
      onMouseDown={isGameActive ? handleMouseDown : undefined}
    >
      <header className='game-hud' onMouseDown={event => event.stopPropagation()}>
        <div className='hud-stat'>
          <span className='hud-label'>Score</span>
          <strong>{score}</strong>
        </div>
        <div className='hud-lives' aria-label={`${livesCount} lives left`}>
          {lives.repeat(livesCount)}
        </div>
        <div className='hud-stat hud-time'>
          <span className='hud-label'>Time</span>
          <strong>{timeLeft}</strong>
        </div>
        <div className='hud-bottom'>
          <p className='hud-difficulty'>Best: {bestScore} · Streak: {hitStreak}/{STREAK_GOAL}</p>
          {hasGameStarted && (
            <button className='hud-action' onClick={changeCharacter}>
              Change Character
            </button>
          )}
        </div>
      </header>

      {!hasGameStarted && (
        <section className='game-over-card start-card'>
          <h2>Oops, Not {protectedName}!</h2>
          <p className='start-subtitle'>Whack groundhogs. Avoid {protectedName}.</p>
          <div className='customizer'>
            <h3>Choose who to protect</h3>
            <label>
              Name
              <input
                type='text'
                value={protectedName}
                onChange={handleProtectedNameChange}
                placeholder='Sisi'
              />
            </label>
            <label>
              Photo
              <input
                type='file'
                accept='image/*'
                onChange={handleProtectedImageChange}
              />
            </label>
            <p className='privacy-note'>Privacy note: photo stays local in your browser.</p>
            <button type='button' className='secondary-button' onClick={resetProtectedCharacter}>
              Use Sisi
            </button>
          </div>
          <button onClick={startGame}>Start Game</button>
        </section>
      )}

      {isGameOver && (
        <section className='game-over-card'>
          <h2>Game Over</h2>
          {madeNewBestScore && <p className='new-best'>New Best!</p>}
          <p>Score</p>
          <strong>{score}</strong>
          <p>Best Score: {bestScore}</p>
          <button onClick={resetGame}>Play Again</button>
        </section>
      )}

      <ul className='board'>{listHoles}</ul>
      {isGameActive && (
        <img
          className={`custom-hammer ${isHammerSwinging ? 'swing' : ''}`}
          src={hammerImage}
          alt=''
          style={{ left: mousePosition.x, top: mousePosition.y }}
        />
      )}
    </main>
  );
}
