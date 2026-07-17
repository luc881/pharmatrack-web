import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Badge from '@mui/material/Badge';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import Slider from '@mui/material/Slider';
import Divider from '@mui/material/Divider';
import Tooltip from '@mui/material/Tooltip';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import FormControlLabel from '@mui/material/FormControlLabel';

import { fCurrency } from 'src/utils/format-number';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';

import { SEX_LABELS } from './utils';

// ----------------------------------------------------------------------

// Controles compartidos entre el drawer (móvil) y el sidebar (desktop)

export function SexFilterControl({ filters }) {
  const { state, setState } = filters;

  const toggleSex = (value) => {
    const checked = state.sex.includes(value)
      ? state.sex.filter((v) => v !== value)
      : [...state.sex, value];
    setState({ sex: checked });
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      <Typography variant="subtitle2" sx={{ mb: 1 }}>
        Sexo
      </Typography>
      {Object.entries(SEX_LABELS).map(([value, label]) => (
        <FormControlLabel
          key={value}
          label={label}
          control={
            <Checkbox
              size="small"
              checked={state.sex.includes(value)}
              onClick={() => toggleSex(value)}
            />
          }
        />
      ))}
    </Box>
  );
}

export function PriceFilterControl({ filters, maxPrice }) {
  const { state, setState } = filters;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      <Typography variant="subtitle2" sx={{ mb: 1 }}>
        Precio
      </Typography>

      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
        {fCurrency(state.priceRange[0])} — {fCurrency(state.priceRange[1])}
      </Typography>

      <Slider
        min={0}
        max={maxPrice}
        step={Math.max(1, Math.round(maxPrice / 100))}
        value={state.priceRange}
        onChange={(event, newValue) => setState({ priceRange: newValue })}
        valueLabelDisplay="auto"
        valueLabelFormat={(value) => fCurrency(value)}
        sx={{ alignSelf: 'center', width: 'calc(100% - 24px)' }}
      />
    </Box>
  );
}

// ----------------------------------------------------------------------

export function CatalogFilters({ open, onOpen, onClose, canReset, filters, options }) {
  const { resetState: resetFilters } = filters;

  return (
    <>
      <Button
        disableRipple
        color="inherit"
        endIcon={
          <Badge color="error" variant="dot" invisible={!canReset}>
            <Iconify icon="ic:round-filter-list" />
          </Badge>
        }
        onClick={onOpen}
      >
        Filtros
      </Button>

      <Drawer
        anchor="right"
        open={open}
        onClose={onClose}
        slotProps={{
          backdrop: { invisible: true },
          paper: { sx: { width: 320 } },
        }}
      >
        <Box sx={{ py: 2, pr: 1, pl: 2.5, display: 'flex', alignItems: 'center' }}>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Filtros
          </Typography>

          <Tooltip title="Limpiar">
            <IconButton onClick={() => resetFilters()}>
              <Badge color="error" variant="dot" invisible={!canReset}>
                <Iconify icon="solar:restart-bold" />
              </Badge>
            </IconButton>
          </Tooltip>

          <IconButton onClick={onClose}>
            <Iconify icon="mingcute:close-line" />
          </IconButton>
        </Box>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <Scrollbar sx={{ px: 2.5, py: 3 }}>
          <Stack spacing={3}>
            <SexFilterControl filters={filters} />
            <PriceFilterControl filters={filters} maxPrice={options.maxPrice} />
          </Stack>
        </Scrollbar>
      </Drawer>
    </>
  );
}
