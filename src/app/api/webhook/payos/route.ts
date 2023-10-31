import logger from "@/libs/logger";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, res: NextResponse) {
  logger.info(`${req.method}:    ${req.url}`);
  return NextResponse.json({ code: 0 }, { status: 200 });
}
