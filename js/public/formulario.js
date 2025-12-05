// js/public/formulario.js
import { cargarDatosPublicos, enviarReserva } from './utils.js';

document.addEventListener('DOMContentLoaded', async () => {
  const {servicios, estilistas} = await cargarDatosPublicos();
  
  const selServicio = document.getElementById('servicio');
  servicios.forEach(s => {
    const opt = document.createElement('option');
    opt.value = s[0]; opt.textContent = `${s[0]} ${s[1]?' - Bs '+s[1]:''}`;
    selServicio.appendChild(opt);
  });

  const selEstilista = document.getElementById('estilista');
  estilistas.forEach(e => {
    const opt = document.createElement('option');
    opt.value = e; opt.textContent = e;
    selEstilista.appendChild(opt);
  });

  document.getElementById('form-reserva').onsubmit = async (e) => {
    e.preventDefault();
    const datos = {
      fecha: fechaSeleccionada ? fechaSeleccionada.toISOString().split('T')[0] : '',
      hora: '10:00', // aquí irán los horarios reales (próxima versión)
      nombre: e.target[0].value,
      telefono: '+591'+e.target[1].value,
      servicio: e.target[2].value,
      estilista: e.target[3].value
    };
    await enviarReserva(datos);
    document.getElementById('mensaje').textContent = "¡Reserva recibida! Te confirmamos por WhatsApp en minutos.";
    document.getElementById('mensaje').style.color = "#74b9a9";
    e.target.reset();
  };
});