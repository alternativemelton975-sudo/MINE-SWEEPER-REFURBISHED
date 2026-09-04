import './style.css'

const DIFFICULTIES = {
  beginner: { label: 'Beginner', rows: 9, columns: 9, mines: 10 },
  intermediate: { label: 'Intermediate', rows: 16, columns: 16, mines: 40 },
  expert: { label: 'Expert', rows: 16, columns: 30, mines: 99 },
}

let difficulty = 'beginner'
let board = []
let gameState = 'ready'
let elapsed = 0
let timerId
let startedAt

const app = document.querySelector('#app')

app.innerHTML = `
  <div class="page-shell">
    <header class="masthead">
      <div class="brand-mark"><span class="brand-kicker">FIELD OPERATIONS / 04</span><h1>Minefield<span class="slash"> //</span> Sweeper</h1></div>
      <p class="status-line"><span class="status-dot"></span><span id="statusText">System ready</span></p>
    </header>

    <section class="hero">
      <div><p class="eyebrow">Clearance protocol</p><h2>Read the terrain.<br /><em>Trust the numbers.</em></h2></div>
      <p class="intro">A focused logic exercise for sharp eyes and steady hands. Every square is a decision.</p>
    </section>

    <section class="game-panel" aria-label="Minesweeper game">
      <div class="control-bar">
        <div class="difficulty-picker" role="group" aria-label="Difficulty">
          ${Object.entries(DIFFICULTIES).map(([key, value]) => `<button class="difficulty-button ${key === difficulty ? 'active' : ''}" data-difficulty="${key}">${value.label}</button>`).join('')}
        </div>
        <button class="reset-button" id="resetButton" aria-label="New field"><span class="reset-icon">↻</span> New field</button>
      </div>

      <div class="readout-row">
        <div class="readout"><span class="readout-label">Mines remaining</span><strong id="mineCount">010</strong></div>
        <div class="readout timer-readout"><span class="readout-label">Elapsed time</span><strong id="timer">000</strong><span class="unit">SEC</span></div>
        <div class="readout mission-readout"><span class="readout-label">Mission</span><strong id="missionStatus">Awaiting drop</strong></div>
      </div>

      <div class="board-wrap"><div id="board" class="board" role="grid" aria-label="Minesweeper board"></div></div>
      <div class="legend"><span><i class="legend-square safe"></i> Unmarked terrain</span><span><i class="legend-square flag">⚑</i> Flagged hazard</span><span><i class="legend-number">3</i> Adjacent hazards</span></div>
    </section>

    <footer><span>PROTOCOL MS-09</span><span>© FIELD SYSTEMS</span><span id="bestScore">Best: --</span></footer>
  </div>
`

const boardElement = document.querySelector('#board')
const mineCountElement = document.querySelector('#mineCount')
const timerElement = document.querySelector('#timer')
const missionStatusElement = document.querySelector('#missionStatus')
const statusTextElement = document.querySelector('#statusText')
const bestScoreElement = document.querySelector('#bestScore')

function createBoard() {
  const config = DIFFICULTIES[difficulty]
  board = Array.from({ length: config.rows * config.columns }, (_, index) => ({
    index, mine: false, revealed: false, flagged: false, adjacent: 0,
  }))
  const mineIndexes = new Set()
  while (mineIndexes.size < config.mines) mineIndexes.add(Math.floor(Math.random() * board.length))
  mineIndexes.forEach((index) => { board[index].mine = true })
  board.forEach((cell) => { cell.adjacent = neighbors(cell.index).filter((neighbor) => board[neighbor].mine).length })
  gameState = 'ready'
  elapsed = 0
  clearInterval(timerId)
  render()
}

