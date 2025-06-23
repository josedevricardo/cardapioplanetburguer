/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

// tailwind.config.js
module.exports = {
  darkMode: "class", // ou "media"
  // ...
};


module.exports = {
  darkMode: 'class', // habilita modo escuro manual
  theme: {
    extend: {
      colors: {
        planet: {
          primary: '#e63946',
          secondary: '#f1c40f',
          dark: '#1a1a1a',
        },
      },
    },
  },
  plugins: [],
}

theme: {
  extend: {
    colors: {
      planetRed: '#e11d48',
      planetYellow: '#facc15',
    },
  },
}

