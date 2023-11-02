import { ORDER_STATE, PAYMENT_LINK_STATE } from "@/configs/constant";
import logger from "@/libs/logger";
import prisma from "@/libs/prisma";
import { PAYOS_RES_CODE } from "@/service/payos/config";
import SendMail from "@/service/sendmail";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, res: NextResponse) {
  logger.info(`${req.method}:    ${req.url}`);
  const body = await req.json();

  try {
    if (body.data.orderCode && body.data.orderCode === 123) {
      console.log("hook test");
      console.log(body);
      return NextResponse.json({ code: 0 }, { status: 200 });
    }

    if (body.code === PAYOS_RES_CODE.SUCCESS) {
      //WEBHOOK
      const webhookData = body.data;

      const paymentLink = await prisma.payment_link.update({
        where: {
          payment_link_id: webhookData.paymentLinkId,
        },
        data: {
          status: PAYMENT_LINK_STATE.SUCCESS,
        },
      });

      const order = await prisma.order.update({
        where: {
          id: Number(paymentLink.order_id),
        },
        data: {
          state: ORDER_STATE.SUCCESS,
        },
      });

      const transport = new SendMail();

      const orderId = order.id || 1;
      //mail + ordercode
      await transport.sendMail("minhnhon159@gmail.com", orderId);

      // console.log(body);
    }

    return NextResponse.json({ code: 0 }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ code: 99 }, { status: 200 });
  }
}
