"use client";

import { useState } from "react";
import { TopNav } from "@/components/TopNav";
import { HeroSection } from "@/components/HeroSection";
import { ProblemSection } from "@/components/ProblemSection";
import { SolutionSection } from "@/components/SolutionSection";
import { ClientExperienceSection } from "@/components/ClientExperienceSection";
import { ProExperienceSection } from "@/components/ProExperienceSection";
import { CommunitySection } from "@/components/CommunitySection";
import { ProductsSection } from "@/components/ProductsSection";
import { ManifestoSection } from "@/components/ManifestoSection";
import { SocialProofSection } from "@/components/SocialProofSection";
import { FutureVisionSection } from "@/components/FutureVisionSection";
import { FinalCTASection } from "@/components/FinalCTASection";
import { Footer } from "@/components/Footer";
import { DownloadModal } from "@/components/DownloadModal";
import { LoginModal } from "@/components/LoginModal";
import { SignupModal } from "@/components/SignupModal";
import { OtpModal } from "@/components/OtpModal";

export default function Home() {
  const [isDownloadOpen, setIsDownloadOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const [isOtpOpen, setIsOtpOpen] = useState(false);
  const [signupEmail, setSignupEmail] = useState("");

  function handleSignupSuccess(email: string) {
    setSignupEmail(email);
    setIsOtpOpen(true);
  }

  return (
    <main className="w-full">
      <TopNav onDownloadClick={() => setIsDownloadOpen(true)} onLoginClick={() => setIsLoginOpen(true)} />
      <HeroSection onDownloadClick={() => setIsDownloadOpen(true)} onSignupClick={() => setIsSignupOpen(true)} />
      <ProblemSection />
      <SolutionSection />
      <ClientExperienceSection />
      <ProExperienceSection />
      <CommunitySection />
      <ProductsSection />
      <ManifestoSection />
      <SocialProofSection />
      <FutureVisionSection />
      <FinalCTASection onDownloadClick={() => setIsDownloadOpen(true)} />
      <Footer />

      <DownloadModal isOpen={isDownloadOpen} onClose={() => setIsDownloadOpen(false)} />
      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onSignupClick={() => {
          setIsLoginOpen(false);
          setIsSignupOpen(true);
        }}
      />
      <SignupModal
        isOpen={isSignupOpen}
        onClose={() => setIsSignupOpen(false)}
        onLoginClick={() => {
          setIsSignupOpen(false);
          setIsLoginOpen(true);
        }}
        onSignupSuccess={handleSignupSuccess}
      />
      <OtpModal isOpen={isOtpOpen} email={signupEmail} onClose={() => setIsOtpOpen(false)} />
    </main>
  );
}
