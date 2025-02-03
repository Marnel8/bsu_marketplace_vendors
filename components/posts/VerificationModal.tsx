"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { useVerifyProduct } from "@/hooks/useProducts";

export function RejectVerificationDialog({ productId }: { productId: string }) {
	const [reason, setReason] = useState("");
	const [isOpen, setIsOpen] = useState(false);

	const { mutateAsync: rejectVerification, isPending } =
		useVerifyProduct(productId);

	const handleReject = async ({ newStatus }: { newStatus: string }) => {
		try {
			await rejectVerification({ productId, newStatus, reason });

			setIsOpen(false);
			setReason("");
			toast({
				description: `Product status updated to ${newStatus} successfully.`,
			});
		} catch (error) {
			toast({
				description: `Failed to update status for product with ID: ${productId}. Please try again.`,
			});
			setIsOpen(false);
		}
	};

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild>
				<Button variant="destructive">Reject Verification</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Reject Product Verification</DialogTitle>
					<DialogDescription>
						Please provide a reason for rejecting this vendor's product
						verification request. This reason will be sent to the vendor.
					</DialogDescription>
				</DialogHeader>
				<div className="grid gap-4 py-4">
					<Textarea
						id="reason"
						placeholder="Enter rejection reason"
						value={reason}
						onChange={(e) => setReason(e.target.value)}
						rows={4}
					/>
				</div>
				<DialogFooter>
					<Button
						type="button"
						variant="secondary"
						onClick={() => setIsOpen(false)}
					>
						Cancel
					</Button>
					<Button
						type="button"
						onClick={() => handleReject({ newStatus: "rejected" })}
						disabled={!reason.trim() || isPending}
					>
						{isPending ? "Confirming..." : "Confirm Rejection"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
