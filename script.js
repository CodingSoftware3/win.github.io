const dom = {
  buildings: document.querySelector('.buildings'),
  player: document.querySelector('gorilla-player.player'),
  cpu: document.querySelector('gorilla-player.cpu'),
  start: document.querySelector('.start'),
  intro: document.querySelector('.intro'),
  screen: document.querySelector('.screen'),
  banana: document.querySelector('banana-missil'),
  sun: document.querySelector('.sun') };


const sounds = {
  hit: new Howl({ src: ['https://manzdev.github.io/cursos-assets/js/gorillas/armhit.mp3'] }),
  intro: new Howl({ src: ['https://manzdev.github.io/cursos-assets/js/gorillas/intro.mp3'] }),
  scream: new Howl({ src: ['https://manzdev.github.io/cursos-assets/js/goku-transform.mp3'] }),
  charging: new Howl({ src: ['https://manzdev.github.io/cursos-assets/js/charging.mp3'], loop: true }),
  event: new Howl({ src: ['https://manzdev.github.io/cursos-assets/js/gorillas/event.mp3?4'] }),
  explode: new Howl({ src: ['https://manzdev.github.io/cursos-assets/js/gorillas/explode.mp3'] }) };


const NUMBUILDINGS = 5 + ~~(Math.random() * 4);

const switchLight = win => {
  win.classList.toggle('on');
  win.classList.toggle('off');
  sounds.event.play();
};

for (let i = 0; i < NUMBUILDINGS; i++) {
  const div = document.createElement('div');
  for (let w = 0; w < 75; w++) {
    const win = document.createElement('div');
    const state = ~~(Math.random() * 2);
    win.className = `window ${['on', 'off'][state]}`;
    win.addEventListener('click', switchLight.bind(this, win));
    div.appendChild(win);
  }
  const type = 1 + ~~(Math.random() * 3);
  div.className = `building type${type}`;
  div.style.height = 100 + ~~(Math.random() * 300) + 'px';
  dom.buildings.appendChild(div);
}

const GorillaPlayer = class extends HTMLElement {
  constructor() {
    super();
    this.armsUp = false;
    this.innerHTML = `
      <div class="head">
        <div class="brows"></div>
      </div>
      <div class="body">
        <div class="left arm"></div>
        <div class="chest"></div>
        <div class="right arm"></div>
      </div>
      <div class="legs">
        <div class="left leg"></div>
        <div class="right leg"></div>
      </div>
`;
  }

  moveTo(x, y) {
    this.x = x;
    this.y = y;
    this.style.left = `${x}px`;
    this.style.top = `${y}px`;
  }

  placeAtBuilding(n = 2) {
    const building = document.querySelector(`.building:nth-child(${n})`);
    const coords = {
      x: building.offsetLeft + building.offsetWidth / 2 - 25,
      y: building.offsetTop - 51 };

    this.moveTo(coords.x, coords.y);
  }

  dance(n = 8, sound = true, speed = 400) {
    if (this.timer)
    clearInterval(this.timer);

    this.timer = setInterval(() => {
      this.armsUp = !this.armsUp;
      this.style.setProperty('--left-arm', `${this.armsUp ? -18 : 0}px`);
      this.style.setProperty('--right-arm', `${!this.armsUp ? -18 : 0}px`);
      if (sound)
      sounds.hit.play();
    }, speed);
    setTimeout(() => {
      clearInterval(this.timer);
      this.style.setProperty('--left-arm', 0);
      this.style.setProperty('--right-arm', 0);
      this.armsUp = false;
    }, speed * n);
  }};

customElements.define('gorilla-player', GorillaPlayer);

const BananaMissil = class extends HTMLElement {
  constructor() {
    super();
  }

  shoot(player) {
    this.hidden = false;
    this.enableRotate();
    this.x = player.x + 16;
    this.y = player.y - 32;
    this.moveTo(this.x, this.y);
    sounds.charging.play();
    player.classList.add('charging');

    setTimeout(() => {
      sounds.scream.play();
    }, 2000);

    setTimeout(() => {
      this.disableRotate();
      this.hidden = true;
      sounds.charging.pause();
      sounds.explode.play();
      player.classList.remove('charging');
    }, 5000);
  }

  moveTo(x, y) {
    this.style.top = `${this.y}px`;
    this.style.left = `${this.x}px`;
  }

  enableRotate() {this.classList.add('spin');}
  disableRotate() {this.classList.remove('spin');}};


customElements.define('banana-missil', BananaMissil);

// Phase 1
dom.start.addEventListener('click', () => {
  dom.start.hidden = true;
  dom.intro.hidden = false;
  dom.player.hidden = false;
  dom.cpu.hidden = false;

  dom.player.moveTo(450, 325);
  dom.cpu.moveTo(525, 325);

  dom.player.dance(8, false, 1400);
  dom.cpu.dance(8, false, 1400);
  sounds.intro.play();

  setTimeout(() => {
    dom.player.dance(8, false, 325);
    dom.cpu.dance(8, false, 325);
  }, 11200);

  // Phase 2
  setTimeout(() => {
    dom.intro.hidden = true;
    dom.screen.hidden = false;

    dom.player.placeAtBuilding(2);
    dom.cpu.placeAtBuilding(NUMBUILDINGS - 1);

    // Fun events
    dom.player.addEventListener('click', function () {this.dance();});
    dom.player.addEventListener('dblclick', function () {dom.banana.shoot(this);});
    dom.cpu.addEventListener('click', function () {this.dance();});
    dom.sun.addEventListener('click', function () {this.classList.toggle('surprised');});
  }, 14000);

});