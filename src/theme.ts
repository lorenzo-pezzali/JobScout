import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    mode: 'dark',
    background: { default: '#0b0d12', paper: '#12151c' },
    primary: { main: '#8fa4ff' },
    success: { main: '#9fd4ad' },
    error: { main: '#ff8a95' },
    divider: '#242a36',
    text: { primary: '#e8eaf0', secondary: '#9ba2b2' },
  },
  shape: { borderRadius: 14 },
  typography: {
    fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif',
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { textTransform: 'none', fontWeight: 700, borderRadius: 10 },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: { border: '1px solid #242a36', backgroundImage: 'none' },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { fontWeight: 600 },
      },
    },
  },
});
