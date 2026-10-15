/**
 * game.js — Lógica principal del Ahorcado
 */

// ===================================================================
// ESTADO GLOBAL
// ===================================================================
const State = {
  // Jugador
  player: { name: '', avatar: '🧑', totalScore: 0 },

  // Configuración de partida
  config: { level: 'easy', mode: 'solo', category: 'general' },

  // Partida en curso
  game: {
    word:          '',
    hint:          '',
    guessed:       [],   // letras acertadas
    wrong:         [],   // letras fallidas
    maxMistakes:   6,
    startTime:     null,
    jokers:        { reveal: 2, eliminate: 1, hint: 1 },
    gameOver:      false,
    won:           false,
    usedHint:      false,
    score:         0,
    eliminated:    [],   // letras eliminadas por comodín
  },

  // VS máquina
  vs: {
    word:        '',
    hint:        '',
    guessed:     [],
    wrong:       [],
    attempts:    0,
    startTime:   null,
    gameOver:    false,
    won:         false,   // true = máquina ganó
  },

  // Historial
  history: [],
};

// ===================================================================
// UTILIDADES
// ===================================================================
const $ = id => document.getElementById(id);

function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  $(id).classList.add('active');
}

function formatTime(ms) {
  const s = Math.floor(ms / 1000);
  if (s < 60) return `${s}s`;
  return `${Math.floor(s / 60)}m ${s % 60}s`;
}

function normalize(str) {
  return str.toUpperCase()
    .replace(/[ÁÀÂÄ]/g, 'A')
    .replace(/[ÉÈÊË]/g, 'E')
    .replace(/[ÍÌÎÏ]/g, 'I')
    .replace(/[ÓÒÔÖ]/g, 'O')
    .replace(/[ÚÙÛÜ]/g, 'U')
    .replace(/Ñ/g, 'N');
}

function saveHistory() {
  try { localStorage.setItem('hangman_history', JSON.stringify(State.history)); } catch(e) {}
}

function loadHistory() {
  try {
    const raw = localStorage.getItem('hangman_history');
    if (raw) State.history = JSON.parse(raw);
  } catch(e) { State.history = []; }
}

// ===================================================================
// PUNTUACIÓN
// ===================================================================
function calcScore(level, mistakes, timeMs, usedJoker) {
  const levelBonus = { easy: 100, medium: 200, hard: 350 };
  const base = levelBonus[level] || 100;
  const mistakePenalty = mistakes * 15;
  const timeSec = Math.floor(timeMs / 1000);
  const timeBonus = Math.max(0, 60 - timeSec) * 2;
  const jokerPenalty = usedJoker ? 30 : 0;
  return Math.max(10, base - mistakePenalty + timeBonus - jokerPenalty);
}

// ===================================================================
// PANTALLA REGISTRO
// ===================================================================
function initRegister() {
  // Avatar selection
  document.querySelectorAll('.avatar-opt').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.avatar-opt').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      State.player.avatar = btn.dataset.val;
    });
  });

  $('btn-register').addEventListener('click', () => {
    const name = $('username').value.trim();
    if (!name) { $('username').focus(); $('username').classList.add('shake'); setTimeout(()=>$('username').classList.remove('shake'),400); return; }
    State.player.name = name;
    State.player.avatar = document.querySelector('.avatar-opt.selected')?.dataset.val || '🧑';
    State.player.totalScore = State.history.filter(h => h.player === name).reduce((s,h) => s + (h.score||0), 0);
    showMenu();
  });

  $('btn-view-scores').addEventListener('click', () => {
    State._scoresFrom = 'register';
    showScores();
  });

  $('username').addEventListener('keydown', e => {
    if (e.key === 'Enter') $('btn-register').click();
  });
}

// ===================================================================
// PANTALLA MENÚ
// ===================================================================
function showMenu() {
  updatePlayerBadge('player-info-menu');
  showScreen('screen-menu');
}

function updatePlayerBadge(containerId) {
  const el = $(containerId);
  if (!el) return;
  el.innerHTML = `
    <span class="p-avatar">${State.player.avatar}</span>
    <div>
      <div class="p-name">${State.player.name}</div>
      <div class="p-score">⭐ ${State.player.totalScore} puntos acumulados</div>
    </div>`;
}

