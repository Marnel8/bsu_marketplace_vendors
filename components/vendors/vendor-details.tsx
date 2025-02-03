"use client";

import Image from "next/image";
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useFetchVendorByID, useVerify } from "@/hooks/useVendors";
import { getImageUrl } from "@/utils/imageUtils";
import { Skeleton } from "@/components/ui/skeleton";
import { string } from "zod";
import { toast } from "@/hooks/use-toast";
import { RejectVerificationDialog } from "./verification-modal";

const VendorDetails = ({ vendorId }: { vendorId: string }) => {
	const { data: vendor, isFetching: isVendorDetailsFetching } =
		useFetchVendorByID(vendorId);

	const { mutateAsync: updateVerification, isPending: isUpdatingStatus } =
		useVerify({ vendorId });

	const handleVerify = async ({
		vendorId,
		newStatus,
	}: {
		vendorId: string;
		newStatus: string;
	}) => {
		try {
			await updateVerification({ vendorId, newStatus });

			toast({
				description: `Vendor status updated to ${newStatus} successfully.`,
			});
		} catch (error) {
			toast({
				description: `Failed to update status for vendor with ID: ${vendorId}. Please try again.`,
			});
		}
	};

	if (isVendorDetailsFetching) return <VendorDetailsSkeleton />;

	return (
		<div className="container mx-auto py-8 px-4 space-y-8">
			<div className="relative h-64 w-full mb-8">
				<Image
					src={getImageUrl(vendor.banner) || "/images/placeholder.jpg"}
					alt={`${vendor.businessName} banner`}
					fill
					className="object-cover rounded-lg"
				/>
			</div>

			<div className="flex items-center mb-8">
				<div className="relative h-24 w-24 mr-6">
					<Image
						src={getImageUrl(vendor.logo) || "/images/placeholder.jpg"}
						alt={`${vendor.businessName} logo`}
						fill
						className="object-cover rounded-full"
					/>
				</div>
				<div>
					<h1 className="text-3xl font-bold">{vendor.businessName}</h1>
					<Badge
						variant={vendor.isVerified === "pending" ? "default" : "secondary"}
					>
						{vendor.isVerified === "verified"
							? "Verified"
							: vendor.isVerified === "pending"
							? "Unverified"
							: "Rejected"}
					</Badge>
				</div>
			</div>
			{vendor.isVerified === "pending" && (
				<Card className="border-yellow-500 bg-yellow-50">
					<CardHeader>
						<CardTitle className="text-yellow-700">
							Verification Request
						</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="mb-4 text-yellow-600">
							This vendor has requested verification. Review their details and
							take action.
						</p>
						<div className="flex items-center gap-3">
							<Button
								onClick={() =>
									handleVerify({ vendorId: vendor.id, newStatus: "verified" })
								}
								disabled={isUpdatingStatus}
							>
								{isUpdatingStatus
									? "Updating status..."
									: "Approve Verification"}
							</Button>
							<RejectVerificationDialog vendorId={vendorId} />
						</div>
					</CardContent>
				</Card>
			)}

			<Tabs defaultValue="business" className="w-full">
				<TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
					<TabsTrigger value="business">Business Details</TabsTrigger>
					<TabsTrigger value="owner">Owner Information</TabsTrigger>
				</TabsList>
				<TabsContent value="business">
					<Card>
						<CardHeader>
							<CardTitle>Business Details</CardTitle>
						</CardHeader>
						<CardContent>
							<dl className="grid grid-cols-1 gap-6 sm:grid-cols-2">
								<div className="flex items-center space-x-2">
									<div>
										<dt className="font-medium text-gray-500">Business Type</dt>
										<dd className="mt-1 text-lg capitalize">
											{vendor.businessType}
										</dd>
									</div>
								</div>
								<div className="flex items-center space-x-2">
									<div>
										<dt className="font-medium text-gray-500">Address</dt>
										<dd className="mt-1 text-lg">{vendor.businessAddress}</dd>
									</div>
								</div>
								<div className="sm:col-span-2">
									<dt className="font-medium text-gray-500 mb-2">
										Description
									</dt>
									<dd className="text-lg leading-relaxed">
										{vendor.businessDescription}
									</dd>
								</div>
							</dl>
						</CardContent>
					</Card>
				</TabsContent>
				<TabsContent value="owner">
					<Card>
						<CardHeader>
							<CardTitle>Owner Information</CardTitle>
						</CardHeader>
						<CardContent>
							<dl className="grid grid-cols-1 gap-6 sm:grid-cols-2">
								<div className="flex items-center space-x-2">
									<div>
										<dt className="font-medium text-gray-500">Name</dt>
										<dd className="mt-1 text-lg">
											{vendor.owner.firstName} {vendor.owner.lastName}
										</dd>
									</div>
								</div>
								<div className="flex items-center space-x-2">
									<div>
										<dt className="font-medium text-gray-500">Email</dt>
										<dd className="mt-1 text-lg">{vendor.owner.email}</dd>
									</div>
								</div>
								<div className="sm:col-span-2">
									<dt className="font-medium text-gray-500 mb-2">Valid ID</dt>
									<dd className="mt-1">
										<Image
											src={
												vendor.validId
													? getImageUrl(vendor.validId)
													: "/images/placeholder.jpg"
											}
											alt="valid id"
											className="rounded-lg shadow-md"
											width={300}
											height={200}
											objectFit="cover"
										/>
									</dd>
								</div>
							</dl>
						</CardContent>
					</Card>
				</TabsContent>
			</Tabs>
		</div>
	);
};

const VendorDetailsSkeleton = () => (
	<div className="container mx-auto py-8 px-4 space-y-8">
		<Skeleton className="h-80 w-full rounded-xl" />
		<div className="space-y-4">
			<Skeleton className="h-12 w-64" />
			<Skeleton className="h-6 w-32" />
		</div>
		<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
			<Skeleton className="h-[300px]" />
			<Skeleton className="h-[300px]" />
		</div>
	</div>
);

export default VendorDetails;
