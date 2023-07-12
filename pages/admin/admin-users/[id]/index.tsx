import AdminLayout from "src/components/AdminLayout";
import { ChangeEvent, FormEvent, useState } from "react";
import { User } from "../../../../typings";
import { setLoader } from "src/slices/loaderReducer";
import { useDispatch } from "react-redux";
import UserForm from "src/components/UserForm";
import {
  GetStaticPaths,
  GetStaticPropsContext,
  InferGetStaticPropsType,
} from "next";
import { getAdminUserById, getAdminUsers } from "src/utils/firestore";

export default function UserPage({
  user: initialUser,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const dispatch = useDispatch();
  const [user, setUser] = useState<User>(initialUser);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const prop = e.target.name as keyof User;
    const value =
      e.target.type === "number" ? Number(e.target.value) : e.target.value;
    setUser({ ...user, [prop]: value });
  };

  const handleOnSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      // @ts-ignore
      dispatch(setLoader(true));

      const updatedUserResponse: { id: string } = await fetch(
        "/api/admin-users",
        {
          method: "PUT",
          body: JSON.stringify({ user }),
        }
      ).then((res: any) => res.json());

      if (!updatedUserResponse) {
        throw new Error("Error creating user");
      }
      // @ts-ignore
      dispatch(setLoader(false));
    } catch (e: any) {
      alert(`Error creating user: ${e.message}`);
    }
  };

  return (
    <AdminLayout>
      <h1 className={"py-4 text-xl text-gray-900"}>{user.name}</h1>
      <UserForm
        user={user}
        onSubmit={handleOnSubmit}
        onChange={handleInputChange}
      />
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
