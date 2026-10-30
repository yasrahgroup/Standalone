import React from 'react';
import { SEOHead } from '../components/common/SEOHead';
import { PageHeader } from '../components/common/PageHeader';
import { FinalCTA } from '../components/home/FinalCTA';
import { Testimonials } from '../components/home/Testimonials';

export const TestimonialsPage: React.FC = () => {
  return (
    <div>
      <SEOHead
        title="Client Testimonials — Enterprise Engineering Endorsements | Azaroth Tech-Hive"
        description="Read verified client testimonials and executive endorsements from enterprises that partner with Azaroth Tech-Hive for software engineering, architecture modernization, and dedicated engineering pods."
        canonicalPath="/testimonials"
      />

      <PageHeader
        kicker="- CLIENT TESTIMONIALS -"
        title="Trusted by Leaders Who Build at Scale"
        gradientWords={['Build', 'Scale']}
        subtitle="Hear directly from the technology leaders, founders, and engineering executives who rely on Azaroth Tech-Hive to deliver resilient platforms and measurable business outcomes."
      />

      <Testimonials />

      <FinalCTA />
    </div>
  );
};

export default TestimonialsPage;
