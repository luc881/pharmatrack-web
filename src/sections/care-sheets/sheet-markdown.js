import { Marked } from 'marked';

// ----------------------------------------------------------------------
// Markdown de las fichas (lo escriben en el dashboard) a HTML para
// dangerouslySetInnerHTML. Por eso: el HTML crudo se muestra como texto y los
// enlaces solo admiten http(s), mailto y rutas del sitio.
// La tabla lleva encabezados con scope; si la esquina va vacía (tabla de
// doble entrada) la primera columna son encabezados de fila. Va dentro de una
// caja con scroll propio para no ensanchar la página en celular.
// ----------------------------------------------------------------------

const escape = (t) =>
  String(t)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

const SAFE_HREF = /^(https?:\/\/|mailto:|\/(?!\/))/i;

const md = new Marked({
  renderer: {
    html({ text }) {
      return escape(text);
    },
    link({ href, title, tokens }) {
      const label = this.parser.parseInline(tokens);
      if (!SAFE_HREF.test(href ?? '')) return label;
      const external = /^https?:\/\//i.test(href);
      return `<a href="${escape(href)}"${title ? ` title="${escape(title)}"` : ''}${external ? ' target="_blank" rel="noopener noreferrer"' : ''}>${label}</a>`;
    },
    image({ href, text }) {
      if (!/^https:\/\//i.test(href ?? '')) return escape(text);
      return `<img src="${escape(href)}" alt="${escape(text)}" loading="lazy">`;
    },
    table({ header, rows }) {
      const cell = (c) => this.parser.parseInline(c.tokens);
      const rowHeads = !header[0]?.text.trim();
      const head = header
        .map((c, i) => (i === 0 && rowHeads ? '<td></td>' : `<th scope="col">${cell(c)}</th>`))
        .join('');
      const body = rows
        .map(
          (r) =>
            `<tr>${r.map((c, i) => (i === 0 && rowHeads ? `<th scope="row">${cell(c)}</th>` : `<td>${cell(c)}</td>`)).join('')}</tr>`
        )
        .join('');
      return `<div class="od-guide-table" tabindex="0" role="region" aria-label="Tabla"><table><thead><tr>${head}</tr></thead><tbody>${body}</tbody></table></div>`;
    },
  },
});

export const renderMarkdown = (src) => md.parse(src ?? '');

// Una línea (Lo básico): solo negritas, cursivas y enlaces
export const renderInline = (src) => md.parseInline(src ?? '');
