import EnterNewPasswordApp from '../screen/EnterNewPasswordApp'
import EnterConfirmNewPasswordApp from '../screen/EnterConfirmNewPasswordApp'
import EnterPasswordApp from '../screen/EnterPasswordApp'
import EnterPassMyPageAndOppenApp from '../screen/EnterPassMyPageAndOppenApp'
import ChangePhoneNumber from '../screen/ChangePhoneNumber'
import AddNewPhone from '../screen/AddNewPhone'
import ValidateOtpNewPhone from '../screen/ValidateOtpNewPhone'
export const AccountStack = {
  EnterNewPasswordApp: {
    screen: EnterNewPasswordApp,
    navigationOptions: {
      header: null,
      gesturesEnabled: false,
    }
  },
  EnterConfirmNewPasswordApp: {
    screen: EnterConfirmNewPasswordApp,
    navigationOptions: {
      header: null,
      gesturesEnabled: false,

    }
  },
  EnterPassMyPageAndOppenApp: {
    screen: EnterPassMyPageAndOppenApp,
    navigationOptions: {
      header: null,
      gesturesEnabled: false,

    }
  },
  ChangePhoneNumber: {
    screen: ChangePhoneNumber,
    navigationOptions: {
      header: null,
      gesturesEnabled: false,

    }
  },
  AddNewPhone: {
    screen: AddNewPhone,
    navigationOptions: {
      header: null,
      gesturesEnabled: false,

    }
  },
  ValidateOtpNewPhone: {
    screen: ValidateOtpNewPhone,
    navigationOptions: {
      header: null,
      gesturesEnabled: false,

    }
  },
  EnterPasswordApp: {
    screen: EnterPasswordApp,
    navigationOptions: {
      header: null,
      gesturesEnabled: false,

    }
  }
}