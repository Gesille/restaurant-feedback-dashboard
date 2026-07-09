import Navbar from "@/components/Navbar";
import BackgroundBlobs from "@/components/BackgroundBlobs";
import Footer from "@/components/Footer";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BackgroundBlobs variant="default" animate fixed />
      <Navbar />
      {children}
      <Footer />
    </>
  );
}