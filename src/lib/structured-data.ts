type Crumb = { label: string; href?: string };

export function siteStructuredData(site: string, canonical: string, crumbs: Crumb[] = []) {
  const person = `${site}#person`;
  const profile = new URL('/about/', site).href;
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Person',
        '@id': person,
        name: 'Maciej Mieńko',
        alternateName: ['Maxie', 'MrMaxie'],
        description:
          'Software developer focused on developer tools, local infrastructure, and technically unusual problems.',
        url: profile,
        sameAs: ['https://github.com/MrMaxie', 'https://www.linkedin.com/in/maciej-mie%C5%84ko-b0200b190/'],
      },
      {
        '@type': 'WebSite',
        '@id': `${site}#website`,
        name: 'Maciej Mieńko',
        alternateName: new URL(site).hostname,
        url: site,
        author: { '@id': person },
      },
      ...(canonical === profile
        ? [
            {
              '@type': 'ProfilePage',
              '@id': `${profile}#profile`,
              url: profile,
              mainEntity: { '@id': person },
              isPartOf: { '@id': `${site}#website` },
            },
          ]
        : []),
      ...(crumbs.length
        ? [
            {
              '@type': 'BreadcrumbList',
              itemListElement: crumbs.map((crumb, index) => ({
                '@type': 'ListItem',
                position: index + 1,
                name: crumb.label,
                item: crumb.href ? new URL(crumb.href, site).href : canonical,
              })),
            },
          ]
        : []),
    ],
  };
}

export function serializeStructuredData(value: unknown): string {
  return JSON.stringify(value)
    .replaceAll('<', '\\u003c')
    .replaceAll('\u2028', '\\u2028')
    .replaceAll('\u2029', '\\u2029');
}
