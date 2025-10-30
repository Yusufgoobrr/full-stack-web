"use client";

import {
  ChevronLeftIcon,
  ChevronRightIcon,
  StarIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";
import Link from "next/link";
import React, { useCallback, useEffect, useState } from "react";

import Box from "@/icons/general/Box";
import { TProduct } from "@/types";

const ProductDetails = ({ product }: { product: TProduct }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const resolvedImageUrl = product.imageUrl
    ? `/api/proxy/api/v1/products/${product.id}/image`
    : null;

  // Create array of product images (you can modify this to include different images)
  const productImages = resolvedImageUrl ? [resolvedImageUrl] : [];

  const openModal = (imageIndex: number) => {
    setCurrentImageIndex(imageIndex);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const nextImage = useCallback(() => {
    setCurrentImageIndex((prev) => (prev + 1) % productImages.length);
  }, [productImages.length]);

  const prevImage = useCallback(() => {
    setCurrentImageIndex(
      (prev) => (prev - 1 + productImages.length) % productImages.length,
    );
  }, [productImages.length]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isModalOpen) return;

      switch (event.key) {
        case "Escape":
          closeModal();
          break;
        case "ArrowLeft":
          prevImage();
          break;
        case "ArrowRight":
          nextImage();
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isModalOpen, nextImage, prevImage]);

  return (
    <div className="space-y-5 md:space-y-8">
      {/* Breadcrumbs */}
      <div className="flex items-center space-x-1 text-lg md:text-xl">
        <Link
          href="/dashboard"
          className="text-gray-400 hover:text-black duration-200"
        >
          Home
        </Link>
        <ChevronRightIcon className="w-4 h-4 text-gray-lighter" />
        <p>{product.name}</p>
      </div>

      <div className="flex w-full space-x-5">
        <div className="space-y-5 w-full max-w-[600px]">
          <div
            className="aspect-square max-h-[600px] relative overflow-hidden rounded-[40px] bg-gray-50 flex items-center justify-center cursor-pointer hover:opacity-90 transition-opacity duration-200"
            onClick={() => openModal(0)}
          >
            {resolvedImageUrl ? (
              <Image
                src={resolvedImageUrl}
                alt="Product Img"
                width={250}
                height={250}
              />
            ) : (
              <div className="scale-300">
                <Box />
              </div>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {productImages.map((imageSrc, index) => (
              <div
                key={index}
                className="size-[140px] relative overflow-hidden rounded-3xl bg-gray-100 flex items-center justify-center cursor-pointer hover:opacity-90 transition-opacity duration-200"
                onClick={() => openModal(index)}
              >
                {resolvedImageUrl ? (
                  <Image
                    src={imageSrc}
                    alt="Product Img"
                    width={80}
                    height={80}
                  />
                ) : (
                  <div className="scale-200">
                    <Box />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between space-x-4">
            <div className="flex items-center space-x-2">
              <div className="flex items-center">
                {[...Array(3)].map((_, index) => (
                  <StarIcon
                    key={index}
                    className="text-yellow-300 fill-yellow-300 w-5 h-5"
                  />
                ))}
              </div>
            </div>
          </div>
          <h2 className="text-gray-900 text-lg md:text-2xl font-medium">
            {product.name}
          </h2>

          <div className="space-y-4">
            <p className="text-gray-400 md:text-lg">{product.description}</p>
            <p>
              Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quo
              reiciendis repellat beatae iusto corporis distinctio nostrum error
              quas adipisci quae in sunt, inventore incidunt molestias quibusdam
              pariatur. Explicabo, voluptatibus pariatur.
            </p>
          </div>

          <p className="text-xl md:text-3xl font-semibold text-gray-900">
            ${product.price}
          </p>

          <button className="mt-2 py-2 md:py-3 px-6 md:text-lg font-medium rounded-full w-full max-w-[300px] border-2 border-transparent bg-[#BAFC50] hover:bg-white hover:border-[#BAFC50] hover:scale-95 duration-200">
            <p>Buy Now</p>
          </button>
        </div>
      </div>

      {/* Image Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.7)" }}
          onClick={closeModal}
        >
          {/* Close button - top right corner of page */}
          <button
            onClick={closeModal}
            className="absolute top-6 right-6 z-20 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full p-3 transition-all duration-200 shadow-lg"
          >
            <XMarkIcon className="w-6 h-6 text-gray-600" />
          </button>

          {/* Navigation buttons - bottom of page */}
          {productImages.length > 1 && (
            <div
              className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-20 flex items-center space-x-4"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Previous button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  prevImage();
                }}
                className="bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full p-3 transition-all duration-200 shadow-lg"
              >
                <ChevronLeftIcon className="w-6 h-6 text-gray-600" />
              </button>

              {/* Image counter */}
              <div className="bg-black bg-opacity-70 text-white px-4 py-2 rounded-full text-sm">
                {currentImageIndex + 1} / {productImages.length}
              </div>

              {/* Next button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  nextImage();
                }}
                className="bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full p-3 transition-all duration-200 shadow-lg"
              >
                <ChevronRightIcon className="w-6 h-6 text-gray-600" />
              </button>
            </div>
          )}

          {/* Modal image - centered */}
          <div
            className="flex items-center justify-center h-full p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="max-w-5xl max-h-full">
              {resolvedImageUrl ? (
                <Image
                  src={productImages[currentImageIndex]}
                  alt="Product Image"
                  width={800}
                  height={800}
                  className="w-full h-auto max-h-[85vh] object-contain"
                />
              ) : (
                <div className="flex items-center justify-center h-[85vh]">
                  <div className="scale-500">
                    <Box />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
