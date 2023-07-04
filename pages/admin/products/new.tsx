import AdminLayout from "src/components/AdminLayout";
import { ChangeEvent, FormEvent, useState } from "react";
import { Product } from "../../../typings";
import { uuidv4 } from "@firebase/util";
import { useRouter } from "next/router";
import { setLoader } from "src/slices/loaderReducer";
import { useDispatch } from "react-redux";
import ProductForm from "src/components/ProductForm";

export default function NewProductPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const [newProduct, setNewProduct] = useState<Partial<Product> | undefined>(
    undefined
  );

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const prop = e.target.name as keyof Product;
    setNewProduct({ ...newProduct, [prop]: e.target.value });
  };

  const handleOnSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      // @ts-ignore
      dispatch(setLoader(true));

      const id = uuidv4();
      const createdProductResponse: { id: string } = await fetch(
        "/api/products",
        {
          method: "POST",
          body: JSON.stringify({ product: { ...newProduct, id } }),
        }
      ).then((res: any) => res.json());

      if (!createdProductResponse) {
        throw new Error("Error creating product");
      }
      // @ts-ignore
      dispatch(setLoader(false));
      router.push(`/admin/products/${createdProductResponse.id}`);
    } catch (e: Error) {
      alert(`Error creating product: ${e.message}`);
    }
  };

  return (
    <AdminLayout>
      <h1 className={"py-4 text-xl text-gray-900"}>New Product</h1>
      <ProductForm
        product={newProduct}
        onSubmit={handleOnSubmit}
        onChange={handleInputChange}
      />
    </AdminLayout>
  );
}
