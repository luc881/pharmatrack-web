'use client';

import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';

import { CONFIG } from 'src/global-config';
import { OdScene } from 'src/layouts/od/od-scene';
import { OdPanel } from 'src/layouts/od/od-panel';
import { OdFlowGradient } from 'src/layouts/od/od-flow-gradient';

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

// Fondo animado (antes una foto con velo, se veía poco profesional). Mientras
// se elige hay varias opciones de flow; con ?fondo-preguntas aparece un botón
// para recorrerlas. ponytail: al elegir, dejar solo esa y borrar el selector.
const FONDOS = [
  { id: 'hondo', nombre: 'Musgo hondo (actual)', colors: ['#101714', '#132b25', '#173E36', '#247465', '#3f9a7f'] },
  { id: 'hondo-grano', nombre: 'Musgo hondo + grano notorio', colors: ['#101714', '#132b25', '#173E36', '#247465', '#3f9a7f'], grano: true },
  { id: 'musgo', nombre: 'Musgo brillante con velo', colors: ['#0f2420', '#173E36', '#247465', '#55B895', '#ACDDB5'], velo: 0.4 },
  { id: 'salvia', nombre: 'Noche y salvia (apagado)', colors: ['#0e1311', '#161B19', '#1f3a33', '#3d6b5c', '#7fa08e'] },
  { id: 'hojarasca', nombre: 'Musgo y hojarasca (tierra)', colors: ['#14110d', '#211c16', '#173E36', '#4f3d2a', '#8f6c42'] },
  { id: 'lento', nombre: 'Musgo hondo, ondas grandes y lentas', colors: ['#101714', '#132b25', '#173E36', '#247465', '#3f9a7f'], scale: 0.24, speed: 0.03 },
];
const FONDO_ELEGIDO = 'hondo';

