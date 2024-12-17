import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Product } from "./products";
import { useAddImages, useCreateProduct } from "@/hooks/useProducts";
import { toast } from "@/hooks/use-toast";

interface ProductDialogProps {
  isOpen: boolean;
  onClose: () => void;
  item: Product | null;
}

export function ProductDialog({ isOpen, onClose, item }: ProductDialogProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [category, setCategory] = useState("");
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [images, setImages] = useState<File[]>([]);

  const { mutateAsync: addProduct, isPending: isAddProductPending } =
    useCreateProduct();
  const { mutateAsync: addImages, isPending: isAddImagesPending } =
    useAddImages();

  const categories = [
    "food",
    "beverage",
    "electronics",
    "fashion",
    "home and garden",
    "beauty",
    "toys",
    "books",
    "sports",
    "other",
  ];

  useEffect(() => {
    if (item) {
      setName(item.name || "");
      setDescription(item.description || "");
      setPrice(typeof item.price === "number" ? item.price.toString() : "");
      setStock(
        typeof item.quantity === "number" ? item.quantity.toString() : ""
      );
      setCategory(item.category || "");
      // Note: We can't restore file inputs from existing data
    } else {
      setName("");
      setDescription("");
      setPrice("");
      setStock("");
      setCategory("");
      setThumbnail(null);
      setImages([]);
    }
  }, [item]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const productData = {
      name,
      description,
      category,
      stock,
      price,
      thumbnail,
    };

    try {
      const response = await addProduct(productData);

      toast({
        description: "Item added successfully!",
      });

      if (response) {
        const imageFiles = Array.from(images);
        await addImages({ images: imageFiles, itemId: response.data?.id });
        toast({
          description: "Images added successfully!",
        });
      }

      setName("");
      setDescription("");
      setPrice("");
      setStock("");
      setCategory("");
      setThumbnail(null);
      setImages([]);

      onClose();
    } catch (error: any) {
      console.error("Error adding item:", error.message);
      return;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[550px] max-h-[85vh] flex flex-col">
        <DialogHeader className="px-6 py-4">
          <DialogTitle className="text-xl">
            {item ? "Edit Item" : "Add New Item"}
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-6 custom-scrollbar">
          <form className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-sm text-muted-foreground">
                Basic Information
              </h3>
              <div className="space-y-4">
                <div className="flex flex-col space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div className="flex flex-col space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Inventory Details */}
            <div className="space-y-4">
              <h3 className="text-sm text-muted-foreground">
                Inventory Details
              </h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex flex-col space-y-2">
                  <Label htmlFor="price">Price</Label>
                  <Input
                    id="price"
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                  />
                </div>

                <div className="flex flex-col space-y-2">
                  <Label htmlFor="stock">Stock</Label>
                  <Input
                    id="stock"
                    type="number"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                  />
                </div>

                <div className="flex flex-col space-y-2 sm:col-span-2">
                  <Label htmlFor="category">Category</Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem
                          className="capitalize"
                          key={cat}
                          value={cat}
                        >
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Product Images */}
            <div className="space-y-4">
              <h3 className="text-sm text-muted-foreground">Product Images</h3>
              <div className="space-y-4">
                <div className="flex flex-col space-y-2">
                  <Label htmlFor="thumbnail">Thumbnail</Label>
                  <Input
                    id="thumbnail"
                    type="file"
                    accept="image/*"
                    onChange={(e) => setThumbnail(e.target.files?.[0] || null)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Upload the main product image
                  </p>
                </div>

                <div className="flex flex-col space-y-2">
                  <Label htmlFor="images">Gallery</Label>
                  <Input
                    id="images"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) =>
                      setImages(Array.from(e.target.files || []))
                    }
                  />
                  <p className="text-xs text-muted-foreground">
                    Upload additional product images (multiple allowed)
                  </p>
                </div>
              </div>
            </div>
          </form>
        </div>
        <DialogFooter className="px-6 py-4 border-t">
          <Button onClick={handleSubmit} disabled={isAddProductPending}>
            {item ? "Save Changes" : "Add Item"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
