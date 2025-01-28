"use client";

import React from "react";

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

type ProductCardProps = {
  product: QuotedProduct;
};

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const discount = (product.promotionalOffer ? parseFloat(product.promotionalOffer.percentage) : 0);
  const { name, description, currency, amount, modality } = product;

  return (
    <div className="mx-auto border border-gray-200 rounded-lg shadow-md p-2 md:p-4 flex w-8/12 md:w-10/12 bg-white">
        <div className="flex-col">
            <div className="w-full flex gap-4">
                <h3 className="text-sm md:text-lg font-semibold text-gray-800">{modality}</h3>
                <p className={`text-sm md:text-lg text-green-500 self-end ${discount === 0 ? 'hidden' : ''}`}>
                    {discount}% de descuento
                </p>
            </div>

            <p className="md:text-sm text-xs text-gray-700 w-full">{description}</p>

            <div className={`flex flex-col ${discount === 0 ? 'hidden' : ''}`}>
                <p className="text-sm font-bold text-blue-600">
                Precio final: {currency} ${amount.total.toFixed(2)}
                </p>
                <p className="hidden md:inline-block text-sm line-through text-gray-400">
                Precio original: {currency} ${amount.totalOriginal.toFixed(2)}
                </p>
            </div>
                
            <div className={`flex flex-col ${discount === 0 ? '' : 'hidden'}`}>
                <p className="text-sm font-bold text-blue-600">
                    Precio: {currency} ${amount.total.toFixed(2)}
                </p>
            </div>
        </div>

        <button
            className="hidden md:inline-block w-fit px-4 py-2 self-end ml-auto bg-blue-500 text-white text-xs md:text-md font-medium rounded-lg hover:bg-blue-600 transition-all"
        >
            Más información
        </button>
    </div>
  );
};

export default ProductCard;