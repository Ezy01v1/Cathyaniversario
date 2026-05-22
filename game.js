/* ═══════════════════════════════════════════════
   HEARTQUEST — game.js
   Juego: Ahorcado + Búsqueda del Tesoro
   ═══════════════════════════════════════════════ */
 
// ─────────────────────────────────────────────
// 🎯 DATOS DEL JUEGO — Personaliza aquí
// ─────────────────────────────────────────────
const STATIONS = [
  {
    id: 1,
    word: "ENAMORADO",
    clue: "¿Cómo te sientes cuando estás con ella? 💕",
    reward: {
      title: "¡Primer corazón desbloqueado! 💖",
      emoji: "💝",
      message: "¡Lo lograste! El amor empieza con una sola palabra...\nY tú la encontraste perfectamente. 🌙",
      gpsCoords: "14.1001° N, 87.2069° W",
      mapsUrl: "https://www.google.com/maps?q=14.1001,-87.2069",
      photoDesc: "📸 Busca el lugar donde todo comenzó... el café de la esquina.",
      // photoUrl: "foto1.jpg",
    },
  },
  {
    id: 2,
    word: "MARIPOSAS",
    clue: "¿Qué sientes en el estómago cada vez que la ves? 🦋",
    reward: {
      title: "¡Segundo corazón desbloqueado! 💗",
      emoji: "🦋",
      message: "Las mariposas nunca desaparecen... solo se vuelven más bonitas con el tiempo. ✨",
      gpsCoords: "14.1020° N, 87.2050° W",
      mapsUrl: "https://www.google.com/maps?q=14.1020,-87.2050",
      photoDesc: "📸 Ve al lugar donde tuvieron su primera foto juntos.",
      // photoUrl: "foto2.jpg",
    },
  },
  {
    id: 3,
    word: "INFINITO",
    clue: "¿Cuánto tiempo quieres estar con ella? ∞",
    reward: {
      title: "¡Tercer corazón desbloqueado! 💓",
      emoji: "∞",
      message: "Infinito. Eso es todo el tiempo que merece alguien tan especial como ella. 🌟",
      gpsCoords: "14.1050° N, 87.2030° W",
      mapsUrl: "https://www.google.com/maps?q=14.1050,-87.2030",
      photoDesc: "📸 Dirígete al lugar favorito de los dos para ver atardeceres.",
      // photoUrl: "foto3.jpg",
    },
  },
  {
    id: 4,
    word: "ANIVERSARIO",
    clue: "¿Qué celebramos hoy con todo el corazón? 🎉",
    reward: {
      title: "¡TODOS LOS CORAZONES! 💞",
      emoji: "🎁",
      message: "¡Lo lograste! Un año increíble juntos, y esto es solo el comienzo.\n¡Feliz aniversario! 🥂",
      gpsCoords: "14.1080° N, 87.2010° W",
      mapsUrl: "https://www.google.com/maps?q=14.1080,-87.2010",
      photoDesc: "📸 ¡El destino final te espera con una sorpresa muy especial!",
      // photoUrl: "foto4.jpg",
    },
  },
];
 
// ─────────────────────────────────────────────
// Configuración
// ─────────────────────────────────────────────
const MAX_ERRORS = 15;
 
// ─────────────────────────────────────────────
// Estado
// ─────────────────────────────────────────────
let currentStation = 0;
let currentWord    = "";
let guessedLetters = new Set();
let errors         = 0;
let gameOver       = false;
 
// ─────────────────────────────────────────────
// Utilidad: cambiar pantalla
// ─────────────────────────────────────────────
function showScreen(id) {
  document.querySelectorAll(".screen").forEach(s => {
    s.classList.remove("active", "screen-enter");
  });
  const target = document.getElementById(id);
  target.classList.add("active");
  // forzar reflow para la animación
  void target.offsetWidth;
  target.classList.add("screen-enter");
  target.scrollTop = 0;
}
 
