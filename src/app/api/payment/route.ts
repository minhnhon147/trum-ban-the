import { MESSAGES, ORDER_STATE, RESPONSE_CODE } from "@/configs/constant";
import logger from "@/libs/logger";
import prisma from "@/libs/prisma";
import payos from "@/service/payos";
import { PAYOS_RES_CODE } from "@/service/payos/config";
import { IPayOSResult, IPaymentLink } from "@/service/payos/types";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, res: NextResponse) {
  logger.info(`${req.method}:    ${req.url}`);
  const body = await req.json();

  const { amount, email, cardId } = body;

  if (!amount || !email || !cardId) {
    return NextResponse.json({
      code: RESPONSE_CODE.HAVE_AN_ERROR,
      message: MESSAGES.HAVE_AN_ERROR,
    });
  }

  try {
    const order = await prisma.order.create({
      data: {
        card_id: cardId,
        amount: amount,
        email: email,
      },
    });

    const paymentLink = await payos.createPaymentLink(
      order.id,
      order.amount!,
      "trumbanthe"
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

    await prisma.$transaction(async (tx) => {
      const pmLink = await tx.payment_link.create({
        data: {
          payment_link_id: paymentLinkRes.data.paymentLinkId,
          order_id: paymentLinkRes.data.orderCode,
          bin: paymentLinkRes.data.bin,
          account_name: paymentLinkRes.data.accountName,
          account_number: paymentLinkRes.data.accountNumber,
          amount: paymentLinkRes.data.amount,
          description: paymentLinkRes.data.description,
          qr_code: paymentLinkRes.data.qrCode,
          checkout_url: paymentLinkRes.data.checkoutUrl,
        },
      });

      await tx.order.update({
        where: {
          id: order.id,
        },
        data: {
          state: ORDER_STATE.PENDING,
        },
      });
    });

    return NextResponse.json({
      code: RESPONSE_CODE.SUCCESS,
      message: MESSAGES.SUCCESS,
      data: paymentLinkRes.data.checkoutUrl,
    });
  } catch (error) {
    return NextResponse.json({
      code: RESPONSE_CODE.HAVE_AN_ERROR,
      message: MESSAGES.HAVE_AN_ERROR,
    });
  }
}
