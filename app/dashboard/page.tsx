import api from "@/lib/axios";

const Page = async () => {
  const { data } = await api.get("/api/v1/products");
  const products = data.map((p: any, index: number) => {
    return (
      <div key={index}>
        <h1>{p.id}</h1>
        <p>{p.name}</p>
        <p>{p.description}</p>
        <p>{p.price}</p>
        <hr />
        <br />
      </div>
    );
  });

  return products;
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
