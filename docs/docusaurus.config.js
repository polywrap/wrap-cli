/** @type {import('@docusaurus/types').DocusaurusConfig} */
module.exports = {
  title: 'Web3API',
  tagline: 'The Universal Web3 Integration Standard',
  url: 'https://docs.web3api.dev',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.png',
  organizationName: 'web3-api',
  projectName: 'monorepo',
  themeConfig: {
    hideableSidebar: true,
    navbar: {
      title: 'Web3API Documentation',
      logo: {
        alt: 'Web3API Icon',
        src: 'img/Web3API_Icon.svg',
      },
      items: [
        {
          href: 'https://github.com/web3-api/monorepo',
          className: 'header-github-link',
          'aria-label': 'GitHub repository',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Community',
          items: [
            {
              label: 'Discord',
              href: 'https://discordapp.com/invite/docusaurus',
            },
            {
              label: 'Twitter',
              href: 'https://twitter.com/docusaurus',
            },
            {
              label: 'GitHub',
              href: 'https://github.com/facebook/docusaurus',
            },
          ],
        },
      ]
    },
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.
          editUrl: 'https://github.com/web3-api/monorepo',
          routeBasePath: '/'
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
};
