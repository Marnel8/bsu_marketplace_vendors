import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Eye,
  CheckCircle,
  XCircle,
  Trash2,
  MoreHorizontal,
} from "lucide-react";
import { IOrder } from "@/types/item";
import { format } from "date-fns";
import { useUpdateOrderStatus } from "@/hooks/useOrders";
import { toast } from "@/hooks/use-toast";

interface OrdersTableProps {
  orders: IOrder[];
  onViewDetails: (order: IOrder) => void;
}

export function OrdersTable({ orders, onViewDetails }: OrdersTableProps) {
  const { mutateAsync: updateStatus, isPending: isUpdatePending } =
    useUpdateOrderStatus();

  const onUpdateStatus = async (id: string, status: string) => {
    try {
      await updateStatus({ id, status });
      toast({
        title: `Order ${status}!`,
        description: "The order status has been updated.",
        variant: "default",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error updating order status",
        description: "Please try again later.",
      });
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order Code</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell className="font-medium">{order.orderCode}</TableCell>
              <TableCell>
                {order.user?.firstName} {order.user?.lastName}
              </TableCell>
              <TableCell>{format(order.createdAt, "MMM dd, yyyy")}</TableCell>
              <TableCell>₱{order.totalPrice.toFixed(2)}</TableCell>
              <TableCell>
                <Badge
                  variant={
                    order.status === "pending"
                      ? "default"
                      : order.status === "confirmed"
                      ? "secondary"
                      : order.status === "success"
                      ? "default"
                      : order.status === "denied"
                      ? "destructive"
                      : "outline"
                  }
                  className="capitalize"
                >
                  {order.status}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => onViewDetails(order)}>
                      <Eye className="mr-2 h-4 w-4" />
                      View details
                    </DropdownMenuItem>
                    {order.status === "confirmed" && (
                      <>
                        <DropdownMenuItem
                          onClick={() => onUpdateStatus(order.id, "approved")}
                        >
                          <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                          Approve
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => onUpdateStatus(order.id, "deny")}
                        >
                          <XCircle className="mr-2 h-4 w-4 text-red-500" />
                          Deny
                        </DropdownMenuItem>
                      </>
                    )}

                    {order.status === "to pick up" && (
                      <DropdownMenuItem
                        onClick={() => onUpdateStatus(order.id, "success")}
                      >
                        <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                        Completed
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <Trash2 className="mr-2 h-4 w-4 text-red-500" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
