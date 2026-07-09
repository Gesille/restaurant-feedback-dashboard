import { QRGeneratorPanel } from "@/components/dashboard/restaurants/QRGeneratorPanel";
import { Topbar } from "@/components/layout/Topbar";

export default async function QrGeneratorPage({
  searchParams,
}: {
  searchParams: Promise<{ restaurant?: string }>;
}) {
  const { restaurant } = await searchParams;

  return (
    <>
      <Topbar title="QR Generator" subtitle="Create a branded, trackable QR code in seconds" />
      <div className="px-8 py-6">
        <QRGeneratorPanel defaultRestaurantId={restaurant} />
      </div>
    </>
  );
}