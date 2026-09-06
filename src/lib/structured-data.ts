type Crumb = { label: string; href?: string };

export function siteStructuredData(site: string, canonical: string, crumbs: Crumb[] = []) {
  const person = `${site}#person`;
  return {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'Person', '@id': person, name: 'Maciej Mieńko', url: new URL('/about/', site).href },
      { '@type': 'WebSite', '@id': `${site}#website`, name: 'Maciej Mieńko', url: site, author: { '@id': person } },
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
