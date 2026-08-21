'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { signIn, useSession } from 'next-auth/react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { Iconify } from 'src/components/iconify';

import { stateForZip } from './mx-zip';

// ----------------------------------------------------------------------

export function SignInPrompt({ title = 'Entra a tu cuenta', description }) {
  // Auth.js manda aquí con ?error=... cuando el login se cae a medias
  const failed = useSearchParams().get('error');

  return (
    <Card sx={{ p: 5, textAlign: 'center', maxWidth: 420, mx: 'auto' }}>
      <Iconify icon="solar:user-circle-bold" width={56} sx={{ color: 'text.disabled', mb: 2 }} />

      <Typography variant="h5" sx={{ mb: 1 }}>
        {title}
      </Typography>
      <Typography variant="body2" sx={{ mb: 4, color: 'text.secondary' }}>
        {description ??
          'Guarda tus favoritos y tu cotización, y consulta tus pedidos desde cualquier dispositivo.'}
      </Typography>

      {failed && (
        <Alert severity="error" sx={{ mb: 3, textAlign: 'left', typography: 'caption' }}>
          No pudimos completar el inicio de sesión. Inténtalo de nuevo; si sigue fallando,
          escríbenos por WhatsApp.
        </Alert>
      )}

      <Button
        fullWidth
        size="large"
        variant="contained"
        onClick={() => signIn('google')}
        startIcon={<Iconify icon="logos:google-icon" width={20} />}
      >
        Continuar con Google
      </Button>
    </Card>
  );
}

// ----------------------------------------------------------------------

const EMPTY = {
  name: '',
  phone: '',
  street: '',
  ext_number: '',
  int_number: '',
  neighborhood: '',
  zip_code: '',
  city: '',
  state: '',
  address_notes: '',
};

export function AccountView() {
  const { status } = useSession();
  const [form, setForm] = useState(EMPTY);
  const [states, setStates] = useState([]);
  const [shippingEnabled, setShippingEnabled] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (status !== 'authenticated') return;
    fetch('/api/shop/me')
      .then((res) => (res.ok ? res.json() : null))
      .then((account) => {
        if (!account) return;
        // solo las llaves conocidas: lo demás (favoritos, carrito) no es del form
        setForm((current) =>
          Object.fromEntries(
            Object.keys(EMPTY).map((key) => [key, account[key] ?? current[key] ?? ''])
          )
        );
      })
      .catch(() => {});
  }, [status]);

  useEffect(() => {
    fetch('/api/site-settings')
      .then((res) => (res.ok ? res.json() : null))
      .then((site) => {
        if (site) setShippingEnabled(site.shipping_enabled !== false);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    fetch('/api/shop/mx-states')
      .then((res) => (res.ok ? res.json() : []))
      .then(setStates)
      .catch(() => {});
  }, []);

  const set = (field) => (e) => {
    const { value } = e.target;
    setForm((f) => {
      const next = { ...f, [field]: value };
      // El CP sugiere el estado (rangos por entidad); si el cliente ya eligió
      // otro, no se le pisa — la sugerencia es ayuda, no autoridad.
      if (field === 'zip_code' && !f.state) {
        const guess = stateForZip(value);
        if (guess) next.state = guess;
      }
      return next;
    });
    setSaved(false);
    setError('');
  };

  const zipOk = !form.zip_code || /^\d{5}$/.test(form.zip_code);

  const handleSave = async () => {
    if (!zipOk) {
      setError('El código postal son 5 dígitos.');
      return;
    }
    setSaving(true);
    setError('');
    try {
      const res = await fetch('/api/shop/me', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setError(
          typeof body.detail === 'string' ? body.detail : 'No se pudieron guardar tus datos.'
        );
        return;
      }
      setSaved(true);
    } catch {
      setError('No se pudieron guardar tus datos. Revisa tu conexión.');
    } finally {
      setSaving(false);
    }
  };

  if (status === 'loading') return null;

  return (
    <Container sx={{ mb: 10, mt: { xs: 1, md: 3 } }}>
      <Typography variant="h3" component="h1" sx={{ mb: { xs: 3, md: 5 } }}>
        Mi cuenta
      </Typography>

      {status !== 'authenticated' ? (
        <SignInPrompt />
      ) : (
        <Card sx={{ p: 3, maxWidth: 560 }}>
          <Stack spacing={2.5}>
            <Alert severity="info" sx={{ typography: 'caption' }}>
              Con estos datos preparamos tus pedidos, para no pedírtelos cada vez por WhatsApp.
            </Alert>

            <TextField label="Nombre" value={form.name} onChange={set('name')} />
            <TextField
              label="Teléfono (WhatsApp)"
              value={form.phone}
              onChange={set('phone')}
              placeholder="55 1234 5678"
              helperText="Con este te contactamos para coordinar la entrega."
            />

            {/* Sin envíos activos la dirección no sirve para nada: se oculta */}
            {shippingEnabled && (
              <>
            <Divider sx={{ borderStyle: 'dashed' }}>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                Dirección de envío
              </Typography>
            </Divider>

            <Typography variant="caption" sx={{ mt: -1, color: 'text.secondary' }}>
              Sólo si quieres que te enviemos a domicilio. Para entregas en persona en CDMX
              no hace falta.
            </Typography>

            <Box sx={{ gap: 2, display: 'grid', gridTemplateColumns: '2fr 1fr 1fr' }}>
              <TextField label="Calle" value={form.street} onChange={set('street')} />
              <TextField label="Núm. ext." value={form.ext_number} onChange={set('ext_number')} />
              <TextField label="Núm. int." value={form.int_number} onChange={set('int_number')} />
            </Box>

            <TextField
              label="Colonia"
              value={form.neighborhood}
              onChange={set('neighborhood')}
            />

            <Box sx={{ gap: 2, display: 'grid', gridTemplateColumns: '1fr 2fr' }}>
              <TextField
                label="Código postal"
                value={form.zip_code}
                onChange={set('zip_code')}
                error={!zipOk}
                slotProps={{ htmlInput: { inputMode: 'numeric', maxLength: 5 } }}
                helperText={zipOk ? 'Completa el estado solo' : '5 dígitos'}
              />
              <TextField
                label="Municipio o alcaldía"
                value={form.city}
                onChange={set('city')}
              />
            </Box>

            <TextField select label="Estado" value={form.state} onChange={set('state')}>
              {states.map((name) => (
                <MenuItem key={name} value={name}>
                  {name}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              label="Referencias"
              value={form.address_notes}
              onChange={set('address_notes')}
              multiline
              rows={2}
              placeholder="Portón negro, entre Av. Juárez y Morelos"
              helperText="Lo que le ayude a la paquetería a encontrarte."
            />
              </>
            )}

            {error && (
              <Alert severity="error" sx={{ typography: 'caption' }}>
                {error}
              </Alert>
            )}

            <Box sx={{ gap: 1.5, display: 'flex', alignItems: 'center' }}>
              <Button variant="contained" loading={saving} onClick={handleSave}>
                Guardar
              </Button>
              {saved && (
                <Typography variant="caption" sx={{ color: 'success.main' }}>
                  Guardado ✓
                </Typography>
              )}
              <Button component={RouterLink} href={paths.orders} color="inherit" sx={{ ml: 'auto' }}>
                Mis pedidos
              </Button>
            </Box>
          </Stack>
        </Card>
      )}
    </Container>
  );
}
