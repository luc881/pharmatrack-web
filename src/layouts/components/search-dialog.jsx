'use client';

import { useRef, useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import InputBase from '@mui/material/InputBase';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';

import { useRouter } from 'src/routes/hooks';

import { fCurrency } from 'src/utils/format-number';

import { Image } from 'src/components/image';
import { Iconify } from 'src/components/iconify';

import { MONO_FONT, ScientificName } from 'src/sections/catalog/scientific';

// ----------------------------------------------------------------------

const MAX_RESULTS = 8;

const normalize = (s) => (s ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

// ----------------------------------------------------------------------

export function SearchDialog({ open, onClose }) {
  const router = useRouter();
  const inputRef = useRef(null);

  const [items, setItems] = useState(null); // null = aún no cargado
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);

  // Carga perezosa: pide el catálogo (proxy same-origin) la primera vez que se abre
  useEffect(() => {
    if (!open || items) return undefined;
    let alive = true;
    (async () => {
      try {
        const res = await fetch('/api/search/');
        const json = res.ok ? await res.json() : [];
        if (alive) setItems(json);
      } catch {
        if (alive) setItems([]);
      }
    })();
    return () => {
      alive = false;
    };
  }, [open, items]);

  const q = normalize(query.trim());
  const results = !q
    ? []
    : (items ?? [])
        .filter((item) => normalize(item.title).includes(q) || normalize(item.sub).includes(q))
        .slice(0, MAX_RESULTS);

  useEffect(() => {
    setActive(0);
  }, [query]);

  const go = useCallback(
    (item) => {
      onClose();
      setQuery('');
      router.push(item.url);
    },
    [onClose, router]
  );

  const handleKeyDown = (event) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActive((i) => Math.min(i + 1, results.length - 1));
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActive((i) => Math.max(i - 1, 0));
    } else if (event.key === 'Enter' && results[active]) {
      event.preventDefault();
      go(results[active]);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      slotProps={{
        transition: { onEntered: () => inputRef.current?.focus() },
        paper: { sx: { mt: { xs: 6, md: 12 }, alignSelf: 'flex-start', borderRadius: 2 } },
      }}
    >
      <Box
        sx={{
          p: 2,
          display: 'flex',
          alignItems: 'center',
          borderBottom: (t) => `solid 1px ${t.vars.palette.divider}`,
        }}
      >
        <InputBase
          fullWidth
          inputRef={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Busca animales, productos o artículos…"
          startAdornment={
            <InputAdornment position="start">
              <Iconify icon="ri:search-line" width={22} sx={{ color: 'text.disabled' }} />
            </InputAdornment>
          }
          sx={{ typography: 'h6', fontWeight: 400 }}
        />
        <Box
          component="kbd"
          sx={{
            px: 0.75,
            py: 0.25,
            ml: 1,
            fontSize: 11,
            fontFamily: MONO_FONT,
            color: 'text.disabled',
            borderRadius: 0.75,
            border: (t) => `solid 1px ${t.vars.palette.divider}`,
          }}
        >
          ESC
        </Box>
      </Box>

      <Box sx={{ maxHeight: 420, overflowY: 'auto' }}>
        {!q && (
          <Typography sx={{ p: 4, textAlign: 'center', color: 'text.disabled' }}>
            Escribe para buscar en el catálogo
          </Typography>
        )}

        {q && results.length === 0 && (
          <Typography sx={{ p: 4, textAlign: 'center', color: 'text.secondary' }}>
            {items === null ? 'Cargando catálogo…' : `Sin resultados para “${query}”`}
          </Typography>
        )}

        {results.map((item, index) => (
          <Box
            key={item.id}
            onClick={() => go(item)}
            onMouseEnter={() => setActive(index)}
            sx={{
              p: 1.5,
              gap: 2,
              display: 'flex',
              cursor: 'pointer',
              alignItems: 'center',
              bgcolor: index === active ? 'action.hover' : 'transparent',
            }}
          >
            <Box
              sx={{
                width: 48,
                height: 48,
                flexShrink: 0,
                borderRadius: 1,
                overflow: 'hidden',
                bgcolor: 'background.neutral',
              }}
            >
              {item.photo && <Image alt={item.title} src={item.photo} ratio="1/1" />}
            </Box>
            <Box sx={{ minWidth: 0, flexGrow: 1 }}>
              <Typography variant="subtitle2" noWrap>
                {item.title}
              </Typography>
              {item.type === 'species' ? (
                <ScientificName sx={{ display: 'block', typography: 'caption' }}>
                  {item.sub}
                </ScientificName>
              ) : (
                <Typography variant="caption" sx={{ display: 'block', color: 'text.secondary' }} noWrap>
                  {item.sub}
                </Typography>
              )}
            </Box>
            {item.price != null && (
              <Typography variant="subtitle2" sx={{ flexShrink: 0 }}>
                {fCurrency(item.price)}
              </Typography>
            )}
          </Box>
        ))}
      </Box>
    </Dialog>
  );
}
