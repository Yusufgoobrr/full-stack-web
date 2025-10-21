import ProductCard from "@/components/ProductCard";
import api from "@/lib/axios";

type TProduct = {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  stockLevel: number;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
};

const Page = async () => {
  const { data, status } = await api.get("/api/v1/products");

  if (status != 200) {
    return <p className="text-red-500">Oops there was an error... Try again</p>;
  }

  console.log(data);
  const products = data.map((p: TProduct, index: number) => {
    return (
      <div key={index} className="w-sm">
        <ProductCard
          name={p.name}
          price={p.price}
          imageUrl={`/assets/products/${p.name}.png`}
          link={`/dashboard/products/${p.id}`}
        />
      </div>
    );
  });

  return (
    <div className="space-y-5 md:space-y-8">
      <h2 className="text-lg md:text-xl">Explore Products</h2>
      <div className="flex flex-wrap gap-4 md:gap-6">{products}</div>
    </div>
  );
};

export default Page;

/*
This is the equivalent client side rendering

'use client'

import api from "@/lib/axios";
import { useEffect, useState } from "react";

const Page = () => {
    const [data, setData] = useState([]);

    const getData = async () => {
        const { data } = await api.get('/api/v1/products');
        setData(data);
    }

    useEffect(() => {
        getData();
    }, []);


    const products = data.map((p: any, index: number) => {
        return (
            <div key={index}>
                <h1>{p.id}</h1>
                <p>{p.name}</p>
                <p>{p.description}</p>
                <p>{p.price}</p>
                <hr/>
                <br/>
            </div>
        )
    });

    return products;
};

export default Page;
*/
