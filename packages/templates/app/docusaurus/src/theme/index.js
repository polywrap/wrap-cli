import { createTheme } from "@mui/material";

export const polywrapPalette = {
  primary: {
    gradient: 'linear-gradient(to right, #74DD9F 20%, #000000, 20%)',
    start: '#74DD9F',
    mid: '#4ED29F',
    end: '#27C69F',
    700: '#06644D',
    direction: '120deg',
  },
  secondary: {
    start: '#1B5FED',
    mid: '#1B6DED',
    end: '#1B87ED',
    300: '#66D9EF',
    800: '#293653',
    900: '#1E2B45',
    1000: '#1d2538',
    direction: 179,
  },
  terciary: {
    gradient: 'linear-gradient(to right, #FFC272, #FFE272)',
    400: '#FFE272',
    500: '#FFC272',
    direction: 0,
  },
  purple: {
    300: '#BB95FF',
    400: '#AE81FF',
  },
  wrapGradient: {
    gradient: 'linear-gradient(0deg, #000000 35%, #FFFFFF 35%)',
    start: '#878787',
    end: '#FFFFFF',
    direction: 0,
    opacity: 0.35,
  },
  black: '#000000',
  white: '#FFFFFF',
}

const baseTheme = createTheme({
  typography: {
    fontFamily: `'Raleway', sans-serif`,
    h1: {
      fontSize: 64,
      fontWeight: 900,
      lineHeight: 1,
    },
    h2: {
      fontSize: 48,
      fontWeight: 900,
      lineHeight: 1,
    },
    h3: {
      fontSize: 40,
      fontWeight: 900,
      lineHeight: 1,
      '@media (max-width:650px)': {
        fontSize: 32,
      },
    },
    h4: {
      fontSize: 32,
      fontWeight: 900,
      lineHeight: 1,
      '@media (max-width:650px)': {
        fontSize: 28,
      },
    },
    subtitle1: {
      fontSize: 24,
      fontWeight: 900,
      lineHeight: 1.5
    },
    body1: {
      fontFamily: `-apple-system,BlinkMacSystemFont,"Roboto",Helvetica,Arial,sans-serif,"Apple Color Emoji"`,
      fontSize: 16,
      lineHeight: 1.75
    },
  },
  overrides: {
    MuiCssBaseline: {
      '@global': {
        html: {
          backgroundColor: polywrapPalette.secondary[900],
        },
        body: {
          overflowX: 'hidden',
        },
      },
    },
    MuiAppBar: {
      root: {
        boxShadow: 'none'
      }
    },
    MuiInput: {
      root: {
        background: `${polywrapPalette.secondary[900]}88`,
        backdropFilter: "blur(8px)",
        border: `solid 1px ${polywrapPalette.primary[700]}`,
        borderRadius: 4,
        fontSize: "1rem",
        fontWeight: 500,
        transition: "background 0.25s ease-in-out",
        "&.Mui-focused": {
          background: polywrapPalette.secondary[900]
        },
      },
    },
    MuiTextField: {
      root: {
        '& .MuiInput-underline:before': {
          borderBottomColor: 'none',
        },
        '& .MuiInput-underline:hover:before': {
          borderBottomColor: 'none',
        },
        '& .MuiInput-underline:after': {
          borderBottomColor: 'none',
        },
        '& .MuiInput-underline:hover:not(.Mui-disabled):before': {
          borderBottom: '0'
        }
      },
    },
    MuiButton: {
      containedPrimary: {
        background: `radial-gradient(circle at 80% 50%, ${polywrapPalette.terciary[400]}, ${polywrapPalette.terciary[500]})`,
        backgroundSize: '250%',
        backgroundPositionX: '0px',
        borderRadius: 999,
        boxShadow: `0 8px 16px ${polywrapPalette.secondary[900]}`,
        color: polywrapPalette.secondary['900'],
        fontWeight: 700,
        transform: 'translateY(0)',
        transition: 'background 0.25s ease-in-out, transform 0.25s ease-in-out',
        '&:hover': {
          backgroundPositionX: '30%',
          transform: 'translateY(-1px)'
        },
        '& .MuiButton-endIcon': {
          marginLeft: 4,
        }
      },
    },
    MuiLink: {
      root: {
        '&:hover': {
          color: polywrapPalette.primary.start
        }
      }
    },
  }
})

export const darkTheme = createTheme({
  ...baseTheme,
  palette: {
    type: 'dark',
    primary: {
      main: polywrapPalette.primary.start,
      dark: polywrapPalette.primary.end,
    },
    secondary: {
      main: polywrapPalette.secondary.end,
      dark: polywrapPalette.secondary.start,
    },
    text: {
      primary: polywrapPalette.white,
      secondary: 'rgba(255,255,255,0.7)',
      disabled: 'rgba(255,255,255,0.3)',
    },
    background: {
      default: polywrapPalette.secondary['900'],
    }
  },
});

export const lightTheme = createTheme({
  ...baseTheme,
  palette: {
    type: 'light',
    primary: {
      main: polywrapPalette.primary.end,
      dark: polywrapPalette.primary.start,
    },
    text: {
      primary: polywrapPalette.secondary['900'],
      secondary: polywrapPalette.secondary['800'],
      disabled: polywrapPalette.secondary['300'],
    },
    background: {
      default: polywrapPalette.white,
    }
  },
});