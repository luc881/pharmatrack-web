'use client';

import { useState } from 'react';

import Box from '@mui/material/Box';

// ----------------------------------------------------------------------

export function AnimalGallery({ photos, alt }) {
  const [selected, setSelected] = useState(0);

  if (!photos.length) {
    return (
      <Box
        sx={{
          width: 1,
          aspectRatio: '4/3',
          display: 'flex',
          borderRadius: 2,
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: 'background.neutral',
          color: 'text.disabled',
        }}
      >
        Sin fotos
      </Box>
    );
  }

  return (
    <Box>
      <Box
        component="img"
        src={photos[selected]}
        alt={alt}
        sx={{
          width: 1,
          aspectRatio: '4/3',
          borderRadius: 2,
          objectFit: 'cover',
          bgcolor: 'background.neutral',
        }}
      />
      {photos.length > 1 && (
        <Box sx={{ mt: 1.5, gap: 1, display: 'flex', flexWrap: 'wrap' }}>
          {photos.map((url, index) => (
            <Box
              key={url}
              component="img"
              src={url}
              alt={`${alt} — foto ${index + 1}`}
              onClick={() => setSelected(index)}
              sx={{
                width: 64,
                height: 64,
                borderRadius: 1,
                objectFit: 'cover',
                cursor: 'pointer',
                border: (t) =>
                  `2px solid ${index === selected ? t.vars.palette.primary.main : 'transparent'}`,
              }}
            />
          ))}
        </Box>
      )}
    </Box>
  );
}
