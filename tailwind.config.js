/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './screens/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        target: ['HelveticaNeue-Regular'],
        'ios-regular': ['HelveticaNeueRegular'],
        'target-medium': ['HelveticaNeue-Medium'],
        'target-bold': ['HelveticaNeue-Bold'],
      },
      colors: {
        dark: 'rgb(51, 51, 51)',
        primary: 'rgb(204, 0, 0)',
        'primary-accent': 'rgb(121, 0, 0)',
      },
      flex: {
        2: '2 2 0%',
      },
    },
  },
  plugins: [],
};
