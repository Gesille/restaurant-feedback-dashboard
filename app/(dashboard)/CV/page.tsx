import AdminCvDashboard from "@/components/cv/cvSubmission";

import { Topbar } from "@/components/layout/Topbar";

export default async function CvSubmissionsPage({
 
}: {
  searchParams: Promise<{ restaurant?: string }>;
}) {


  return (
    <>
   
    
           <Topbar title="New CV Submissions" subtitle="Manage and review new CV submissions from applicants in one place." />
           <div className="mx-auto max-w-6xl">
             <AdminCvDashboard />
           </div>
 
    </>
  );
}