import AdminLayout from "src/components/AdminLayout";
import { Product } from "../../../../typings";
import { useDispatch } from "react-redux";

import {
  GetStaticPaths,
  GetStaticPropsContext,
  InferGetStaticPropsType,
} from "next";
import { getProductById, getProducts } from "src/utils/firestore";
import { useRouter } from "next/router";
import { setLoader } from "src/slices/loaderReducer";

export default function DeleteProductPage({
  product,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const router = useRouter();
  const dispatch = useDispatch();

  const handleDelete = async () => {
    try {
      // @ts-ignore
      dispatch(setLoader(true));

      const deletedProductResponse: { id: string } = await fetch(
        `/api/products?id=${product.id}`,
        {
          method: "DELETE",
        }
      ).then((res: any) => res.json());

      if (!deletedProductResponse) {
        throw new Error("Error deleting product");
      }
      // @ts-ignore
      dispatch(setLoader(false));
      router.push(`/admin/products`);
    } catch (e: any) {
      alert(`Error creating product: ${e.message}`);
    }
  };

  return (
    <AdminLayout>
      <h1 className={"py-4 text-xl text-gray-900"}>{product.title}</h1>
      <p>Do you really want to delete {product.title}?</p>
      <div className={"flex items-center space-x-5"}>
        <button
          onClick={() => router.push(`/admin/products`)}
          className={"adminButton rounded-sm"}
        >
          No
        </button>
        <button className={"button"} onClick={handleDelete}>
          Yes
        </button>
      </div>
    </AdminLayout>
  );
}

export const getStaticProps = async (
  context: GetStaticPropsContext<{ id: string }>
) => {
  const product: Product = await getProductById(context?.params?.id!);
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
