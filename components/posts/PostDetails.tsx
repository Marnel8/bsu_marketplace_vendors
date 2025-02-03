"use client";
import React from "react";
import { Badge } from "../ui/badge";
import { VerificationStatus } from "@/types/product";
import { useGetProductById, useVerifyProduct } from "@/hooks/useProducts";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
	AlertCircle,
	Clock,
	Package,
	ShoppingCart,
	Star,
	Store,
} from "lucide-react";
import { Button } from "../ui/button";
import Image from "next/image";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { formatDistance } from "date-fns";
import { getImageUrl } from "@/utils/imageUtils";
import { toast } from "@/hooks/use-toast";
import { RejectVerificationDialog } from "./VerificationModal";

const PostDetails = ({ postId }: { postId: string }) => {
	const { data: product, isFetching: isProductDetailsFetching } =
		useGetProductById(postId);

	const { mutateAsync: updateVerification, isPending: isUpdatingStatus } =
		useVerifyProduct(postId);
	const getVerificationBadge = (status: VerificationStatus) => {
		switch (status) {
			case VerificationStatus.VERIFIED:
				return <Badge className="bg-green-500">Verified</Badge>;
			case VerificationStatus.REJECTED:
				return <Badge variant="destructive">Rejected</Badge>;
			default:
				return <Badge variant="secondary">Pending</Badge>;
		}
	};

	const handleVerify = async ({
		productId,
		newStatus,
	}: {
		productId: string;
		newStatus: string;
	}) => {
		try {
			await updateVerification({ productId, newStatus });

			toast({
				description: `Vendor status updated to ${newStatus} successfully.`,
			});
		} catch (error) {
			toast({
				description: `Failed to update status for vendor with ID: ${productId}. Please try again.`,
			});
		}
	};

	if (isProductDetailsFetching) return <p>Fetching...</p>;
	return (
		<div className="container mx-auto py-6  max-w-6xl">
			{/* Verification Status Banner */}
			{product?.isVerified === VerificationStatus.PENDING && (
				<Card className="mb-8 border-yellow-500/20 bg-yellow-50/50">
					<CardContent className="pt-6">
						<div className="flex items-start gap-4">
							<AlertCircle className="text-yellow-600 mt-1" />
							<div className="flex-1">
								<h3 className="text-lg font-semibold text-yellow-800 mb-2">
									Verification Request
								</h3>
								<p className="text-yellow-800 mb-4">
									This product is pending verification. Review the details and
									take action.
								</p>
								<div className="flex gap-3">
									<Button
										className="bg-black hover:bg-black/90"
										onClick={() =>
											handleVerify({
												productId: product.id,
												newStatus: VerificationStatus.VERIFIED,
											})
										}
										disabled={isUpdatingStatus}
									>
										{isUpdatingStatus ? "..." : "Approve Product"}
									</Button>
									<RejectVerificationDialog productId={product.id} />
								</div>
							</div>
						</div>
					</CardContent>
				</Card>
			)}

			{/* Product Overview */}
			<div className="grid md:grid-cols-2 gap-6 mb-8">
				<div className="space-y-4">
					<div className="aspect-square relative rounded-lg overflow-hidden border">
						<Image
							src={getImageUrl(product.thumbnail) || "/placeholder.svg"}
							alt={product.name}
							fill
							className="object-cover"
						/>
					</div>
					<div className="grid grid-cols-4 gap-2">
						{product.images.map((image: any, index: number) => (
							<div
								key={image.id}
								className="aspect-square relative rounded-lg overflow-hidden border"
							>
								<Image
									src={getImageUrl(image.url) || "/placeholder.svg"}
									alt={`${product.name} ${index + 1}`}
									fill
									className="object-cover"
								/>
							</div>
						))}
					</div>
				</div>

				<div className="space-y-6">
					<div>
						<div className="flex items-center gap-2 mb-2">
							<h1 className="text-3xl font-bold">{product.name}</h1>
							{getVerificationBadge(product.isVerified as VerificationStatus)}
						</div>
						<p className="text-muted-foreground">{product.description}</p>
					</div>

					<div className="space-y-4">
						<div className="flex items-center gap-4">
							<div className="flex items-center">
								<Star className="w-5 h-5 fill-yellow-400 stroke-yellow-400" />
								<span className="ml-1 font-medium">{product.rating}</span>
							</div>
							<Badge variant="outline" className="text-sm">
								{product.category}
							</Badge>
						</div>

						<div className="flex items-baseline gap-2">
							<span className="text-3xl font-bold">
								${product.price.toFixed(2)}
							</span>
							{product.quantity < 10 && (
								<Badge variant="destructive">
									Low Stock: {product.quantity} left
								</Badge>
							)}
						</div>

						<div className="grid gap-2">
							<div className="flex items-center gap-2">
								<Package className="w-4 h-4 text-muted-foreground" />
								<span>Brand: {product.brand}</span>
							</div>
							<div className="flex items-center gap-2">
								<ShoppingCart className="w-4 h-4 text-muted-foreground" />
								<span>Quantity in stock: {product.quantity}</span>
							</div>
							<div className="flex items-center gap-2">
								<Store className="w-4 h-4 text-muted-foreground" />
								<span>Variant: {product.variant}</span>
							</div>
							<div className="flex items-center gap-2">
								<Clock className="w-4 h-4 text-muted-foreground" />
								<span>
									Listed{" "}
									{formatDistance(new Date(product.createdAt), new Date(), {
										addSuffix: true,
									})}
								</span>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Additional Details */}
			<Tabs defaultValue="details" className="w-full">
				<TabsList>
					<TabsTrigger value="details">Product Details</TabsTrigger>
					<TabsTrigger value="vendor">Vendor Information</TabsTrigger>
				</TabsList>

				<TabsContent value="details">
					<Card>
						<CardHeader>
							<CardTitle>Product Details</CardTitle>
						</CardHeader>
						<CardContent className="grid gap-4">
							<div className="grid md:grid-cols-2 gap-4">
								<div>
									<h3 className="font-medium mb-1">Product ID</h3>
									<p className="text-sm text-muted-foreground font-mono">
										{product.id}
									</p>
								</div>
								<div>
									<h3 className="font-medium mb-1">Category</h3>
									<p className="text-sm text-muted-foreground">
										{product.category}
									</p>
								</div>
								<div>
									<h3 className="font-medium mb-1">Last Updated</h3>
									<p className="text-sm text-muted-foreground">
										{formatDistance(new Date(product.updatedAt), new Date(), {
											addSuffix: true,
										})}
									</p>
								</div>
								{product.orderId && (
									<div>
										<h3 className="font-medium mb-1">Order ID</h3>
										<p className="text-sm text-muted-foreground font-mono">
											{product.orderId}
										</p>
									</div>
								)}
							</div>
						</CardContent>
					</Card>
				</TabsContent>

				<TabsContent value="vendor">
					<Card>
						<CardHeader>
							<CardTitle>Vendor Information</CardTitle>
						</CardHeader>
						<CardContent>
							<div>
								<h3 className="font-medium mb-1">Vendor ID</h3>
								<p className="text-sm text-muted-foreground font-mono">
									{product.vendorId}
								</p>
							</div>
						</CardContent>
					</Card>
				</TabsContent>
			</Tabs>
		</div>
	);
};

export default PostDetails;
