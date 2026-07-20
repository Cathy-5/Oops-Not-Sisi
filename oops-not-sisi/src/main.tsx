
import { createRoot } from 'react-dom/client'
import './index.css'
import Mole from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <section style={{ display: 'flex', gap:'12px'}}>
    <Mole /> 
    <Mole />
    <Mole />
  </section>,
)
