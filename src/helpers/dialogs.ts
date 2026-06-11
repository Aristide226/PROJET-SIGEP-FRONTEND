import Swal from "sweetalert2";

export const okSuccessDialog = (message: string) => {
    Swal.fire({
        title: 'GesBud',
        text: message,
        icon: 'success',
        confirmButtonText: 'OK',
        allowOutsideClick: false,
        confirmButtonColor: '#007E33' 
    });
}

export const okWarnignDialog = (message: string) => {
  Swal.fire({
      title: 'GesBud',
      text: message,
      icon: 'warning',
      confirmButtonText: 'OK',
      allowOutsideClick: false,
      confirmButtonColor: '#007E33' 
  });
}