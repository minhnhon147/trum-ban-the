import Main from "@/components/Main/Main";
import CarouselCom from "@/components/common/CarouselCom";
import { BRAND_STATE } from "@/configs/constant";
import logger from "@/libs/logger";
import prisma from "@/libs/prisma";
import Image from "next/image";

const getBrands = async () => {
  try {
    const brands = await prisma.brand.findMany({
      where: {
        state: BRAND_STATE.ACTIVE,
      },
      select: {
        id: true,
        logo: true,
        brand_name: true,
      },
    });

    return brands;
  } catch (error) {
    logger.error("Get Brands error");
    return [];
  }
};

export default async function Home() {
  const brands = await getBrands();
  return (
    <main>
      <CarouselCom></CarouselCom>
      <section className="w-full h-full flex flex-col items-center p-4">
        <Main brands={brands}></Main>
      </section>
    </main>
  );
}
