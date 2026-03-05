import { ChevronRightIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import Link from "next/link";
import React from "react";

import Box from "@/icons/general/Box";

type TProductCard = {
  imageUrl?: string | null;
  name: string;
  price: number;
  link: string;
};

const ProductCard = ({ imageUrl, name, price, link }: TProductCard) => {
  return (
    <div className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-[35px] space-y-5 p-2 group">
      {/* PRODUCT Image */}
      <div className="w-full h-[250px] md:h-[280px] relative overflow-hidden rounded-[30px] bg-gray-50 dark:bg-gray-700 flex items-center justify-center">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt="Product Img"
            width={160}
            height={160}
            className="group-hover:scale-110 duration-300"
          />
        ) : (
          <div className="scale-200">
            <Box />
          </div>
        )}
      </div>

      {/* DESCRIPTION */}
      <h2 className="md:text-lg px-2 md:px-4 line-clamp-2 text-gray-900 dark:text-gray-100">
        {name}
      </h2>

      <div className="flex items-center justify-between px-2 md:px-4 pb-6">
        {/* PRICE */}
        <p className="font-medium md:text-lg text-gray-900 dark:text-gray-100">
          ${price}
        </p>

        {/* BUY NOW link */}
        <Link
          href={link}
          className="flex items-center space-x-2 border-2 border-transparent bg-[#BAFC50] hover:bg-white dark:hover:bg-gray-800 hover:border-[#BAFC50] hover:scale-95 duration-200 py-1 pl-4 pr-1.5 rounded-full"
        >
          <p className="text-sm text-gray-900 dark:text-gray-100">Learn more</p>
          <div className="bg-black dark:bg-white text-white dark:text-gray-900 rounded-full p-1.5">
            <div className="border border-white dark:border-gray-900 rounded-full w-5 h-5 flex items-center justify-center -space-x-2">
              <ChevronRightIcon className="w-4 h-4" />
              <ChevronRightIcon className="w-4 h-4" />
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default ProductCard;