// ─────────────────────────────────────────────
// Corazones flotantes dinámicos
// ─────────────────────────────────────────────
function spawnHearts() {
  const container = document.getElementById("heartsBg");
  const symbols   = ["💕", "💖", "💗", "💓", "❤️", "🌸", "✨"];
 
  function addHeart() {
    const el = document.createElement("span");
    el.className = "floating-heart";
    el.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    el.style.left     = Math.random() * 100 + "vw";
    el.style.fontSize = (12 + Math.random() * 18) + "px";
    const dur = 6 + Math.random() * 8;
    el.style.animationDuration = dur + "s";
    el.style.animationDelay   = Math.random() * 2 + "s";
    container.appendChild(el);
    setTimeout(() => el.remove(), (dur + 3) * 1000);
  }
 
  for (let i = 0; i < 8; i++) setTimeout(addHeart, i * 500);
  setInterval(addHeart, 1300);
}
 
// ─────────────────────────────────────────────
// Canvas: ahorcado pixel-art rosado
// ─────────────────────────────────────────────
function drawHangman(errCount) {
  const canvas = document.getElementById("hangmanCanvas");
  const ctx    = canvas.getContext("2d");
 
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.imageSmoothingEnabled = false;
 
  const structureColor = "#81515a";   // clr-primary
  const ropeColor      = "#ffadc5";   // clr-pink-mid
  const bodyColor      = "#ff6b9d";   // clr-pink-hot
 
  function px(x, y, w, h, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
  }
 
  // Estructura
  px(10,  190, 180, 8,   structureColor); // base
  px(50,  24,  8,   166, structureColor); // poste
  px(50,  24,  90,  8,   structureColor); // viga
  px(132, 24,  6,   30,  ropeColor);      // cuerda
 
  // Error 1: Cabeza
  if (errCount >= 1) {
    for (let dy = 0; dy < 28; dy++) {
      for (let dx = 0; dx < 28; dx++) {
        const cx = dx - 14, cy = dy - 14;
        const d2 = cx * cx + cy * cy;
        if (d2 < 196 && d2 > 120) px(128 + dx - 14, 56 + dy, 4, 4, bodyColor);
      }
    }
    // Ojos
    px(124, 66, 6, 6, "#fff0f5");
    px(136, 66, 6, 6, "#fff0f5");
    // Boca triste
    px(126, 76, 12, 4, "#c9375e");
    px(122, 80, 4,  4, "#c9375e");
    px(138, 80, 4,  4, "#c9375e");
  }
 
  // Error 2: Cuerpo
  if (errCount >= 2) px(133, 84, 6, 44, bodyColor);
 
  // Error 3: Brazo izquierdo
  if (errCount >= 3) {
    ctx.save();
    ctx.translate(136, 94);
    ctx.rotate(-Math.PI / 5);
    px(-20, 0, 6, 34, bodyColor);
    ctx.restore();
  }
 
  // Error 4: Brazo derecho
  if (errCount >= 4) {
    ctx.save();
    ctx.translate(136, 94);
    ctx.rotate(Math.PI / 5);
    px(14, 0, 6, 34, bodyColor);
    ctx.restore();
  }
 
  // Error 5: Pierna izquierda
  if (errCount >= 5) {
    ctx.save();
    ctx.translate(136, 128);
    ctx.rotate(-Math.PI / 8);
    px(-10, 0, 6, 40, bodyColor);
    ctx.restore();
  }
 
  // Error 6: Pierna derecha
  if (errCount >= 6) {
    ctx.save();
    ctx.translate(136, 128);
    ctx.rotate(Math.PI / 8);
    px(4, 0, 6, 40, bodyColor);
    ctx.restore();
  }
 
  // Corazón pixel decorativo cuando no hay errores
  if (errCount === 0) drawPixelHeart(ctx, 90, 145, bodyColor, 5);
}
 
function drawPixelHeart(ctx, x, y, color, s) {
  ctx.fillStyle = color;
  const pattern = [
    "0110110",
    "1111111",
    "1111111",
    "0111110",
    "0011100",
    "0001000",
  ];
  pattern.forEach((row, ry) => {
    [...row].forEach((cell, rx) => {
      if (cell === "1") ctx.fillRect(x + rx * s, y + ry * s, s, s);
    });
  });
}
 
