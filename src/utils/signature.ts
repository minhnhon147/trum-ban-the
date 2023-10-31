import envConfig from "@/envConfig";
import { HmacSHA256, enc } from "crypto-js";

export const sortObjDataByAlphabet = (obj: any) => {
  const sortedObject: Object = Object.keys(obj)
    .sort()
    .reduce(
      (result, key) => ((result[key as keyof Object] = obj[key]), result),
      {}
    );

  return sortedObject;
};

export const genSignature = (data: any) => {
  const sortedData = sortObjDataByAlphabet(data);
  const stringifyData = Object.keys(sortedData)
    .map((key) => `${key}=${data[key]}`)
    .join("&");

  // console.log(stringifyData)

  return HmacSHA256(
    stringifyData,
    envConfig.get("PAYOS_CHECKSUM_KEY")
  ).toString(enc.Hex);
};
