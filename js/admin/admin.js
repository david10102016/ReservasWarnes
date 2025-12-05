// js/admin/admin.js
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwS_TthIkWZ81eObLAV4bRPIs_M1Yy6dKXNuMoq7dAuac8KPcZz68CGlm33CqaDe0oy/exec";   // ← MISMA URL

export async function cargarPendientes() {
  const res = await fetch(`${SCRIPT_URL}?action=pendientes`);
  const pendientes = await res.json();

  const cont = document.getElementById('lista-pendientes');
  cont.innerHTML = "";

  if (pendientes.length === 0) {
    cont.innerHTML = "<p style='text-align:center; color:#74b9a9; font-size:1.2rem;'>¡No hay reservas pendientes!</p>";
    return;
  }

  pendientes.forEach(r => {
    const card = document.createElement('div');
    card.className = "card";
    card.style.marginBottom = "25px";
    card.innerHTML = `
      <div style="padding:20px;">
        <h3 style="margin:0 0 10px 0; color:#2d3436;">${r.nombre}</h3>
        <p style="margin:5px 0; color:#555;">
          <strong>Fecha:</strong> ${r.fecha}  <strong>Hora:</strong> ${r.hora}<br>
          <strong>Servicio:</strong> ${r.servicio}  <strong>Estilista:</strong> ${r.estilista}
        </p>
        <div style="margin-top:15px;">
          <a href="https://wa.me/${r.telefono.replace('+','')}?text=¡Hola%20${encodeURIComponent(r.nombre)}!%20Tu%20cita%20está%20CONFIRMADA%20para%20el%20${r.fecha}%20a%20las%20${r.hora}%20con%20${encodeURIComponent(r.estilista)}.%20¡Te%20esperamos!%20%F0%9F%92%88%F0%9F%94%A5" 
             target="_blank" class="btn-primary" style="display:inline-block; padding:12px 20px; margin:8px 4px; font-size:1rem; text-decoration:none;">
             Aceptar y enviar WhatsApp
          </a>
          <a href="https://wa.me/${r.telefono.replace('+','')}?text=Hola%20${encodeURIComponent(r.nombre)},%20lo%20sentimos%20pero%20el%20horario%20del%20${r.fecha}%20a%20las%20${r.hora}%20ya%20no%20está%20disponible.%20¿Te%20gustaría%20reservar%20otra%20fecha%20u%20hora%3F%20%F0%9F%98%8A" 
             target="_blank" style="background:#e74c3c; display:inline-block; padding:12px 20px; margin:8px 4px; font-size:1rem; text-decoration:none; border-radius:10px; color:white;">
             Rechazar y enviar WhatsApp
          </a>
        </div>
      </div>
    `;
    cont.appendChild(card);
  });
}