// ─────────────────────────────────────────────
// Renderizar vidas
// ─────────────────────────────────────────────
function renderLives() {
  const container = document.getElementById("livesDisplay");
  container.innerHTML = "";
  for (let i = 0; i < MAX_ERRORS; i++) {
    const span = document.createElement("span");
    span.className = "life-heart" + (i < errors ? " lost" : "");
    span.textContent = i < errors ? "🖤" : "❤️";
    container.appendChild(span);
  }
}
 
// ─────────────────────────────────────────────
// Renderizar word display
// ─────────────────────────────────────────────
function renderWordDisplay() {
  const container = document.getElementById("wordDisplay");
  container.innerHTML = "";
 
  [...currentWord].forEach(char => {
    const slot = document.createElement("div");
    if (char === " ") {
      slot.className = "letter-slot space";
    } else {
      slot.className = "letter-slot";
      if (guessedLetters.has(char)) {
        slot.textContent = char;
        slot.classList.add("revealed");
      }
    }
    container.appendChild(slot);
  });
}
 
// ─────────────────────────────────────────────
// Renderizar teclado
// ─────────────────────────────────────────────
function renderKeyboard() {
  const container = document.getElementById("keyboard");
  container.innerHTML = "";
 
  "ABCDEFGHIJKLMNÑOPQRSTUVWXYZ".split("").forEach(letter => {
    const btn = document.createElement("button");
    btn.className   = "key";
    btn.textContent = letter;
    btn.type        = "button";
 
    if (guessedLetters.has(letter)) {
      btn.disabled = true;
      btn.classList.add(currentWord.includes(letter) ? "correct" : "wrong");
    }
 
    btn.addEventListener("click", () => handleGuess(letter));
    container.appendChild(btn);
  });
}
 
// ─────────────────────────────────────────────
// Renderizar letras usadas
// ─────────────────────────────────────────────
function renderUsedLetters() {
  const el = document.getElementById("usedLetters");
  el.textContent = [...guessedLetters].join("  ") || "★ ★ ★";
}
 
// ─────────────────────────────────────────────
// Verificar victoria
// ─────────────────────────────────────────────
function checkWin() {
  return [...currentWord].every(c => c === " " || guessedLetters.has(c));
}
 
// ─────────────────────────────────────────────
// Manejar letra
// ─────────────────────────────────────────────
function handleGuess(letter) {
  if (gameOver || guessedLetters.has(letter)) return;
 
  guessedLetters.add(letter);
 
  if (currentWord.includes(letter)) {
    renderWordDisplay();
    renderUsedLetters();
    renderKeyboard();
    if (checkWin()) {
      gameOver = true;
      setTimeout(showRewardScreen, 800);
    }
  } else {
    errors++;
    drawHangman(errors);
    renderLives();
    renderUsedLetters();
    renderKeyboard();
    if (errors >= MAX_ERRORS) {
      gameOver = true;
      setTimeout(showGameOver, 600);
    }
  }
}
 
// ─────────────────────────────────────────────
// Iniciar estación
// ─────────────────────────────────────────────
function startStation(index) {
  const station  = STATIONS[index];
  currentWord    = station.word.toUpperCase();
  guessedLetters = new Set();
  errors         = 0;
  gameOver       = false;
 
  document.getElementById("stationNumber").textContent  = station.id;
  document.getElementById("stationCurrent").textContent = station.id;
  document.getElementById("clueText").textContent       = station.clue;
 
  const statusEl = document.getElementById("statusMsg");
  statusEl.className = "status-msg hidden";
  statusEl.textContent = "";
 
  drawHangman(0);
  renderLives();
  renderWordDisplay();
  renderKeyboard();
  renderUsedLetters();
 
  showScreen("screenGame");
}
 
