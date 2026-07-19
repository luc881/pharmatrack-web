import { m } from 'framer-motion';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { Iconify } from 'src/components/iconify';
import { varFade, varContainer, MotionViewport } from 'src/components/animate';

import { SectionLabel } from 'src/sections/catalog/scientific';
import { ArticleCard } from 'src/sections/articles/article-card';

// ----------------------------------------------------------------------

const slowStagger = varContainer({ transitionIn: { staggerChildren: 0.18, delayChildren: 0.15 } });
const slowFade = (dir) => varFade(dir, { distance: 40, transitionIn: { duration: 0.9 } });

export function HomeArticles({ articles = [], sx, ...other }) {
  if (!articles.length) return null;

  return (
    <Box
      component="section"
      sx={[{ overflow: 'hidden' }, ...(Array.isArray(sx) ? sx : [sx])]}
      {...other}
    >
      <Container component={MotionViewport} variants={slowStagger} sx={{ py: { xs: 8, md: 12 } }}>
        <Box sx={{ mb: 5, gap: 2, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
          <Box>
            <m.div variants={slowFade('inDown')}>
              <SectionLabel sx={{ justifyContent: 'flex-start' }}>Divulgación</SectionLabel>
            </m.div>

            <m.div variants={slowFade('inUp')}>
              <Typography variant="h2" sx={{ mt: 2 }}>
                Artículos
              </Typography>
            </m.div>
          </Box>

          <m.div variants={slowFade('inUp')}>
            <Button
              component={RouterLink}
              href={paths.articles}
              color="inherit"
              endIcon={<Iconify icon="eva:diagonal-arrow-right-up-fill" width={18} />}
            >
              Ver todos
            </Button>
          </m.div>
        </Box>

        <Box
          sx={{
            gap: 3,
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
          }}
        >
          {articles.slice(0, 3).map((article, index) => (
            <Box key={article.id} component={m.div} variants={slowFade('inUp')}>
              <ArticleCard article={article} index={index} />
            </Box>
          ))}
        </Box>
      </Container>
    </Box>
  );
}
