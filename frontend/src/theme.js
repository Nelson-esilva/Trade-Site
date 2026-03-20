import { createTheme } from '@mui/material/styles';

const createAppTheme = (mode = 'dark') => {
  const isDark = mode === 'dark';

  return createTheme({
  palette: {
    mode,
    primary: {
      main: '#2563eb',
      light: '#60a5fa',
      dark: '#1d4ed8',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#0f172a',
      light: '#334155',
      dark: '#020617',
      contrastText: '#ffffff',
    },
    error: {
      main: '#ef4444',
    },
    warning: {
      main: '#f59e0b',
    },
    info: {
      main: '#06b6d4',
    },
    success: {
      main: '#10b981',
    },
    background: {
      default: isDark ? '#0b1220' : '#f8fafc',
      paper: isDark ? '#111827' : '#ffffff',
    },
    text: {
      primary: isDark ? '#e5e7eb' : '#0f172a',
      secondary: isDark ? '#94a3b8' : '#64748b',
    },
    divider: isDark ? 'rgba(148, 163, 184, 0.2)' : 'rgba(15, 23, 42, 0.08)',
  },
  shape: {
    borderRadius: 12,
  },
  spacing: 8,
  typography: {
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 800,
      lineHeight: 1.15,
      letterSpacing: '-0.02em',
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 700,
      lineHeight: 1.2,
      letterSpacing: '-0.01em',
    },
    h3: {
      fontSize: '1.5rem',
      fontWeight: 700,
      lineHeight: 1.3,
      letterSpacing: '-0.01em',
    },
    h4: {
      fontSize: '1.25rem',
      fontWeight: 600,
      lineHeight: 1.35,
    },
    h5: {
      fontSize: '1.1rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h6: {
      fontSize: '0.95rem',
      fontWeight: 600,
      lineHeight: 1.5,
    },
    subtitle1: {
      fontSize: '0.95rem',
      fontWeight: 500,
      lineHeight: 1.5,
      color: '#64748b',
    },
    body1: {
      fontSize: '0.938rem',
      lineHeight: 1.6,
    },
    body2: {
      fontSize: '0.85rem',
      lineHeight: 1.55,
    },
    caption: {
      fontSize: '0.75rem',
      lineHeight: 1.5,
      letterSpacing: '0.01em',
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
      fontSize: '0.875rem',
    },
    overline: {
      fontSize: '0.7rem',
      fontWeight: 700,
      letterSpacing: '0.08em',
      textTransform: 'uppercase',
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: isDark ? '#0b1220' : '#f8fafc',
        },
      },
    },
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          borderRadius: 10,
          padding: '8px 20px',
          fontWeight: 600,
        },
        containedPrimary: {
          '&:hover': {
            backgroundColor: '#1d4ed8',
          },
        },
        outlinedPrimary: {
          borderWidth: '1.5px',
          borderColor: isDark ? 'rgba(148, 163, 184, 0.35)' : 'rgba(37, 99, 235, 0.35)',
          '&:hover': {
            borderWidth: '1.5px',
            backgroundColor: isDark ? 'rgba(37, 99, 235, 0.14)' : 'rgba(37, 99, 235, 0.04)',
          },
        },
        sizeSmall: {
          padding: '5px 14px',
          fontSize: '0.8rem',
        },
        sizeLarge: {
          padding: '12px 28px',
          fontSize: '0.95rem',
        },
      },
    },
    MuiCard: {
      defaultProps: {
        elevation: 0,
      },
      styleOverrides: {
        root: {
          borderRadius: 16,
          border: isDark ? '1px solid rgba(148, 163, 184, 0.2)' : '1px solid rgba(15, 23, 42, 0.08)',
          backgroundColor: isDark ? '#111827' : '#ffffff',
          transition: 'box-shadow 0.2s ease, transform 0.2s ease',
          '&:hover': {
            boxShadow: isDark ? '0 10px 30px rgba(2, 6, 23, 0.45)' : '0 8px 30px rgba(15, 23, 42, 0.08)',
          },
        },
      },
    },
    MuiPaper: {
      defaultProps: {
        elevation: 0,
      },
      styleOverrides: {
        root: {
          borderRadius: 16,
          backgroundImage: 'none',
          backgroundColor: isDark ? '#111827' : '#ffffff',
        },
        outlined: {
          borderColor: isDark ? 'rgba(148, 163, 184, 0.2)' : 'rgba(15, 23, 42, 0.08)',
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          backgroundColor: isDark ? '#0f172a' : '#ffffff',
          '& fieldset': {
            borderColor: isDark ? 'rgba(148, 163, 184, 0.3)' : 'rgba(15, 23, 42, 0.12)',
          },
          '&:hover fieldset': {
            borderColor: isDark ? 'rgba(96, 165, 250, 0.6)' : 'rgba(37, 99, 235, 0.4)',
          },
          '&.Mui-focused fieldset': {
            borderColor: '#60a5fa',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 500,
          fontSize: '0.75rem',
        },
        sizeSmall: {
          height: 24,
          fontSize: '0.7rem',
        },
      },
    },
    MuiAppBar: {
      defaultProps: {
        elevation: 0,
      },
      styleOverrides: {
        root: {
          boxShadow: 'none',
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
          fontSize: '0.875rem',
          minHeight: 48,
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 20,
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          fontSize: '0.875rem',
          fontWeight: 600,
        },
      },
    },
  },
});
};

export default createAppTheme;
