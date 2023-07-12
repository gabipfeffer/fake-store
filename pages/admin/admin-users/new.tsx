import AdminLayout from "src/components/AdminLayout";
import { ChangeEvent, FormEvent, useState } from "react";
import { User } from "../../../typings";
import { uuidv4 } from "@firebase/util";
import { useRouter } from "next/router";
import { setLoader } from "src/slices/loaderReducer";
import { useDispatch } from "react-redux";
import UserForm from "src/components/UserForm";

export default function NewUserPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const [user, setUser] = useState<Partial<User>>({ id: uuidv4() });

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
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

      const createdUserResponse: { id: string } = await fetch(
        "/api/admin-users",
        {
          method: "POST",
          body: JSON.stringify({ user }),
        }
      ).then((res: any) => res.json());

      if (!createdUserResponse) {
        throw new Error("Error creating user");
      }
      // @ts-ignore
      dispatch(setLoader(false));
      router.push(`/admin/admin-users/${createdUserResponse.id}`);
    } catch (e: any) {
      alert(`Error creating user: ${e.message}`);
    }
  };

  return (
    <AdminLayout>
      <h1 className={"py-4 text-xl text-gray-900"}>New User</h1>
      <UserForm
        user={user}
        onSubmit={handleOnSubmit}
        onChange={handleInputChange}
      />
    </AdminLayout>
  );
}
