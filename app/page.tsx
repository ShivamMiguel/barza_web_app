'use client';

import { useState } from 'react';
import { TopNav } from '@/components/TopNav';
import { HeroSection } from '@/components/HeroSection';
import { ProblemSection } from '@/components/ProblemSection';
import { SolutionSection } from '@/components/SolutionSection';
import { ClientExperienceSection } from '@/components/ClientExperienceSection';
import { ProExperienceSection } from '@/components/ProExperienceSection';
import { CommunitySection } from '@/components/CommunitySection';
import { ProductsSection } from '@/components/ProductsSection';
import { ManifestoSection } from '@/components/ManifestoSection';
import { SocialProofSection } from '@/components/SocialProofSection';
import { FutureVisionSection } from '@/components/FutureVisionSection';
import { FinalCTASection } from '@/components/FinalCTASection';
import { Footer } from '@/components/Footer';
import { DownloadModal } from '@/components/DownloadModal';

export default function Home() {
  const [isDownloadOpen, setIsDownloadOpen] = useState(false);

  return (
    <main className="w-full">
      <TopNav onDownloadClick={() => setIsDownloadOpen(true)} />
      <HeroSection onDownloadClick={() => setIsDownloadOpen(true)} />
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
    </main>
  );
}
