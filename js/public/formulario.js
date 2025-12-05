// js/public/formulario.js
import { cargarDatosPublicos } from './utils.js';

// Variable global para la fecha seleccionada (compartida con calendario.js)
window.fechaSeleccionada = null;

document.addEventListener('DOMContentLoaded', async () => {
  const { servicios, estilistas } = await cargarDatosPublicos();

  // Llenar servicios
  const selServicio = document.getElementById('servicio');
  selServicio.innerHTML = '<option value="">Selecciona servicio</option>';
  servicios.forEach(s => {
    const opt = document.createElement('option');
    opt.value = s[0];
    opt.textContent = s[1] ? `${s[0]} - Bs ${s[1]}` : s[0];
    selServicio.appendChild(opt);
  });

  // Llenar estilistas
  const selEstilista = document.getElementById('estilista');
  selEstilista.innerHTML = '<option value="">Selecciona estilista</option>';
  estilistas.forEach(e => {
    const opt = document.createElement('option');
    opt.value = e;
    opt.textContent = e;
    selEstilista.appendChild(opt);
  });

  // Enviar formulario
  document.getElementById('form-reserva').onsubmit = async (e) => {
    e.preventDefault();

    if (!window.fechaSeleccionada) {
      alert("Por favor selecciona una fecha en el calendario");
      return;
    }

    const form = e.target;
    const datos = {
      fecha: window.fechaSeleccionada.toISOString().split('T')[0],
      hora: "10:00", // Aquí luego pondremos selector de hora real
      nombre: form[0].value.trim(),
      telefono: '+591' + form[1].value.trim(),
      servicio: form[2].value,
      estilista: form[3].value
    };

    // Validaciones rápidas
    if (!datos.nombre || !datos.servicio || !datos.estilista) {
      alert("Completa todos los campos");
      return;
    }

    try {
      await fetch(SCRIPT_URL, {
        method: "POST",
        body: JSON.stringify({ action: "nueva", ...datos }),
        headers: { "Content-Type": "text/plain" }
      });

      document.getElementById('mensaje').innerHTML = 
        "¡Reserva enviada con éxito! Te confirmamos por WhatsApp en minutos.";
      document.getElementById('mensaje').style.color = "#74b9a9";
      form.reset();
      window.fechaSeleccionada = null;
      document.querySelectorAll('.dia.seleccionado')?.forEach(d => d.classList.remove('seleccionado'));
    } catch (err) {
      alert("Error al enviar. Revisa tu conexión.");
    }
  };
});