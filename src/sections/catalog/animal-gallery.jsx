'use client';

import { useEffect } from 'react';

import Box from '@mui/material/Box';

import { Image } from 'src/components/image';
import { Lightbox, useLightbox } from 'src/components/lightbox';
import {
  Carousel,
  useCarousel,
  CarouselThumb,
  CarouselThumbs,
  CarouselArrowNumberButtons,
} from 'src/components/carousel';

// ----------------------------------------------------------------------

export function AnimalGallery({ photos, alt }) {
  const carousel = useCarousel({ thumbs: { slidesToShow: 'auto' } });

  const slides = photos.map((src) => ({ src }));

  const lightbox = useLightbox(slides);

  useEffect(() => {
    if (lightbox.open) {
      carousel.mainApi?.scrollTo(lightbox.selected, true);
    }
  }, [carousel.mainApi, lightbox.open, lightbox.selected]);

  if (!slides.length) {
    return (
      <Box
        sx={{
          width: 1,
          borderRadius: 2,
          aspectRatio: '1/1',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: 'background.neutral',
          color: 'text.disabled',
          typography: 'body2',
        }}
      >
        Sin foto
      </Box>
    );
  }

  return (
    <>
      <div>
        <Box sx={{ mb: 2.5, position: 'relative' }}>
          {slides.length > 1 && (
            <CarouselArrowNumberButtons
              {...carousel.arrows}
              options={carousel.options}
              totalSlides={carousel.dots.dotCount}
              selectedIndex={carousel.dots.selectedIndex + 1}
              sx={{ right: 16, bottom: 16, position: 'absolute' }}
            />
          )}

          <Carousel carousel={carousel} sx={{ borderRadius: 2 }}>
            {slides.map((slide) => (
              <Image
                key={slide.src}
                alt={alt}
                src={slide.src}
                ratio="1/1"
                cdnWidth={900}
                onClick={() => lightbox.onOpen(slide.src)}
                sx={{ cursor: 'zoom-in', minWidth: 320 }}
              />
            ))}
          </Carousel>
        </Box>

        {slides.length > 1 && (
          <CarouselThumbs
            ref={carousel.thumbs.thumbsRef}
            options={carousel.options?.thumbs}
            slotProps={{ disableMask: true }}
            sx={{ width: 360, maxWidth: 1 }}
          >
            {slides.map((item, index) => (
              <CarouselThumb
                key={item.src}
                index={index}
                src={item.src}
                selected={index === carousel.thumbs.selectedIndex}
                onClick={() => carousel.thumbs.onClickThumb(index)}
              />
            ))}
          </CarouselThumbs>
        )}
      </div>

      <Lightbox
        index={lightbox.selected}
        slides={slides}
        open={lightbox.open}
        close={lightbox.onClose}
        onGetCurrentIndex={(index) => lightbox.setSelected(index)}
      />
    </>
  );
}
