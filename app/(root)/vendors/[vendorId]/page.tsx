import VendorDetails from "@/components/vendors/vendor-details";
import React from "react";

const VendorPage = async ({
	params,
}: {
	params: Promise<{ vendorId: string }>;
}) => {
	const vendorId = (await params).vendorId;
	return (
		<div>
			<VendorDetails vendorId={vendorId} />
		</div>
	);
};

export default VendorPage;
