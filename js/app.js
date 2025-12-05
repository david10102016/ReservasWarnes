// js/app.js  ← REEMPLAZA TODO TU ARCHIVO CON ESTE
const SCRIPT_URL = "https://api.allorigins.win/raw?url=" + encodeURIComponent("https://script.google.com/macros/s/AKfycbwS_TthIkWZ81eObLAV4bRPIs_M1Yy6dKXNuMoq7dAuac8KPcZz68CGlm33CqaDe0oy/exec");

window.fechaSeleccionada = null;
const hoy = new Date();
hoy.setHours(0, 0, 0, 0);

document.addEventListener('DOMContentLoaded', async () => {
  generarCalendario();

  // Botón principal
  document.getElementById('btn-reservar').onclick = () => {
    document.getElementById('seccion-reserva').classList.remove('oculto');
    document.getElementById('seccion-reserva').scrollIntoView({ behavior: 'smooth' });
  };

  // Cargar servicios y estilistas
  try {
    const res = await fetch(`${SCRIPT_URL}?action=public`);
    const data = await res.json();
    const servicios = data.servicios || [];
    const estilistas = data.estilistas || [];

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
      opt.value = e;
      opt.textContent = e;
      selEst.appendChild(opt);
    });
  } catch (err) {
    console.error("No se pudieron cargar servicios/estilistas");
  }

  // Enviar reserva
  document.getElementById('form-reserva').onsubmit = async e => {
    e.preventDefault();

    if (!window.fechaSeleccionada) {
      alert("Por favor selecciona una fecha en el calendario");
      return;
    }

    const datos = {
      fecha: window.fechaSeleccionada.toISOString().split('T')[0],
      hora: "10:00", // Aquí luego puedes poner selector de hora
      nombre: e.target[0].value.trim(),
      telefono: '+591' + e.target[1].value.trim(),
      servicio: e.target[2].value,
      estilista: e.target[3].value
    };

    if (!datos.nombre || !datos.telefono || !datos.servicio || !datos.estilista) {
      alert("Completa todos los campos");
      return;
    }

    try {
      // ENVÍO COMPATIBLE CON CORS (URLSearchParams)
      const params = new URLSearchParams({
        action: "nueva",
        ...datos
      });

      const respuesta = await fetch(SCRIPT_URL, {
        method: "POST",
        body: params,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        }
      });

      if (respuesta.ok) {
        document.getElementById('mensaje').textContent = "¡Reserva enviada con éxito! Te confirmamos por WhatsApp.";
        document.getElementById('mensaje').style.color = "#74b9a9";
        e.target.reset();
        window.fechaSeleccionada = null;
        document.querySelectorAll('.dia.seleccionado').forEach(d => d.classList.remove('seleccionado'));
      } else {
        alert("Error al enviar. Inténtalo de nuevo.");
      }
    } catch (err) {
      alert("Error de conexión. Revisa internet o intenta más tarde.");
    }
  };
});

// Generar calendario del mes actual
function generarCalendario() {
  const cont = document.getElementById('calendario');
  if (!cont) return;

  cont.innerHTML = '';
  const diasSemana = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
  diasSemana.forEach(d => {
    const div = document.createElement('div');
    div.textContent = d;
    div.style.fontWeight = 'bold';
    div.style.background = '#2d3436';
    div.style.color = 'white';
    cont.appendChild(div);
  });

  const fecha = new Date();
  const anio = fecha.getFullYear();
  const mes = fecha.getMonth();
  const primerDia = new Date(anio, mes, 1).getDay();
  const diasEnMes = new Date(anio, mes + 1, 0).getDate();

  // Espacios vacíos
  for (let i = 0; i < primerDia; i++) {
    cont.innerHTML += '<div></div>';
  }

  // Días del mes
  for (let d = 1; d <= diasEnMes; d++) {
    const diaFecha = new Date(anio, mes, d);
    const celda = document.createElement('div');
    celda.className = 'dia';
    celda.textContent = d;

    if (diaFecha < hoy) {
      celda.style.opacity = '0.4';
      celda.style.cursor = 'not-allowed';
    } else {
      celda.onclick = () => {
        document.querySelectorAll('.dia').forEach(x => x.classList.remove('seleccionado'));
        celda.classList.add('seleccionado');
        window.fechaSeleccionada = diaFecha;
        document.getElementById('seccion-reserva').scrollIntoView({ behavior: 'smooth' });
      };
    }
    cont.appendChild(celda);
  }
}
