let isReloadPrescriptionScreen = false;

export const setReloadPrescriptionScreen = (reload) => {
  isReloadPrescriptionScreen = reload;
}

export const hasReloadPrescriptionScreen = () => {
  return isReloadPrescriptionScreen;
}