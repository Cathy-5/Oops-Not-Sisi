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

// A package of mole inside holes
function Hole(props: { imageid: string }) {
  return <li className='box'>{props.imageid}</li>; // props package has imageid
}

export default function App() {
  // Go through every mole in the moles array
  const listMoles = moles.map(mole => (
    <Hole key={mole.id} imageid={mole.imageid} />
  ));

  return <ul className="board">{listMoles}</ul>; // put all hole components in a unsorted list
}
