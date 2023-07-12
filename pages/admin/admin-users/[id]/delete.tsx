import AdminLayout from "src/components/AdminLayout";
import { User } from "../../../../typings";
import { useDispatch } from "react-redux";
import {
  GetStaticPaths,
  GetStaticPropsContext,
  InferGetStaticPropsType,
} from "next";
import { getAdminUserById, getAdminUsers } from "src/utils/firestore";
import { useRouter } from "next/router";
import { setLoader } from "src/slices/loaderReducer";

export default function DeleteUserPage({
  user,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const router = useRouter();
  const dispatch = useDispatch();

  const handleDelete = async () => {
    try {
      // @ts-ignore
      dispatch(setLoader(true));

      const deletedUserResponse: { id: string } = await fetch(
        `/api/admin-users?id=${user.id}`,
        {
          method: "DELETE",
        }
      ).then((res: any) => res.json());

      if (!deletedUserResponse) {
        throw new Error("Error deleting user");
      }
      // @ts-ignore
      dispatch(setLoader(false));
      router.push(`/admin/admin-users`);
    } catch (e: any) {
      alert(`Error creating user: ${e.message}`);
    }
  };

  return (
    <AdminLayout>
      <h1 className={"py-4 text-xl text-gray-900"}>{user.name}</h1>
      <p>Do you really want to delete {user.name}?</p>
      <div className={"flex items-center space-x-5"}>
        <button
          onClick={() => router.push(`/admin/admin-users`)}
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
  const user: User = await getAdminUserById(context?.params?.id!);
  return {
    props: {
      user,
    },
    revalidate: 20,
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const users: User[] = await getAdminUsers();

  return {
    paths: users.map((user: User) => ({
      params: {
        id: user.id,
      },
    })),
    fallback: "blocking",
  };
};
