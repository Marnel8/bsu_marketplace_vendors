import { SearchAndFilter } from "@/components/orders/search-and-filter";
import { VendorsTable } from "@/components/vendors/VendorsTable";
import React from "react";

const VendorsPage = () => {
	return (
		<div className="container mx-auto">
			<h1 className="text-3xl font-bold mb-6">Vendors</h1>
			<div>
				<VendorsTable />
			</div>
		</div>
	);
};

export default VendorsPage;
