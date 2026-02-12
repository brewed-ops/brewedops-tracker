import { Helmet } from 'react-helmet-async';

const SEO = ({
  title = 'BrewedOps | VA Services, GHL Automation & Free Tools',
  description = 'Expert VA services, GoHighLevel CRM automation, and web development — backed by 11+ years of customer support experience. Plus 26+ free productivity tools.',
  keywords = 'BrewedOps, virtual assistant services, GHL automation, GoHighLevel, customer support, admin VA, web development, free tools',
  url,
  image = 'https://brewedops.com/BrewedOpsLogo.png',
}) => {
  const rawUrl = url || (typeof window !== 'undefined' ? window.location.href : 'https://brewedops.com');
  const pageUrl = rawUrl.replace('://www.brewedops.com', '://brewedops.com');
  const canonicalUrl = pageUrl.split('?')[0].split('#')[0];

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="title" content={title} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={canonicalUrl} />

      <meta property="og:type" content="website" />
      <meta property="og:url" content={pageUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content="BrewedOps" />

      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={pageUrl} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={image} />
      <meta property="twitter:site" content="@BrewedOps" />
    </Helmet>
  );
};

export default SEO;
