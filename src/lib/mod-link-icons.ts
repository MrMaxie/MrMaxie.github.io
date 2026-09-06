export const getModLinkIcon = (href: string): string => {
  const hostname = new URL(href).hostname;
  if (hostname === 'steamcommunity.com') return 'tabler:brand-steam';
  if (hostname === 'www.curseforge.com' || hostname === 'curseforge.com') return 'curseforge';
  if (hostname === 'github.com') return 'tabler:brand-github';
  return 'tabler:external-link';
};
