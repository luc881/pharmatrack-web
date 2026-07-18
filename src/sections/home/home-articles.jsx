import { m } from 'framer-motion';
import { varAlpha } from 'minimal-shared/utils';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { RouterLink } from 'src/routes/components';

import { Image } from 'src/components/image';
import { Iconify } from 'src/components/iconify';
import { varFade, varContainer, MotionViewport } from 'src/components/animate';

import { MONO_FONT, SectionLabel } from 'src/sections/catalog/scientific';

import { ARTICLES } from './home-content';

// ----------------------------------------------------------------------

const slowStagger = varContainer({ transitionIn: { staggerChildren: 0.18, delayChildren: 0.15 } });
const slowFade = (dir) => varFade(dir, { distance: 40, transitionIn: { duration: 0.9 } });

// Texto pequeño en monospace, estilo "ficha de catálogo" de phasmaMX
const mono = {
  fontFamily: MONO_FONT,
  fontSize: 11,
  fontWeight: 700,
  letterSpacing: '0.18em',
  textTransform: 'uppercase',
};

function ArticleCard({ article, index }) {
  return (
    <Link
      component={RouterLink}
      href={article.href}
      underline="none"
      sx={(theme) => ({
        display: 'block',
        position: 'relative',
        overflow: 'hidden',
        borderRadius: 2,
        aspectRatio: '3/4',
        bgcolor: theme.vars.palette.grey[900],
        color: 'common.white',
        '&:hover .art-img': { transform: 'scale(1.06)' },
        '&:hover .art-cta': { opacity: 1, transform: 'translateY(0)' },
      })}
    >
      {article.photo ? (
        <Image
          alt={article.title}
          src={article.photo}
          className="art-img"
          sx={{
            width: 1,
            height: 1,
            position: 'absolute',
            inset: 0,
            transition: 'transform 0.8s ease',
          }}
        />
      ) : (
        // Sin foto: panel editorial con un degradado sutil del tono primario
        <Box
          className="art-img"
          sx={(theme) => ({
            position: 'absolute',
            inset: 0,
            transition: 'transform 0.8s ease',
            backgroundImage: `radial-gradient(at 80% 0%, ${varAlpha(theme.vars.palette.primary.darkerChannel, 0.6)} 0%, transparent 60%)`,
          })}
        />
      )}

      {/* velo para que el texto siempre lea bien sobre la foto */}
      <Box
        sx={(theme) => ({
          position: 'absolute',
          inset: 0,
          backgroundImage: `linear-gradient(to bottom, ${varAlpha(theme.vars.palette.common.blackChannel, 0.24)} 0%, transparent 35%, ${varAlpha(theme.vars.palette.common.blackChannel, 0.8)} 100%)`,
        })}
      />

      <Box sx={{ position: 'absolute', inset: 0, p: 3, display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', opacity: 0.64 }}>
          <Box component="span" sx={mono}>
            {article.code}
          </Box>
          <Box component="span" sx={mono}>
            {String(index + 1).padStart(2, '0')}
          </Box>
        </Box>

        <Box sx={{ mt: 'auto' }}>
          <Box component="span" sx={{ ...mono, color: 'warning.light' }}>
            {article.tag}
          </Box>

          <Typography variant="h4" sx={{ mt: 1, mb: 1.5 }}>
            {article.title}
          </Typography>

          <Box
            className="art-cta"
            sx={{
              ...mono,
              gap: 0.75,
              display: 'flex',
              alignItems: 'center',
              opacity: { xs: 1, md: 0 },
              transform: { md: 'translateY(8px)' },
              transition: 'opacity 0.45s ease, transform 0.45s ease',
            }}
          >
            Leer artículo
            <Iconify icon="eva:diagonal-arrow-right-up-fill" width={16} />
          </Box>
        </Box>
      </Box>
    </Link>
  );
}

export function HomeArticles({ sx, ...other }) {
  if (!ARTICLES.length) return null;

  return (
    <Box
      component="section"
      sx={[{ overflow: 'hidden' }, ...(Array.isArray(sx) ? sx : [sx])]}
      {...other}
    >
      <Container component={MotionViewport} variants={slowStagger} sx={{ py: { xs: 8, md: 12 } }}>
        <m.div variants={slowFade('inDown')}>
          <SectionLabel sx={{ justifyContent: 'flex-start' }}>Divulgación</SectionLabel>
        </m.div>

        <m.div variants={slowFade('inUp')}>
          <Typography variant="h2" sx={{ mt: 2, mb: 5 }}>
            Artículos
          </Typography>
        </m.div>

        <Box
          sx={{
            gap: 3,
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
          }}
        >
          {ARTICLES.map((article, index) => (
            <Box key={article.code} component={m.div} variants={slowFade('inUp')}>
              <ArticleCard article={article} index={index} />
            </Box>
          ))}
        </Box>
      </Container>
    </Box>
  );
}
