import Swal from "sweetalert2";
import "./customStyle.scss"


const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  iconColor: 'white',
  customClass: {
    popup: 'colored-toast',
  },
  showConfirmButton: false,
  timer: 1500,
  timerProgressBar: false,
})

export default Toast