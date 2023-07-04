import AdminLayout from "src/components/AdminLayout";
import { ChangeEvent, FormEvent, useState } from "react";
import { Product } from "../../../typings";
import { setLoader } from "src/slices/loaderReducer";
import { useDispatch } from "react-redux";
import ProductForm from "src/components/ProductForm";
import {
  GetStaticPaths,
  GetStaticPropsContext,
  InferGetStaticPropsType,
} from "next";
import { getProductById, getProducts } from "src/utils/firestore";

export default function ProductPage({
  product: initialProduct,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const dispatch = useDispatch();
  const [product, setProduct] = useState<Product>(initialProduct);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const prop = e.target.name as keyof Product;
    setProduct({ ...product, [prop]: e.target.value });
  };

  const handleOnSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      // @ts-ignore
      dispatch(setLoader(true));

      const updatedProductResponse: { id: string } = await fetch(
        "/api/products",
        {
          method: "PUT",
          body: JSON.stringify({ product }),
        }
      ).then((res: any) => res.json());

      if (!updatedProductResponse) {
        throw new Error("Error creating product");
      }
      // @ts-ignore
      dispatch(setLoader(false));
    } catch (e: Error) {
      alert(`Error creating product: ${e.message}`);
    }
  };

  return (
    <AdminLayout>
      <h1 className={"py-4 text-xl text-gray-900"}>{product.title}</h1>
      <ProductForm
        product={product}
        onSubmit={handleOnSubmit}
        onChange={handleInputChange}
      />
    </AdminLayout>
  );
}

export const getStaticProps = async (
  context: GetStaticPropsContext<{ id: string }>
) => {
  const product: Product = await getProductById(context.params.id);
  return {
    props: {
      product,
    },
    revalidate: 20,
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const products: Product[] = await getProducts();

  return {
    paths: products.map((product: Product) => ({
      params: {
        id: product.id,
      },
    })),
    fallback: "blocking",
  };
};
