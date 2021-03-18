import * as AppConfigsBO from './AppConfigsBO';
import * as AreaBO from './AreaBO';
import * as AuthentBO from './AuthentBO';
import * as UserBO from './UserBO';
import * as CategoriesBO from './CategoriesBO';

export default {
  ...AppConfigsBO,
  ...AuthentBO,
  ...AreaBO,
  ...UserBO,
  ...CategoriesBO,
};
