"use client";
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

import { toast } from "@/hooks/use-toast";
import { useState } from "react";
import { SearchAndFilter } from "../orders/search-and-filter";
import Link from "next/link";
import { useDeleteVendor, useFetchVendors } from "@/hooks/useVendors";

export function VendorsTable() {
	const { data: vendors, isFetching: isVendorsFetching } = useFetchVendors();
	const [searchTerm, setSearchTerm] = useState("");
	const [statusFilter, setStatusFilter] = useState("all");
	const [dateFilter, setDateFilter] = useState<Date | undefined>(undefined);

	const { mutateAsync: deleteVendor, isPending: isDeleting } =
		useDeleteVendor();

	const filteredOrders =
		(vendors &&
			vendors?.filter(
				(vendor: any) =>
					(vendor.owner?.firstName
						?.toLowerCase()
						.includes(searchTerm.toLowerCase()) ||
						vendor.owner.lastName
							?.toLowerCase()
							.includes(searchTerm.toLowerCase()) ||
						vendor.businessName
							?.toLowerCase()
							.includes(searchTerm.toLowerCase())) &&
					(statusFilter === "all" || vendor.isVerified === statusFilter) &&
					(!dateFilter ||
						new Date(vendor.createdAt).toDateString() ===
							dateFilter.toDateString())
			)) ||
		[];

	const handleDeleteVendor = async (vendorId: string) => {
		try {
			await deleteVendor(vendorId);
			toast({
				description: `Vendor deleted successfully.`,
			});
		} catch (error) {
			toast({
				description: `Failed to delete vendor with ID: ${vendorId}. Please try again.`,
			});
		}
	};
	return (
		<>
			<SearchAndFilter
				searchTerm={searchTerm}
				setSearchTerm={setSearchTerm}
				statusFilter={statusFilter}
				setStatusFilter={setStatusFilter}
				dateFilter={dateFilter}
				setDateFilter={setDateFilter}
			/>
			<div className="rounded-md border p-4">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Owner</TableHead>
							<TableHead>Business Name</TableHead>
							<TableHead>Category</TableHead>
							<TableHead>Status</TableHead>
							<TableHead className="text-right">Actions</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{!isVendorsFetching &&
							filteredOrders.map((vendor: any) => (
								<TableRow key={vendor.id}>
									<TableCell className="font-medium">
										{vendor.owner.firstName} {vendor.owner.lastName}
									</TableCell>
									<TableCell>{vendor.businessName}</TableCell>
									<TableCell className="capitalize">
										{vendor.businessType}
									</TableCell>
									<TableCell>
										<Badge
											variant={
												vendor.isVerified === "verified"
													? "default"
													: vendor.isVerified === "pending"
													? "secondary"
													: "destructive"
											}
											className="capitalize"
										>
											{vendor.isVerified === "verified"
												? "Verified"
												: vendor.isVerified === "pending"
												? "Pending"
												: "Rejected"}
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
												<>
													<Link href={`/vendors/${vendor.id}`}>
														<DropdownMenuItem>
															<Eye className="mr-2 h-4 w-4" />
															{vendor.isVerified === "pending"
																? "Review"
																: "View"}
														</DropdownMenuItem>
													</Link>
												</>

												<DropdownMenuSeparator />
												<Button
													variant="ghost"
													asChild
													onClick={() => handleDeleteVendor(vendor.id)}
													disabled={isDeleting}
												>
													<DropdownMenuItem>
														<Trash2 className="mr-2 h-4 w-4 text-red-500" />
														{isDeleting ? "Deleting..." : "Delete"}
													</DropdownMenuItem>
												</Button>
											</DropdownMenuContent>
										</DropdownMenu>
									</TableCell>
								</TableRow>
							))}
					</TableBody>
				</Table>
			</div>
		</>
	);
}
