'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { signIn, useSession } from 'next-auth/react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { Iconify } from 'src/components/iconify';

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

export function AccountView() {
  const { status } = useSession();
  const [form, setForm] = useState({ name: '', phone: '', address: '' });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (status !== 'authenticated') return;
    fetch('/api/shop/me')
      .then((res) => (res.ok ? res.json() : null))
      .then((account) => {
        if (account) {
          setForm({
            name: account.name ?? '',
            phone: account.phone ?? '',
            address: account.address ?? '',
          });
        }
      })
      .catch(() => {});
  }, [status]);

  const set = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
    setSaved(false);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await fetch('/api/shop/me', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      setSaved(true);
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
        <Card sx={{ p: 3, maxWidth: 520 }}>
          <Stack spacing={2.5}>
            <Alert severity="info" sx={{ typography: 'caption' }}>
              Con estos datos preparamos tus pedidos, para no pedírtelos cada vez por WhatsApp.
            </Alert>

            <TextField label="Nombre" value={form.name} onChange={set('name')} />
            <TextField
              label="Teléfono"
              value={form.phone}
              onChange={set('phone')}
              placeholder="55 1234 5678"
            />
            <TextField
              label="Dirección de envío"
              value={form.address}
              onChange={set('address')}
              multiline
              rows={3}
            />

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
