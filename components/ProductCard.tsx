import React from "react";
import { Card } from "./ui/card";
import Image from "next/image";

const ProductCard = () => {
  return (
    <Card className="max-w-[330px] min-h-[100px] rounded-sm flex items-center px-3">
      <div className="w-full h-[60%] ">
        <Image src="/products/test_item1.jpg" height={60} width={60} alt="productImage" />
      </div>
    </Card>
  );
};

export default ProductCard;
