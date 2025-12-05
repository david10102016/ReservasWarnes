// js/public/utils.js
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwS_TthIkWZ81eObLAV4bRPIs_M1Yy6dKXNuMoq7dAuac8KPcZz68CGlm33CqaDe0oy/exec";

export async function cargarDatosPublicos() {
  const res = await fetch(`${SCRIPT_URL}?action=public`);
  return await res.json();
}

export async function enviarReserva(datos) {
  await fetch(SCRIPT_URL, {
    method: "POST",
    body: JSON.stringify({action:"nueva", ...datos})
  });
}