// ─────────────────────────────────────────────
// Pantalla de recompensa
// ─────────────────────────────────────────────
function showRewardScreen() {
  const { reward } = STATIONS[currentStation];
 
  document.getElementById("rewardTitle").textContent   = reward.title;
  document.getElementById("rewardEmoji").textContent   = reward.emoji;
  document.getElementById("rewardMessage").textContent = reward.message;
  document.getElementById("gpsCoords").textContent     = reward.gpsCoords;
  document.getElementById("btnMaps").href              = reward.mapsUrl;
  document.getElementById("photoDesc").textContent     = reward.photoDesc;
 
  // Foto (si existe)
  const photoFrame = document.getElementById("photoFrame");
  photoFrame.innerHTML = "";
  if (reward.photoUrl) {
    const img = document.createElement("img");
    img.src = reward.photoUrl;
    img.alt = "Pista visual";
    photoFrame.appendChild(img);
  } else {
    const icon = document.createElement("span");
    icon.className = "material-symbols-outlined photo-icon";
    icon.textContent = "photo_camera";
    photoFrame.appendChild(icon);
  }
 
  const btnNext = document.getElementById("btnNextStation");
  if (currentStation >= STATIONS.length - 1) {
    btnNext.innerHTML = `<span class="material-symbols-outlined icon-sm">celebration</span> VER SORPRESA FINAL`;
  } else {
    btnNext.innerHTML = `SIGUIENTE ESTACIÓN <span class="material-symbols-outlined icon-sm">arrow_forward</span>`;
  }
 
  showScreen("screenReward");
  launchConfetti();
}
 
// ─────────────────────────────────────────────
// Game Over
// ─────────────────────────────────────────────
function showGameOver() {
  document.getElementById("revealedWord").textContent = currentWord;
  const msgs = [
    "¡No te rindas! El amor también pide perseverancia. 💪",
    "Casi... ¡vuelve a intentarlo! 🌸",
    "¡El amor es paciente! Inténtalo de nuevo 💕",
  ];
  document.getElementById("gameoverMsg").textContent =
    msgs[Math.floor(Math.random() * msgs.length)];
  showScreen("screenGameOver");
}
 
// ─────────────────────────────────────────────
// Pantalla final
// ─────────────────────────────────────────────
function showFinalScreen() {
  document.getElementById("finalMessage").innerHTML =
    "¡Un año lleno de momentos increíbles!<br/>y muchos más por venir. 💕<br/>Eres la persona más especial de su vida. 🌟";
 
  document.getElementById("giftText").innerHTML =
    "¡Dirígete al restaurante donde tuvieron su primera cita!<br/>" +
    "Te espera una cena muy especial... 🥂✨";
 
  showScreen("screenFinal");
  launchHeartExplosion();
}
 
// ─────────────────────────────────────────────
// Animaciones de celebración
// ─────────────────────────────────────────────
function launchConfetti() {
  const emojis = ["💕","💖","✨","🌸","⭐","💗","🎉"];
  for (let i = 0; i < 28; i++) {
    setTimeout(() => {
      const el = document.createElement("span");
      el.style.cssText = [
        "position:fixed",
        `left:${Math.random() * 100}vw`,
        "top:-30px",
        `font-size:${14 + Math.random() * 18}px`,
        "pointer-events:none",
        "z-index:9999",
        `animation:confettiFall ${1.5 + Math.random() * 2}s ease-in forwards`,
      ].join(";");
      el.textContent = emojis[Math.floor(Math.random() * emojis.length)];
      document.body.appendChild(el);
      setTimeout(() => el.remove(), 4500);
    }, i * 80);
  }
}
 
function launchHeartExplosion() {
  const hearts = ["💕","💖","💗","❤️","🌸","⭐"];
  for (let i = 0; i < 45; i++) {
    setTimeout(() => {
      const el = document.createElement("span");
      const angle = Math.random() * 360;
      const dist  = 80 + Math.random() * 220;
      el.style.cssText = [
        "position:fixed",
        "left:50vw",
        "top:50vh",
        `font-size:${16 + Math.random() * 28}px`,
        "pointer-events:none",
        "z-index:9999",
        "transition:transform 1.5s ease-out,opacity 1.5s ease-out",
        "transform:translate(0,0) scale(1)",
        "opacity:1",
      ].join(";");
      el.textContent = hearts[Math.floor(Math.random() * hearts.length)];
      document.body.appendChild(el);
      setTimeout(() => {
        const rad = (angle * Math.PI) / 180;
        el.style.transform = `translate(${Math.cos(rad)*dist}px,${Math.sin(rad)*dist}px) scale(0)`;
        el.style.opacity = "0";
      }, 60);
      setTimeout(() => el.remove(), 2200);
    }, i * 55);
  }
}
 
