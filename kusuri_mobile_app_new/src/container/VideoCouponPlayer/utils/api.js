import { managerAccount, URL } from "../../../const/System";
import { fetchApiMethodPost } from "../../../service";

const applyCouponEndVideo = async (pKikakuId, numberDayCanUseCoupon) =>
  await fetchApiMethodPost(
    `${URL}newCoupon/applyCoupon?pKikakuId=${pKikakuId}&numberDayCanUseCoupon=${numberDayCanUseCoupon}`,
    {
      method: "POST",
      headers: {
        accessToken: `${managerAccount.accessToken}`,
        "Content-Type": "application/json",
      },
    }
  );

export const Api = {
  applyCouponEndVideo,
};
