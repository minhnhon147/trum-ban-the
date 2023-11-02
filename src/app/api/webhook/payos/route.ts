import envConfig from "@/envConfig";
import logger from "@/libs/logger";
import SendMail from "@/service/sendmail";
import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest, res: NextResponse) {
  logger.info(`${req.method}:    ${req.url}`);
  const body = await req.json();

  try {
    // if (body.data.orderCode && body.data.orderCode === 123) {
    //   console.log("hook test");
    //   return NextResponse.json({ code: 0 }, { status: 200 });
    // }

    //WEBHOOK
    const transport = new SendMail();
    await transport.sendMail("minhnhon159@gmail.com");

    // console.log(body);
    return NextResponse.json({ code: 0 }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ code: 99 }, { status: 200 });
  }
}
