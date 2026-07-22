import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { MainLayout } from 'src/layouts/main';
import { getSiteSettings } from 'src/lib/public-api';

// ----------------------------------------------------------------------

export const metadata = {
  title: 'Términos y condiciones',
  description: 'Condiciones de compra, entrega y devoluciones de Opuntia Den.',
};

const SECTIONS = [
  {
    title: 'Sobre los pedidos',
    body: `Un pedido en el sitio es una solicitud de compra sujeta a disponibilidad. Trabajamos con animales vivos: si un ejemplar deja de estar disponible entre tu pedido y la confirmación, te avisamos y te devolvemos íntegro cualquier pago realizado. Los precios están en pesos mexicanos (MXN).`,
  },
  {
    title: 'Entrega personal en CDMX',
    body: `Los pedidos con entrega personal se pagan en línea a través de Mercado Pago; el precio del catálogo es el total, sin cargos adicionales. Después del pago acordamos contigo por WhatsApp el punto y la hora de entrega, en lugares públicos dentro de la Ciudad de México.`,
  },
  {
    shippingOnly: true,
    title: 'Envíos',
    body: `Para envíos a otras partes del país, primero cotizamos el costo según destino y especie, y te enviamos un link de pago por WhatsApp con el total final. Enviamos únicamente especies que toleran bien el transporte, con empaque adecuado a la temporada.`,
  },
  {
    shippingOnly: true,
    title: 'Garantía de llegada viva',
    body: `Garantizamos que tu animal llega vivo. Si un ejemplar llega sin vida, avísanos el mismo día de la entrega con fotos o video del paquete sin abrir por completo, y lo reponemos o te reembolsamos.`,
  },
  {
    title: 'Animales vivos',
    body: `Entregamos ejemplares sanos y activos; puedes revisarlo con nosotros en el momento de la entrega. Por la naturaleza de los animales vivos, no hay devoluciones una vez entregado y aceptado el ejemplar: su bienestar depende de condiciones de manejo que ya no podemos supervisar.`,
  },
  {
    title: 'Cancelaciones y reembolsos',
    body: `Puedes cancelar cualquier pedido pendiente desde «Mis pedidos». Si ya pagaste en línea y el pedido aún no se entrega, escríbenos por WhatsApp y te reembolsamos por el mismo medio de pago a través de Mercado Pago; los tiempos de acreditación dependen de tu banco.`,
  },
  {
    title: 'Legalidad y bienestar animal',
    body: `Vendemos únicamente ejemplares de cría en cautiverio y, cuando la especie lo requiere, con la documentación legal correspondiente. Nos reservamos el derecho de rechazar una venta si consideramos que las condiciones de destino no son adecuadas para la especie.`,
  },
  {
    title: 'Contacto',
    body: `Cualquier duda sobre estos términos: opuntiaden@gmail.com o por WhatsApp desde el propio sitio. Última actualización: julio de 2026.`,
  },
];

export default async function Page() {
  const site = await getSiteSettings();
  const shipping = site.shipping_enabled !== false;
  // Sin envíos activos, prometer condiciones de envío sería engañoso
  const sections = SECTIONS.filter((s) => shipping || !s.shippingOnly);
  return (
    <MainLayout>
      <Container sx={{ mb: 10, mt: { xs: 1, md: 3 }, maxWidth: 720 }}>
        <Typography variant="h3" component="h1" sx={{ mb: { xs: 3, md: 5 } }}>
          Términos y condiciones
        </Typography>

        {sections.map((section) => (
          <div key={section.title}>
            <Typography variant="h6" sx={{ mt: 4, mb: 1 }}>
              {section.title}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {section.body}
            </Typography>
          </div>
        ))}
      </Container>
    </MainLayout>
  );
}
