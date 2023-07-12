import AdminLayout from "src/components/AdminLayout";
import { ChangeEvent, FormEvent, useState } from "react";
import { Category } from "../../../../typings";
import { setLoader } from "src/slices/loaderReducer";
import { useDispatch } from "react-redux";
import CategoryForm from "src/components/CategoryForm";
import {
  GetStaticPaths,
  GetStaticPropsContext,
  InferGetStaticPropsType,
} from "next";
import { getCategories, getCategoryById } from "src/utils/firestore";

export default function CategoriesPage({
  category: initialCategory,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const dispatch = useDispatch();
  const [category, setCategory] = useState<Category>(initialCategory);

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

      const updatedCategoryResponse: { id: string } = await fetch(
        "/api/categories",
        {
          method: "PUT",
          body: JSON.stringify({ category }),
        }
      ).then((res: any) => res.json());

      if (!updatedCategoryResponse) {
        throw new Error("Error creating category");
      }
      // @ts-ignore
      dispatch(setLoader(false));
    } catch (e: any) {
      alert(`Error creating category: ${e.message}`);
    }
  };

  const handleImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
    try {
      const files = e.target?.files;

      if (files?.length && files?.length > 0) {
        const formData = new FormData();
        for (const file of files) {
          formData.append(`${category.id}/${file.name}`, file);
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
        const deletedImageIndex = category.images?.findIndex(
          (image) => image.name === fileName
        );

        const images = [...category.images];
        images.splice(deletedImageIndex, 1);

        setCategory({ ...category, images });
      }
    } catch (e: any) {
      alert(`Error deleting image: ${e.message}`);
    }
  };

  return (
    <AdminLayout>
      <h1 className={"py-4 text-xl text-gray-900"}>{category.title}</h1>
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

export const getStaticProps = async (
  context: GetStaticPropsContext<{ id: string }>
) => {
  const category: Category = await getCategoryById(context?.params?.id!);
  return {
    props: {
      category,
    },
    revalidate: 20,
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const categories: Category[] = await getCategories();

  return {
    paths: categories.map((category: Category) => ({
      params: {
        id: category.id,
      },
    })),
    fallback: "blocking",
  };
};
