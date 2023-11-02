"use client";

import {
  IFRAME_URI,
  RECIEVE_MESSAGE_TYPE,
  RESPONSE_CODE,
} from "@/configs/constant";
import { Brand, Card } from "@/core/type/types";
import toastService from "@/libs/toast";
import { createPaymentLink, getCards } from "@/service/api.service";
import Button from "@mui/material/Button";
import {
  ToggleButton,
  ToggleButtonGroup,
  CircularProgress,
} from "@mui/material";
import Image from "next/image";
import { useEffect, useState } from "react";
import TextDetailTransaction from "../common/TextDetailTransaction";

type Props = {
  brands: Brand[];
};

const Main = (props: Props) => {
  const [brand, setBrand] = useState<Brand>(props.brands[0]);
  const [cards, setCards] = useState<Card[]>([]);
  const [card, setCard] = useState<Card>();
  const [showIframe, setShowIframe] = useState(false);
  const [src, setSrc] = useState("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    window.addEventListener("message", recieveMessage);

    return () => {
      window.removeEventListener("message", recieveMessage);
    };
  }, []);

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
    if (value) {
      setBrand(value);
    }
    console.log(value);
  };

  const changeCard = (e: any, value: any) => {
    if (value) {
      setCard(value);
    }
    console.log(value);
  };

  const clickPayment = async () => {
    if (!card) {
      toastService.info("Chưa chọn mệnh giá thẻ");
      return;
    }

    setIsLoading(true);
    await createPaymentLink(
      card!.price,
      "minhnhon258@gmail.com",
      card!.id
    ).then((res) => {
      setIsLoading(false);
      if (res.data.code === RESPONSE_CODE.SUCCESS) {
        setSrc(res.data.data);
        setShowIframe(true);
      } else {
        toastService.error(res.data.message);
      }
    });
  };

  const recieveMessage = (event: any) => {
    console.log(event.origin);
    console.log(event.data);
    if (event.origin === IFRAME_URI) {
      const { type, data } = JSON.parse(event.data);

      if (type === RECIEVE_MESSAGE_TYPE.STATUS) {
        //Trường hợp click vào nút exit để đóng iframe
        const { loading } = data;
        if (loading === false) setShowIframe(false);
        return;
      }

      if (type === RECIEVE_MESSAGE_TYPE.PAYMENT_RESPONSE) {
        console.log("run run r");
        const { loading } = data;
        if (loading === false) setShowIframe(false);
      }
    } else {
      // The data was NOT sent from your site!
      // Be careful! Do not use it. This else branch is
      // here just for clarity, you usually shouldn't need it.
      return;
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

            <div className="mx-4 my-4">
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
                      className="!rounded-lg !border-1 !border-gray-300 !border-solid  "
                    >
                      <Image
                        className=" "
                        src={`/images/${brand.logo}`}
                        width={100}
                        height={100}
                        alt=""
                      ></Image>
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

            <div className="mx-4 my-4">
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
                      className="!border-1 !rounded-lg !border-solid !border-gray-300 !capitalize !w-32"
                    >
                      <div className="w-full flex flex-col justify-center items-center">
                        <p className="text-black">{card.price}đ</p>
                        <hr className="w-full border-gray-400 border-dotted"></hr>
                        <div className="flex justify-between mt-2 w-full">
                          <p className="!text-xs ">Giá bán:</p>
                          <p className="!text-xs text-[#002bff]">
                            {card.price}đ
                          </p>
                        </div>
                      </div>
                    </ToggleButton>
                  );
                })}
              </ToggleButtonGroup>
            </div>
          </section>

          <section>
            <div className="bg-gray-200 p-2 w-full">
              <p className="">Thông tin nhận thẻ</p>
            </div>
          </section>
        </div>

        <div className="flex-grow">
          <p className="text-xl font-bold">Thanh toán</p>

          <section className="my-4">
            <div className="bg-gray-200 p-2 w-full">
              <p className="">Hình thức thanh toán</p>
            </div>

            <div className="my-2">
              <div>
                <Image
                  className="p-4 border-2 rounded-lg border-solid border-[#f25922] hover:cursor-pointer"
                  src="/images/payos.png"
                  width={100}
                  height={100}
                  alt=""
                ></Image>
              </div>
            </div>
          </section>

          <section className="my-8">
            <div className="bg-gray-200 p-2 w-full">
              <p className="">Chi tiết giao dịch</p>
            </div>

            <div>
              <TextDetailTransaction
                title={"Loại mã thẻ"}
                text={brand.brand_name}
              />

              <TextDetailTransaction
                title={"Mệnh giá thẻ"}
                text={card?.price ? card.price + "đ" : " "}
              />

              <TextDetailTransaction title={"Số lượng"} text={"1"} />
            </div>
          </section>

          <Button
            variant="contained"
            className="w-full bg-[#001a4c] hover:!bg-[#032870] disabled:!bg-[#032870]"
            onClick={clickPayment}
            disabled={isLoading}
          >
            {!isLoading ? (
              <span>Thanh toán</span>
            ) : (
              <div className="flex items-center justify-center">
                <CircularProgress className="!w-[30px] !h-[30px] !text-white" />
              </div>
            )}
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
