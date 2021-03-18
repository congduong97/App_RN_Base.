import { URL } from '../../../const/System'
import { fetchApiMethodGet } from '../../../service'

const getListPrescription = ()=> {
  return fetchApiMethodGet(`${URL}prescription/listPrescription?phase=PHASE_2`);
}

const getTermsOfUser =  ()=> {
  return fetchApiMethodGet(`${URL}text/prescription/termOfUse`)
}

export const Api =  {
  getListPrescription,
  getTermsOfUser
}