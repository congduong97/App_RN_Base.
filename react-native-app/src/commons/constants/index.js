import Color from './Color';
import Font from './Font';
import Icon from './Icon';
import Telecom from './Telecom';
import Telecoms from './Telecoms';
import Price, {Fates} from './Price';
import Status from './Status';
import PaymentPackage from './PaymentPakage';
import MenuHome from './MenuHome';
import Dimension from './Dimension';
import Size from './SizeApp';

export {
  Color,
  Dimension,
  Font,
  Icon,
  Telecom,
  Telecoms,
  Price,
  Fates,
  Status,
  PaymentPackage,
  MenuHome,
  Size,
};

const constants = {
  ...Color,
  ...Dimension,
  ...Font,
  ...Icon,
  ...Telecom,
  ...Telecoms,
  ...Price,
  ...Fates,
  ...Status,
  ...PaymentPackage,
  ...MenuHome,
  ...Size,
};

export default constants;
