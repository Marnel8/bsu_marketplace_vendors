"use client";
import React from "react";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "../ui/table";
import { useDeleteProduct, useFetchProducts } from "@/hooks/useProducts";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Eye, MoreHorizontal, Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import Link from "next/link";
import { Badge } from "../ui/badge";
import { toast } from "@/hooks/use-toast";

export enum ItemCategory {
	ELECTRONICS = "electronics",
	CLOTHING = "clothing",
	HOME = "home",
	FOOD = "food",
}

export enum VerificationStatus {
	PENDING = "pending",
	VERIFIED = "verified",
	REJECTED = "rejected",
}

export interface Image {
	id: string;
	url: string;
}
export interface Post {
	id: string;
	name: string;
	description: string;
	variant: string;
	category: ItemCategory;
	price: number;
	thumbnail: string;
	brand: string;
	rating: number;
	quantity: number;
	isVerified: VerificationStatus;
	orderId: string;
	images: Image[];
	vendor: {
		businessName: string;
	};
	createdAt?: Date;
	updatedAt?: Date;
}

const PostsTable = () => {
	const { data: posts, isFetching: isPostsFetching } = useFetchProducts();

	const { mutateAsync: deleteProduct, isPending: isDeleting } =
		useDeleteProduct();

	const handleDeleteProduct = async (postId: string) => {
		try {
			await deleteProduct(postId);
			toast({
				description: `Post deleted successfully.`,
			});
		} catch (error) {
			toast({
				description: `Failed to delete post with ID: ${postId}. Please try again.`,
			});
		}
	};
	return (
		<div>
			<div className="rounded-md border p-4">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Vendor</TableHead>
							<TableHead>Product</TableHead>
							<TableHead>Category</TableHead>
							<TableHead>Status</TableHead>
							<TableHead className="text-right">Actions</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{!isPostsFetching &&
							posts.map((post: Post) => (
								<TableRow key={post.id}>
									<TableCell className="font-medium">
										{post.vendor.businessName}
									</TableCell>
									<TableCell>{post.name}</TableCell>
									<TableCell className="capitalize">{post.category}</TableCell>
									<TableCell>
										<Badge
											variant={
												post.isVerified === "verified"
													? "default"
													: post.isVerified === "pending"
													? "secondary"
													: "destructive"
											}
											className="capitalize"
										>
											{post.isVerified === "verified"
												? "Verified"
												: post.isVerified === "pending"
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
													<Link href={`/posts/${post.id}`}>
														<DropdownMenuItem>
															<Eye className="mr-2 h-4 w-4" />
															Review
														</DropdownMenuItem>
													</Link>
												</>

												<DropdownMenuSeparator />
												<Button
													variant="ghost"
													asChild
													onClick={() => handleDeleteProduct(post.id)}
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
		</div>
	);
};

export default PostsTable;
