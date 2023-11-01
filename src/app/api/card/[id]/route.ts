import { MESSAGES, RESPONSE_CODE } from "@/configs/constant";
import logger from "@/libs/logger";
import prisma from "@/libs/prisma";
import { NextRequest, NextResponse } from "next/server";

type params = {
  id: number;
};

export async function GET(req: NextRequest, { params }: { params: params }) {
  logger.info(`${req.method}:    ${req.url}`);
  try {
    const cards = await prisma.card.findMany({
      where: {
        brand_id: Number(params.id),
      },
      select: {
        id: true,
        brand_id: true,
        price: true,
        discount: true,
      },
    });

    return NextResponse.json({
      code: RESPONSE_CODE.SUCCESS,
      message: MESSAGES.SUCCESS,
      data: cards,
    });
  } catch (error) {
    return NextResponse.json({
      code: RESPONSE_CODE.HAVE_AN_ERROR,
      message: MESSAGES.HAVE_AN_ERROR,
    });
  }
}
