import { DOWNLOAD_URL } from '@/lib/site';
import { MarketingButton } from '../marketing-button';
import { Section } from '../section';
import SectionHeading from '../section-heading';

export function CallToAction() {
  return (
    <Section className="container">
      <SectionHeading tag="Get started" className="items-center" headingClassName="text-center">
        Start building knowledge.
      </SectionHeading>

      <div className="mt-10 flex flex-wrap items-center justify-center gap-5">
        <MarketingButton href="/docs" variant="minimal" size="lg">
          Read the docs
        </MarketingButton>
        <MarketingButton
          href={DOWNLOAD_URL}
          target="_blank"
          size="lg"
          showIcon
          iconDirection="down"
        >
          Download for macOS
        </MarketingButton>
      </div>
    </Section>
  );
}