// Inyectar keyframe confetti
const styleConfetti = document.createElement("style");
styleConfetti.textContent = `
  @keyframes confettiFall {
    from { transform:translateY(0) rotate(0deg); opacity:1; }
    to   { transform:translateY(115vh) rotate(720deg); opacity:0; }
  }
`;
document.head.appendChild(styleConfetti);

// ─────────────────────────────────────────────
// CARRUSEL DE MEMORIES
// ─────────────────────────────────────────────

const MEMORY_IMAGES = [
  { src: "acostados.jpeg",        label: "Juntos"       },
  { src: "ascensorSA.jpeg",       label: "San Pedro"    },
  { src: "colomoncawa.jpeg",       label: "Colomoncagua" },
  { src: "comiendo.jpeg",          label: "Rico"         },
  { src: "culumpio.jpeg",          label: "Columpio"     },
  { src: "deviajelentes.jpeg",     label: "De viaje"     },
  { src: "deviajelos2.jpeg",       label: "De viaje"     },
  { src: "dondeallan.jpeg",        label: "Donde Allan"  },
  { src: "en760.jpeg",             label: "En 760"       },
  { src: "en7602.jpeg",            label: "En 760"       },
  { src: "en7603.jpeg",            label: "En 760"       },
  { src: "en7604.jpeg",            label: "En 760"       },
  { src: "en7605.jpeg",            label: "En 760"       },
  { src: "en7606.jpeg",            label: "En 760"       },
  { src: "encasademaynor.jpeg",    label: "Casa Maynor"  },
  { src: "enconcierto.jpeg",       label: "Concierto"    },
  { src: "enfritesandgril2.jpeg",  label: "Frites"       },
  { src: "enfritesandgrils.jpeg",  label: "Frites"       },
  { src: "enhotelsa.jpeg",         label: "Hotel SA"     },
  { src: "ENsa.jpeg",              label: "San Pedro"    },
  { src: "esperandoSA.jpeg",       label: "Esperando"    },
  { src: "losjarros.jpeg",         label: "Los Jarros"   },
  { src: "playa1.jpeg",            label: "Playa"        },
  { src: "selfie2.jpeg",           label: "Selfie"       },
  { src: "selfie3.jpeg",           label: "Selfie"       },
  { src: "slefie.jpeg",            label: "Selfie"       },
  { src: "viendoterrenos.jpeg",    label: "Terrenos"     },
];

let shuffledImages = [...MEMORY_IMAGES].sort(() => Math.random() - 0.5);
let currentSlideIndex = 0;

// Construye la tira de película (hoyos)
function buildFilmStrip(el) {
  el.innerHTML = "";
  for (let i = 0; i < 14; i++) {
    if (i === 6) {
      const sp = document.createElement("div");
      sp.className = "film-spacer";
      el.appendChild(sp);
    }
    const hole = document.createElement("div");
    hole.className = "film-hole";
    el.appendChild(hole);
  }
}

