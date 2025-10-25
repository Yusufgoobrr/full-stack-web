"use client";

import { ArrowUpTrayIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { yupResolver } from "@hookform/resolvers/yup";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { twMerge } from "tailwind-merge";
import * as yup from "yup";

import api from "@/lib/axios";
import { TProduct } from "@/types";

const schema = yup.object({
  name: yup.string().required("Product Name is required"),
  description: yup.string(),
  quantity: yup
    .number()
    .typeError("Quantity must be a number")
    .positive()
    .required("Quantity is required"),
  price: yup
    .number()
    .typeError("Price must be a number")
    .positive()
    .min(0.01, "Price must be at least $0.01")
    .required("Price is required"),
  stripeId: yup.string().optional(),
});

type FormType = yup.InferType<typeof schema>;

const EditProduct = () => {
  const params = useParams();
  const productId = params.id as string;

  const [product, setProduct] = useState<TProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPublished, setIsPublished] = useState<boolean>(true);
  const [productImage, setProductImage] = useState<string | null>(null);
  const [aiGenerateTitle, setAiGenerateTitle] = useState<boolean>(false);
  const [aiGenerateDescription, setAiGenerateDescription] =
    useState<boolean>(false);
  const [isGeneratingTitle, setIsGeneratingTitle] = useState<boolean>(false);
  const [isGeneratingDescription, setIsGeneratingDescription] =
    useState<boolean>(false);
  const [isDragOver, setIsDragOver] = useState<boolean>(false);
  const [hasChanges, setHasChanges] = useState<boolean>(false);
  const originalValuesRef = useRef<any>(null);
  const [notification, setNotification] = useState<{
    show: boolean;
    message: string;
    type: "success" | "error";
  }>({ show: false, message: "", type: "success" });

  const showNotification = (message: string, type: "success" | "error") => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification((prev) => ({ ...prev, show: false }));
    }, 3000);
  };

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormType>({
    resolver: yupResolver(schema) as any,
    defaultValues: {
      name: "",
      description: "",
      quantity: undefined,
      price: undefined,
      stripeId: undefined,
    },
  });

  // Watch form values to detect changes
  const watchedValues = watch();

  // Fetch product data
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const { data } = await api.get(`/api/v1/products/${productId}`);
        setProduct(data);

        // Set form values
        setValue("name", data.name);
        setValue("description", data.description || "");
        setValue("quantity", data.stockLevel);
        setValue("price", data.price);
        setValue("stripeId", data.stripeId || "");

        // Set other state values
        setIsPublished(data.isPublished);
        setProductImage(data.imageUrl);

        // Store original values for change detection
        originalValuesRef.current = {
          name: data.name,
          description: data.description || "",
          quantity: Number(data.stockLevel),
          price: Number(data.price),
          isPublished: data.isPublished,
          imageUrl: data.imageUrl,
        };
      } catch (error: any) {
        console.error("Error fetching product:", error);
        const errorMessage =
          error.response?.data?.message || "Failed to fetch product";
        showNotification(errorMessage, "error");
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchProduct();
    }
  }, [productId, setValue]);

  // Detect changes in form
  useEffect(() => {
    if (!originalValuesRef.current) return;

    const currentValues = {
      name: watchedValues.name,
      description: watchedValues.description,
      quantity: Number(watchedValues.quantity),
      price: Number(watchedValues.price),
      isPublished: isPublished,
      imageUrl: productImage,
    };

    const hasFormChanges =
      JSON.stringify(currentValues) !==
      JSON.stringify(originalValuesRef.current);
    setHasChanges(hasFormChanges);
  }, [watchedValues, isPublished, productImage, productId]);

  const onSubmit: SubmitHandler<FormType> = async (data: any) => {
    // Remove stripeId from the payload
    const { stripeId, ...payload } = data;

    // Add additional fields to payload
    const productData = {
      ...payload,
      imageUrl: productImage,
      isPublished: isPublished,
      stockLevel: payload.quantity, // Map quantity to stockLevel
    };

    try {
      await api.put(`/api/v1/products/${productId}`, productData);
      showNotification("Product updated successfully!", "success");

      // Update the original values ref to reset change detection
      originalValuesRef.current = {
        name: productData.name,
        description: productData.description,
        quantity: Number(productData.stockLevel),
        price: Number(productData.price),
        isPublished: productData.isPublished,
        imageUrl: productData.imageUrl,
      };

      // Update the product state with the new data
      setProduct((prev) =>
        prev
          ? {
              ...prev,
              name: productData.name,
              description: productData.description,
              price: productData.price,
              stockLevel: productData.stockLevel,
              isPublished: productData.isPublished,
              imageUrl: productData.imageUrl,
            }
          : null,
      );

      // Don't navigate back - stay on edit page as requested
    } catch (error: any) {
      console.error("Error updating product:", error);
      const errorMessage =
        error.response?.data?.message || error.message || "An error occurred";
      showNotification(errorMessage, "error");
    }
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      const imageUrl = URL.createObjectURL(file);
      setProductImage(imageUrl);
      event.target.value = "";
    }
  };

  const handleRemoveImage = () => {
    setProductImage(null);
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragOver(false);

    const files = event.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file.type.startsWith("image/")) {
        const imageUrl = URL.createObjectURL(file);
        setProductImage(imageUrl);
      }
    }
  };

  // Simulate AI generation for product title
  const simulateAITitleGeneration = async () => {
    setIsGeneratingTitle(true);
    setAiGenerateTitle(true);

    // Simulate 5-second API call
    await new Promise((resolve) => setTimeout(resolve, 5000));

    // Set AI generated value
    setValue("name", "AI_GENERATED");
    setIsGeneratingTitle(false);
    setAiGenerateTitle(false);
  };

  // Simulate AI generation for product description
  const simulateAIDescriptionGeneration = async () => {
    setIsGeneratingDescription(true);
    setAiGenerateDescription(true);
    // Simulate 5-second API call
    await new Promise((resolve) => setTimeout(resolve, 5000));

    // Set AI generated value
    setValue("description", "AI_GENERATED");
    setIsGeneratingDescription(false);
    setAiGenerateDescription(false);
  };

  // Function to check if form is valid
  const isFormValid = () => {
    const productName = watch("name");
    const quantity = watch("quantity");
    const price = watch("price");

    return (
      productName &&
      productName.trim() !== "" &&
      quantity &&
      quantity > 0 &&
      price &&
      price > 0
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-gray-300 border-t-[#BAFC50] rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading product...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-red-500 text-lg">Product not found</p>
          <Link
            href="/dashboard/my-products"
            className="mt-4 inline-block text-[#BAFC50] hover:underline"
          >
            Back to My Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-5 md:space-y-8"
      >
        {/* Breadcrumb */}
        <div className="flex flex-col space-y-2 md:space-y-0 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center space-x-1 text-lg md:text-xl">
            <Link
              href="/dashboard/my-products"
              className="text-gray-400 hover:text-black duration-200 whitespace-nowrap"
            >
              My Products
            </Link>
            <ChevronRightIcon className="w-4 h-4 text-gray-lighter" />
            <p className="line-clamp-1">{product.name}</p>
          </div>

          <div className="flex items-center space-x-4">
            <Link
              href={`/dashboard/my-products`}
              className="flex items-center space-x-2 border border-gray-200 rounded-full px-6 py-1 hover:bg-black hover:text-white hover:scale-95 duration-200"
            >
              <p>Cancel</p>
            </Link>

            <button
              type="submit"
              disabled={!isFormValid() || !hasChanges}
              className={twMerge(
                "py-1 px-6 font-medium rounded-full border-2 border-gray-200 duration-200",
                !isFormValid() || !hasChanges
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-[#BAFC50] hover:bg-white hover:border-[#BAFC50] hover:scale-95",
              )}
            >
              <p>Save Changes</p>
            </button>
          </div>
        </div>

        <div className="space-y-5 md:space-y-8 xl:flex xl:items-start xl:space-y-0 w-full xl:space-x-6">
          {/* PRODUCT INFO */}
          <div className="border border-gray-200 p-4 md:p-6 rounded-2xl space-y-5 w-full">
            <h2 className="text-lg md:text-xl font-light text-gray-400">
              Product Information
            </h2>

            {/* NAME */}
            <div className="space-y-5">
              <div className="relative flex flex-col space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-gray-700 font-medium md:text-xl">
                    Product Name
                  </label>
                  {productImage && !aiGenerateTitle && !isGeneratingTitle && (
                    <button
                      type="button"
                      onClick={simulateAITitleGeneration}
                      className="flex items-center space-x-2 px-3 py-1 bg-[#BAFC50] text-black rounded-full hover:bg-[#BAFC50]/80 duration-200 text-sm"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                        />
                      </svg>
                      <span>Generate with AI</span>
                    </button>
                  )}
                  {isGeneratingTitle && (
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-green-600 font-medium">
                        AI Generating...
                      </span>
                      <div className="w-4 h-4 border-2 border-green-600 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  )}
                </div>
                <input
                  type="text"
                  placeholder={
                    aiGenerateTitle
                      ? "AI will generate product name"
                      : "Enter your product name"
                  }
                  disabled={aiGenerateTitle}
                  {...register("name")}
                  className={twMerge(
                    "outline-none border border-gray-200 ring ring-transparent py-2 px-3 rounded-lg duration-300 placeholder:text-gray-400",
                    errors.name
                      ? "border-red-500 ring-red-300"
                      : aiGenerateTitle
                        ? "bg-gray-50 text-gray-500 cursor-not-allowed"
                        : "input-hover",
                  )}
                />
                {errors.name && (
                  <p className="absolute -bottom-5 text-red-500 text-xs">
                    {errors.name.message}
                  </p>
                )}
              </div>

              {/* DESCRIPTION */}
              <div className="flex flex-col space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-gray-700 font-medium md:text-xl">
                    Description{" "}
                    <span className="text-gray-400 text-sm md:text-base font-normal">
                      (Optional)
                    </span>
                  </label>
                  {productImage &&
                    !aiGenerateDescription &&
                    !isGeneratingDescription && (
                      <button
                        type="button"
                        onClick={simulateAIDescriptionGeneration}
                        className="flex items-center space-x-2 px-3 py-1 bg-[#BAFC50] text-black rounded-full hover:bg-[#BAFC50]/80 duration-200 text-sm"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                          />
                        </svg>
                        <span>Generate with AI</span>
                      </button>
                    )}
                  {isGeneratingDescription && (
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-green-600 font-medium">
                        AI Generating...
                      </span>
                      <div className="w-4 h-4 border-2 border-green-600 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  )}
                </div>
                <textarea
                  placeholder={
                    aiGenerateDescription
                      ? "AI will generate product description"
                      : "Enter your product Description"
                  }
                  disabled={aiGenerateDescription}
                  {...register("description")}
                  className={twMerge(
                    "outline-none border border-gray-200 ring ring-transparent py-2 px-3 rounded-lg duration-300 placeholder:text-gray-400",
                    aiGenerateDescription
                      ? "bg-gray-50 text-gray-500 cursor-not-allowed"
                      : "input-hover",
                  )}
                  rows={4}
                />
              </div>

              {/* PRODUCT IMAGE */}
              <div className="flex flex-col space-y-2">
                <p className="text-gray-700 font-medium md:text-xl">
                  Product Image{" "}
                  <span className="text-gray-400 text-sm md:text-base font-normal">
                    (Optional)
                  </span>
                </p>

                <div className="space-y-5 md:border md:border-gray-200 md:p-4 md:rounded-2xl">
                  {!productImage ? (
                    /* IMAGE Picker */
                    <div
                      className={twMerge(
                        "relative border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center space-y-2 md:space-y-3 text-sm md:text-base px-4 py-6 md:py-8 text-center transition-colors duration-200",
                        isDragOver
                          ? "border-[#BAFC50] bg-[#BAFC50]/5"
                          : "hover:border-[#BAFC50]",
                      )}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                    >
                      <div className="p-2 bg-gray-50 rounded-full text-gray-400">
                        <ArrowUpTrayIcon className="w-6 h-6" />
                      </div>
                      <p>Choose a file Or Drag and Drop it here</p>
                      <p className="text-gray-400">PNG, JPEG, up to 12Mb</p>
                      <label
                        htmlFor="file-upload"
                        className="cursor-pointer absolute w-full h-full"
                      >
                        <input
                          id="file-upload"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleImageChange}
                        />
                      </label>
                    </div>
                  ) : (
                    /* IMAGE Preview */
                    <div className="flex flex-col items-center space-y-4">
                      <div className="relative w-48 h-48 overflow-hidden rounded-2xl bg-gray-100 flex items-center justify-center shadow-lg">
                        <Image
                          src={productImage}
                          alt="Product Preview"
                          width={200}
                          height={200}
                          className="object-cover w-full h-full"
                        />

                        {/* REMOVE Button */}
                        <button
                          type="button"
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 duration-200"
                          onClick={handleRemoveImage}
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </div>

                      {/* Replace Button */}
                      <label
                        htmlFor="file-upload-replace"
                        className="cursor-pointer flex items-center space-x-2 border border-gray-300 rounded-full px-4 py-2 hover:bg-gray-50 duration-200"
                      >
                        <ArrowUpTrayIcon className="w-4 h-4" />
                        <span className="text-sm">Replace Image</span>
                        <input
                          id="file-upload-replace"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleImageChange}
                        />
                      </label>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-5 md:space-y-8 w-full">
            {/* STATUS */}
            <div className="border border-gray-200 p-4 md:p-6 rounded-2xl space-y-5">
              <h2 className="text-lg md:text-xl font-light text-gray-400">
                Product Status
              </h2>
              <div className="flex items-center justify-between">
                <p className="text-gray-700 font-medium md:text-xl">Active</p>
                <button
                  type="button"
                  className={twMerge(
                    "p-[3px] rounded-full w-11 duration-300",
                    isPublished
                      ? "bg-green-500"
                      : "bg-gray-200 hover:bg-green-200",
                  )}
                  onClick={() => setIsPublished(!isPublished)}
                >
                  <div
                    className={twMerge(
                      "w-5 h-5 bg-white rounded-full shadow-xl duration-300",
                      isPublished && "translate-x-[90%]",
                    )}
                  />
                </button>
              </div>
            </div>

            {/* QUANTITY */}
            <div className="border border-gray-200 p-4 md:p-6 rounded-2xl space-y-5">
              <h2 className="text-lg md:text-xl font-light text-gray-400">
                Stock Level
              </h2>
              <div className="relative flex flex-col space-y-2">
                <label className="text-gray-700 font-medium md:text-xl">
                  Quantity
                </label>
                <input
                  type="number"
                  placeholder="Enter the number of units available"
                  {...register("quantity")}
                  className={twMerge(
                    "outline-none border border-gray-200 ring ring-transparent py-2 px-3 rounded-lg duration-300 placeholder:text-gray-400",
                    errors.quantity
                      ? "border-red-500 ring-red-300"
                      : "input-hover",
                  )}
                />
                {errors.quantity && (
                  <p className="absolute -bottom-5 text-red-500 text-xs">
                    {errors.quantity.message}
                  </p>
                )}
              </div>
            </div>

            {/* PRICE */}
            <div className="border border-gray-200 p-4 md:p-6 rounded-2xl space-y-5">
              <h2 className="text-lg md:text-xl font-light text-gray-400">
                Pricing
              </h2>
              <div className="relative flex flex-col space-y-2">
                <label className="text-gray-700 font-medium md:text-xl">
                  Price
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  placeholder="Set the price for this product (e.g., 29.99)"
                  {...register("price")}
                  className={twMerge(
                    "outline-none border border-gray-200 ring ring-transparent py-2 px-3 rounded-lg duration-300 placeholder:text-gray-400",
                    errors.price
                      ? "border-red-500 ring-red-300"
                      : "input-hover",
                  )}
                />
                {errors.price && (
                  <p className="absolute -bottom-5 text-red-500 text-xs">
                    {errors.price.message}
                  </p>
                )}
              </div>
            </div>

            {/* STRIPE Product ID - Information only */}
            <div className="border border-gray-200 p-4 md:p-6 rounded-2xl space-y-5">
              <div className="flex items-center justify-between">
                <h2 className="text-lg md:text-xl font-light text-gray-400">
                  Stripe Product ID
                </h2>

                <div className="relative w-12 h-5">
                  <Image src="/assets/stripe.png" alt="stripe img" fill />
                </div>
              </div>
              <div className="relative flex flex-col space-y-2">
                <label className="text-gray-700 font-medium md:text-xl">
                  Product ID{" "}
                  <span className="text-gray-400 text-sm md:text-base font-normal">
                    (generated by server)
                  </span>
                </label>
                <div className="outline-none border border-gray-200 ring ring-transparent py-2 px-3 rounded-lg duration-300 bg-gray-50 text-gray-600 cursor-not-allowed">
                  <p className="text-sm text-gray-500">
                    No Stripe ID available
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>

      {/* Notification Toast */}
      {notification.show && (
        <motion.div
          initial={{ opacity: 0, x: 100, scale: 0.3 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 100, scale: 0.5 }}
          className={`fixed bottom-4 right-4 z-50 max-w-sm w-full bg-white rounded-lg shadow-lg border-l-4 p-4 ${
            notification.type === "success"
              ? "border-green-500"
              : "border-red-500"
          }`}
        >
          <div className="flex items-center">
            <div
              className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                notification.type === "success" ? "bg-green-100" : "bg-red-100"
              }`}
            >
              {notification.type === "success" ? (
                <svg
                  className="w-5 h-5 text-green-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                <svg
                  className="w-5 h-5 text-red-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </div>
            <div className="ml-3">
              <p
                className={`text-sm font-medium ${
                  notification.type === "success"
                    ? "text-green-800"
                    : "text-red-800"
                }`}
              >
                {notification.message}
              </p>
            </div>
            <div className="ml-auto pl-3">
              <button
                onClick={() =>
                  setNotification((prev) => ({ ...prev, show: false }))
                }
                className={`inline-flex rounded-md p-1.5 ${
                  notification.type === "success"
                    ? "text-green-500 hover:bg-green-100"
                    : "text-red-500 hover:bg-red-100"
                } focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                  notification.type === "success"
                    ? "focus:ring-green-600"
                    : "focus:ring-red-600"
                }`}
              >
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </>
  );
};

export default EditProduct;
