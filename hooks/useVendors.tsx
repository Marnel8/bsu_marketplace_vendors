import api from "@/utils/api";
import {
	QueryKey,
	useMutation,
	useQuery,
	useQueryClient,
} from "@tanstack/react-query";

const fetchVendors = async () => {
	const response = await api.get("/vendor");

	return response.data;
};

export const useFetchVendors = () => {
	return useQuery({
		queryKey: ["vendors"],
		queryFn: fetchVendors,
		staleTime: 15000,
	});
};

const fetchVendorByID = async (vendorId: string) => {
	const response = await api.get(`/vendor/${vendorId}`);

	return response.data;
};

export const useFetchVendorByID = (vendorId: string) => {
	return useQuery({
		queryKey: ["vendor", vendorId],
		queryFn: () => fetchVendorByID(vendorId),
		enabled: !!vendorId,
		staleTime: 15000,
	});
};

export const updateVerification = async ({
	vendorId,
	reason,
	newStatus,
}: {
	vendorId: string;
	reason?: string;
	newStatus: string;
}) => {
	const response = await api.put(`/vendor/${vendorId}`, { reason, newStatus });

	return response.data;
};
export const useVerify = ({ vendorId }: { vendorId: string }) => {
	const queryClient = useQueryClient();

	console.log("test");

	return useMutation({
		mutationFn: updateVerification,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["vendor", vendorId] });
		},
	});
};

const deleteVendor = async (id: string) => {
	const response = await api.delete(`/vendor/${id}`);

	return response.data;
};

export const useDeleteVendor = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: deleteVendor,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["vendors"] });
		},
	});
};
