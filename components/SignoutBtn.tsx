"use client";
import { useLogout } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const SignoutBtn = () => {
  const router = useRouter();
  const { mutateAsync: logout, isSuccess } = useLogout();

  useEffect(() => {
    if (isSuccess) {
      router.push("/auth");
    }
  }, [isSuccess]);

  return <span onClick={() => logout()}>Sign out</span>;
};

export default SignoutBtn;
