"use client";

import { PencilIcon } from "@heroicons/react/24/outline";
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

  return (
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
          <div className="grid grid-cols-7 py-2.5 px-6 border-b border-gray-200 font-medium">
            <p className="col-start-1 col-end-3 text-left">Products</p>
            <p>Price</p>
            <p>Stock</p>
            <p>Stock Level</p>
            <p>Published</p>
            <p>Manage</p>
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
                    (product.id.charCodeAt(0) + product.id.charCodeAt(1)) % 100,
                  ) + 1;

                return (
                  <div
                    key={product.id}
                    className="grid grid-cols-7 py-5 px-6 items-center"
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
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
