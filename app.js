const targetDate = new Date('2026-12-12T16:30:00-06:00').getTime();
function updateCountdown(){
  let diff = Math.max(0, targetDate - Date.now());
  const d = Math.floor(diff / 86400000); diff %= 86400000;
  const h = Math.floor(diff / 3600000); diff %= 3600000;
  const m = Math.floor(diff / 60000); diff %= 60000;
  const s = Math.floor(diff / 1000);
  document.getElementById('days').textContent = String(d).padStart(3,'0');
  document.getElementById('hours').textContent = String(h).padStart(2,'0');
  document.getElementById('minutes').textContent = String(m).padStart(2,'0');
  document.getElementById('seconds').textContent = String(s).padStart(2,'0');
}
updateCountdown(); setInterval(updateCountdown,1000);

const observer = new IntersectionObserver(entries => entries.forEach(entry => {
  if(entry.isIntersecting) entry.target.classList.add('is-visible');
}), {threshold:.12});
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

const attendanceDetails = document.getElementById('attendanceDetails');
document.querySelectorAll('input[name="attendance"]').forEach(radio => radio.addEventListener('change', e => {
  attendanceDetails.classList.toggle('hidden', e.target.value === 'no');
}));

const passes = document.getElementById('passes');
const companions = document.getElementById('companions');
const companionsHint = document.getElementById('companionsHint');
function syncCompanions(){
  const count = Number(passes.value);
  companions.disabled = count === 1;
  companions.classList.toggle('opacity-50', count === 1);
  companionsHint.textContent = count === 1 ? 'No necesitas agregar acompañantes para 1 pase.' : `Agrega ${count-1} acompañante${count-1>1?'s':''}, un nombre por línea.`;
}
passes.addEventListener('change', syncCompanions); syncCompanions();

const toast = document.getElementById('toast');
function showToast(text){
  toast.textContent = text; toast.classList.remove('opacity-0','translate-y-3');
  setTimeout(()=>toast.classList.add('opacity-0','translate-y-3'),1500);
}
document.querySelectorAll('.copy-btn').forEach(btn => btn.addEventListener('click', async () => {
  try{ await navigator.clipboard.writeText(btn.dataset.copy); showToast('Copiado al portapapeles'); }
  catch{ showToast('Selecciona y copia manualmente'); }
}));

const form = document.getElementById('rsvpForm');
const successState = document.getElementById('successState');
form.addEventListener('submit', e => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(form).entries());
  data.food = [...form.querySelectorAll('input[name="food"]:checked')].map(x=>x.value);
  localStorage.setItem('sofia-alejandro-rsvp-demo', JSON.stringify(data));
  form.classList.add('hidden'); successState.classList.remove('hidden');
  successState.scrollIntoView({behavior:'smooth',block:'center'});
});
document.getElementById('editResponse').addEventListener('click', () => {
  successState.classList.add('hidden'); form.classList.remove('hidden');
});
