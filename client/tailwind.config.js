const withMT = require("@material-tailwind/react/utils/withMT");
 
module.exports = withMT({
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "path-to-your-node_modules/@material-tailwind/react/components/**/*.{js,ts,jsx,tsx}",
    "path-to-your-node_modules/@material-tailwind/react/theme/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors:{
        sky: {
          50: "#f0f9ff",
          100: "#e0f2fe",
          200: "#bae6fd",
          300: "#7dd3fc",
          400: "#38bdf8",
          500: "#0ea5e9",
          600: "#0284c7",
          700: "#0369a1",
          800: "#075985",
          900: "#0c4a6e",
        },
        'white': {
          '50': '#ffffff',
          '100': '#efefef',
          '200': '#dcdcdc',
          '300': '#bdbdbd',
          '400': '#989898',
          '500': '#7c7c7c',
          '600': '#656565',
          '700': '#525252',
          '800': '#464646',
          '900': '#3d3d3d',
          '950': '#292929',
        },
      
        'gray': {
          '50': '#f7f7f7',
          '100': '#e3e3e3',
          '200': '#c8c8c8',
          '300': '#a4a4a4',
          '400': '#808080',
          '500': '#666666',
          '600': '#515151',
          '700': '#434343',
          '800': '#383838',
          '900': '#313131',
          '950': '#1a1a1a',
        },
        'seagull': {
          '50': '#f2f8fd',
          '100': '#e4effa',
          '200': '#c2dff5',
          '300': '#8dc6ec',
          '400': '#67b4e4',
          '500': '#298ece',
          '600': '#1b71ae',
          '700': '#175a8d',
          '800': '#174d75',
          '900': '#184162',
          '950': '#102941',
        },
        'persimmon': {
          '50': '#fff2f1',
          '100': '#ffe2df',
          '200': '#ffcbc5',
          '300': '#ffa69d',
          '400': '#ff7364',
          '500': '#ff5e4d',
          '600': '#ed2a15',
          '700': '#c81f0d',
          '800': '#a51d0f',
          '900': '#881f14',
          '950': '#4b0b04',
      },

      'emerald': {
        '50': '#edfff3',
        '100': '#d5ffe5',
        '200': '#afffcb',
        '300': '#70ffa4',
        '400': '#34d399',
        '500': '#00e753',
        '600': '#00c040',
        '700': '#009635',
        '800': '#06752f',
        '900': '#076029',
        '950': '#003614',
      },
      aquamarine: {
        50: '#eefff6',
        100: '#d8ffed',
        200: '#b3ffdb',
        300: '#78fdbf',
        400: '#52f4a9',
        500: '#0cdb7c',
        600: '#03b664',
        700: '#068f51',
        800: '#0b7042',
        900: '#0b5c39',
        950: '#00341e',
      },
  
    

      }
    },
    fontFamily: {
      sans: ["DM Sans", "sans-serif"],
    },
  },
  plugins: [],
});