function initMenu() {
  // Niveles
  document.querySelectorAll('.btn-level[data-level]').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.btn-level[data-level]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      State.config.level = btn.dataset.level;
    });
  });

  // Modos
  document.querySelectorAll('.mode-card').forEach(card => {
    card.addEventListener('click', () => {
      document.querySelectorAll('.mode-card').forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      State.config.mode = card.dataset.mode;
    });
  });
  $('mode-solo').classList.add('selected');

  // Categoría
  $('category-select').addEventListener('change', e => {
    State.config.category = e.target.value;
  });

  $('btn-start-game').addEventListener('click', () => {
    if (State.config.mode === 'vs') {
      showScreen('screen-vs-input');
    } else {
      startSoloGame();
    }
  });

  $('btn-back-register').addEventListener('click', () => showScreen('screen-register'));
}

// ===================================================================
// MODO VS — INGRESAR PALABRA
// ===================================================================
function initVsInput() {
  $('btn-vs-start').addEventListener('click', () => {
    const raw = $('vs-word-input').value.trim().toUpperCase();
    const normalized = normalize(raw);
    const err = $('vs-word-error');

    if (!normalized || normalized.length < 3) {
      err.textContent = 'La palabra debe tener al menos 3 letras.'; return;
    }
    if (/[^A-Z]/.test(normalized)) {
      err.textContent = 'Usa solo letras del abecedario, sin tildes ni símbolos.'; return;
    }

    err.textContent = '';
    State.vs.word = normalized;
    State.vs.hint = $('vs-hint-input').value.trim() || '';
    $('vs-word-input').value = '';
    $('vs-hint-input').value = '';
    startVsMachineGame();
  });

  $('btn-vs-back').addEventListener('click', () => showMenu());

  $('vs-word-input').addEventListener('keydown', e => {
    if (e.key === 'Enter') $('btn-vs-start').click();
  });
}

// ===================================================================
// JUEGO — SOLO (usuario adivina)
// ===================================================================
function startSoloGame() {
  const { level, category } = State.config;
  const usedWords = State.history.map(h => h.word);
  const { word, hint } = getRandomWord(category, level, usedWords);

  State.game = {
    word,
    hint,
    guessed:    [],
    wrong:      [],
    maxMistakes: 6,
    startTime:  Date.now(),
    jokers:     { reveal: 2, eliminate: 1, hint: 1 },
    gameOver:   false,
    won:        false,
    usedHint:   false,
    score:      0,
    eliminated: [],
  };

  renderGame();
  showScreen('screen-game');
}

function renderGame() {
  const g = State.game;
  const { level, category } = State.config;

  // Badge jugador
  $('game-player-badge').innerHTML = `${State.player.avatar} <strong>${State.player.name}</strong>`;

  // Stats
  $('stat-score').textContent = `⭐ ${g.score}`;
  $('stat-level').textContent = { easy:'🟢 Fácil', medium:'🟡 Medio', hard:'🔴 Difícil' }[level];
  const catLabels = { general:'🌐 General', animals:'🐾 Animales', countries:'🌍 Países', fruits:'🍎 Frutas', tech:'💻 Tecnología' };
  $('stat-category').textContent = catLabels[category] || category;

  // Categoría
  $('word-category-label').textContent = catLabels[category] + ' · ' + g.word.length + ' letras';

  // Hint box
  if (g.usedHint && g.hint) {
    $('hint-box').classList.remove('hidden');
    $('hint-text').textContent = g.hint;
  } else {
    $('hint-box').classList.add('hidden');
  }

  // Palabra
  renderWordDisplay();

  // Letras incorrectas
  renderWrongLetters();

  // Vidas (corazones)
  renderHearts();

  // Ahorcado SVG
  renderHangman(g.wrong.length);

  // Comodines
  updateJokerButtons();

  // Teclado
  renderKeyboard();
}

