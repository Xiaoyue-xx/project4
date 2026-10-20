(() => {
  'use strict';
  const app = document.querySelector('#app');
  const scene = document.querySelector('#scene');
  const start = document.querySelector('#start');
  const enterButton = document.querySelector('#enterButton');
  const calmMotion = document.querySelector('#calmMotion');
  const pauseButton = document.querySelector('#pauseButton');
  const hintText = document.querySelector('#hintText');
  const storyCaption = document.querySelector('#storyCaption');
  const progressDots = [...document.querySelectorAll('.progress i')];
  const hotspots = [...document.querySelectorAll('.hotspot')];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  calmMotion.checked = reduced;

  let audio, master, ambientGain, humOsc, windSource;
  let started = false, paused = false, storyPlaying = false, step = 0;
  let hintTimer = 0, idleSeconds = 0;
  const timers = new Set();
  const sequence = ['bell', 'window', 'pumpkin'];
  const hints = [
    ['Something old hangs where the hill begins.', 'A silent singer waits left of the manor.', 'Find the bell that has forgotten its song.'],
    ['A cold blue eye watches from the highest room.', 'Look above the front door, where the roof points.', 'The attic window wants a little moonlight.'],
    ['The last clue wears autumn stripes.', 'Search the patch beside the manor.', 'A striped pumpkin is trying not to grin.']
  ];

  class PausableTimer {
    constructor(callback, delay) { this.callback=callback; this.remaining=delay; this.startedAt=0; this.id=0; timers.add(this); this.resume(); }
    pause(){ if(!this.id)return; clearTimeout(this.id); this.remaining-=performance.now()-this.startedAt; this.id=0; }
    resume(){ if(this.id)return; this.startedAt=performance.now(); this.id=setTimeout(()=>{this.id=0;timers.delete(this);this.callback();},Math.max(0,this.remaining)); }
    cancel(){ clearTimeout(this.id);this.id=0;timers.delete(this); }
  }
  const later = (fn,ms) => new PausableTimer(fn,ms);

  function initAudio(){
    const AC = window.AudioContext || window.webkitAudioContext;
    if(!AC) return;
    audio = new AC(); master=audio.createGain(); ambientGain=audio.createGain();
    master.gain.value=.52; ambientGain.gain.value=.12; ambientGain.connect(master).connect(audio.destination);
    humOsc=audio.createOscillator(); const filter=audio.createBiquadFilter(); humOsc.type='sine';humOsc.frequency.value=54;filter.type='lowpass';filter.frequency.value=170;humOsc.connect(filter).connect(ambientGain);humOsc.start();
    const length=audio.sampleRate*2, buffer=audio.createBuffer(1,length,audio.sampleRate), data=buffer.getChannelData(0);
    for(let i=0;i<length;i++) data[i]=(Math.random()*2-1)*(.35+.65*Math.sin(Math.PI*i/length));
    windSource=audio.createBufferSource(); const windFilter=audio.createBiquadFilter(); windSource.buffer=buffer;windSource.loop=true;windFilter.type='lowpass';windFilter.frequency.value=520;windSource.connect(windFilter).connect(ambientGain);windSource.start();
  }
  function tone(freq,duration=.16,type='sine',volume=.16,delay=0){
    if(!audio) return; const o=audio.createOscillator(),g=audio.createGain(),now=audio.currentTime+delay;
    o.type=type;o.frequency.setValueAtTime(freq,now);g.gain.setValueAtTime(.001,now);g.gain.exponentialRampToValueAtTime(volume,now+.02);g.gain.exponentialRampToValueAtTime(.001,now+duration);o.connect(g).connect(master);o.start(now);o.stop(now+duration+.03);
  }
  function playFeedback(kind){
    if(kind==='bell'){tone(392,.55,'sine',.18);tone(587,.48,'sine',.09,.08)}
    if(kind==='window'){tone(659,.18,'triangle',.14);tone(880,.25,'triangle',.11,.1)}
    if(kind==='pumpkin'){tone(196,.15,'square',.08);tone(294,.22,'triangle',.13,.12)}
    if(kind==='wrong'){tone(118,.12,'sawtooth',.045);}
  }
  function chimeStory(){ [523,659,784,1046].forEach((n,i)=>tone(n,.55,'triangle',.12,i*.12)); }

  function updateHint(reset=false){
    if(reset) idleSeconds=0;
    if(storyPlaying) return;
    const level=Math.min(2,Math.floor(idleSeconds/8));
    hintText.textContent=hints[step]?.[level] || 'The hollow remembers your visit.';
  }
  function beginHintClock(){
    clearInterval(hintTimer); hintTimer=setInterval(()=>{ if(!paused&&!storyPlaying){idleSeconds++;updateHint();}},1000);
  }
  function setCaption(text){ storyCaption.textContent=text;storyCaption.classList.toggle('visible',Boolean(text)); }

  function startStory(){
    storyPlaying=true; scene.classList.add('story-playing'); hotspots.forEach(b=>b.disabled=true);
    hintText.textContent='The hollow is waking…'; chimeStory(); setCaption('A warm light stirs behind the walls…');
    later(()=>{setCaption('The Lantern Keeper rises with a grin.');tone(262,.5,'sine',.12);},1900);
    later(()=>{setCaption('“You found my favorite hiding light!”');[392,494,587].forEach((n,i)=>tone(n,.25,'triangle',.1,i*.1));},3900);
    later(()=>{setCaption('A golden spark marks you as a friend of the hollow.');tone(880,.8,'sine',.1);},5600);
    later(()=>{
      setCaption(''); storyPlaying=false; scene.classList.remove('story-playing'); hotspots.forEach(b=>b.disabled=false); step=0;
      progressDots.forEach(d=>d.classList.remove('found')); hintText.textContent='The keeper sleeps again. Can you replay the mystery?'; idleSeconds=-4;
    },7200);
  }

  function handleHotspot(event){
    if(paused||storyPlaying) return;
    const button=event.currentTarget, kind=button.dataset.trigger;
    button.classList.remove('activated'); void button.offsetWidth; button.classList.add('activated');
    if(kind===sequence[step]){
      playFeedback(kind); progressDots[step].classList.add('found'); step++; idleSeconds=0;
      if(step===1) hintText.textContent='A clear note! Something high answers in blue.';
      if(step===2) hintText.textContent='The window is awake. Now find autumn stripes.';
      if(step===3){
        hintText.textContent='Three clues align!';
        hotspots.forEach(b=>b.disabled=true);
        later(startStory,500);
      }
    } else {
      playFeedback('wrong'); hintText.textContent=step===0?'A soft thud. The first clue is older than the manor.':'The hollow hums: “Not yet…”';
      button.classList.add('wrong');setTimeout(()=>button.classList.remove('wrong'),500);idleSeconds=0;
    }
  }
  function togglePause(){
    paused=!paused; app.classList.toggle('paused',paused); scene.classList.toggle('user-paused',paused);
    pauseButton.setAttribute('aria-pressed',String(paused));pauseButton.setAttribute('aria-label',paused?'Resume experience':'Pause experience');
    pauseButton.querySelector('.pause-icon').textContent=paused?'▶':'Ⅱ';pauseButton.querySelector('.pause-label').textContent=paused?'Play':'Pause';
    timers.forEach(t=>paused?t.pause():t.resume());
    if(audio) paused?audio.suspend():audio.resume();
  }
  function enter(){
    if(started)return;started=true;initAudio();
    app.classList.toggle('calm',calmMotion.checked);app.classList.add('started');app.classList.remove('paused');
    scene.removeAttribute('aria-hidden');start.setAttribute('aria-hidden','true');beginHintClock();later(()=>updateHint(true),900);
  }
  enterButton.addEventListener('click',enter);pauseButton.addEventListener('click',togglePause);hotspots.forEach(b=>b.addEventListener('click',handleHotspot));
  document.addEventListener('visibilitychange',()=>{if(document.hidden&&started&&!paused)togglePause();});
})();
