import envConfig from "@/envConfig";
import axios from "axios";
import { headerDefault } from "./config";
import { genSignature } from "@/utils/signature";
import { IPayOSResult, IPaymentLink } from "./types";

class PayOs {
  private httpClient;
  private cancelUrl;
  private returnUrl;
  constructor() {
    this.httpClient = axios.create({
      baseURL: envConfig.get("PAYOS_API_HOST"),
      headers: {
        ...headerDefault,
      },
    });

    this.cancelUrl = envConfig.get("PAYOS_CANCEL_URL");
    this.returnUrl = envConfig.get("PAYOS_RETURN_URL");
  }

  createPaymentLink = async (
    orderCode: number,
    amount: number,
    description: string
  ) => {
    const data = {
      orderCode,
      amount,
      description,
      cancelUrl: this.cancelUrl,
      returnUrl: this.returnUrl,
    };

    const signature = genSignature(data);
    console.log(signature);

    return this.httpClient.post("/payment-requests", {
      ...data,
      signature: signature,
    });
  };
}

export default new PayOs();
