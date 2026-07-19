import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Link from '@mui/material/Link';
import Button from '@mui/material/Button';

import { RouterLink } from 'src/routes/components';

import { Image } from 'src/components/image';

// ----------------------------------------------------------------------
// Tarjeta base del catálogo: LA MISMA para especies y productos.
// Foto con zoom que se asienta (o crossfade si hay segunda foto), barra
// "Ver detalle" recortada dentro de la imagen y slots para etiquetas.
// Cualquier ajuste de animación aquí aplica a ambas.
// ----------------------------------------------------------------------

export function NoPhoto() {
  return (
    <Box
      sx={{
        aspectRatio: '1/1',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.neutral',
        color: 'text.disabled',
        typography: 'caption',
      }}
    >
      Sin foto
    </Box>
  );
}

export function CatalogCard({ href, photo, hoverPhoto = null, alt, topLeft, topRight, children }) {
  return (
    <Card
      sx={{
        height: 1,
        // la foto principal cede a la segunda con un zoom suave que se asienta
        ...(hoverPhoto
          ? {
              '&:hover .img-main': { opacity: 0 },
              '&:hover .img-hover': { opacity: 1, transform: 'scale(1)' },
            }
          : { '&:hover .img-main img': { transform: 'scale(1.08)' } }),
        '&:hover .quick-cta': { opacity: 1 },
        '&:hover .fav-btn': { opacity: 1, transform: 'translateY(0)' },
      }}
    >
      {topLeft}
      {topRight}

      <Box sx={{ p: 1 }}>
        {/* El contenedor redondeado recorta también la franja de Ver detalle;
            isolation evita artefactos de pintado del transform recortado */}
        <Box sx={{ borderRadius: 1.5, overflow: 'hidden', position: 'relative', isolation: 'isolate' }}>
          <Link component={RouterLink} href={href} sx={{ display: 'block' }}>
            {photo ? (
              <>
                <Image
                  alt={alt}
                  src={photo}
                  ratio="1/1"
                  className="img-main"
                  sx={{
                    transition: 'opacity 0.5s ease',
                    '& img': { transition: 'transform 0.6s ease' },
                  }}
                />
                {hoverPhoto && (
                  <Image
                    alt={alt}
                    src={hoverPhoto}
                    ratio="1/1"
                    className="img-hover"
                    sx={{
                      position: 'absolute',
                      inset: 0,
                      opacity: 0,
                      transform: 'scale(1.12)',
                      transition: 'opacity 0.5s ease, transform 1s ease',
                    }}
                  />
                )}
              </>
            ) : (
              <NoPhoto />
            )}
          </Link>

          <Button
            className="quick-cta"
            component={RouterLink}
            href={href}
            fullWidth
            disableElevation
            variant="contained"
            color="inherit"
            sx={{
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 9,
              height: 42,
              position: 'absolute',
              borderRadius: 0,
              boxShadow: 'none',
              // solo opacidad: animar transform aquí junto con el zoom de la
              // foto producía rasgaduras de composición en Windows/Chrome
              opacity: 0,
              transition: 'opacity 0.35s ease',
              display: { xs: 'none', md: 'inline-flex' },
            }}
          >
            Ver detalle
          </Button>
        </Box>
      </Box>

      {children}
    </Card>
  );
}
