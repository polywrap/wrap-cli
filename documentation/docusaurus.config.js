/** @type {import('@docusaurus/types').DocusaurusConfig} */

const customFields = {
  githubUrl: `https://github.com/web3-api/monorepo`,
  discordUrl: `https://discord.gg/Z5m88a5qWu`,
  twitterUrl: 'https://twitter.com/Web3Api',
  forumUrl: 'https://forum.web3api.dev',
};

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
    navbar: {
      title: 'Web3API',
      logo: {
        alt: 'Web3API Icon',
        src: 'img/Web3API_Icon.svg',
        href: 'https://web3api.dev',
      },
      items: [
        {
          label: 'Community',
          position: 'left',
          items: [
            {
              label: 'Forum',
              href: customFields.forumUrl,
              className: 'forum-logo',
              'aria-label': 'Forum',
            },
            {
              label: 'GitHub',
              href: customFields.githubUrl,
              className: 'github-logo',
              'aria-label': 'GitHub repository',
            },
            {
              label: 'Discord',
              href: customFields.discordUrl,
              className: 'discord-logo',
              'aria-label': 'Discord server',
            },
            {
              label: 'Twitter',
              href: customFields.twitterUrl,
              className: 'twitter-logo',
              'aria-label': 'twitter account',
            },
          ],
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
              href: 'https://discordapp.com/invite/Z5m88a5qWu',
            },
            {
              label: 'Twitter',
              href: 'https://twitter.com/web3api',
            },
            {
              label: 'GitHub',
              href: 'https://github.com/web3-api',
            },
          ],
        },
      ],
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
          routeBasePath: '/',
        },
        theme: {
          customCss: require.resolve('./style.css'),
        },
      },
    ],
  ],
  plugins: [require.resolve('docusaurus-lunr-search')],
};
