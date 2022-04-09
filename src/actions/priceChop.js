import axiosinstance from "../axios/service/api";

export const getPriceChopList = async (callback) => {
  await axiosinstance
    .post("/priceChopPromotions/v1/list")
    .then((res) => {
      callback(res, true);
    })
    .catch((err) => {
      callback(err, false);
    });
};

export const getPcShareInfo = async (id, callback) => {
  await axiosinstance
    .post(`/priceChopPromotions/v1/shareInfo?promotionDefinitionId=${id}`)
    .then((res) => {
      callback(res, true);
    })
    .catch((err) => {
      callback(err, false);
    });
};

export const getPromotionStats = async (promotionId, callback) => {
  await axiosinstance
    .get(`/priceChopPromotions/v1/stats?promotionDefinitionId=${promotionId}`)
    .then((res) => {
      callback(res, true);
    })
    .catch((err) => {
      console.log(err.response);
      callback(err, false);
    });
};
