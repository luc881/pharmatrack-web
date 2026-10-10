// Estilos compartidos (objetos sx). Módulo sin 'use client' para que también
// los puedan usar las páginas de servidor (un valor exportado desde un módulo
// cliente llega al servidor como referencia, no como objeto).

// Fila de lista dentro de un <OdRowGroup>. El grupo pinta UN solo bloque
// oscuro que se desliza a la fila bajo el cursor y le pone `data-active`;
// aquí solo se reacciona a eso: el texto se aclara, .od-row-num se pinta de
// tuna y .od-row-arrow se vuelve un círculo tuna que gira. Con `data-fx` la
// flecha (.od-magnet) además se deja jalar por el cursor.
export const rowFillSx = {
  position: 'relative',
  color: 'inherit',
  textDecoration: 'none',
  transition: 'color 450ms var(--od-ease)',
  '& .od-row-num, & .od-row-meta': { transition: 'color 450ms' },
  '& .od-row-arrow': { transition: 'transform 500ms var(--od-ease), background 300ms, color 300ms, border-color 300ms' },
  '& .od-row-arrow svg': { transition: 'transform 500ms var(--od-ease)' },
  '&[data-active]': { color: 'var(--color-neutral-100)' },
  '&[data-active] .od-row-num': { color: 'var(--od-tuna)' },
  '&[data-active] .od-row-meta': { color: 'var(--color-neutral-400)' },
  '&[data-active] .od-row-arrow': { bgcolor: 'var(--od-tuna)', borderColor: 'var(--od-tuna)', color: '#fff' },
  '&[data-active] .od-row-arrow svg': { transform: 'rotate(-45deg)' },
};
