"use client";

import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";

import api from "@/lib/axios";
import { TProduct } from "@/types";

const Page = () => {
  const [products, setProducts] = useState<TProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [publishedStatus, setPublishedStatus] = useState<boolean[]>([]);
  const [deleteConfirmIndex, setDeleteConfirmIndex] = useState<number | null>(
    null,
  );
  const [notification, setNotification] = useState<{
    show: boolean;
    message: string;
    type: "success" | "error";
  }>({ show: false, message: "", type: "success" });

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const { data } = await api.get("/api/v1/products");
        setProducts(data);
        // Initialize published status array based on product isPublished field
        setPublishedStatus(
          data.map((product: TProduct) => product.isPublished),
        );
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to fetch products");
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const togglePublished = async (index: number, productId: string) => {
    try {
      const newPublishedStatus = !publishedStatus[index];

      // TODO: Update the published status on the server
      await api.put(`/api/v1/products/${productId}`, {
        isPublished: newPublishedStatus,
      });

      // Update local state only after successful API call
      setPublishedStatus((prev) => {
        const newStatus = [...prev];
        newStatus[index] = newPublishedStatus;
        return newStatus;
      });
    } catch (error) {
      console.error("Failed to update published status:", error);
      // Optionally show an error message to the user
    }
  };

  const showNotification = (message: string, type: "success" | "error") => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification((prev) => ({ ...prev, show: false }));
    }, 3000);
  };

  const handleDeleteProduct = async (index: number, productId: string) => {
    try {
      await api.delete(`/api/v1/products/${productId}`);

      // Remove product from local state
      setProducts((prev) => prev.filter((_, i) => i !== index));
      setPublishedStatus((prev) => prev.filter((_, i) => i !== index));
      setDeleteConfirmIndex(null);

      showNotification("Product deleted successfully!", "success");
    } catch (error: any) {
      console.error("Failed to delete product:", error);
      const errorMessage =
        error.response?.data?.message || "Failed to delete product";
      showNotification(errorMessage, "error");
    }
  };

  return (
    <>
      <div className="space-y-5 md:space-y-8">
        <div className="flex items-center justify-between">
          <h2 className="text-lg md:text-xl">My Listing</h2>
          <Link
            href="/dashboard/products/new"
            className="py-1.5 px-4 font-medium rounded-full text-sm border-2 border-transparent bg-[#BAFC50] hover:bg-white hover:border-[#BAFC50] hover:scale-95 duration-200"
          >
            <p>Add New Product</p>
          </Link>
        </div>

        <div className="border border-gray-200 rounded-2xl text-center overflow-x-auto">
          <div className="min-w-[1200px]">
            <div className="grid grid-cols-8 py-2.5 px-6 border-b border-gray-200 font-medium">
              <p className="col-start-1 col-end-3 text-left">Products</p>
              <p>Price</p>
              <p>Stock</p>
              <p>Stock Level</p>
              <p>Published</p>
              <p>Manage</p>
              <p>Delete</p>
            </div>

            <div className="divide-y divide-gray-200">
              {loading ? (
                <div className="py-8 text-center">
                  <p>Loading products...</p>
                </div>
              ) : error ? (
                <div className="py-8 text-center text-red-500">
                  <p>Error: {error}</p>
                </div>
              ) : products.length === 0 ? (
                <div className="py-8 text-center">
                  <p>No products found</p>
                </div>
              ) : (
                products.map((product, index) => {
                  // Generate consistent random percentage for stock level display based on product ID
                  const randomPercentage =
                    Math.floor(
                      (product.id.charCodeAt(0) + product.id.charCodeAt(1)) %
                        100,
                    ) + 1;

                  return (
                    <div
                      key={product.id}
                      className="grid grid-cols-8 py-5 px-6 items-center"
                    >
                      <div className="col-start-1 col-end-3 text-left">
                        <div className="flex items-center space-x-4">
                          <Image
                            src={`/assets/products/${product.name}.png`}
                            alt="product img"
                            width={60}
                            height={60}
                          />

                          <p className="line-clamp-1">{product.name}</p>
                        </div>
                      </div>

                      <div>
                        <p>${product.price}</p>
                      </div>

                      <div>
                        <p>{product.stockLevel}</p>
                      </div>

                      <div className="space-y-2">
                        <div
                          className={twMerge(
                            "w-full h-1.5 bg-gray-100 border border-gray-200 rounded-full duration-500",
                          )}
                        >
                          <motion.div
                            className={twMerge(
                              "h-full rounded-full",
                              randomPercentage >= 80
                                ? "bg-red-500"
                                : randomPercentage >= 50
                                  ? "bg-yellow-500"
                                  : "bg-green-500",
                            )}
                            initial={{ width: 0 }}
                            animate={{ width: `${randomPercentage}%` }}
                            transition={{ duration: 0.5 }}
                          ></motion.div>
                        </div>

                        <p className="text-sm text-gray-600">
                          {randomPercentage}%
                        </p>
                      </div>

                      <div>
                        <button
                          className={twMerge(
                            "p-[3px] rounded-full w-11 duration-300",
                            publishedStatus[index]
                              ? "bg-green-500"
                              : "bg-gray-200 hover:bg-green-200",
                          )}
                          onClick={() => togglePublished(index, product.id)}
                        >
                          <div
                            className={twMerge(
                              "w-5 h-5 bg-white rounded-full shadow-xl duration-300",
                              publishedStatus[index] && "translate-x-[90%]",
                            )}
                          />
                        </button>
                      </div>

                      <div className="flex justify-center">
                        <Link
                          href={`/dashboard/products/${product.id}/edit`}
                          className="flex items-center space-x-2 border border-gray-200 rounded-full px-3 py-1 hover:bg-black hover:text-white hover:scale-95 duration-200"
                        >
                          <PencilIcon className="w-4 h-4" />
                          <p>Manage</p>
                        </Link>
                      </div>

                      <div className="flex justify-center">
                        {deleteConfirmIndex === index ? (
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() =>
                                handleDeleteProduct(index, product.id)
                              }
                              className="px-3 py-1 bg-red-500 text-white rounded-full text-sm hover:bg-red-600 duration-200 cursor-pointer"
                            >
                              Yes
                            </button>
                            <button
                              onClick={() => setDeleteConfirmIndex(null)}
                              className="px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-sm hover:bg-gray-300 duration-200 cursor-pointer"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setDeleteConfirmIndex(index)}
                            className="flex items-center space-x-2 border border-red-200 text-red-500 rounded-full px-3 py-1 hover:bg-red-500 hover:text-white hover:scale-95 duration-200 cursor-pointer"
                          >
                            <TrashIcon className="w-4 h-4" />
                            <p>Delete</p>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>

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

export default Page;
