import AdminLayout from "src/components/AdminLayout";
import { ChangeEvent, FormEvent, useState } from "react";
import { Category } from "../../../typings";
import { uuidv4 } from "@firebase/util";
import { useRouter } from "next/router";
import { setLoader } from "src/slices/loaderReducer";
import { useDispatch } from "react-redux";
import CategoryForm from "src/components/CategoryForm";

export default function NewCategoryPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const [category, setCategory] = useState<Partial<Category>>({ id: uuidv4() });

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const prop = e.target.name as keyof Category;
    setCategory({ ...category, [prop]: e.target.value });
  };

  const handleOnSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      // @ts-ignore
      dispatch(setLoader(true));

      const createdCategoryResponse: { id: string } = await fetch(
        "/api/categories",
        {
          method: "POST",
          body: JSON.stringify({ category: category }),
        }
      ).then((res: any) => res.json());

      if (!createdCategoryResponse) {
        throw new Error("Error creating category");
      }
      // @ts-ignore
      dispatch(setLoader(false));
      router.push(`/admin/categories/${createdCategoryResponse.id}`);
    } catch (e: any) {
      alert(`Error creating category: ${e.message}`);
    }
  };

  const handleImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target?.files;

    if (files?.length && files?.length > 0) {
      const formData = new FormData();
      for (const file of files) {
        formData.append(`${category?.id}/${file.name}`, file);
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

      setCategory({
        ...category,
        images: category?.images?.length
          ? [...category?.images, ...response]
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
        const deletedImageIndex = category.images?.findIndex(
          (image) => image.name === fileName
        );

        if (category.images?.length && deletedImageIndex) {
          const images = [...category.images];
          images.splice(deletedImageIndex, 1);

          setCategory({ ...category, images });
        }
      }
    } catch (e: any) {
      alert(`Error deleting image: ${e.message}`);
    }
  };

  return (
    <AdminLayout>
      <h1 className={"py-4 text-xl text-gray-900"}>New Category</h1>
      <CategoryForm
        category={category}
        onSubmit={handleOnSubmit}
        onChange={handleInputChange}
        onImageChange={handleImageChange}
        onImageDelete={handleImageDelete}
      />
    </AdminLayout>
  );
}
