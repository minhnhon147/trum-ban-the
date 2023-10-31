import envConfig from "@/envConfig";

export const headerDefault = {
  "Content-Type": "application/json",
  Accept: "application/json",
  "x-client-id": envConfig.get("PAYOS_CLIENT_ID"),
  "x-api-key": envConfig.get("PAYOS_API_KEY"),
};

export const PAYOS_RES_CODE = {
  SUCCESS: "00",
};
