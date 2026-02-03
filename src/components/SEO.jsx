import { Helmet } from 'react-helmet-async';

const SEO = ({
  title = 'BrewedOps - Free Tools for Filipino VAs & Freelancers',
  description = 'Your all-in-one productivity hub with 20 free tools. Finance tracking, image editing, PDF tools, and more - built for Filipino Virtual Assistants and Freelancers.',
  keywords = 'BrewedOps, Filipino VA tools, freelancer tools, finance tracker, productivity, virtual assistant, free tools',
  url,
  image = 'https://i.imgur.com/R52jwPv.png',
}) => {
  const pageUrl = url || (typeof window !== 'undefined' ? window.location.href : 'https://brewedops.com');

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="title" content={title} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />

      <meta property="og:type" content="website" />
      <meta property="og:url" content={pageUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />

      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={pageUrl} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={image} />
    </Helmet>
  );
};

export default SEO;
