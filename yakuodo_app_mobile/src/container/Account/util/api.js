import {fetchApiMethodGet} from '../../../service'
import {URL, managerAcount, isIOS} from '../../../const/System'
const  validatePhoneNumber =(phone)=> fetchApiMethodGet(`${URL}/member/validatePhoneNumber?memberCode=${managerAcount.memberCode}&phone=${phone}`)
const  checkPhoneNumberIsExist =(phone)=> fetchApiMethodGet(`${URL}member/checkPhoneNumberIsExist?memberCode=${managerAcount.memberCode}&phone=${phone}`)
const  validateByEmail =(email)=> fetchApiMethodGet(`${URL}/member/validateByEmail?memberCode=${managerAcount.memberCode}&os=${isIOS ? 'IOS':'ANDROID' }&email=${email}`)
const  checkBlacklistMember =(memberCodeLogin)=> fetchApiMethodGet(`${URL}/member/checkBlacklistMember?memberCode=${memberCodeLogin || managerAcount.memberCode}`)
const  validateOTPCode =(phone,otpCode,email)=> fetchApiMethodGet(`${URL}/member/validateOTPCode?memberCode=${managerAcount.memberCode}${phone? `&phone=${phone}` : ''}${email? `&email=${email}` : ''}&otpCode=${otpCode}`)
const  updatePhoneNumber =(currentPhone,newPhone)=> fetchApiMethodGet(`${URL}/member/updatePhoneNumber?memberCode=${managerAcount.memberCode}&currentPhone=${currentPhone}&newPhone=${newPhone}`)
export const Api = {
    validatePhoneNumber,
    validateOTPCode,
    updatePhoneNumber,
    checkBlacklistMember,
    validateByEmail,
    checkPhoneNumberIsExist
}