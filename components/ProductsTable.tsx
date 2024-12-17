"use client"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useFetchProducts } from "@/hooks/useProducts";

export function ProductTable() {

  const { data: products } = useFetchProducts()

  return (
    <Table>
      <TableCaption>A list of your recent items.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Item ID</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Stocks</TableHead>
          <TableHead>Price</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {products && products.map((prod: any) => (
          <TableRow key={prod.id}>
            <TableCell className="flex">{prod.id}</TableCell>
            <TableCell>{prod.description}</TableCell>
            <TableCell>${prod.price}</TableCell>
            <TableCell>{prod.stocks}</TableCell>
            <TableCell>
              <button className="mr-2">Edit</button>
              <button className="text-red-500">Delete</button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
      {/* <TableFooter>
        <TableRow></TableRow>
      </TableFooter> */}
    </Table>
  );
}
