import { readdirSync, readFileSync } from 'node:fs';
import ts from 'typescript';

export const readSource = (path: string) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
export const pageHtml = (route: string) => readSource(`dist/${route ? `${route}/` : ''}index.html`);
export const pageText = (html: string) =>
  html
    .replace(/<[^>]+>/g, '')
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&');
export function catalog(group: 'projects' | 'mods') {
  return readdirSync(new URL(`../src/data/${group}/`, import.meta.url))
    .filter(file => file.endsWith('.ts'))
    .map(file => {
      const slug = file.replace(/\.ts$/, '');
      const source = readSource(`src/data/${group}/${file}`);
      const tree = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true);
      const exported = tree.statements.find(ts.isExportAssignment);
      if (!exported || !ts.isCallExpression(exported.expression)) throw new Error(`Missing content factory: ${file}`);
      const input = exported.expression.arguments[0];
      if (!ts.isObjectLiteralExpression(input)) throw new Error(`Missing content declaration: ${file}`);
      const fields = Object.fromEntries(
        input.properties.map(property => {
          if (ts.isShorthandPropertyAssignment(property)) return [property.name.text, property.name.text];
          if (!ts.isPropertyAssignment(property)) throw new Error(`Unexpected content property: ${file}`);
          return [
            property.name.getText(tree),
            ts.isStringLiteral(property.initializer) ? property.initializer.text : property.initializer.getText(tree),
          ];
        }),
      );
      return {
        slug,
        fields,
        source,
        markdown: readSource(`src/data/${group}/${slug}.md`),
        html: pageHtml(`${group}/${slug}`),
      };
    });
}