function renderWordDisplay() {
  const g = State.game;
  const container = $('word-display');
  container.innerHTML = '';

  g.word.split('').forEach(ch => {
    const box = document.createElement('div');
    box.className = 'letter-box';

    const charEl = document.createElement('div');
    charEl.className = 'letter-char';

    if (ch === ' ') {
      box.classList.add('space');
      charEl.textContent = '';
    } else if (g.guessed.includes(ch)) {
      charEl.textContent = ch;
      charEl.classList.add('revealed');
    } else {
      charEl.textContent = '';
    }

    const line = document.createElement('div');
    line.className = 'letter-line';

    box.appendChild(charEl);
    box.appendChild(line);
    container.appendChild(box);
  });
}

function renderWrongLetters() {
  const container = $('wrong-letters');
  container.innerHTML = '';
  State.game.wrong.forEach(ch => {
    const span = document.createElement('span');
    span.className = 'wrong-letter';
    span.textContent = ch;
    container.appendChild(span);
  });
}

function renderHearts() {
  const row = $('hearts-row');
  row.innerHTML = '';
  for (let i = 0; i < State.game.maxMistakes; i++) {
    const heart = document.createElement('span');
    heart.className = 'heart' + (i < State.game.wrong.length ? ' lost' : '');
    heart.textContent = i < State.game.wrong.length ? '🖤' : '❤️';
    row.appendChild(heart);
  }
}

const BODY_PARTS = ['h-head','h-body','h-arm-l','h-arm-r','h-leg-l','h-leg-r'];

function renderHangman(mistakes) {
  BODY_PARTS.forEach((id, idx) => {
    const el = $(id);
    if (!el) return;
    if (idx < mistakes) {
      el.classList.remove('hidden');
      el.classList.add('visible');
    } else {
      el.classList.remove('visible');
      el.classList.add('hidden');
    }
  });
  // Cara triste solo cuando pierde
  const face = $('h-face');
  if (face) {
    if (mistakes >= 6 && State.game.gameOver && !State.game.won) {
      face.classList.remove('hidden'); face.classList.add('visible');
    } else {
      face.classList.remove('visible'); face.classList.add('hidden');
    }
  }
}

function updateJokerButtons() {
  const j = State.game.jokers;
  const disabled = State.game.gameOver;

  const setBtnState = (btn, count) => {
    btn.disabled = (count <= 0 || disabled);
    btn.querySelector('.joker-count').textContent = count;
  };

  setBtnState($('joker-reveal'),    j.reveal);
  setBtnState($('joker-eliminate'), j.eliminate);
  setBtnState($('joker-hint'),      j.hint);
}

function renderKeyboard() {
  const container = $('keyboard');
  container.innerHTML = '';
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  letters.forEach(letter => {
    const btn = document.createElement('button');
    btn.className = 'key-btn';
    btn.textContent = letter;
    btn.dataset.letter = letter;

    if (State.game.guessed.includes(letter)) {
      btn.classList.add('correct'); btn.disabled = true;
    } else if (State.game.wrong.includes(letter)) {
      btn.classList.add('wrong'); btn.disabled = true;
    } else if (State.game.eliminated.includes(letter)) {
      btn.classList.add('wrong'); btn.disabled = true; btn.style.opacity = '0.2';
    } else if (State.game.gameOver) {
      btn.disabled = true;
    } else {
      btn.addEventListener('click', () => handleGuess(letter));
    }

    container.appendChild(btn);
  });
}

function handleGuess(letter) {
  const g = State.game;
  if (g.gameOver) return;
  if (g.guessed.includes(letter) || g.wrong.includes(letter)) return;

  const normalizedWord = normalize(g.word);

  if (normalizedWord.includes(letter)) {
    // Correcto — revela todas las ocurrencias
    g.word.split('').forEach((ch, idx) => {
      if (normalize(ch) === letter) {
        if (!g.guessed.includes(ch)) g.guessed.push(ch);
      }
    });
    // También agregar la letra normalizada si difiere
    if (!g.guessed.includes(letter)) g.guessed.push(letter);
  } else {
    g.wrong.push(letter);
  }

  checkGameOver();
  renderGame();
}

