'use client';

import { m } from 'framer-motion';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { EmptyContent } from 'src/components/empty-content';
import { varFade, varContainer, MotionViewport } from 'src/components/animate';

import { SectionLabel } from 'src/sections/catalog/scientific';

import { ArticleCard } from './article-card';

// ----------------------------------------------------------------------

const slowStagger = varContainer({ transitionIn: { staggerChildren: 0.12, delayChildren: 0.1 } });
const slowFade = (dir) => varFade(dir, { distance: 40, transitionIn: { duration: 0.9 } });

export function ArticlesView({ articles }) {
  return (
    <Container component={MotionViewport} variants={slowStagger} sx={{ py: { xs: 6, md: 10 } }}>
      <m.div variants={slowFade('inDown')}>
        <SectionLabel sx={{ justifyContent: 'flex-start' }}>Divulgación</SectionLabel>
      </m.div>

      <m.div variants={slowFade('inUp')}>
        <Typography variant="h2" sx={{ mt: 2, mb: 1 }}>
          Artículos
        </Typography>
        <Typography sx={{ mb: 5, color: 'text.secondary', maxWidth: 560 }}>
          Guías de cuidado, especies y el detrás de cámaras del criadero.
        </Typography>
      </m.div>

      {articles.length === 0 ? (
        <EmptyContent title="Aún no hay artículos" sx={{ py: 10 }} />
      ) : (
        <Box
          sx={{
            gap: 3,
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
          }}
        >
          {articles.map((article, index) => (
            <Box key={article.id} component={m.div} variants={slowFade('inUp')}>
              <ArticleCard article={article} index={index} />
            </Box>
          ))}
        </Box>
      )}
    </Container>
  );
}
