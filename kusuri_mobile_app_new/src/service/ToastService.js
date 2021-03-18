let toast;

function setTopLevelToast(toastRef) {
  toast = toastRef;

}

function showToast(message, duration) {
    console.log("Show toast 2");
  toast.ShowToastFunction(message, duration);
}

const ToastService = {setTopLevelToast, showToast,toast};
export {ToastService};
