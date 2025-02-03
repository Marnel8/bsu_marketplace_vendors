import api from "../utils/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

interface LoginCredentials {
	email: string;
	password: string;
}

const login = async ({ email, password }: LoginCredentials) => {
	try {
		const response = await api.post("/user/", { email, password });
		return response.data;
	} catch (error: any) {
		if (error.response) {
			throw new Error(error.response.data.message || "Login failed");
		} else if (error.request) {
			throw new Error("No response from server");
		} else {
			throw new Error("Error in login request: " + error.message);
		}
	}
};

export const useLogin = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: login,
		onSuccess: (data) => {
			queryClient.setQueryData(["user"], data.user);
		},
	});
};

const fetchCurrentUser = async () => {
	try {
		const response = await api.get("/user/me");
		return response.data;
	} catch (error: any) {
		if (error.response) {
			throw new Error(error.response.data.message || "Login failed");
		} else if (error.request) {
			throw new Error("No response from server");
		} else {
			throw new Error("Error in login request: " + error.message);
		}
	}
};

export const useFetchCurrentUser = () => {
	return useQuery({
		queryKey: ["user"],
		queryFn: fetchCurrentUser,
		staleTime: 15000,
	});
};

const logout = async () => {
	try {
		const response = await api.post("/user/logout");

		return response.data;
	} catch (error: any) {
		if (error.response) {
			throw new Error(error.response.data.message || "Login failed");
		} else if (error.request) {
			throw new Error("No response from server");
		} else {
			throw new Error("Error in login request: " + error.message);
		}
	}
};

export const useLogout = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: logout,
		onSuccess: () => {
			queryClient.removeQueries({ queryKey: ["user"] });
		},
	});
};
