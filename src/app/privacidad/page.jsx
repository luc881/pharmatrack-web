import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { OdLayout } from 'src/layouts/od/od-layout';

// ----------------------------------------------------------------------

export const metadata = {
  title: 'Aviso de privacidad',
  description: 'Cómo tratamos tus datos personales en Opuntia Den.',
};

// ponytail: contenido estático en la página; si algún día se quiere editar
// desde el dashboard, se convierte en un artículo o un app_setting
const SECTIONS = [
  {
    title: 'Responsable',
    body: `Opuntia Den, con sitio en www.opuntiaden.com, es responsable del tratamiento de los datos personales que nos proporcionas al usar esta tienda. Contacto: opuntiaden@gmail.com.`,
  },
  {
    title: 'Datos que recabamos',
    body: `Al iniciar sesión con Google: tu nombre, correo electrónico y foto de perfil. Al hacer un pedido: teléfono de contacto y, si eliges envío, dirección de entrega (que puedes guardar en «Mi cuenta»), además de la dirección IP desde la que se hace el pedido, que usamos solo para prevenir abusos. No recibimos ni almacenamos datos de tarjetas: los pagos en línea los procesa Mercado Pago en sus propios sistemas.`,
  },
  {
    title: 'Para qué los usamos',
    body: `Exclusivamente para operar la tienda: procesar y dar seguimiento a tus pedidos, contactarte para coordinar entregas o envíos, guardar tus favoritos y tu carrito entre dispositivos, y enviarte confirmaciones por correo. No enviamos publicidad ni boletines, y no vendemos ni compartimos tus datos con terceros, salvo los estrictamente necesarios para operar: Mercado Pago para los pagos, la paquetería que lleva tu paquete (a través de Envia.com recibe tu nombre, teléfono y dirección de entrega para generar la guía) y nuestros proveedores de infraestructura.`,
  },
  {
    title: 'Tus derechos (ARCO)',
    body: `Puedes solicitar en cualquier momento el acceso, rectificación, cancelación u oposición al tratamiento de tus datos escribiendo a opuntiaden@gmail.com desde el correo con el que te registraste. También puedes corregir tu teléfono y dirección directamente en «Mi cuenta», y eliminar tu cuenta tú mismo ahí, con el botón «Eliminar mi cuenta»: se borran al momento tu nombre, teléfono, dirección, favoritos y carrito, y se cancelan tus pedidos pendientes. Conservamos únicamente el registro de los pedidos ya realizados (folio, artículos y total), sin datos que te identifiquen, por las obligaciones fiscales. Si tienes un pedido pagado en curso, podrás eliminarla cuando lo entreguemos, o antes escribiéndonos.`,
  },
  {
    title: 'Conservación y seguridad',
    body: `Tus datos se almacenan en servidores con acceso restringido y cifrado en tránsito. La sesión usa cookies estrictamente necesarias para mantenerte dentro de tu cuenta; no usamos cookies de publicidad ni rastreo de terceros. La página «Rastrea tu envío» consulta el estado de un paquete solo con el número de guía y no muestra datos del destinatario.`,
  },
  {
    title: 'Cambios a este aviso',
    body: `Si este aviso cambia, publicaremos la versión actualizada en esta misma página. Última actualización: noviembre de 2026.`,
  },
];

export default function Page() {
  return (
    <OdLayout sideArt={1200}>
      <Container sx={{ mb: 10, mt: { xs: 1, md: 3 }, maxWidth: 720 }}>
        <Typography variant="h3" component="h1" sx={{ mb: { xs: 3, md: 5 } }}>
          Aviso de privacidad
        </Typography>

        {SECTIONS.map((section) => (
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
    </OdLayout>
  );
}
