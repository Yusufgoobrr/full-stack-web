import api from "@/lib/axios";
import { TProduct } from "@/types";

import ProductDetails from "../_components/ProductDetails";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

const Page = async ({ params }: Props) => {
  console.log(params);
  const { id } = await params;

  try {
    const { data }: { data: TProduct } = await api.get(
      `/api/v1/products/${id}`,
    );
    return <ProductDetails product={data} />;
  } catch (error: any) {
    const statusCode = error.response.status;

    if (statusCode === 404) {
      return `product [${id}] not found`;
    }

    return "failed to load products";
  }
};

export default Page;
