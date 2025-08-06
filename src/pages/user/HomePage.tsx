import ComingSoonSection from "../../components/ComingSoonSection"
import FeaturedSection from "../../components/FeaturedSection"
import GenreBrowser from "../../components/GenreBrowser"
import HeroSection from "../../components/HeroSection"
import VerifyEmailBanner from "../../components/VerifyEmailBanner"

const HomePage = () => {
  return (
    <>
      <VerifyEmailBanner />
      <HeroSection />
      <FeaturedSection />
      <ComingSoonSection />
      <GenreBrowser />
    </>
  )
}

export default HomePage
