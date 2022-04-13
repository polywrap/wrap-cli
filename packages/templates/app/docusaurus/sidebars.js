module.exports = {
  docs: [
    {
      type: 'category',
      label: 'My Wrapper',
      items: [
        'wrapper/intro',
        'wrapper/types',
        'wrapper/enums',
        'wrapper/query',
        'wrapper/mutation',
      ],
    },
    {
      type: 'category',
      label: '👋 Getting started',
      items: [
        'getting-started/what-is-polywrap',
        'getting-started/polywrap-vs-javascript-sdks',
        'getting-started/understanding-uris',
        'getting-started/understanding-plugins',
      ],
    },
    {
      type: 'category',
      label: 'Guide: Integrate into a JS dapp',
      items: [
        'guides/create-js-dapp/install-client',
        'guides/create-js-dapp/create-client-instance',
        'guides/create-js-dapp/react-integration',
      ],
    },
    {
      type: 'category',
      label: 'Developer tools',
      items: [
        'devtools/polywrap-cli',
        'devtools/polywrap-clientjs',
        'devtools/polywrap-react',
      ],
    },
    'resources/talks-and-videos'
  ],
};
