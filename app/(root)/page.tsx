import VendorOrdersDashboard from "@/components/orders/vendors-orders";

export default function VendorOrdersPage() {
  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold mb-6">Orders</h1>
      <VendorOrdersDashboard />
    </div>
  );
}
