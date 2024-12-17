"use client";

import { useState } from "react";
import { ProductsTable } from "@/components/products/products-table";
import { ProductDialog } from "@/components/products/products-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusCircle, Search } from "lucide-react";
import { useFetchProducts } from "@/hooks/useProducts";

export interface Product {
  id: string;
  name: string;
  price: number;
  quantity: number;
  category: string;
  description?: string;
  thumbnail?: string | File | null;
  images?: (string | File)[];
}

export default function VendorItemsDashboard() {
  const { data: products } = useFetchProducts();
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<Product | null>(null);

  const filteredItems =
    products &&
    products.filter(
      (item: Product) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div className="relative flex-grow mr-4">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
        <Button
          onClick={() => {
            setCurrentItem(null);
            setIsDialogOpen(true);
          }}
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Item
        </Button>
      </div>

      <ProductsTable
        items={filteredItems}
        onEdit={(item) => {
          setIsDialogOpen(true);
          setCurrentItem(item);
        }}
        onDelete={() => console.log("delete")}
        onView={(item) => {
          console.log("Viewing item:", item);
        }}
      />

      <ProductDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        item={currentItem}
      />
    </div>
  );
}
