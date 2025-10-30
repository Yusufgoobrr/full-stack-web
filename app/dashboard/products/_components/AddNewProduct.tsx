"use client";

import { ArrowUpTrayIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { yupResolver } from "@hookform/resolvers/yup";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { twMerge } from "tailwind-merge";
import * as yup from "yup";

import api from "@/lib/axios";

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

const AddNewProduct = () => {
  const [isPublished, setIsPublished] = useState<boolean>(true);
  const [productImage, setProductImage] = useState<string | null>(null);
  const [productImageFile, setProductImageFile] = useState<File | null>(null);
  const [aiGenerateTitle, setAiGenerateTitle] = useState<boolean>(false);
  const [aiGenerateDescription, setAiGenerateDescription] =
    useState<boolean>(false);
  const [isGeneratingTitle, setIsGeneratingTitle] = useState<boolean>(false);
  const [isGeneratingDescription, setIsGeneratingDescription] =
    useState<boolean>(false);
  const [isDragOver, setIsDragOver] = useState<boolean>(false);
  const [notification, setNotification] = useState<{
    show: boolean;
    message: string;
    type: "success" | "error";
  }>({ show: false, message: "", type: "success" });

  const router = useRouter();

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

  const onSubmit: SubmitHandler<FormType> = async (data: any) => {
    // Remove stripeId from the payload
    const { stripeId, ...payload } = data;

    // Add additional fields to payload
    const productData = {
      ...payload,
      // Do not send a blob preview URL to backend
      isPublished: isPublished,
      stockLevel: payload.quantity, // Map quantity to stockLevel
    };

    try {
      // If we have an image file, use the backend's multipart endpoint to create product + image together
      if (productImageFile) {
        const formData = new FormData();
        formData.append("name", String(productData.name ?? ""));
        formData.append("description", String(productData.description ?? ""));
        formData.append("price", String(productData.price ?? ""));
        formData.append("stockLevel", String(productData.stockLevel ?? ""));
        formData.append("image", productImageFile);

        const { data } = await api.post(`/api/v1/products`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        // data is expected to be the created product UUID
        if (!data) {
          throw new Error("Product creation did not return an ID");
        }
      } else {
        // Fallback: create without image using JSON endpoint contract
        await api.post("/api/v1/products", productData);
      }
      showNotification("Product created successfully!", "success");
      // Delay navigation to show the success notification
      setTimeout(() => {
        router.push("/dashboard/my-products");
      }, 1500);
    } catch (error: any) {
      console.error("Error submitting product:", error);
      const errorMessage =
        error.response?.data?.message || error.message || "An error occurred";
      showNotification(errorMessage, "error");
    } finally {
      reset();
    }
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      const imageUrl = URL.createObjectURL(file);
      setProductImage(imageUrl);
      setProductImageFile(file);
      event.target.value = "";
    }
  };

  const handleRemoveImage = () => {
    setProductImage(null);
    setProductImageFile(null);
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
        setProductImageFile(file);
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
              className="text-gray-400 dark:text-gray-500 hover:text-black dark:hover:text-gray-100 duration-200 whitespace-nowrap"
            >
              My Products
            </Link>
            <ChevronRightIcon className="w-4 h-4 text-gray-lighter dark:text-gray-500" />
            <p className="line-clamp-1 text-gray-900 dark:text-gray-100">
              {watch("name") || "Add new Product"}
            </p>
          </div>

          <div className="flex items-center space-x-4">
            <Link
              href={`/dashboard/my-products`}
              className="flex items-center space-x-2 border border-gray-200 dark:border-gray-600 rounded-full px-6 py-1 text-gray-700 dark:text-gray-300 hover:bg-black hover:text-white hover:scale-95 duration-200"
            >
              <p>Cancel</p>
            </Link>

            <button
              type="submit"
              disabled={!isFormValid()}
              className={twMerge(
                "py-1 px-6 font-medium rounded-full border-2 border-gray-200 dark:border-gray-600 duration-200",
                !isFormValid()
                  ? "bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                  : "bg-[#BAFC50] hover:bg-white dark:hover:bg-gray-800 hover:border-[#BAFC50] hover:scale-95",
              )}
            >
              <p>Add Product</p>
            </button>
          </div>
        </div>

        <div className="space-y-5 md:space-y-8 xl:flex xl:items-start xl:space-y-0 w-full xl:space-x-6">
          {/* PRODUCT INFO */}
          <div className="border border-gray-200 dark:border-gray-700 p-4 md:p-6 rounded-2xl space-y-5 w-full bg-white dark:bg-gray-800">
            <h2 className="text-lg md:text-xl font-light text-gray-400 dark:text-gray-500">
              Product Information
            </h2>

            {/* NAME */}
            <div className="space-y-5">
              <div className="relative flex flex-col space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-gray-700 dark:text-gray-300 font-medium md:text-xl">
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
                    "outline-none border border-gray-200 dark:border-gray-600 ring ring-transparent py-2 px-3 rounded-lg duration-300 placeholder:text-gray-400 dark:placeholder:text-gray-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100",
                    errors.name
                      ? "border-red-500 ring-red-300"
                      : aiGenerateTitle
                        ? "bg-gray-50 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed"
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
                  <label className="text-gray-700 dark:text-gray-300 font-medium md:text-xl">
                    Description{" "}
                    <span className="text-gray-400 dark:text-gray-500 text-sm md:text-base font-normal">
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
                    "outline-none border border-gray-200 dark:border-gray-600 ring ring-transparent py-2 px-3 rounded-lg duration-300 placeholder:text-gray-400 dark:placeholder:text-gray-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100",
                    aiGenerateDescription
                      ? "bg-gray-50 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                      : "input-hover",
                  )}
                  rows={4}
                />
              </div>

              {/* PRODUCT IMAGE */}
              <div className="flex flex-col space-y-2">
                <p className="text-gray-700 dark:text-gray-300 font-medium md:text-xl">
                  Product Image{" "}
                  <span className="text-gray-400 dark:text-gray-500 text-sm md:text-base font-normal">
                    (Optional)
                  </span>
                </p>

                <div className="space-y-5 md:border md:border-gray-200 dark:md:border-gray-700 md:p-4 md:rounded-2xl md:bg-gray-50 dark:md:bg-gray-900">
                  {!productImage ? (
                    /* IMAGE Picker */
                    <div
                      className={twMerge(
                        "relative border-2 border-dashed border-gray-200 dark:border-gray-600 rounded-2xl flex flex-col items-center space-y-2 md:space-y-3 text-sm md:text-base px-4 py-6 md:py-8 text-center transition-colors duration-200 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300",
                        isDragOver
                          ? "border-[#BAFC50] bg-[#BAFC50]/5 dark:bg-[#BAFC50]/10"
                          : "hover:border-[#BAFC50]",
                      )}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                    >
                      <div className="p-2 bg-gray-50 dark:bg-gray-700 rounded-full text-gray-400 dark:text-gray-500">
                        <ArrowUpTrayIcon className="w-6 h-6" />
                      </div>
                      <p>Choose a file Or Drag and Drop it here</p>
                      <p className="text-gray-400 dark:text-gray-500">
                        PNG, JPEG, up to 12Mb
                      </p>
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
                      <div className="relative w-48 h-48 overflow-hidden rounded-2xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center shadow-lg">
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
                        className="cursor-pointer flex items-center space-x-2 border border-gray-300 dark:border-gray-600 rounded-full px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 duration-200"
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
            <div className="border border-gray-200 dark:border-gray-700 p-4 md:p-6 rounded-2xl space-y-5 bg-white dark:bg-gray-800">
              <h2 className="text-lg md:text-xl font-light text-gray-400 dark:text-gray-500">
                Product Status
              </h2>
              <div className="flex items-center justify-between">
                <p className="text-gray-700 dark:text-gray-300 font-medium md:text-xl">
                  Active
                </p>
                <button
                  type="button"
                  className={twMerge(
                    "p-[3px] rounded-full w-11 duration-300",
                    isPublished
                      ? "bg-green-500"
                      : "bg-gray-200 dark:bg-gray-600 hover:bg-green-200 dark:hover:bg-green-600",
                  )}
                  onClick={() => setIsPublished(!isPublished)}
                >
                  <div
                    className={twMerge(
                      "w-5 h-5 bg-white dark:bg-gray-200 rounded-full shadow-xl duration-300",
                      isPublished && "translate-x-[90%]",
                    )}
                  />
                </button>
              </div>
            </div>

            {/* QUANTITY */}
            <div className="border border-gray-200 dark:border-gray-700 p-4 md:p-6 rounded-2xl space-y-5 bg-white dark:bg-gray-800">
              <h2 className="text-lg md:text-xl font-light text-gray-400 dark:text-gray-500">
                Stock Level
              </h2>
              <div className="relative flex flex-col space-y-2">
                <label className="text-gray-700 dark:text-gray-300 font-medium md:text-xl">
                  Quantity
                </label>
                <input
                  type="number"
                  placeholder="Enter the number of units available"
                  {...register("quantity")}
                  className={twMerge(
                    "outline-none border border-gray-200 dark:border-gray-600 ring ring-transparent py-2 px-3 rounded-lg duration-300 placeholder:text-gray-400 dark:placeholder:text-gray-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100",
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
            <div className="border border-gray-200 dark:border-gray-700 p-4 md:p-6 rounded-2xl space-y-5 bg-white dark:bg-gray-800">
              <h2 className="text-lg md:text-xl font-light text-gray-400 dark:text-gray-500">
                Pricing
              </h2>
              <div className="relative flex flex-col space-y-2">
                <label className="text-gray-700 dark:text-gray-300 font-medium md:text-xl">
                  Price
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  placeholder="Set the price for this product (e.g., 29.99)"
                  {...register("price")}
                  className={twMerge(
                    "outline-none border border-gray-200 dark:border-gray-600 ring ring-transparent py-2 px-3 rounded-lg duration-300 placeholder:text-gray-400 dark:placeholder:text-gray-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100",
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
            <div className="border border-gray-200 dark:border-gray-700 p-4 md:p-6 rounded-2xl space-y-5 bg-white dark:bg-gray-800">
              <div className="flex items-center justify-between">
                <h2 className="text-lg md:text-xl font-light text-gray-400 dark:text-gray-500">
                  Stripe Product ID
                </h2>

                <div className="relative w-12 h-5">
                  <Image src="/assets/stripe.png" alt="stripe img" fill />
                </div>
              </div>
              <div className="relative flex flex-col space-y-2">
                <label className="text-gray-700 dark:text-gray-300 font-medium md:text-xl">
                  Product ID{" "}
                  <span className="text-gray-400 dark:text-gray-500 text-sm md:text-base font-normal">
                    (generated by server)
                  </span>
                </label>
                <div className="outline-none border border-gray-200 dark:border-gray-600 ring ring-transparent py-2 px-3 rounded-lg duration-300 bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-400 cursor-not-allowed">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    This ID will be automatically generated when the product is
                    created
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
          className={`fixed bottom-4 right-4 z-50 max-w-sm w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg border-l-4 p-4 ${
            notification.type === "success"
              ? "border-green-500"
              : "border-red-500"
          }`}
        >
          <div className="flex items-center">
            <div
              className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                notification.type === "success"
                  ? "bg-green-100 dark:bg-green-900"
                  : "bg-red-100 dark:bg-red-900"
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
                    ? "text-green-800 dark:text-green-200"
                    : "text-red-800 dark:text-red-200"
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
                    ? "text-green-500 hover:bg-green-100 dark:hover:bg-green-900"
                    : "text-red-500 hover:bg-red-100 dark:hover:bg-red-900"
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

export default AddNewProduct;
