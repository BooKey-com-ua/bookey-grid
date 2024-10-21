import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { Provider as MobxProvider } from 'mobx-react';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';

//import from components
import WpPlugin from './WpPlugin';

//import from store
import * as mobxStores from './Store';

const theme = extendTheme({
  breakpoints: {
    base: '0em',
    sm: '43em',
    md: '90em',
    lg: '90em',
    xl: '120em',
    '2xl': '120em',
  },
  components: {
    Alert: {
      baseStyle: {
        container: {
          paddingRight: '16px',
        },
      },
    },
    Input: {
      variants: {
        outline: {
          field: {
            bg: 'bgSecondary',
          },
        },
      },
      defaultProps: {
        focusBorderColor: 'teal.500',
      },
    },
    Menu: {
      baseStyle: {
        button: {
          bg: 'bgSecondary',
        },
        list: {
          bg: 'bgSecondary',
        },
        item: {
          bg: 'bgSecondary',
        },
      },
    },
    NumberInput: {
      defaultProps: {
        focusBorderColor: 'teal.500',
      },
    },
    Select: {
      baseStyle: {
        field: {
          option: {
            bg: 'bgSecondary',
          },
        },
      },
    },
    Textarea: {
      defaultProps: {
        focusBorderColor: 'teal.500',
      },
    },
    Tabs: {
      variants: {
        enclosed: {
          tab: {
            _selected: {
              bg: 'bgSecondary',
              color: 'textSection',
              borderColor: 'stroke',
              borderBottomColor: 'bgSecondary',
            },
          },
          tabpanel: {
            border: '1px',
            borderColor: 'stroke',
            borderRadius: '8px',
          },
        },
      },
    },
    Badge: {
      baseStyle: {
        fontWeight: 'bold',
        textTransform: 'none',
      },
    },
  },
  semanticTokens: {
    colors: {
      'approved': { _light: 'green.200', _dark: 'green.200' },
      'requested': { _light: 'blue.200', _dark: 'blue.200' },
      'bgFooter': { _light: '#2C7A7B', _dark: '#285E61' },
      'bgPrimary': { _light: '#EFF0F1', _dark: '#121212' },
      'bgSecondary': { _light: '#FCFCFC', _dark: '#1E1E1E' },
      'bgTertiary': { _light: '#E4E6E9', _dark: '#2C2C2C' },
      'chakra-body-bg': { _light: '#EFF0F1', _dark: '#121212' },
      'chakra-body-text': { _light: '#2D3748', _dark: '#D0D0D0' },
      'funcBlue': { _light: '#3182CE', _dark: '#90CDF4' },
      'funcGray': { _light: '#A0AEC0', _dark: '#717171' },
      'funcGreen': { _light: '#38A169', _dark: '#9AE6B4' },
      'funcRed': { _light: '#E53E3E', _dark: '#FEB2B2' },
      'funcYellow': { _light: 'yellow.500', _dark: 'yellow.400' },
      'stroke': { _light: '#D0D5DD', _dark: '#4B4B4B' },
      'textIcon': { _light: '#4A5568', _dark: '#BCBCBC' },
      'textInverse': { _light: 'white', _dark: 'gray.800' },
      'textPlaceholder': { _light: '#A0AEC0', _dark: '#717171' },
      'textPrimary': { _light: '#171923', _dark: '#F2F2F2' },
      'textSecondary': { _light: '#2D3748', _dark: '#D0D0D0' },
      'textSection': { _light: '#319795', _dark: '#4FD1C5' },
    },
    fonts: {
      heading: "'Inter', sans-serif",
      body: "'Inter', sans-serif",
    },
  },
});

const root = ReactDOM.createRoot(document.getElementById('bookey-root'));

root.render(
  <StrictMode>
    <MobxProvider {...mobxStores}>
      <ChakraProvider theme={theme}>
        <WpPlugin />
      </ChakraProvider>
    </MobxProvider>
  </StrictMode>

);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
