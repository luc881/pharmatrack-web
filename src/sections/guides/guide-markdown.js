import { Marked } from 'marked';

// ----------------------------------------------------------------------
// Markdown de las guías (texto del repo, no de usuarios) a HTML. Solo cambia
// la tabla: encabezados con scope, y si la esquina va vacía (tabla de doble
// entrada) la primera columna son encabezados de fila. Va dentro de una caja
// con scroll propio para no ensanchar la página en celular.
// ----------------------------------------------------------------------

const md = new Marked({
  renderer: {
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

export const renderMarkdown = (src) => md.parse(src);

// Una línea (Lo básico): solo negritas, cursivas y enlaces
export const renderInline = (src) => md.parseInline(src);
