import { fetchApiMethodPost } from "../../../service";
import { URL, managerAccount } from "../../../const/System";

const getHistoryPrica = async (page) => {
  return await fetchApiMethodPost(`${URL}/cardUsageHistory/getData`, {
    method: "POST",
    headers: {
      accessToken: `${managerAccount.accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      limit: 50,
      memberCode: managerAccount.memberCode,
      offset: page,
      pinCode: managerAccount.password,
    }),
  });
};

export const Api = {
  getHistoryPrica,
};
