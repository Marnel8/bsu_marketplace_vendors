import api from "@/utils/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const getAllOrders = async () => {
	const response = await api.get("/order/vendor-orders");
	return response.data;
};

export const useGetAllOrders = () => {
	return useQuery({
		queryKey: ["orders"],
		queryFn: getAllOrders,
		staleTime: 15000,
	});
};

const updateOrderStatus = async ({
	id,
	status,
}: {
	id: string;
	status: string;
}) => {
	try {
		const response = await api.put(`/order/${id}`, { status });
		return response.data;
	} catch (error: any) {
		throw new Error(error.response?.data?.message || "Error updating order");
	}
};

export const useUpdateOrderStatus = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: updateOrderStatus,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["orders"] });
		},
	});
};

const deleteOrder = async (orderId: string) => {
	try {
		const response = await api.delete(`/order/${orderId}`);
		return response.data;
	} catch (error: any) {
		throw new Error(error.response?.data?.message || "Error updating order");
	}
};

export const useDeleteOrder = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: deleteOrder,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["orders"] });
		},
	});
};
