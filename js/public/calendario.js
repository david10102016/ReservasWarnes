// js/public/calendario.js

// Variable global compartida con formulario.js
window.fechaSeleccionada = null;

const hoy = new Date();
hoy.setHours(0, 0, 0, 0); // Para comparar solo fechas

export function iniciarCalendario() {
  generarCalendario(hoy.getFullYear(), hoy.getMonth());
  document.getElementById('btn-reservar').onclick = mostrarReserva;
}

function mostrarReserva() {
  document.getElementById('seccion-reserva').classList.remove('oculto');
  document.getElementById('seccion-reserva').scrollIntoView({ behavior: 'smooth' });
}

function generarCalendario(anio, mes) {
  const contenedor = document.getElementById('calendario');
  contenedor.innerHTML = '';

  // Cabecera: días de la semana
  const diasSemana = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
  diasSemana.forEach(dia => {
    const cab = document.createElement('div');
    cab.textContent = dia;
    cab.style.fontWeight = 'bold';
    cab.style.background = '#2d3436';
    cab.style.color = 'white';
    contenedor.appendChild(cab);
  });

  const primerDia = new Date(anio, mes, 1).getDay();
  const diasEnMes = new Date(anio, mes + 1, 0).getDate();

  // Espacios vacíos antes del día 1
  for (let i = 0; i < primerDia; i++) {
    contenedor.appendChild(document.createElement('div'));
  }

  // Días del mes
  for (let dia = 1; dia <= diasEnMes; dia++) {
    const fecha = new Date(anio, mes, dia);
    const celda = document.createElement('div');
    celda.className = 'dia';
    celda.textContent = dia;

    // Día de hoy
    if (fecha.toDateString() === hoy.toDateString()) {
      celda.classList.add('hoy');
    }

    // Días pasados → deshabilitados
    if (fecha < hoy) {
      celda.classList.add('deshabilitado');
      celda.style.opacity = '0.4';
      celda.style.cursor = 'not-allowed';
    } else {
      celda.style.cursor = 'pointer';
      celda.onclick = () => seleccionarFecha(fecha, celda);
    }

    contenedor.appendChild(celda);
  }
}

function seleccionarFecha(fecha, elemento) {
  // Quitar selección anterior
  document.querySelectorAll('.dia.seleccionado').forEach(d => d.classList.remove('seleccionado'));

  // Marcar nueva selección
  elemento.classList.add('seleccionado');
  window.fechaSeleccionada = fecha;

  // Bajar al formulario
  document.getElementById('seccion-reserva').scrollIntoView({ behavior: 'smooth' });
}

// Botones de mes anterior/siguiente (opcional, puedes agregarlos después)
// por ahora solo mostramos el mes actual

// Iniciar al cargar
document.addEventListener('DOMContentLoaded', iniciarCalendario);