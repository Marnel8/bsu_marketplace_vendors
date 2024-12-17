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
      queryClient.invalidateQueries({});
    },
  });
};
