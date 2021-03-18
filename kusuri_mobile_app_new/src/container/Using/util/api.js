import { URL } from '../../../const/System';
import { fetchApiMethodGetNotUseToken } from '../../../service';

const getStepUsing = async () => fetchApiMethodGetNotUseToken(`${URL}/instruction`);

export const Api = {
    getStepUsing,
};
