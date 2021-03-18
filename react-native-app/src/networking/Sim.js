import models from '../models';
import actions from '../redux/actions';
import {deepCopyObject} from '../commons/utils';
import {REQUEST_SIM_SEARCH_MOBILE, REQUEST_SIM_FENGSHUI} from './ApiUrl';
import {get} from './ApiHelper';
import FilterKey from '../screens/Search/FilterView/FilterKey';

async function requestSimSearch(dispatch, params) {
  let paramsSearch = deepCopyObject(params);
  let arrayFactorFirsts = paramsSearch[FilterKey.FirstPhones];
  if (arrayFactorFirsts && arrayFactorFirsts.length > 0) {
    paramsSearch[FilterKey.FirstPhones] = arrayFactorFirsts.toString();
  }
  let urlApi = REQUEST_SIM_SEARCH_MOBILE;
  if (params[FilterKey.MenhSim]) {
    paramsSearch[FilterKey.MenhSim] = params[FilterKey.MenhSim]?.name;
    urlApi = REQUEST_SIM_FENGSHUI;
  }
  let responsesData = await get(
    urlApi,
    paramsSearch,
    dispatch,
    'Lỗi khi lấy danh danh Sim',
  );
  let listSimData = responsesData?.data || [];
  let totalRecords = responsesData?.pagination?.totalRecords || 0;
  await dispatch(
    actions.responseSimSearch({
      listSimData,
      totalRecords,
      isReloadData: params.isReloadData,
      currentPage: params.page,
      sizePage: params.size,
    }),
  );
  return responsesData?.data;
}

export default {
  requestSimSearch,
};
