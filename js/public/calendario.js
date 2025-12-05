// js/public/calendario.js
import { cargarDatosPublicos } from './utils.js';

const hoy = new Date();
let fechaSeleccionada = null;

export function iniciarCalendario() {
  const cont = document.getElementById('calendario');
  mostrarMes(hoy.getFullYear(), hoy.getMonth());
}

function mostrarMes(year, month) {
  const cont = document.getElementById('calendario');
  cont.innerHTML = '';
  const primerDia = new Date(year, month, 1).getDay();
  const diasEnMes = new Date(year, month+1, 0).getDate();

  // Días de la semana
  ['Dom','Lun','Mar','Mié','Jue','Vie','Sáb'].forEach(d => {
    const div = document.createElement('div');
    div.textContent = d; div.style.fontWeight = '600';
    cont.appendChild(div);
  });

  // Días vacíos
  for(let i=0; i<primerDia; i++) cont.innerHTML += '<div></div>';

  // Días del mes
  for(let dia=1; dia<=diasEnMes; dia++) {
    const fecha = new Date(year, month, dia);
    const div = document.createElement('div');
    div.className = 'dia';
    div.textContent = dia;
    if (fecha.toDateString() === hoy.toDateString()) div.classList.add('hoy');
    if (fecha < hoy) div.disabled = true;
    else div.onclick = () => seleccionarFecha(fecha);
    cont.appendChild(div);
  }
}

function seleccionarFecha(fecha) {
  fechaSeleccionada = fecha;
  document.querySelectorAll('.dia').forEach(d => d.classList.remove('seleccionado'));
  event.target.classList.add('seleccionado');
  document.getElementById('seccion-reserva').scrollIntoView({behavior:'smooth'});
}

// Al cargar página
document.getElementById('btn-reservar').onclick = () => {
  document.getElementById('seccion-reserva').classList.remove('oculto');
  document.getElementById('seccion-reserva').scrollIntoView({behavior:'smooth'});
};