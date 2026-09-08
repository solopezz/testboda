const body = document.body;
const intro = document.getElementById('intro');
const openInvite = document.getElementById('openInvite');
const song = document.getElementById('song');
const musicBtn = document.getElementById('musicBtn');
const inlinePlay = document.getElementById('inlinePlay');
const calendarBtn = document.getElementById('calendarBtn');
const form = document.getElementById('rsvpForm');
const success = document.getElementById('rsvpSuccess');
let playing = false;

function updateMusicButtons(){
  const label = playing ? '❚❚' : '▶';
  musicBtn.textContent = label;
  inlinePlay.textContent = label;
}

function setMusic(on){
  playing = on;
  if(on){
    song.play().catch(()=>{ playing = false; updateMusicButtons(); });
  }else{
    song.pause();
  }
  updateMusicButtons();
}

openInvite.addEventListener('click', ()=>{
  intro.classList.add('opening');
  setMusic(true);
  setTimeout(()=>{
    intro.classList.add('hidden');
    body.classList.remove('locked');
  }, 900);
});

musicBtn.addEventListener('click', ()=>setMusic(!playing));
inlinePlay.addEventListener('click', ()=>setMusic(!playing));

const target = new Date('2027-04-18T17:00:00-06:00').getTime();
function updateCountdown(){
  let diff = Math.max(0, target - Date.now());
  const days = Math.floor(diff / 86400000); diff %= 86400000;
  const hours = Math.floor(diff / 3600000); diff %= 3600000;
  const minutes = Math.floor(diff / 60000); diff %= 60000;
  const seconds = Math.floor(diff / 1000);
  document.getElementById('days').textContent = String(days).padStart(3,'0');
  document.getElementById('hours').textContent = String(hours).padStart(2,'0');
  document.getElementById('minutes').textContent = String(minutes).padStart(2,'0');
  document.getElementById('seconds').textContent = String(seconds).padStart(2,'0');
}
updateCountdown();
setInterval(updateCountdown, 1000);

const observer = new IntersectionObserver(entries=>{
  entries.forEach(entry=>{ if(entry.isIntersecting) entry.target.classList.add('in'); });
}, {threshold:.14});
document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));

form.addEventListener('submit', (e)=>{
  e.preventDefault();
  const data = Object.fromEntries(new FormData(form).entries());
  localStorage.setItem('valentina-sebastian-rsvp-demo', JSON.stringify(data));
  form.style.display = 'none';
  success.classList.add('show');
});

if(localStorage.getItem('valentina-sebastian-rsvp-demo')){
  form.style.display = 'none';
  success.classList.add('show');
}

calendarBtn.addEventListener('click', ()=>{
  const ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'BEGIN:VEVENT',
    'SUMMARY:Valentina y Sebastián - Boda',
    'DTSTART:20270418T230000Z',
    'DTEND:20270419T060000Z',
    'LOCATION:Templo de San Agustín / Jardín Santa Lucía, Zacatecas',
    'DESCRIPTION:Ceremonia y recepción de Valentina y Sebastián',
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\n');
  const blob = new Blob([ics], {type:'text/calendar;charset=utf-8'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'valentina-sebastian.ics';
  a.click();
  URL.revokeObjectURL(url);
});