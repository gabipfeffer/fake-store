import AdminLayout from "src/components/AdminLayout";
import { ChangeEvent, FormEvent, useState } from "react";
import { Product } from "../../../../typings";
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
    } catch (e: any) {
      alert(`Error creating product: ${e.message}`);
    }
  };

  const handleImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
    try {
      const files = e.target?.files;

      if (files?.length && files?.length > 0) {
        const formData = new FormData();
        for (const file of files) {
          formData.append(`${product.id}/${file.name}`, file);
        }

        const options: {
          method: string;
          body: any;
          headers: { "Content-Type"?: string };
        } = {
          method: "POST",
          body: formData,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        };
        delete options.headers["Content-Type"];

        const response: { name: string; imageUrl: string }[] = await fetch(
          "/api/file",
          options
        ).then((res) => res.json());

        setProduct({
          ...product,
          images: product?.images?.length
            ? [...product?.images, ...response]
            : response,
        });
      }
    } catch (e: any) {
      alert(`Error uploading image: ${e.message}`);
    }
  };

  const handleImageDelete = async (fileName: string) => {
    try {
      const response = await fetch(`/api/file?file=${fileName}`, {
        method: "DELETE",
      }).then((res) => res.json());

      if (response) {
        const deletedImageIndex = product.images?.findIndex(
          (image) => image.name === fileName
        );

        const images = [...product.images];
        images.splice(deletedImageIndex, 1);

        setProduct({ ...product, images });
      }
    } catch (e: any) {
      alert(`Error deleting image: ${e.message}`);
    }
  };

  return (
    <AdminLayout>
      <h1 className={"py-4 text-xl text-gray-900"}>{product.title}</h1>
      <ProductForm
        product={product}
        onSubmit={handleOnSubmit}
        onChange={handleInputChange}
        onImageChange={handleImageChange}
        onImageDelete={handleImageDelete}
      />
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