export function OdFaq({ mossTall }) {
  const [fi, setFi] = useState(() => FONDOS.findIndex((f) => f.id === FONDO_ELEGIDO));
  const [probando, setProbando] = useState(false);
  useEffect(() => {
    setProbando(new URLSearchParams(window.location.search).has('fondo-preguntas'));
  }, []);
  const fondo = FONDOS[fi];
  const [open, setOpen] = useState(0);

  return (
    <OdPanel id="preguntas" className="od-grain" sx={{ pt: { xs: '56px', md: '72px' }, pb: { xs: '72px', md: '110px' } }}>
      {/* foto de ambiente muy oscurecida: textura, no protagonista */}
      <Box aria-hidden sx={{ position: 'absolute', inset: 0, zIndex: -1 }}>
        <OdFlowGradient key={fondo.id} colors={fondo.colors} scale={fondo.scale} speed={fondo.speed} />
        {fondo.velo && <Box sx={{ position: 'absolute', inset: 0, bgcolor: `rgba(22,27,25,${fondo.velo})` }} />}
        {fondo.grano && <Box sx={{ position: 'absolute', inset: 0, backgroundImage: 'var(--od-noise)', backgroundSize: '140px', mixBlendMode: 'overlay' }} />}
      </Box>
      {probando && (
        <Box
          component="button"
          type="button"
          onClick={() => setFi((n) => (n + 1) % FONDOS.length)}
          sx={{ position: 'fixed', left: 20, bottom: 20, zIndex: 1500, px: 2.5, py: 1.5, border: 0, borderRadius: '999px', font: 'inherit', fontSize: 14, cursor: 'pointer', bgcolor: 'var(--od-papel)', color: 'var(--od-tinta)', boxShadow: '0 6px 24px rgba(0,0,0,0.25)' }}
        >
          Fondo de preguntas: {fondo.nombre} ({fi + 1}/{FONDOS.length}) · Siguiente →
        </Box>
      )}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 3, px: { xs: '18px', md: 'var(--od-gutter)' }, pb: 2.75, fontSize: 13, color: 'var(--color-neutral-500)' }}>
        <Box component="span">(Preguntas frecuentes)</Box>
        <Box component="span" sx={{ fontVariantNumeric: 'tabular-nums' }}>06 respuestas</Box>
      </Box>

      <Box sx={{ py: 3.25, borderTop: '1px solid rgba(238,236,230,0.18)', borderBottom: '1px solid rgba(238,236,230,0.18)', overflow: 'hidden' }}>
        <Box className="od-marquee" sx={{ display: 'flex', width: 'max-content', whiteSpace: 'nowrap', fontFamily: 'var(--font-heading)', fontSize: { xs: 'clamp(24px, 7vw, 40px)', md: 'clamp(46px, 7.6vw, 118px)' }, lineHeight: 1.06, letterSpacing: '-0.01em', textTransform: 'uppercase', color: 'var(--color-neutral-100)', animation: 'odMarqueeR 70s linear infinite' }}>
          <Box component="span">{NAMES.repeat(6)}</Box>
          <Box component="span">{NAMES.repeat(6)}</Box>
        </Box>
      </Box>

      <Box sx={{ display: 'grid', alignItems: 'stretch', px: { md: 'var(--od-gutter-extra)' }, gridTemplateColumns: { xs: '1fr', md: 'minmax(260px, 0.75fr) minmax(340px, 1.65fr)' } }}>
        {/* Izquierda: escena del tronco + WhatsApp */}
        <Box sx={{ display: 'flex', flexDirection: 'column', p: { xs: '40px 18px 0', md: '62px 46px 0 40px' }, borderRight: { md: '1px solid rgba(238,236,230,0.14)' } }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, fontSize: 13, color: 'var(--color-neutral-400)' }}>
            <Box component="span" sx={{ width: 7, height: 7, borderRadius: '50%', bgcolor: 'var(--color-neutral-500)' }} />
            Antes de tu primer ejemplar
          </Box>
          <Box sx={{ mt: 'auto', pt: { xs: '40px', md: '80px' } }}>
            <Box sx={{ display: { xs: 'none', md: 'block' }, maxWidth: 300 }}>
              <OdScene scene="tocon" fallbackSrc={mossTall} fallbackLabel="Tocón de madera" ratio="4 / 5" />
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
          <Box sx={{ mt: { xs: 5, md: 8 }, borderTop: '1px solid rgba(238,236,230,0.14)' }}>
            {FAQS.map((item, i) => {
              const isOpen = open === i;
              return (
                <Box key={item.q} sx={{ borderBottom: '1px solid rgba(238,236,230,0.14)', bgcolor: `rgba(238,236,230,${0.014 + i * 0.011})` }}>
                  <Box
                    component="button"
                    type="button"
                    onClick={() => setOpen(isOpen ? -1 : i)}
                    aria-expanded={isOpen}
                    sx={{ width: 1, display: 'grid', gridTemplateColumns: '1fr auto', alignItems: 'center', gap: 2.5, p: { xs: '20px 4px', md: '24px 26px' }, bgcolor: 'transparent', border: 0, cursor: 'pointer', font: 'inherit', color: 'var(--color-neutral-100)', textAlign: 'left', transition: 'background 260ms, color 260ms', '&:hover': { bgcolor: 'rgba(238,236,230,0.08)', color: 'var(--color-accent-300)' } }}
                  >
                    <Box component="span" sx={{ fontSize: { xs: 16, md: 18 }, fontWeight: 500 }}>{item.q}</Box>
                    <Box component="span" sx={{ flexShrink: 0, width: 10, height: 10, borderRadius: '50%', border: '1px solid var(--color-neutral-500)', bgcolor: isOpen ? 'var(--color-accent-400)' : 'transparent', transition: 'background 260ms' }} />
                  </Box>
                  <Collapse in={isOpen}>
                    <Box sx={{ m: 0, p: { xs: '0 4px 24px', md: '0 80px 28px 26px' }, fontSize: 15, lineHeight: 1.8, color: 'var(--color-neutral-400)' }}>
                      {item.a}
                    </Box>
                  </Collapse>
                </Box>
              );
            })}
          </Box>
        </Box>
      </Box>
    </OdPanel>
  );
}
