import * as React from 'react';
let modalForgotRef = React.createRef();

function showModal(screen) {
  modalForgotRef.current.setShowModal(screen);
}

function hideModal() {
  modalForgotRef.current.closeModal();
}

const ForgotModalService = {modalForgotRef, showModal, hideModal};
export {ForgotModalService};