function checkGameOver() {
  const g = State.game;
  const normalizedWord = normalize(g.word);

  // ¿Ganó? Todas las letras de la palabra están en guessed
  const won = normalizedWord.split('').every(ch => ch === ' ' || g.guessed.includes(ch));

  if (won) {
    g.gameOver = true;
    g.won = true;
    g.score = calcScore(State.config.level, g.wrong.length, Date.now() - g.startTime, g.jokers.reveal < 2 || g.jokers.eliminate < 1 || g.usedHint);
    State.player.totalScore += g.score;
    saveGameResult();
    setTimeout(showSoloResult, 600);
  } else if (g.wrong.length >= g.maxMistakes) {
    g.gameOver = true;
    g.won = false;
    g.score = 0;
    saveGameResult();
    setTimeout(showSoloResult, 600);
  }
}

function saveGameResult() {
  const g = State.game;
  const entry = {
    player:   State.player.name,
    avatar:   State.player.avatar,
    word:     g.word,
    level:    State.config.level,
    category: State.config.category,
    score:    g.score,
    errors:   g.wrong.length,
    time:     Date.now() - g.startTime,
    won:      g.won,
    date:     new Date().toLocaleDateString('es'),
  };
  State.history.unshift(entry);
  // Mantener máximo 200 entradas
  if (State.history.length > 200) State.history.length = 200;
  saveHistory();
}

// ===================================================================
// COMODINES
// ===================================================================
function initJokers() {
  $('joker-reveal').addEventListener('click', () => {
    const g = State.game;
    if (g.jokers.reveal <= 0 || g.gameOver) return;
    const normalizedWord = normalize(g.word);
    const hidden = normalizedWord.split('').filter((ch, idx) =>
      ch !== ' ' && !g.guessed.includes(ch) && !g.guessed.includes(g.word[idx])
    );
    if (hidden.length === 0) return;
    const pick = hidden[Math.floor(Math.random() * hidden.length)];
    g.jokers.reveal--;
    handleGuess(pick);
  });

  $('joker-eliminate').addEventListener('click', () => {
    const g = State.game;
    if (g.jokers.eliminate <= 0 || g.gameOver) return;
    const normalizedWord = normalize(g.word);
    // Letras del abecedario que no están en la palabra y no han sido usadas
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    const available = alphabet.filter(ch =>
      !normalizedWord.includes(ch) &&
      !g.wrong.includes(ch) &&
      !g.guessed.includes(ch) &&
      !g.eliminated.includes(ch)
    );
    // Eliminar hasta 3 letras
    const toEliminate = available.sort(() => Math.random() - 0.5).slice(0, 3);
    g.eliminated.push(...toEliminate);
    g.jokers.eliminate--;
    renderGame();
  });

  $('joker-hint').addEventListener('click', () => {
    const g = State.game;
    if (g.jokers.hint <= 0 || g.gameOver || g.usedHint) return;
    g.usedHint = true;
    g.jokers.hint--;
    $('hint-box').classList.remove('hidden');
    $('hint-text').textContent = g.hint || 'Sin pista disponible para esta palabra.';
    updateJokerButtons();
  });
}

// ===================================================================
// MOSTRAR RESULTADO SOLO
// ===================================================================
function showSoloResult() {
  const g = State.game;
  const timeMs = Date.now() - g.startTime;
  const levelLabels = { easy:'Fácil', medium:'Medio', hard:'Difícil' };

  renderHangman(g.wrong.length);

  $('result-emoji').textContent = g.won ? '🎉' : '💀';
  $('result-title').className = g.won ? 'win' : 'lose';
  $('result-title').textContent = g.won ? '¡Ganaste!' : 'Game Over';
  $('result-word').textContent = g.word;
  $('r-points').textContent   = g.score;
  $('r-errors').textContent   = `${g.wrong.length} / ${g.maxMistakes}`;
  $('r-time').textContent     = formatTime(timeMs);
  $('r-level').textContent    = levelLabels[State.config.level] || State.config.level;

  showScreen('screen-result');
}

// ===================================================================
// MODO VS MÁQUINA (la máquina adivina)
// ===================================================================

// Frecuencia de letras en español
const LETTER_FREQ = 'EAOSIRNTLDMCUPBGVFHJQYZXKW'.split('');

