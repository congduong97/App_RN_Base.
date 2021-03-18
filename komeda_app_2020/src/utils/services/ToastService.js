import * as React from 'react';
let toastRef = React.createRef();

function showToast(title) {
  toastRef.current.showToast(title);
}

function hideToast() {
  toastRef.current.closeToast();
}

const ToastService = {toastRef, showToast, hideToast};
export {ToastService};
