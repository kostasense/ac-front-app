"use client";

import React, { useContext, useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/swiper-bundle.css";
import { FaRegStar } from "react-icons/fa";
import { BiDish } from "react-icons/bi";
import { MyContext } from "../context/MyContext";
import { IoClose } from "react-icons/io5";
import ProductCard from "./ProductCard";

const Stars = ({ rating }: { rating: number }) => {
  const stars = Array(rating).fill(<FaRegStar color="black" size={24} />);

  return (
    <div className="flex gap-4">
      {stars.map((star, index) => (
        <span key={index}>{star}</span>
      ))}
    </div>
  );
};

const IMG_BASE = "https://media.travelartmedia.com/hotels/";

type QuotedProduct = {
  productCode: string;
  rateCode: string;
  name: string;
  description: string;
  currency: string;
  modality: string;
  promotionalOffer: {
    code: string;
    description: string;
    percentage: string;
  } | null;
  amount: {
    totalOriginal: number;
    total: number;
  };
};

type CardProps = {
  id: string;
  name: string;
  regionName: string;
  city: string;
  stars: number;
  address: string;
  pricePerNight: number;
  originalPricePerNight: number;
  imageUrl: string[];
  mealType: string;
  discount: number;
  hasRefundableOptions: boolean;
  relatedProducts: QuotedProduct[];
};

const Card: React.FC<CardProps> = ({
  name,
  regionName,
  city,
  stars,
  address,
  pricePerNight,
  originalPricePerNight,
  imageUrl,
  mealType,
  discount,
  hasRefundableOptions,
  relatedProducts,
}) => {
  const { days, passengers } = useContext(MyContext);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const modalRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        closeModal();
      }
    };
    if (isModalOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isModalOpen]);

  const totalPrice = pricePerNight * days * passengers;

  const handleMapClick = () => {
    const url = `https://www.google.com/maps?q=${name}`;
    window.open(url, "_blank");
  };

  return (
    <div className="w-80 max-w-3xl rounded-lg border border-gray-300 overflow-hidden my-4 mx-auto md:flex md:w-10/12 md:h-60">
      <Swiper
        className={`w-full h-40 object-contain md:h-full md:w-1/4 ${
          imageUrl.length === 0 ? "bg-slate-500" : ""
        }`}
        modules={[Navigation]}
        spaceBetween={0}
        slidesPerView={1}
        navigation
        loop
      >
        {imageUrl.map((image, index) => (
          <SwiperSlide key={index}>
            <img
              src={`${IMG_BASE}${image}`}
              alt={`Imagen ${index + 1} de ${name}`}
              className="w-full h-full object-cover"
            />
          </SwiperSlide>
        ))}
      </Swiper>
      <div className="p-4 h-3/6 flex flex-col md:h-full md:w-3/4 md:flex-row">
        <div className="flex flex-col md:w-1/2">
          <h2 className="text-xl font-semibold">{name}</h2>
          <p className="text-gray-500">
            {regionName}, {city}
          </p>
          <Stars rating={stars}></Stars>
          <p
            className={`rounded-md bg-green-400 text-sm text-white p-1 mr-auto my-auto mt-2 ${
              hasRefundableOptions ? "" : "hidden"
            }`}
          >
            Cuenta con opciones de reembolso
          </p>
          <p className="mt-auto text-sm md:w-2/3 text-gray-700 hidden md:inline-block">
            {address}
          </p>
        </div>
        <div className="flex flex-col md:w-1/2">
          <div className="flex gap-1 ml-auto">
            <BiDish color="black" size="24" className="mt-1"></BiDish>
            <p className="mt-2 text-sm text-gray-700">{mealType}</p>
          </div>
          <div className="flex flex-col md:mt-auto md:ml-auto">
            <p className="mt-2 text-sm rounded-md text-white bg-blue-400 p-1 ml-auto">
              {discount}% de descuento
            </p>
            <div className="flex flex-col gap-1 ml-auto">
              <p className="text-md my-auto ml-auto line-through">
                MXN${originalPricePerNight}
              </p>
              <div className="flex gap-2">
                <p className="text-2xl font-medium my-auto">
                  MXN${pricePerNight}
                </p>
                <p className="text-sm mt-auto">por noche</p>
              </div>
              <div className="ml-auto">
                <p className="text-sm">Total a pagar de MXN${totalPrice.toFixed(2)}</p>
              </div>
            </div>
            <div className="flex gap-2 ml-auto">
              <button
                onClick={handleMapClick}
                className="mt-2 rounded-md text-sm text-white bg-blue-400 p-2 hover:shadow-md hover:bg-white hover:text-blue-400 transition-all duration-150"
              >
                Ver en Google Maps
              </button>
              <button
                onClick={openModal}
                className="mt-2 rounded-md text-sm text-white bg-blue-400 p-2 hover:shadow-md hover:bg-white hover:text-blue-400 transition-all duration-150"
              >
                Reserva ya
              </button>
            </div>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div
            ref={modalRef}
            className="w-8/12 bg-white rounded-lg p-6 shadow-lg md:w-2/3 lg:w-1/2 max-h-screen flex flex-col gap-2 lg:gap-4"
          >
            <div className="flex w-full gap-4 lg:mb-4">
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-800 transition-all duration-150"
              >
                <IoClose className="m-auto" size="30" />
              </button>
              <h2 className="text-xl font-semibold">{name}</h2>
            </div>

            <Stars rating={stars}></Stars>
            <p className="text-md lg:text-lg text-blue-600">
              Precio por noche: MXN${pricePerNight}
            </p>
            <p className="text-md lg:text-lg text-blue-600">
              Total: MXN${totalPrice.toFixed(2)}
            </p>
            <p className="text-gray-700">Tipo de comida: {mealType}</p>
            <p
              className={`rounded-md bg-green-400 text-xs md:text-sm text-white p-2 w-fit ${
                hasRefundableOptions ? "" : "hidden"
              }`}
            >
              Cuenta con opciones de reembolso
            </p>

            <div className="flex w-10/12 gap-1">
              <div className="flex w-fit">
                <p className="text-md lg:text-xl font-semibold my-auto">
                  Viaja seguro con
                </p>
              </div>
              <div className="flex w-1/3 sm:w-3/12 h-auto mr-auto">
                <img src="/assist-card-seeklogo.svg" alt="AssistCard" className="w-30 h-auto self-start"/>
              </div>
            </div>

            <h1 className={`${hasRefundableOptions ? "hidden" : ""}`}>Revisa nuestros seguros de viaje:</h1>
            
            <Swiper
              modules={[Navigation]}
              spaceBetween={20}
              slidesPerView={1}
              navigation
              loop
              className="w-full"
            >
              {relatedProducts.map((product) => (
                <SwiperSlide className="my-auto">
                  <ProductCard product={product} />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      )}
    </div>
  );
};

export default Card;