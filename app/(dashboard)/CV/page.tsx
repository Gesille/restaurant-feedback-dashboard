import AdminCvDashboard from "@/components/cv/cvSubmission";

import { Topbar } from "@/components/layout/Topbar";

export default async function QrGeneratorPage({
 
}: {
  searchParams: Promise<{ restaurant?: string }>;
}) {


  return (
    <>
   
      <div className="px-8 py-6 ">
           <Topbar title="QR Generator" subtitle="Create a branded, trackable QR code in seconds" />
           <div className="px-8 py-6 ">
             <AdminCvDashboard />
           </div>
       
      </div>
    </>
  );
}