// Inicializar carrusel
function initCarousel() {
  const track      = document.getElementById("carouselTrack");
  const indicators = document.getElementById("carouselIndicators");

  track.innerHTML      = "";
  indicators.innerHTML = "";

  buildFilmStrip(document.getElementById("filmTop"));
  buildFilmStrip(document.getElementById("filmBottom"));

  shuffledImages.forEach((item, idx) => {
    // Slide
    const slide = document.createElement("div");
    slide.className = "carousel-slide";

    const img = document.createElement("img");
    img.src = `img/${item.src}`;
    img.alt = item.label;
    img.onerror = function () {
      this.style.display = "none";
      const ph = document.createElement("div");
      ph.className = "slide-placeholder";
      ph.innerHTML = `<span class="slide-placeholder-icon">&#9829;</span><span>${item.label}</span>`;
      slide.appendChild(ph);
    };
    slide.appendChild(img);

    // Badge
    const badge = document.createElement("div");
    badge.className = "slide-badge";
    badge.textContent = item.label;
    slide.appendChild(badge);

    track.appendChild(slide);

    // Dot
    const dot = document.createElement("div");
    dot.className = "carousel-dot" + (idx === 0 ? " active" : "");
    dot.addEventListener("click", () => goToSlide(idx));
    indicators.appendChild(dot);
  });

  document.getElementById("totalSlides").textContent = shuffledImages.length;
  currentSlideIndex = 0;
  updateCarousel();

  // Swipe táctil
  const viewport = document.querySelector(".carousel-viewport");
  let touchStartX = 0;

  viewport.addEventListener("touchstart", (e) => {
    touchStartX = e.touches[0].clientX;
  }, { passive: true });

  viewport.addEventListener("touchend", (e) => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 40) {
      dx < 0 ? nextSlide() : prevSlide();
    }
  }, { passive: true });
}

// Actualizar posición y UI
function updateCarousel() {
  const track = document.getElementById("carouselTrack");
  track.style.transform = `translateX(${-currentSlideIndex * 100}%)`;

  document.querySelectorAll(".carousel-dot").forEach((dot, idx) => {
    dot.classList.toggle("active", idx === currentSlideIndex);
  });

  document.getElementById("currentSlide").textContent = currentSlideIndex + 1;
}

function goToSlide(idx) {
  currentSlideIndex = idx;
  updateCarousel();
}

function nextSlide() {
  currentSlideIndex = (currentSlideIndex + 1) % shuffledImages.length;
  updateCarousel();
}

function prevSlide() {
  currentSlideIndex = (currentSlideIndex - 1 + shuffledImages.length) % shuffledImages.length;
  updateCarousel();
}

// Event listeners de botones (igual que antes)
document.getElementById("btnNextSlide").addEventListener("click", nextSlide);
document.getElementById("btnPrevSlide").addEventListener("click", prevSlide);
 
// ─────────────────────────────────────────────
// Event Listeners
// ─────────────────────────────────────────────
 
// Teclado físico
document.addEventListener("keydown", e => {
  const letter = e.key.toUpperCase();
  if (/^[A-ZÑ]$/.test(letter)) handleGuess(letter);
});
 
// Botón START
document.getElementById("btnStart").addEventListener("click", () => {
  currentStation = 0;
  startStation(0);
});
 
// Botón SIGUIENTE ESTACIÓN
document.getElementById("btnNextStation").addEventListener("click", () => {
  currentStation++;
  if (currentStation >= STATIONS.length) showFinalScreen();
  else startStation(currentStation);
});
 
// Botón RETRY
document.getElementById("btnRetry").addEventListener("click", () => {
  startStation(currentStation);
});
 
// Botón RESTART
document.getElementById("btnRestart").addEventListener("click", () => {
  currentStation = 0;
  showScreen("screenIntro");
});

// Botones del carrusel
document.getElementById("btnPrevSlide").addEventListener("click", prevSlide);
document.getElementById("btnNextSlide").addEventListener("click", nextSlide);

// Bottom nav: Story y Memories
const bnav = document.querySelectorAll(".bnav-item");
bnav[0].addEventListener("click", () => {
  document.querySelectorAll(".bnav-item").forEach(b => b.classList.remove("bnav-item--active"));
  bnav[0].classList.add("bnav-item--active");
  showScreen("screenIntro");
});

bnav[1].addEventListener("click", () => {
  document.querySelectorAll(".bnav-item").forEach(b => b.classList.remove("bnav-item--active"));
  bnav[1].classList.add("bnav-item--active");
  showScreen("screenMemories");
  initCarousel();
});
 
// ─────────────────────────────────────────────
// INIT
// ─────────────────────────────────────────────
spawnHearts();
drawHangman(0);