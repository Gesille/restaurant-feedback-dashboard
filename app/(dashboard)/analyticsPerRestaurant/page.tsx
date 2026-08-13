
import QRGeneratorPanel from "@/components/dashboard/restaurants/QRGeneratorPanel";
import { Topbar } from "@/components/layout/Topbar";

export default async function QrGeneratorPage({

}: {
  searchParams: Promise<{ restaurant?: string }>;
}) {


  return (
    <>


             <Topbar 
  title="Restaurant Analytics"
  subtitle="Performance insights and customer feedback for this restaurant"
/>
        <QRGeneratorPanel />
     
    </>
  );
}