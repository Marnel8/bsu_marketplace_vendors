"use client";
import VendorItemsDashboard from "@/components/products/products";
import { useFetchProducts } from "@/hooks/useProducts";

const ProductPage = () => {
  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold mb-6">Products</h1>
      <VendorItemsDashboard  />
    </div>
  );
};

export default ProductPage;
