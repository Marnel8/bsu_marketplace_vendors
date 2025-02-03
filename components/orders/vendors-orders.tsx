"use client";
import { useState } from "react";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { SummaryCards } from "./summary-cards";
import { SearchAndFilter } from "./search-and-filter";
import { OrdersTable } from "./orders-table";
import { useGetAllOrders } from "@/hooks/useOrders";
import { IOrder } from "@/types/item";
import { format } from "date-fns";

export default function VendorOrdersDashboard() {
	const { data: orders, isPending: isLoading } = useGetAllOrders();
	const [searchTerm, setSearchTerm] = useState("");
	const [statusFilter, setStatusFilter] = useState("all");
	const [dateFilter, setDateFilter] = useState<Date | undefined>(undefined);
	const [selectedOrder, setSelectedOrder] = useState<IOrder | null>(null);

	const filteredOrders =
		(orders &&
			orders?.filter(
				(order: IOrder) =>
					order.user?.firstName
						?.toLowerCase()
						.includes(searchTerm.toLowerCase()) &&
					(statusFilter === "all" || order.status === statusFilter) &&
					(!dateFilter ||
						new Date(order.createdAt).toDateString() ===
							dateFilter.toDateString())
			)) ||
		[];

	const totalOrders = filteredOrders.length || 0;
	const totalRevenue =
		filteredOrders.reduce(
			(sum: number, order: IOrder) =>
				order.status === "success" && sum + order.totalPrice,
			0
		) || 0;

	const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

	return (
		<>
			<SummaryCards
				totalOrders={totalOrders}
				totalRevenue={totalRevenue}
				averageOrderValue={averageOrderValue}
			/>

			<SearchAndFilter
				searchTerm={searchTerm}
				setSearchTerm={setSearchTerm}
				statusFilter={statusFilter}
				setStatusFilter={setStatusFilter}
				dateFilter={dateFilter}
				setDateFilter={setDateFilter}
			/>

			<OrdersTable orders={filteredOrders} onViewDetails={setSelectedOrder} />

			<Dialog
				open={!!selectedOrder}
				onOpenChange={(open) => !open && setSelectedOrder(null)}
			>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Order Details</DialogTitle>
						<DialogDescription>Order ID: {selectedOrder?.id}</DialogDescription>
					</DialogHeader>
					<div className="grid gap-4 py-4">
						<div className="grid grid-cols-4 items-center gap-4">
							<span className="font-medium">Customer:</span>
							<span className="col-span-3">
								{selectedOrder?.user.firstName} {selectedOrder?.user.lastName}
							</span>
						</div>
						<div className="grid grid-cols-4 items-center gap-4">
							<span className="font-medium">Date:</span>
							<span className="col-span-3">
								{selectedOrder?.createdAt
									? format(new Date(selectedOrder.createdAt), "MMM dd, yyyy")
									: "N/A"}
							</span>
						</div>
						<div className="grid grid-cols-4 items-center gap-4">
							<span className="font-medium">Total:</span>
							<span className="col-span-3">
								₱{selectedOrder?.totalPrice.toFixed(2)}
							</span>
						</div>
						<div className="grid grid-cols-4 items-center gap-4">
							<span className="font-medium">Status:</span>
							<span className="col-span-3 capitalize">
								{selectedOrder?.status}
							</span>
						</div>
					</div>
				</DialogContent>
			</Dialog>
		</>
	);
}
