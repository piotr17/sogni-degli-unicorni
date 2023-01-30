module.exports = {
  url: process.env.URL || 'https://sogniunicorni.it',
  siteName: 'I Sogni degli Unicorni',
  siteDescription:
    'Una raccolta di racconti per bambini, prima della ninna o per passare qualche momento felice e sereno.',
  siteType: 'Person', // schema
  locale: 'it_IT',
  lang: 'it',
  skipContent: 'Salta al contenuto',
  author: 'Uga Buga', // i.e. Lene Saile - author's name. Must be set.
  authorEmail: 'aceroanalytics@gmail.com', // i.e. hola@lenesaile.com - email of the author
  authorWebsite: '', // i.e. https.://www.lenesaile.com - the personal site of the author
  themeColor: '#DD4462', //  Manifest: defines the default theme color for the application
  themeBgColor: '#F3F3F3', // Manifest: defines a placeholder background color for the application page to display before its stylesheet is loaded
  meta_data: {
    opengraph_default: '/assets/images/opengraph-default.jpg',
    twitterSite: '', // i.e. @site - twitter profile of the site
    twitterCreator: '', // i.e. @author -  twitter profile of the site
    mastodonProfile: '' // i.e. https://front-end.social/@lene - url to your mastodon instance/profile
  },
  blog: {
    // this is for the rss feed
    name: 'I Sogni degli Unicorni',
    description:
      'Una raccolta di storie per bambini, prima della ninna o per passare qualche momento di felicità'
  },
  pagination: {
    itemsPerPage: 20
  },
  address: {
    // edit all presets or leave empty. They are being used in the pages for privacy.md and imprint.md
    firma: '',
    street: '',
    city: '',
    state: '',
    zip: '',
    mobileDisplay: '',
    mobileCall: '',
    email: '',
    cif: ''
  },
  menu: {
    closedText: 'Menu'
  }
};
