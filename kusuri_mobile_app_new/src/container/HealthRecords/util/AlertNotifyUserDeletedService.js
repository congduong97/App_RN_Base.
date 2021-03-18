let alert;

function setTopLevelAlert(alertRef) {
  alert = alertRef;
}

function ableModal(screen, params) {
  alert.ableModal(screen, params);
}
function disableModal() {
  alert.disableModal();
}

const AlertNotifyUserDeletedService = {setTopLevelAlert, ableModal, disableModal};
export {AlertNotifyUserDeletedService};
