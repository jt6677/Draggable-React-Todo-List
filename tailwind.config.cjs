/** @type {import('tailwindcss').Config} */
// const withMT = require('@material-tailwind/react/utils/withMT')
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        content: 'var(--content)',
        muted: 'var(--muted)',
        cellColor: 'var(--cellColor)',
        primaryColor: 'var(--primaryColor)',
        secondaryColor: 'var(--secondaryColor)',
        darkBlue: 'var(--darkBlue)',
        primaryText: 'var(--primaryText)',
        secondaryText: 'var(--secondaryText)',
        hoverText: 'var(--hoverText)',
        hoverBg: 'var(--hoverBg)',
        dangerColor: 'var(--dangerColor)',
        okColor: 'var(--okColor)',
        overlayBg: 'var(--overlayBg)',
        lightGray: 'hsl(220, 13%, 92%);',
        darkGray: '#7a7b99',
        midGray: '#9a9bae',
        modalColor: '#6b7280bf',
        surface1: 'var(--surface1)',
        surface2: 'var(--surface2)',
        surface3: 'var(--surface3)',
        surface4: 'var(--surface4)',
        surface5: 'var(--surface5)',

        overlayBg: 'var(--overlayBg)',

        tabDark: 'var(--tabDark)',
        tabDarkText: 'var(--tabDarkText)',
        tabRed: 'var(--tabRed)',
        tabRedText: 'var(--tabRedText)',
        tabGreen: 'var(--tabGreen)',
        tabGreenText: 'var(--tabGreenText)',

        // color2: 'hsl(185, 65%, 51%)',
        // color5: 'hsl(193, 100%, 82%)',

        color0: '#F1C3B8',
        color1: '#FDF06F',
        color2: 'hsl(199, 21%, 80%)',
        color3: 'hsl(193, 100%, 82%)',
        color5: 'hsl(245, 100%, 89%)',
        color7: '#64dcb6',
        color9: '#95b8f8',

        color4: 'hsl(214, 24%, 75%)',
        color6: '#f5b0e3',
        color8: 'hsl(1, 88%, 71%)',
        color11: 'hsl(214, 24%, 85%)',
        color12: '#f78584',
        color13: '#10d4a9',
        color14: 'hsl(215, 77%, 55%)',
        colorGreen: 'var(--tabGreen)',
        colorRed: 'var(--tabRed)',
        colorGray: '#dfe8ec',
      },
      boxShadow: {
        sideBarShadow: '  9px 0px 12px -13px rgba(0, 0, 0, 0.4)',
      },
      fontSize: {
        '2xs': ['0.7rem', { lineHeight: '0.75rem' }],
      },
    },
  },
  plugins: [
    // require('tailwind-scrollbar'),
    // require('daisyui'),
  ],
}
