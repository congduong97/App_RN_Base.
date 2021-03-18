

import { URL } from '../../../const/System';
import { fetchApiMethodGetNotUseToken } from '../../../service';
const getQuesitions = () => fetchApiMethodGetNotUseToken(`${URL}/appQuestion/list`);
export const Api = {
    getQuesitions
};
