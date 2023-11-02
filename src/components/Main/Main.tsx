"use client";

import { RESPONSE_CODE } from "@/configs/constant";
import { Brand, Card } from "@/core/type/types";
import toastService from "@/libs/toast";
import { createPaymentLink, getCards } from "@/service/api.service";
import { Button } from "@mui/base";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import axios from "axios";
import Image from "next/image";
import { useEffect, useState } from "react";

type Props = {
  brands: Brand[];
};

const Main = (props: Props) => {
  const [brand, setBrand] = useState<Brand>(props.brands[0]);
  const [cards, setCards] = useState<Card[]>([]);
  const [card, setCard] = useState<Card>();
  const [showIframe, setShowIframe] = useState(false);
  const [src, setSrc] = useState("");

  useEffect(() => {
    const fetchCards = async (brandId: number) => {
      const getCardsResult = await getCards(brandId);
      if (getCardsResult.data.code === RESPONSE_CODE.SUCCESS) {
        setCards(getCardsResult.data.data);
      } else {
        console.log(getCardsResult.data.message);
        toastService.error(getCardsResult.data.message);
      }
    };

    fetchCards(brand.id);
  }, [brand]);

  const changeBrand = (e: any, value: any) => {
    setBrand(value);
    console.log(value);
  };

  const changeCard = (e: any, value: any) => {
    setCard(value);
    console.log(value);
  };

  const clickPayment = async () => {
    if (!card) {
      toastService.info("Chưa chọn mệnh giá thẻ");
      return;
    }

    const paymentLinkResult = await createPaymentLink(
      card!.price,
      "minhnhon258@gmail.com",
      card!.id
    );

    if (paymentLinkResult.data.code === RESPONSE_CODE.SUCCESS) {
      setSrc(paymentLinkResult.data.data);
      setShowIframe(true);
    } else {
      toastService.error(paymentLinkResult.data.message);
    }
  };
  return (
    <>
      <div className="flex items-start justify-center w-[70%] h-full gap-8">
        <div className="w-[65%]">
          <section>
            <div className="bg-gray-200 p-2 w-full">
              <p className="">Chọn nhà cung cấp</p>
            </div>

            <div className="mx-4 my-2">
              <ToggleButtonGroup
                className="w-full flex gap-4"
                value={brand}
                exclusive
                onChange={changeBrand}
                aria-label="text alignment"
              >
                {props.brands.map((brand) => {
                  return (
                    <ToggleButton
                      value={brand}
                      key={brand.id}
                      className="!border-1 !rounded-lg !border-solid !border-gray-300"
                    >
                      <span>{brand.brand_name}</span>
                    </ToggleButton>
                  );
                })}
              </ToggleButtonGroup>
            </div>
          </section>

          <section>
            <div className="bg-gray-200 p-2 w-full">
              <p className="">Chọn mệnh giá</p>
            </div>

            <div className="mx-4 my-2">
              <ToggleButtonGroup
                className="w-full flex gap-4"
                value={card}
                exclusive
                onChange={changeCard}
                aria-label="text alignment"
              >
                {cards.map((card) => {
                  return (
                    <ToggleButton
                      value={card}
                      key={card.id}
                      className="!border-1 !rounded-lg !border-solid !border-gray-300"
                    >
                      <span>{card.price}</span>
                    </ToggleButton>
                  );
                })}
              </ToggleButtonGroup>
            </div>
          </section>
        </div>

        <div className="flex-grow">
          <p className="text-xl font-bold">Thanh toán</p>
          <div className="bg-gray-200 p-2 w-">
            <p className="">Hình thức thanh toán</p>
          </div>

          <div>
            <div className="flex justify-between items-center">
              <p className="">Loại mã thẻ</p>
              <p className="text-red-600">{brand.brand_name}</p>
            </div>

            <div className="flex justify-between items-center">
              <p className="">Mệnh giá thẻ</p>
              <p className="text-red-600">{card?.price}</p>
            </div>

            <div className="flex justify-between items-center">
              <p className="">Số lượng</p>
              <p className="text-red-600">1</p>
            </div>
          </div>

          <Button className="bg-gray-300 w-[8rem]" onClick={clickPayment}>
            Thanh toán
          </Button>
        </div>

        {showIframe && (
          <div className="">
            <iframe
              src={src}
              className="h-full w-full fixed block z-[1000] overflow-hidden top-0 bottom-0 left-0 right-0 "
            ></iframe>
          </div>
        )}
      </div>
    </>
  );
};

export default Main;