function neighbors(index) {
  const { columns } = DIFFICULTIES[difficulty]
  const row = Math.floor(index / columns)
  const column = index % columns
  const result = []
  for (let rowOffset = -1; rowOffset <= 1; rowOffset += 1) {
    for (let columnOffset = -1; columnOffset <= 1; columnOffset += 1) {
      if (rowOffset === 0 && columnOffset === 0) continue
      const nextRow = row + rowOffset
      const nextColumn = column + columnOffset
      if (nextRow >= 0 && nextRow < DIFFICULTIES[difficulty].rows && nextColumn >= 0 && nextColumn < columns) result.push(nextRow * columns + nextColumn)
    }
  }
  return result
}

function reveal(index) {
  const cell = board[index]
  if (gameState === 'won' || gameState === 'lost' || cell.revealed || cell.flagged) return
  if (gameState === 'ready') startTimer()
  cell.revealed = true
  if (cell.mine) return loseGame()
  if (cell.adjacent === 0) neighbors(index).forEach(reveal)
  if (board.filter((item) => !item.mine && !item.revealed).length === 0) winGame()
  render()
}

function toggleFlag(index) {
  if (gameState === 'won' || gameState === 'lost' || board[index].revealed) return
  if (gameState === 'ready') startTimer()
  board[index].flagged = !board[index].flagged
  render()
}

function startTimer() {
  gameState = 'playing'
  startedAt = Date.now()
  timerId = setInterval(() => { elapsed = Math.floor((Date.now() - startedAt) / 1000); timerElement.textContent = String(elapsed).padStart(3, '0') }, 1000)
}

function loseGame() {
  gameState = 'lost'
  clearInterval(timerId)
  board.filter((cell) => cell.mine).forEach((cell) => { cell.revealed = true })
  render()
}

function winGame() {
  gameState = 'won'
  clearInterval(timerId)
  board.forEach((cell) => { if (cell.mine) cell.flagged = true })
  const bestKey = `minesweeper-best-${difficulty}`
  const best = Number(localStorage.getItem(bestKey))
  if (!best || elapsed < best) localStorage.setItem(bestKey, elapsed)
  render()
}

function render() {
  const config = DIFFICULTIES[difficulty]
  boardElement.style.setProperty('--columns', config.columns)
  boardElement.innerHTML = ''
  board.forEach((cell) => {
    const button = document.createElement('button')
    button.className = `cell ${cell.revealed ? 'revealed' : ''} ${cell.flagged ? 'flagged' : ''} ${cell.mine && cell.revealed ? 'mine' : ''}`
    button.setAttribute('role', 'gridcell')
    button.setAttribute('aria-label', cell.flagged ? 'Flagged square' : cell.revealed ? `${cell.adjacent} adjacent mines` : 'Covered square')
    if (cell.revealed && !cell.mine && cell.adjacent) { button.textContent = cell.adjacent; button.dataset.number = cell.adjacent }
    if (cell.flagged) button.textContent = '⚑'
    if (cell.mine && cell.revealed) button.textContent = '✹'
    button.addEventListener('click', () => reveal(cell.index))
    button.addEventListener('contextmenu', (event) => { event.preventDefault(); toggleFlag(cell.index) })
    boardElement.appendChild(button)
  })
  const flags = board.filter((cell) => cell.flagged).length
  mineCountElement.textContent = String(config.mines - flags).padStart(3, '0')
  const messages = { ready: ['System ready', 'Awaiting drop'], playing: ['Field active', 'In progress'], won: ['Field cleared', 'Mission complete'], lost: ['Contact lost', 'Detonation'] }
  statusTextElement.textContent = messages[gameState][0]
  missionStatusElement.textContent = messages[gameState][1]
  const best = localStorage.getItem(`minesweeper-best-${difficulty}`)
  bestScoreElement.textContent = best ? `Best: ${String(best).padStart(3, '0')} sec` : 'Best: --'
}

document.querySelectorAll('[data-difficulty]').forEach((button) => button.addEventListener('click', () => { difficulty = button.dataset.difficulty; document.querySelectorAll('[data-difficulty]').forEach((item) => item.classList.toggle('active', item === button)); createBoard() }))
document.querySelector('#resetButton').addEventListener('click', createBoard)
createBoard()
