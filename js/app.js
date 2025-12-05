// js/app.js  ← ÚNICO archivo que controla todo el index.html
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwS_TthIkWZ81eObLAV4bRPIs_M1Yy6dKXNuMoq7dAuac8KPcZz68CGlm33CqaDe0oy/exec";

window.fechaSeleccionada = null;
const hoy = new Date();
hoy.setHours(0,0,0,0);

document.addEventListener('DOMContentLoaded', async () => {
  generarCalendario();

  document.getElementById('btn-reservar').onclick = () => {
    document.getElementById('seccion-reserva').classList.remove('oculto');
    document.getElementById('seccion-reserva').scrollIntoView({behavior:'smooth'});
  };

  // Cargar servicios y estilistas
  const res = await fetch(`${SCRIPT_URL}?action=public`);
  const {servicios, estilistas} = await res.json();

  const selServ = document.getElementById('servicio');
  selServ.innerHTML = '<option value="">Servicio</option>';
  servicios.forEach(s => {
    const opt = document.createElement('option');
    opt.value = s[0];
    opt.textContent = s[1] ? `${s[0]} - Bs ${s[1]}` : s[0];
    selServ.appendChild(opt);
  });

  const selEst = document.getElementById('estilista');
  selEst.innerHTML = '<option value="">Estilista</option>';
  estilistas.forEach(e => {
    const opt = document.createElement('option');
    opt.value = e; opt.textContent = e;
    selEst.appendChild(opt);
  });

  // Formulario
  document.getElementById('form-reserva').onsubmit = async e => {
    e.preventDefault();
    if (!window.fechaSeleccionada) return alert("Selecciona una fecha");

    const datos = {
      fecha: window.fechaSeleccionada.toISOString().split('T')[0],
      hora: "10:00",
      nombre: e.target[0].value.trim(),
      telefono: '+591' + e.target[1].value.trim(),
      servicio: e.target[2].value,
      estilista: e.target[3].value
    };

    await fetch(SCRIPT_URL, {
      method: "POST",
      body: JSON.stringify({action:"nueva", ...datos})
    });

    alert("¡Reserva enviada con éxito! Te contactamos por WhatsApp.");
    e.target.reset();
    window.fechaSeleccionada = null;
    document.querySelectorAll('.dia.seleccionado').forEach(d => d.classList.remove('seleccionado'));
  };
});

function generarCalendario() {
  const cont = document.getElementById('calendario');
  cont.innerHTML = '';
  ['Dom','Lun','Mar','Mié','Jue','Vie','Sáb'].forEach(d => {
    const div = document.createElement('div');
    div.textContent = d; div.style.fontWeight='bold'; div.style.background='#2d3436'; div.style.color='white';
    cont.appendChild(div);
  });

  const fecha = new Date();
  const primerDia = new Date(fecha.getFullYear(), fecha.getMonth(), 1).getDay();
  const diasMes = new Date(fecha.getFullYear(), fecha.getMonth()+1, 0).getDate();

  for (let i = 0; i < primerDia; i++) cont.innerHTML += '<div></div>';
  for (let d = 1; d <= diasMes; d++) {
    const diaFecha = new Date(fecha.getFullYear(), fecha.getMonth(), d);
    const celda = document.createElement('div');
    celda.className = 'dia';
    celda.textContent = d;
    if (diaFecha < hoy) celda.style.opacity = '0.4';
    else celda.onclick = () => {
      document.querySelectorAll('.dia').forEach(x => x.classList.remove('seleccionado'));
      celda.classList.add('seleccionado');
      window.fechaSeleccionada = diaFecha;
      document.getElementById('seccion-reserva').scrollIntoView({behavior:'smooth'});
    };
    cont.appendChild(celda);
  }
}
