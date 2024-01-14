import Swal from "sweetalert2";

export function showNotification(icon, title, text, timer = 2200) {
  Swal.fire({
    icon,
    title,
    text,
    timer,
    timerProgressBar: true,
    backdrop: `
      rgba(36,32,32,0.65)
    `,
  });
}

export function formatearFecha(fecha) {
  if (!fecha) return "No hay fecha";

  // Formatear la fecha y hora al formato deseado (YYYY-MM-DD HH:MM:SS)
  const dia = fecha.getDate().toString().padStart(2, "0");
  const mes = (fecha.getMonth() + 1).toString().padStart(2, "0");
  const año = fecha.getFullYear();
  const hora = fecha.getHours().toString().padStart(2, "0");
  const minutos = fecha.getMinutes().toString().padStart(2, "0");
  const segundos = fecha.getSeconds().toString().padStart(2, "0");

  return `${año}-${mes}-${dia} ${hora}:${minutos}:${segundos}`;
}
