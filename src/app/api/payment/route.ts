import { MESSAGES, RESPONSE_CODE } from "@/configs/constant";
import logger from "@/libs/logger";
import payos from "@/service/payos";
import { PAYOS_RES_CODE } from "@/service/payos/config";
import { IPayOSResult, IPaymentLink } from "@/service/payos/types";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, res: NextResponse) {
  logger.info(`${req.method}:    ${req.url}`);
  const body = await req.json();

  try {
    const paymentLink = await payos.createPaymentLink(
      20003,
      1000,
      "test decription"
    );
    const paymentLinkRes: IPayOSResult<IPaymentLink> = paymentLink.data;
    if (paymentLinkRes.code !== PAYOS_RES_CODE.SUCCESS) {
      return NextResponse.json({
        code: RESPONSE_CODE.HAVE_AN_ERROR,
        message: paymentLinkRes.desc,
      });
    }

    // SUCCESS
    //todo store payment link
    console.log(paymentLink.data);

    return NextResponse.json({
      code: RESPONSE_CODE.SUCCESS,
      message: MESSAGES.SUCCESS,
      data: paymentLinkRes.data,
    });
  } catch (error) {
    return NextResponse.json({
      code: RESPONSE_CODE.HAVE_AN_ERROR,
      message: MESSAGES.HAVE_AN_ERROR,
    });
  }
}
