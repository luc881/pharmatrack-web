'use client';

import { useState } from 'react';

import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';

import { CONFIG } from 'src/global-config';
import { OdScene } from 'src/layouts/od/od-scene';

// ----------------------------------------------------------------------
// Preguntas frecuentes (sección del home, ancla #preguntas). Fondo terracota,
// marquesina inversa, escena del tronco a la izquierda y acordeón a la derecha.
// ----------------------------------------------------------------------

const WA = `https://wa.me/${CONFIG.whatsapp}`;

const FAQS = [
  { q: '¿Cómo se hace el envío o la entrega?', a: 'Entregamos en persona en puntos acordados de la CDMX y área metropolitana. Para otros estados coordinamos envío exprés con caja térmica, siempre saliendo lunes o martes.' },
  { q: '¿Cuántos individuos incluye un cultivo?', a: 'Cada cultivo sale con 12 a 15 individuos de tallas mixtas, sustrato de arranque y hojarasca. Siempre mandamos algunos de más para cubrir cualquier baja del traslado.' },
  { q: '¿Son buenos para empezar?', a: 'Sí. Las especies marcadas como principiante toleran variaciones de humedad y temperatura ambiente sin equipo especial. En la ficha de cada una verás la dificultad indicada.' },
  { q: '¿Qué necesito tener listo antes?', a: 'Un contenedor con tapa y ventilación, sustrato húmedo, hojarasca seca y una zona de refugio. El kit de arranque trae todo eso montado si prefieres no armarlo por partes.' },
  { q: '¿Hay garantía si llegan mal?', a: 'Sí. Avísanos con fotos dentro de las primeras 24 horas y reponemos los individuos afectados en la siguiente entrega, sin costo.' },
  { q: '¿Cómo puedo pagar?', a: 'Mercado Pago con tarjeta o meses sin intereses, transferencia SPEI y efectivo en la entrega. El apartado se confirma con el 50%.' },
];

const NAMES = 'Preguntas frecuentes · ';

