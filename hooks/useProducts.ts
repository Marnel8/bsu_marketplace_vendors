import { Product } from "@/components/products/products";
import api from "@/utils/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const fetchProducts = async () => {
  const response = await api.get("/item/vendor-items");

  return response.data;
};

export const useFetchProducts = () => {
  return useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });
};

const createProduct = async (productData: any) => {
  try {
    const response = await api.post("/item", productData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response;
  } catch (error: any) {
    throw new Error(error.response);
  }
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({});
    },
  });
};

const addImages = async ({
  images,
  itemId,
}: {
  images: File[];
  itemId: string;
}) => {
  try {
    const formData = new FormData();

    images.forEach((image) => {
      formData.append("images", image);
    });

    const response = await api.post(`/item/${itemId}/upload-images`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Error uploading images");
  }
};

export const useAddImages = () => {
  return useMutation({
    mutationFn: addImages,
  });
};

const deleteProduct = async (id: string) => {
  try {
    const response = await api.delete(`/item/${id}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Error deleting product");
  }
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({});
    },
  });
};

const updateProduct = async (productData: Product) => {
  try {
    const response = await api.put(`/item/${productData.id}`, productData);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Error updating product");
  }
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({});
    },
  });
};
