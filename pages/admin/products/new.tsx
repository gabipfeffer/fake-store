import AdminLayout from "src/components/AdminLayout";
import { ChangeEvent, FormEvent, useState } from "react";
import { Category, Product } from "../../../typings";
import { uuidv4 } from "@firebase/util";
import { useRouter } from "next/router";
import { setLoader } from "src/slices/loaderReducer";
import { useDispatch } from "react-redux";
import ProductForm from "src/components/ProductForm";
import { InferGetStaticPropsType } from "next";
import { getCategories } from "src/utils/firestore";

export default function NewProductPage({
  categories: initialCategories,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const dispatch = useDispatch();
  const router = useRouter();
  const [product, setProduct] = useState<Partial<Product>>({ id: uuidv4() });
  const [categories] = useState<Category[]>(initialCategories);

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

      const createdProductResponse: { id: string } = await fetch(
        "/api/products",
        {
          method: "POST",
          body: JSON.stringify({ product }),
        }
      ).then((res: any) => res.json());

      if (!createdProductResponse) {
        throw new Error("Error creating product");
      }
      // @ts-ignore
      dispatch(setLoader(false));
      router.push(`/admin/products/${createdProductResponse.id}`);
    } catch (e: any) {
      alert(`Error creating product: ${e.message}`);
    }
  };

  const handleImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target?.files;

    if (files?.length && files?.length > 0) {
      const formData = new FormData();
      for (const file of files) {
        formData.append(`${product?.id}/${file.name}`, file);
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

        if (product.images?.length && deletedImageIndex) {
          const images = [...product.images];
          images.splice(deletedImageIndex, 1);

          setProduct({ ...product, images });
        }
      }
    } catch (e: any) {
      alert(`Error deleting image: ${e.message}`);
    }
  };

  return (
    <AdminLayout>
      <h1 className={"py-4 text-xl text-gray-900"}>New Product</h1>
      <ProductForm
        product={product}
        categories={categories}
        onSubmit={handleOnSubmit}
        onChange={handleInputChange}
        onImageChange={handleImageChange}
        onImageDelete={handleImageDelete}
      />
    </AdminLayout>
  );
}

export const getStaticProps = async () => {
  try {
    const categories: Category[] = await getCategories();

    return {
      props: {
        categories,
      },
      revalidate: 20,
    };
  } catch (e: any) {
    throw new Error(e.message);
  }
};