function startVsMachineGame() {
  State.vs = {
    word:      State.vs.word,
    hint:      State.vs.hint,
    guessed:   [],
    wrong:     [],
    attempts:  0,
    startTime: Date.now(),
    gameOver:  false,
    won:       false,
    letterQueue: [...LETTER_FREQ],
  };

  // Reutilizamos la pantalla del juego pero en modo VS
  State.config._vsMode = true;

  renderVsGame();
  showScreen('screen-game');
  scheduleVsMove();
}

function renderVsGame() {
  const vs = State.vs;
  $('game-player-badge').innerHTML = `🤖 <strong>Máquina adivina</strong>`;
  $('stat-score').textContent = `🔤 ${vs.attempts} intentos`;
  $('stat-level').textContent = '🆚 VS Máquina';
  $('stat-category').textContent = '';
  $('word-category-label').textContent = vs.hint ? `Pista: ${vs.hint}` : `${vs.word.length} letras`;

  if (vs.hint) {
    $('hint-box').classList.remove('hidden');
    $('hint-text').textContent = vs.hint;
  } else {
    $('hint-box').classList.add('hidden');
  }

  // Palabra (la máquina ve los mismos blancos que el usuario vería)
  const container = $('word-display');
  container.innerHTML = '';
  vs.word.split('').forEach(ch => {
    const box = document.createElement('div');
    box.className = 'letter-box';
    const charEl = document.createElement('div');
    charEl.className = 'letter-char';
    charEl.textContent = vs.guessed.includes(normalize(ch)) ? ch : (ch === ' ' ? '' : '');
    const line = document.createElement('div');
    line.className = 'letter-line';
    box.appendChild(charEl);
    box.appendChild(line);
    container.appendChild(box);
  });

  renderWrongLettersVs();
  renderHeartsVs();
  renderHangman(vs.wrong.length);
  renderKeyboardVs();

  // Deshabilitar comodines en modo VS
  $('joker-reveal').disabled = true;
  $('joker-eliminate').disabled = true;
  $('joker-hint').disabled = true;

  $('btn-give-up').style.display = 'none';
}

function renderWrongLettersVs() {
  const container = $('wrong-letters');
  container.innerHTML = '';
  State.vs.wrong.forEach(ch => {
    const span = document.createElement('span');
    span.className = 'wrong-letter';
    span.textContent = ch;
    container.appendChild(span);
  });
}

function renderHeartsVs() {
  const row = $('hearts-row');
  row.innerHTML = '';
  for (let i = 0; i < 6; i++) {
    const heart = document.createElement('span');
    heart.className = 'heart' + (i < State.vs.wrong.length ? ' lost' : '');
    heart.textContent = i < State.vs.wrong.length ? '🖤' : '❤️';
    row.appendChild(heart);
  }
}

function renderKeyboardVs() {
  const container = $('keyboard');
  container.innerHTML = '';
  'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').forEach(letter => {
    const btn = document.createElement('button');
    btn.className = 'key-btn';
    btn.textContent = letter;
    btn.disabled = true;

    if (State.vs.guessed.includes(letter)) {
      btn.classList.add('correct');
    } else if (State.vs.wrong.includes(letter)) {
      btn.classList.add('wrong');
    }
    container.appendChild(btn);
  });
}

function scheduleVsMove() {
  if (State.vs.gameOver) return;
  const delay = 800 + Math.random() * 600; // 0.8–1.4 segundos
  setTimeout(vsMachineGuess, delay);
}

function vsMachineGuess() {
  const vs = State.vs;
  if (vs.gameOver) return;

  // Elegir siguiente letra de la cola de frecuencia
  let letter = null;
  while (vs.letterQueue.length > 0) {
    const candidate = vs.letterQueue.shift();
    if (!vs.guessed.includes(candidate) && !vs.wrong.includes(candidate)) {
      letter = candidate;
      break;
    }
  }

  if (!letter) {
    // Fallback: letras restantes
    const remaining = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')
      .filter(l => !vs.guessed.includes(l) && !vs.wrong.includes(l));
    if (remaining.length === 0) { endVsGame(false); return; }
    letter = remaining[0];
  }

  vs.attempts++;
  const normalizedWord = normalize(vs.word);

  if (normalizedWord.includes(letter)) {
    if (!vs.guessed.includes(letter)) vs.guessed.push(letter);
  } else {
    if (!vs.wrong.includes(letter)) vs.wrong.push(letter);
  }

  renderVsGame();

  // ¿Ganó la máquina?
  const machineWon = normalizedWord.split('').every(ch => vs.guessed.includes(ch));
  if (machineWon) {
    vs.gameOver = true;
    vs.won = true;
    setTimeout(() => showVsResult(), 800);
    return;
  }

  if (vs.wrong.length >= 6) {
    endVsGame(false);
    return;
  }

  scheduleVsMove();
}

