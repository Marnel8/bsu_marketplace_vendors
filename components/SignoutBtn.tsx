"use client";
import { toast } from "@/hooks/use-toast";
import { useLogout } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const SignoutBtn = () => {
	const router = useRouter();
	const { mutateAsync: logout, isSuccess } = useLogout();

	const handleLogout = async () => {
		try {
			await logout();
			router.push("/auth");
		} catch (error) {
			toast({
				variant: "destructive",
				description: "Logout failed",
			});
		}
	};

	useEffect(() => {
		if (isSuccess) router.push("/auth");
	}, [logout]);

	return (
		<button onClick={handleLogout} className="text-sm">
			Sign out
		</button>
	);
};

export default SignoutBtn;
