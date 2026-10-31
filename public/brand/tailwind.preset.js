/** Opuntia Den — Tailwind preset.
 *  Uso: en tailwind.config.js →  presets: [require("./brand/tailwind.preset.js")]
 *  (Tailwind v4: copia los valores a @theme en el CSS global.)
 */
module.exports = {
  theme: {
    extend: {
      colors: {
        od: {
          crema: "#EFF0E2", papel: "#F7F7EE", tinta: "#173E36", noche: "#133129",
          tuna: "#247465", gris: "#4E6660", linea: "#C7D1C0", "arena-texto": "#ACC4B8",
          "punto-oscuro": "#6B6158", kraft: "#C4A47C", olivo: "#247465",
          hueso: "#F3F4E8", lino: "#E2E8D2", arena: "#D2DCC4",
        },
      },
      fontFamily: {
        display: ['"Playfair Display"', '"Iowan Old Style"', "Georgia", "serif"],
        sans: ["Inter", "system-ui", "-apple-system", '"Segoe UI"', "sans-serif"],
      },
      letterSpacing: { label: "0.22em" },
      borderRadius: { pill: "999px" },
      boxShadow: { flat: "3px 3px 0 rgba(51,36,20,0.10)" },
    },
  },
};
