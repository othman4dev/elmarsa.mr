const flowbite = require("flowbite-react/tailwind");
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}',
    flowbite.content(),
    "node_modules/flowbite/**/*.js", // Add this line

  ],
  theme: {
    extend: {},
  },
  plugins: [require("tailwindcss-rtl"), flowbite.plugin(),
  require('flowbite/plugin'),

  ], // Add this line


}

