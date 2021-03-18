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

const AlertService = {setTopLevelAlert, ableModal, disableModal};
export {AlertService};
