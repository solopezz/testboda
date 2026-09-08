const body=document.body;
const intro=document.getElementById('intro');
const enterBtn=document.getElementById('enterBtn');
const song=document.getElementById('song');
const musicBtn=document.getElementById('musicBtn');
const musicState=document.getElementById('musicState');
const musicIcon=document.getElementById('musicIcon');
const progress=document.getElementById('progress');
let playing=false;

function renderMusic(){
  musicBtn.classList.toggle('playing',playing);
  musicState.textContent=playing?'Pausar':'Reproducir';
  musicIcon.textContent=playing?'Ⅱ':'♪';
}
async function setMusic(on){
  if(on){
    try{await song.play();playing=true;}catch(e){playing=false;}
  }else{song.pause();playing=false;}
  renderMusic();
}
enterBtn.addEventListener('click',()=>{
  setMusic(true);
  intro.classList.add('is-hidden');
  body.classList.remove('is-locked');
});
musicBtn.addEventListener('click',()=>setMusic(!playing));

const target=new Date('2027-04-18T17:00:00-06:00').getTime();
function tick(){
  let diff=Math.max(0,target-Date.now());
  const d=Math.floor(diff/86400000); diff%=86400000;
  const h=Math.floor(diff/3600000); diff%=3600000;
  const m=Math.floor(diff/60000); diff%=60000;
  const s=Math.floor(diff/1000);
  document.getElementById('days').textContent=String(d).padStart(3,'0');
  document.getElementById('hours').textContent=String(h).padStart(2,'0');
  document.getElementById('minutes').textContent=String(m).padStart(2,'0');
  document.getElementById('seconds').textContent=String(s).padStart(2,'0');
}
tick();setInterval(tick,1000);

const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('in')}),{threshold:.12});
document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));

window.addEventListener('scroll',()=>{
  const max=document.documentElement.scrollHeight-window.innerHeight;
  progress.style.width=(max>0?(window.scrollY/max)*100:0)+'%';
},{passive:true});

const calendarBtn=document.getElementById('calendarBtn');
calendarBtn.addEventListener('click',()=>{
  const ics=['BEGIN:VCALENDAR','VERSION:2.0','BEGIN:VEVENT','SUMMARY:Valentina y Sebastián — Boda','DTSTART:20270418T230000Z','DTEND:20270419T060000Z','LOCATION:Templo de San Agustín y Jardín Santa Lucía, Zacatecas','DESCRIPTION:Boda de Valentina y Sebastián','END:VEVENT','END:VCALENDAR'].join('\n');
  const blob=new Blob([ics],{type:'text/calendar;charset=utf-8'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='valentina-sebastian.ics';a.click();URL.revokeObjectURL(url);
});

const form=document.getElementById('rsvpForm');
const success=document.getElementById('success');
form.addEventListener('submit',e=>{
  e.preventDefault();
  const data=Object.fromEntries(new FormData(form).entries());
  localStorage.setItem('vs-editorial-rsvp',JSON.stringify(data));
  form.style.display='none';success.classList.add('show');
});
if(localStorage.getItem('vs-editorial-rsvp')){form.style.display='none';success.classList.add('show');}
