import { createMDX } from 'fumadocs-mdx/next';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  reactCompiler: {
    // Fail the build on any compiler diagnostic
    panicThreshold: 'all_errors',
  },
  // Redirects for deleted docs pages — the prior `Install` and `CLI` pages
  // were folded into Quickstart and Configuration respectively when the docs
  // pivoted to a desktop-app-first story.
  async redirects() {
    return [
      {
        source: '/docs/get-started/install',
        destination: '/docs/get-started/quickstart',
        permanent: true,
      },
      {
        source: '/docs/reference/cli',
        destination: '/docs/reference/configuration',
        permanent: true,
      },
      {
        source: '/docs/features/templates',
        destination: '/docs/advanced/folders-and-templates',
        permanent: true,
      },
    ];
  },
};

const withMDX = createMDX();

export default withMDX(nextConfig);