function endVsGame(machineWon) {
  State.vs.gameOver = true;
  State.vs.won = machineWon;
  setTimeout(showVsResult, 600);
}

function showVsResult() {
  const vs = State.vs;
  const timeMs = Date.now() - vs.startTime;

  $('vs-result-emoji').textContent  = vs.won ? '🤖' : '🎉';
  const title = $('vs-result-title');
  title.className = vs.won ? 'lose' : 'win';
  title.textContent = vs.won ? '¡La máquina ganó!' : '¡La máquina falló!';
  $('vs-result-word').textContent   = vs.word;
  $('vs-r-attempts').textContent    = vs.attempts;
  $('vs-r-errors').textContent      = `${vs.wrong.length} / 6`;
  $('vs-r-time').textContent        = formatTime(timeMs);

  State.config._vsMode = false;
  showScreen('screen-vs-result');
}

// ===================================================================
// PANTALLA HISTORIAL
// ===================================================================
function showScores() {
  renderScoresTable('all');
  showScreen('screen-scores');
}

function renderScoresTable(filter) {
  const tbody = $('scores-tbody');
  const empty = $('scores-empty');
  tbody.innerHTML = '';

  let data = [...State.history].filter(h => h.won);
  if (filter !== 'all') data = data.filter(h => h.level === filter);
  data.sort((a, b) => b.score - a.score);
  data = data.slice(0, 50);

  if (data.length === 0) {
    empty.style.display = 'block';
    return;
  }
  empty.style.display = 'none';

  const levelLabels = { easy:'🟢 Fácil', medium:'🟡 Medio', hard:'🔴 Difícil' };
  data.forEach((entry, idx) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${idx + 1}</td>
      <td>${entry.avatar || '🧑'} ${entry.player}</td>
      <td>${entry.word}</td>
      <td>${levelLabels[entry.level] || entry.level}</td>
      <td><strong>${entry.score}</strong></td>
      <td>${entry.errors}</td>
      <td>${formatTime(entry.time)}</td>`;
    tbody.appendChild(tr);
  });
}

function initScores() {
  document.querySelectorAll('.btn-level[data-filter]').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.btn-level[data-filter]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderScoresTable(btn.dataset.filter);
    });
  });

  $('btn-scores-back').addEventListener('click', () => {
    if (State._scoresFrom === 'register') showScreen('screen-register');
    else showMenu();
  });

  $('btn-download-scores').addEventListener('click', downloadScores);
}

// ===================================================================
// DESCARGAR RESULTADOS
// ===================================================================
function downloadSingleResult() {
  const g = State.game;
  const timeMs = Date.now() - g.startTime;
  const levelLabels = { easy:'Fácil', medium:'Medio', hard:'Difícil' };
  const catLabels = { general:'General', animals:'Animales', countries:'Países', fruits:'Frutas', tech:'Tecnología' };

  const content = [
    '==============================================',
    '       EL AHORCADO — RESULTADO DE PARTIDA',
    '==============================================',
    '',
    `Jugador   : ${State.player.name} ${State.player.avatar}`,
    `Fecha     : ${new Date().toLocaleString('es')}`,
    '',
    '--- CONFIGURACIÓN ---',
    `Nivel     : ${levelLabels[State.config.level] || State.config.level}`,
    `Categoría : ${catLabels[State.config.category] || State.config.category}`,
    '',
    '--- RESULTADO ---',
    `Resultado : ${g.won ? '¡GANASTE! 🎉' : 'PERDISTE 💀'}`,
    `Palabra   : ${g.word}`,
    `Pista     : ${g.hint || 'N/A'}`,
    '',
    '--- ESTADÍSTICAS ---',
    `Puntuación  : ${g.score} pts`,
    `Errores     : ${g.wrong.length} / ${g.maxMistakes}`,
    `Tiempo      : ${formatTime(timeMs)}`,
    `Letras err. : ${g.wrong.join(', ') || 'Ninguna'}`,
    '',
    '==============================================',
    '   ¡Gracias por jugar El Ahorcado!',
    '==============================================',
  ].join('\n');

  downloadText(content, `ahorcado_resultado_${State.player.name}_${Date.now()}.txt`);
}

function downloadScores() {
  const data = [...State.history].filter(h => h.won).sort((a, b) => b.score - a.score).slice(0, 50);
  const levelLabels = { easy:'Fácil', medium:'Medio', hard:'Difícil' };

  const lines = [
    '==============================================',
    '      EL AHORCADO — HISTORIAL DE MEJORES JUGADORES',
    '==============================================',
    `Generado: ${new Date().toLocaleString('es')}`,
    '',
    `${'#'.padEnd(4)}${'Jugador'.padEnd(18)}${'Palabra'.padEnd(16)}${'Nivel'.padEnd(10)}${'Puntos'.padEnd(8)}${'Errores'.padEnd(9)}${'Tiempo'}`,
    '-'.repeat(70),
  ];

  data.forEach((e, idx) => {
    lines.push(
      `${String(idx+1).padEnd(4)}${(e.player).padEnd(18)}${e.word.padEnd(16)}${(levelLabels[e.level]||e.level).padEnd(10)}${String(e.score).padEnd(8)}${String(e.errors).padEnd(9)}${formatTime(e.time)}`
    );
  });

  lines.push('', '==============================================');
  downloadText(lines.join('\n'), `ahorcado_historial_${Date.now()}.txt`);
}

function downloadText(content, filename) {
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// ===================================================================
// TECLADO FÍSICO
// ===================================================================
function initKeyboardInput() {
  document.addEventListener('keydown', e => {
    const screen = document.querySelector('.screen.active');
    if (!screen) return;
    const screenId = screen.id;

    if (screenId === 'screen-game' && !State.config._vsMode) {
      const letter = e.key.toUpperCase();
      if (/^[A-Z]$/.test(letter) && !State.game.gameOver) {
        handleGuess(letter);
      }
    }
  });
}

// ===================================================================
// ACCIONES EN PARTIDA
// ===================================================================
function initGameActions() {
  $('btn-give-up').addEventListener('click', () => {
    if (State.game.gameOver) return;
    State.game.gameOver = true;
    State.game.won = false;
    State.game.score = 0;
    // Revelar todas las letras
    State.game.guessed = [...new Set(normalize(State.game.word).split('').filter(c => c !== ' '))];
    saveGameResult();
    renderGame();
    setTimeout(showSoloResult, 400);
  });

  $('btn-menu').addEventListener('click', () => {
    State.config._vsMode = false;
    showMenu();
  });
}

// ===================================================================
// ACCIONES EN RESULTADO
// ===================================================================
function initResultActions() {
  $('btn-play-again').addEventListener('click', () => {
    startSoloGame();
  });

  $('btn-download-result').addEventListener('click', downloadSingleResult);

  $('btn-result-menu').addEventListener('click', () => showMenu());

  // VS result
  $('btn-vs-play-again').addEventListener('click', () => {
    showScreen('screen-vs-input');
  });

  $('btn-vs-result-menu').addEventListener('click', () => showMenu());
}

// ===================================================================
// AYUDA
// ===================================================================
function initHelp() {
  $('btn-help-float').addEventListener('click', () => {
    $('modal-help').classList.remove('hidden');
  });
  $('btn-close-help').addEventListener('click', () => {
    $('modal-help').classList.add('hidden');
  });
  $('modal-help').addEventListener('click', e => {
    if (e.target === $('modal-help')) $('modal-help').classList.add('hidden');
  });
}

// ===================================================================
// INICIALIZACIÓN
// ===================================================================
function init() {
  loadHistory();
  initRegister();
  initMenu();
  initVsInput();
  initJokers();
  initScores();
  initResultActions();
  initGameActions();
  initHelp();
  initKeyboardInput();

  // Pantalla inicial
  showScreen('screen-register');
}

document.addEventListener('DOMContentLoaded', init);
