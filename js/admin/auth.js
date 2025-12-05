// js/admin/auth.js
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwS_TthIkWZ81eObLAV4bRPIs_M1Yy6dKXNuMoq7dAuac8KPcZz68CGlm33CqaDe0oy/exec";   // ← MISMA URL QUE EN LOS OTROS JS

export async function intentarLogin(password) {
  const res = await fetch(`${SCRIPT_URL}?action=login&pass=${encodeURIComponent(password)}`);
  const texto = await res.text();
  return texto === "OK";
}

// Esto se ejecuta cuando hacen clic en "Ingresar"
window.login = async () => {
  const passInput = document.getElementById('pass');
  const password = passInput.value.trim();
  
  if (!password) {
    alert("Ingresa la contraseña");
    return;
  }

  const ok = await intentarLogin(password);
  if (ok) {
    document.getElementById('login').classList.add('oculto');
    document.getElementById('panel').classList.remove('oculto');
    // Llamamos al otro módulo
    const { cargarPendientes } = await import('./admin.js');
    cargarPendientes();
  } else {
    alert("Contraseña incorrecta");
    passInput.value = "";
  }
};