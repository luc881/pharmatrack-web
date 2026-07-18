import { m } from 'framer-motion';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Accordion from '@mui/material/Accordion';
import Typography from '@mui/material/Typography';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';

import { Iconify } from 'src/components/iconify';
import { varFade, varContainer, MotionViewport } from 'src/components/animate';

import { SectionLabel } from 'src/sections/catalog/scientific';

import { FAQS } from './home-content';

// ----------------------------------------------------------------------

const slowStagger = varContainer({ transitionIn: { staggerChildren: 0.18, delayChildren: 0.15 } });
const slowFade = (dir) => varFade(dir, { distance: 40, transitionIn: { duration: 0.9 } });

// Schema.org FAQPage: Google puede mostrar las preguntas en los resultados
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQS.map((faq) => ({
    '@type': 'Question',
    name: faq.question,
    acceptedAnswer: { '@type': 'Answer', text: faq.answer },
  })),
};

export function HomeFaq({ sx, ...other }) {
  return (
    <Box
      component="section"
      sx={[{ overflow: 'hidden' }, ...(Array.isArray(sx) ? sx : [sx])]}
      {...other}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Container
        component={MotionViewport}
        variants={slowStagger}
        sx={{ py: { xs: 8, md: 12 }, maxWidth: { md: 880 } }}
      >
        <m.div variants={slowFade('inDown')}>
          <SectionLabel>Dudas</SectionLabel>
        </m.div>

        <m.div variants={slowFade('inUp')}>
          <Typography variant="h2" sx={{ mt: 2, mb: 5, textAlign: 'center' }}>
            Preguntas frecuentes
          </Typography>
        </m.div>

        {FAQS.map((faq) => (
          <Box key={faq.question} component={m.div} variants={slowFade('inUp')}>
            <Accordion
              disableGutters
              sx={(theme) => ({
                mb: 2,
                px: 1,
                borderRadius: 1.5,
                boxShadow: 'none',
                border: `solid 1px ${theme.vars.palette.divider}`,
                '&::before': { display: 'none' },
                '&.Mui-expanded': { borderColor: 'text.primary' },
              })}
            >
              <AccordionSummary
                expandIcon={
                  <Iconify
                    icon="mingcute:add-line"
                    width={20}
                    sx={{
                      transition: 'transform 0.3s ease',
                      '.Mui-expanded &': { transform: 'rotate(45deg)' },
                    }}
                  />
                }
                // el icono ya rota por su cuenta: sin el giro default del summary
                sx={{
                  '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': { transform: 'none' },
                }}
              >
                <Typography
                  variant="subtitle2"
                  sx={{ py: 0.5, letterSpacing: '0.08em', textTransform: 'uppercase' }}
                >
                  {faq.question}
                </Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ pt: 0 }}>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {faq.answer}
                </Typography>
              </AccordionDetails>
            </Accordion>
          </Box>
        ))}
      </Container>
    </Box>
  );
}
