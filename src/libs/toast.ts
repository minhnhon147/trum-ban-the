import { toast } from "react-toastify";

class Toast {
  private toastElement;
  constructor() {
    this.toastElement = toast;
  }
  success(message: string) {
    this.toastElement(message, {
      hideProgressBar: false,
      autoClose: 2000,
      type: "success",
    });
    return;
  }

  error(message: string) {
    this.toastElement(message, {
      hideProgressBar: false,
      autoClose: 2000,
      type: "error",
      style: {
        backgroundColor: "rgb(254 226 226)",
      },
    });

    return;
  }
}

const toastService = new Toast();

export default toastService;
