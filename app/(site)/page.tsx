import ContactSection from "@/sections/ContactSection";
import CTASection from "@/sections/CTASection";
import FeaturesSection from "@/sections/FeaturesSection";
import HeroSection from "@/sections/HeroSection";
import QuestionsSection from "@/sections/QuestionsSection";
import RestaurantsSection from "@/sections/RestaurantsSection";
import TestimonialSectionList from "@/sections/TestimonialSectionList";

const page = () => {
  return (
    <div>
      <HeroSection />
      <RestaurantsSection />
      <FeaturesSection />
      <TestimonialSectionList />
      <ContactSection />
      <QuestionsSection />
      <CTASection />
    </div>
  );
};

export default page;
