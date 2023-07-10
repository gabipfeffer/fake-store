import AdminLayout from "src/components/AdminLayout";
import { Category } from "../../../../typings";
import { useDispatch } from "react-redux";
import {
  GetStaticPaths,
  GetStaticPropsContext,
  InferGetStaticPropsType,
} from "next";
import { getCategoryById, getCategories } from "src/utils/firestore";
import { useRouter } from "next/router";
import { setLoader } from "src/slices/loaderReducer";

export default function DeleteCategoryPage({
  category,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const router = useRouter();
  const dispatch = useDispatch();

  const handleDelete = async () => {
    try {
      // @ts-ignore
      dispatch(setLoader(true));

      const deletedCategoryResponse: { id: string } = await fetch(
        `/api/categories?id=${category.id}`,
        {
          method: "DELETE",
        }
      ).then((res: any) => res.json());

      if (!deletedCategoryResponse) {
        throw new Error("Error deleting category");
      }
      // @ts-ignore
      dispatch(setLoader(false));
      router.push(`/admin/categories`);
    } catch (e: any) {
      alert(`Error creating category: ${e.message}`);
    }
  };

  return (
    <AdminLayout>
      <h1 className={"py-4 text-xl text-gray-900"}>{category.title}</h1>
      <p>Do you really want to delete {category.title}?</p>
      <div className={"flex items-center space-x-5"}>
        <button
          onClick={() => router.push(`/admin/categories`)}
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
