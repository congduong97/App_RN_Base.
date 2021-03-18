import { URL } from '../../../const/System'
import { fetchApiMethodGet } from '../../../service'

const getTermsOfUser =  ()=> {
  return fetchApiMethodGet(`${URL}text/prescription/termOfUse`)
}

export const Api = {
  getTermsOfUser
}