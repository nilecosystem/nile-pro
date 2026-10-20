// src/backend/main/config/theme.js
const colors = require('./colors');

module.exports = {
  palette: {
    primary: colors.primary,
    secondary: colors.secondary,
    background: colors.background,
    text: colors.text,
  },
  typography: {
    fontFamily: 'Inter, Arial, sans-serif',
    headingWeight: 700,
    bodyWeight: 400,
  },
  components: {
    button: {
      borderRadius: '8px',
      padding: '10px 20px',
    },
    card: {
      borderRadius: '12px',
      shadow: '0 4px 12px rgba(0,0,0,0.2)',
    },
  }
};
