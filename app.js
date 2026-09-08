const targetDate = new Date('2027-04-24T13:00:00-06:00').getTime();

function createFallingHearts(){
  if(window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const layer=document.createElement('div');
  layer.id='falling-hearts';
  layer.setAttribute('aria-hidden','true');
  const colors=['#D9ADA9','#CFC5D5','#B89A67','#566348','#EEE7D9'];
  const total=window.innerWidth<640?11:17;
  for(let i=0;i<total;i++){
    const heart=document.createElement('span');
    heart.className='falling-heart'; heart.textContent='♥';
    const drift=Math.round(Math.random()*70-35);
    heart.style.left=`${Math.random()*100}%`;
    heart.style.fontSize=`${10+Math.random()*11}px`;
    heart.style.color=colors[Math.floor(Math.random()*colors.length)];
    heart.style.animationDuration=`${9+Math.random()*8}s`;
    heart.style.animationDelay=`${-Math.random()*15}s`;
    heart.style.setProperty('--drift',`${drift}px`);
    heart.style.setProperty('--drift-end',`${Math.round(-drift*.35)}px`);
    layer.appendChild(heart);
  }
  document.body.appendChild(layer);
}
createFallingHearts();

function updateCountdown(){
  let diff=Math.max(0,targetDate-Date.now());
  const d=Math.floor(diff/86400000); diff%=86400000;
  const h=Math.floor(diff/3600000); diff%=3600000;
  const m=Math.floor(diff/60000); diff%=60000;
  const s=Math.floor(diff/1000);
  document.getElementById('days').textContent=String(d).padStart(3,'0');
  document.getElementById('hours').textContent=String(h).padStart(2,'0');
  document.getElementById('minutes').textContent=String(m).padStart(2,'0');
  document.getElementById('seconds').textContent=String(s).padStart(2,'0');
}
updateCountdown(); setInterval(updateCountdown,1000);

const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting)entry.target.classList.add('is-visible')}),{threshold:.12});
document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));

const attendanceDetails=document.getElementById('attendanceDetails');
document.querySelectorAll('input[name="attendance"]').forEach(radio=>radio.addEventListener('change',e=>{attendanceDetails.classList.toggle('hidden',e.target.value==='no')}));

const passes=document.getElementById('passes');
const companions=document.getElementById('companions');
const companionsHint=document.getElementById('companionsHint');
function syncCompanions(){const count=Number(passes.value);companions.disabled=count===1;companions.classList.toggle('opacity-50',count===1);companionsHint.textContent=count===1?'No necesitas agregar acompañantes para 1 persona.':`Agrega ${count-1} acompañante${count-1>1?'s':''}, un nombre por línea.`}
passes.addEventListener('change',syncCompanions); syncCompanions();

const form=document.getElementById('rsvpForm');
const successState=document.getElementById('successState');
form.addEventListener('submit',e=>{e.preventDefault();const data=Object.fromEntries(new FormData(form).entries());localStorage.setItem('lizbeth-salvador-rsvp-demo',JSON.stringify(data));form.classList.add('hidden');successState.classList.remove('hidden');successState.scrollIntoView({behavior:'smooth',block:'center'})});
document.getElementById('editResponse').addEventListener('click',()=>{successState.classList.add('hidden');form.classList.remove('hidden')});
