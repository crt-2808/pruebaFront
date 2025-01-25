import Swal from 'sweetalert2';

export const showLoadingAlert = (message = 'Por favor espera un momento') => {
  return Swal.fire({
    title: 'Cargando...',
    text: message,
    allowOutsideClick: false,
    didOpen: () => {
      Swal.showLoading();
    },
  });
};

export const showSuccessAlert = (title, text = 'UDA', timer = 1400) => {
  return Swal.fire({
    icon: 'success',
    title,
    text,
    timer,
    timerProgressBar: true,
    backdrop: 'rgba(36,32,32,0.65)',
  });
};

export const showErrorAlert = (title, text = 'UDA', timer = 1400) => {
  return Swal.fire({
    icon: 'error',
    title,
    text,
    timer,
    timerProgressBar: true,
    backdrop: 'rgba(36,32,32,0.65)',
  });
};

export const showInfoAlert = (title, text, confirmButtonText = 'Entendido') => {
  return Swal.fire({
    title,
    text,
    icon: 'info',
    confirmButtonText,
  });
};

export const showConfirmationAlert = async (title, text) => {
  const result = await Swal.fire({
    title,
    text,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Sí',
    cancelButtonText: 'No',
  });

  return result.isConfirmed;
};

export const showToast = (title, icon = 'success', timer = 3000) => {
  return Swal.fire({
    toast: true,
    position: 'top-end',
    icon,
    title,
    showConfirmButton: false,
    timer,
    timerProgressBar: true,
  });
};

export const showSuccessToast = (title) => {
  return showToast(title, 'success');
};

export const showErrorToast = (title) => {
  return showToast(title, 'error');
};

export const showInfoToast = (title) => {
  return showToast(title, 'info');
};

export const showWarningToast = (title) => {
  return showToast(title, 'warning');
};
