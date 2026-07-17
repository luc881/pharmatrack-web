import Box from '@mui/material/Box';
import Radio from '@mui/material/Radio';
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

export function CatalogFilters({ open, onOpen, onClose, canReset, filters, options }) {
  const { state: currentFilters, setState: updateFilters, resetState: resetFilters } = filters;

  const toggleSex = (value) => {
    const checked = currentFilters.sex.includes(value)
      ? currentFilters.sex.filter((v) => v !== value)
      : [...currentFilters.sex, value];
    updateFilters({ sex: checked });
  };

  const renderHead = () => (
    <>
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
    </>
  );

  const renderRadioGroup = (title, items, key, italic = false) =>
    items.length > 1 && (
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <Typography variant="subtitle2" sx={{ mb: 1 }}>
          {title}
        </Typography>
        <FormControlLabel
          label="Todos"
          control={
            <Radio
              checked={currentFilters[key] === null}
              onClick={() => updateFilters({ [key]: null })}
            />
          }
        />
        {items.map((item) => (
          <FormControlLabel
            key={item.id}
            label={item.name}
            control={
              <Radio
                checked={currentFilters[key] === item.id}
                onClick={() => updateFilters({ [key]: item.id })}
              />
            }
            sx={{ ...(italic && { '& .MuiFormControlLabel-label': { fontStyle: 'italic' } }) }}
          />
        ))}
      </Box>
    );

  const renderSex = () => (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      <Typography variant="subtitle2" sx={{ mb: 1 }}>
        Sexo
      </Typography>
      {Object.entries(SEX_LABELS).map(([value, label]) => (
        <FormControlLabel
          key={value}
          label={label}
          control={
            <Checkbox checked={currentFilters.sex.includes(value)} onClick={() => toggleSex(value)} />
          }
        />
      ))}
    </Box>
  );

  const renderPrice = () => (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      <Typography variant="subtitle2" sx={{ mb: 1 }}>
        Precio
      </Typography>

      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
        {fCurrency(currentFilters.priceRange[0])} — {fCurrency(currentFilters.priceRange[1])}
      </Typography>

      <Slider
        min={0}
        max={options.maxPrice}
        step={Math.max(1, Math.round(options.maxPrice / 100))}
        value={currentFilters.priceRange}
        onChange={(event, newValue) => updateFilters({ priceRange: newValue })}
        valueLabelDisplay="auto"
        valueLabelFormat={(value) => fCurrency(value)}
        sx={{ alignSelf: 'center', width: 'calc(100% - 24px)' }}
      />
    </Box>
  );

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
        {renderHead()}

        <Scrollbar sx={{ px: 2.5, py: 3 }}>
          <Stack spacing={3}>
            {renderRadioGroup('Grupo', options.groups, 'groupId')}
            {renderRadioGroup('Género', options.genera, 'genusId', true)}
            {renderSex()}
            {renderPrice()}
          </Stack>
        </Scrollbar>
      </Drawer>
    </>
  );
}
