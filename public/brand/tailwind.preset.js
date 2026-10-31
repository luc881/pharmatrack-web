/** Opuntia Den — Tailwind preset.
 *  Uso: en tailwind.config.js →  presets: [require("./brand/tailwind.preset.js")]
 *  (Tailwind v4: copia los valores a @theme en el CSS global.)
 */
module.exports = {
  theme: {
    extend: {
      colors: {
        od: {
          crema: "#EEECE6", papel: "#F6F5F1", tinta: "#1C2320", noche: "#161B19",
          tuna: "#247465", gris: "#5B5F5A", linea: "#D6D2C8", "arena-texto": "#B4B6B0",
          "punto-oscuro": "#6B6158", kraft: "#C4A47C", olivo: "#247465",
          hueso: "#F2F1EC", lino: "#E4E1D9", arena: "#D7D3C9",
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
