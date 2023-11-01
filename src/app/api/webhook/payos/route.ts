import logger from "@/libs/logger";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, res: NextResponse) {
  logger.info(`${req.method}:    ${req.url}`);
  const body = await req.json();

  if (body.data.orderCode && body.data.orderCode === 123) {
    console.log("hook test");
    return NextResponse.json({ code: 0 }, { status: 200 });
  }

  console.log(body);
  return NextResponse.json({ code: 0 }, { status: 200 });
}
