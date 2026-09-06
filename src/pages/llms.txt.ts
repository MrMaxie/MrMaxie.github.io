import type { APIRoute } from 'astro';
import { getMods } from '~/lib/mods';
import { getProjects } from '~/lib/projects';
import Routes from '~/lib/routes';

export const GET: APIRoute = async ({ site }) => {
  const link = (name: string, path: string, description: string) =>
    `- [${name.replace(/[\\[\]]/g, '\\$&')}](${new URL(path, site)}): ${description}`;
  const projects = await getProjects();
  const mods = await getMods();
  const content = [
    '# Maciej Mieńko',
    '',
    '> Software projects and game mods by Maciej Mieńko, also known as Maxie.',
    '',
    'I build software, from developer tools to games. Understanding the mechanism is often the part I enjoy most.',
    '',
    'The links below lead to server-rendered pages with project descriptions, technical context, and available source or download links. Some projects have private or proprietary source code; their public descriptions do not imply source availability.',
    '',
    '## About',
    '',
    link('About Maciej', Routes.about(), 'Background, interests, and approach to building software.'),
    '',
    '## Projects',
    '',
    ...projects.map(project => link(project.name, Routes.project(project.slug), project.summary)),
    '',
    '## Game mods',
    '',
    ...mods.map(mod => link(mod.name, Routes.mod(mod.slug), mod.summary)),
    '',
    '## Optional',
    '',
    link('Topics', Routes.topics(), 'Browse projects and mods by technology and topic.'),
    '- [GitHub](https://github.com/MrMaxie): Public repositories by MrMaxie.',
    '',
  ].join('\n');
  return new Response(content, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
