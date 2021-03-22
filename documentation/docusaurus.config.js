/** @type {import('@docusaurus/types').DocusaurusConfig} */

const customFields = {
  githubUrl: `https://github.com/web3-api/monorepo`,
  discordUrl: `https://discord.gg/Z5m88a5qWu`,
  twitterUrl: 'https://twitter.com/Web3Api',
  forumUrl: 'https://forum.web3api.dev',
  daoUrl: 'https://github.com/web3-api/dao',
  blogUrl: 'https://web3api.substack.com/',
  gitcoinUrl: 'https://gitcoin.co/grants/1252/web3api',
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
        href: '/',
      },
      items: [
        {
          label: 'Website',
          href: 'https://web3api.dev'
        },
        {
          label: 'Social',
          position: 'left',
          items: [
            {
              label: 'Blog',
              href: customFields.blogUrl,
              className: 'blog-logo',
              'aria-label': 'Web3API Blog',
            },
            {
              label: 'Twitter',
              href: customFields.twitterUrl,
              className: 'twitter-logo',
              'aria-label': 'twitter account',
            },
            {
              label: 'Donate',
              href: customFields.gitcoinUrl,
              className: 'gitcoin-logo',
              'aria-label': 'gitcoin grant',
            },
          ],
        },
        {
          label: 'Community',
          position: 'left',
          items: [
            {
              label: 'Code',
              href: customFields.githubUrl,
              className: 'github-logo',
              'aria-label': 'GitHub repository',
            },
            {
              label: 'Discuss',
              href: customFields.forumUrl,
              className: 'forum-logo',
              'aria-label': 'Forum'
            },
            {
              label: 'Chat',
              href: customFields.discordUrl,
              className: 'discord-logo',
              'aria-label': 'Discord server',
            },
            {
              label: 'Govern',
              href: customFields.daoUrl,
              className: 'dao-logo',
              'aria-label': 'dao repo'
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