export function OdFaq() {
  const [open, setOpen] = useState(0);

  return (
    <Box component="section" id="preguntas" data-dark="1" sx={{ bgcolor: 'var(--color-accent-900)', color: 'var(--color-neutral-200)', pt: { xs: '56px', md: '72px' }, pb: { xs: '72px', md: '110px' }, overflow: 'hidden' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 3, px: '40px', pb: 2.75, fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--color-neutral-500)' }}>
        <Box component="span">(Preguntas frecuentes)</Box>
        <Box component="span" sx={{ fontVariantNumeric: 'tabular-nums' }}>06 respuestas</Box>
      </Box>

      <Box sx={{ py: 3.25, borderTop: '1px solid rgba(240,235,224,0.18)', borderBottom: '1px solid rgba(240,235,224,0.18)', overflow: 'hidden' }}>
        <Box className="od-marquee" sx={{ display: 'flex', width: 'max-content', whiteSpace: 'nowrap', fontFamily: 'var(--font-heading)', fontSize: 'clamp(46px, 7.6vw, 118px)', lineHeight: 1.06, letterSpacing: '-0.01em', textTransform: 'uppercase', color: 'var(--color-neutral-100)', animation: 'odMarqueeR 70s linear infinite' }}>
          <Box component="span">{NAMES.repeat(6)}</Box>
          <Box component="span">{NAMES.repeat(6)}</Box>
        </Box>
      </Box>

      <Box sx={{ display: 'grid', alignItems: 'stretch', gridTemplateColumns: { xs: '1fr', md: 'minmax(260px, 0.75fr) minmax(340px, 1.65fr)' } }}>
        {/* Izquierda: escena del tronco + WhatsApp */}
        <Box sx={{ display: 'flex', flexDirection: 'column', p: { xs: '40px 18px 0', md: '62px 46px 0 40px' }, borderRight: { md: '1px solid rgba(240,235,224,0.14)' } }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, fontSize: 13, color: 'var(--color-neutral-400)' }}>
            <Box component="span" sx={{ width: 7, height: 7, borderRadius: '50%', bgcolor: 'var(--color-neutral-500)' }} />
            Antes de tu primer ejemplar
          </Box>
          <Box sx={{ mt: 'auto', pt: { xs: '40px', md: '80px' } }}>
            <Box sx={{ display: { xs: 'none', md: 'block' }, maxWidth: 300 }}>
              <OdScene scene="log" fallbackSrc="/assets/redesign/moss-forest-1.jpg" fallbackLabel="Tronco con musgo" ratio="3 / 5" />
            </Box>
            <Box sx={{ mt: { xs: 0, md: '34px' }, fontFamily: 'var(--font-heading)', fontSize: 27, lineHeight: 1.25, color: 'var(--color-neutral-500)' }}>
              ¿Te quedó una duda?
            </Box>
            <Box sx={{ mb: 3.25, fontFamily: 'var(--font-heading)', fontSize: 27, lineHeight: 1.25, color: 'var(--color-neutral-100)' }}>
              Escríbenos por WhatsApp.
            </Box>
            <Box
              component="a"
              href={WA}
              target="_blank"
              rel="noopener"
              sx={{ display: 'inline-flex', alignItems: 'center', gap: '34px', pl: '22px', pr: '15px', py: '15px', borderRadius: '6px', bgcolor: 'var(--color-neutral-100)', color: 'var(--color-accent-900)', fontSize: 15, textDecoration: 'none', transition: 'background 300ms', '&:hover': { bgcolor: 'var(--color-accent-200)' } }}
            >
              Preguntar por WhatsApp
              <Box component="span" sx={{ flexShrink: 0, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 30, height: 30, borderRadius: '4px', bgcolor: 'var(--color-accent-900)', color: 'var(--color-neutral-100)' }}>↗</Box>
            </Box>
          </Box>
        </Box>

        {/* Derecha: título + acordeón */}
        <Box sx={{ p: { xs: '48px 18px 0', md: '62px 40px 0 46px' } }}>
          <Box component="h2" sx={{ m: 0, fontFamily: 'var(--font-heading)', fontWeight: 400, fontSize: 'clamp(34px, 4vw, 58px)', lineHeight: 1.08, color: 'var(--color-neutral-100)', maxWidth: '18ch', textWrap: 'pretty' }}>
            Esto es lo que conviene saber antes de tu primer ejemplar.
          </Box>
          <Box sx={{ mt: { xs: 5, md: 8 }, borderTop: '1px solid rgba(240,235,224,0.14)' }}>
            {FAQS.map((item, i) => {
              const isOpen = open === i;
              return (
                <Box key={item.q} sx={{ borderBottom: '1px solid rgba(240,235,224,0.14)', bgcolor: `rgba(240,235,224,${0.014 + i * 0.011})` }}>
                  <Box
                    component="button"
                    type="button"
                    onClick={() => setOpen(isOpen ? -1 : i)}
                    aria-expanded={isOpen}
                    sx={{ width: 1, display: 'grid', gridTemplateColumns: { xs: '34px 1fr auto', md: '62px 1fr auto' }, alignItems: 'center', gap: 2.5, p: { xs: '20px 4px', md: '24px 26px' }, bgcolor: 'transparent', border: 0, cursor: 'pointer', font: 'inherit', color: 'var(--color-neutral-100)', textAlign: 'left', transition: 'background 260ms, color 260ms', '&:hover': { bgcolor: 'rgba(240,235,224,0.08)', color: 'var(--color-accent-300)' } }}
                  >
                    <Box component="span" sx={{ fontFamily: 'var(--font-heading)', fontSize: 15, letterSpacing: '0.14em', color: 'var(--color-neutral-500)', fontVariantNumeric: 'tabular-nums' }}>
                      {String(i + 1).padStart(2, '0')}
                    </Box>
                    <Box component="span" sx={{ fontSize: { xs: 16, md: 18 }, fontWeight: 500 }}>{item.q}</Box>
                    <Box component="span" sx={{ flexShrink: 0, width: 10, height: 10, borderRadius: '50%', border: '1px solid var(--color-neutral-500)', bgcolor: isOpen ? 'var(--color-accent-400)' : 'transparent', transition: 'background 260ms' }} />
                  </Box>
                  <Collapse in={isOpen}>
                    <Box sx={{ m: 0, p: { xs: '0 4px 24px 42px', md: '0 80px 28px 108px' }, fontSize: 15, lineHeight: 1.8, color: 'var(--color-neutral-400)' }}>
                      {item.a}
                    </Box>
                  </Collapse>
                </Box>
              );
            })}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
