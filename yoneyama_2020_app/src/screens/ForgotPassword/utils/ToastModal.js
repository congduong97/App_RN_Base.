import * as React from 'react';
let toastRef = React.createRef();

function showToast(title) {
  toastRef.current.showToast(title);
}

function hideToast() {
  toastRef.current.closeToast();
}

const ToastModal = {toastRef, showToast, hideToast};
export {ToastModal};
