import { extendTheme } from '@chakra-ui/react'

const theme = extendTheme({
  fonts: {
    heading: 'Inter, sans-serif',
    body: 'Inter, sans-serif',
  },
  styles: {
    global: {
      body: {
        bg: '#F8F8F9',
        fontFamily: 'Inter, sans-serif',
      },
    },
  },
  colors: {
    brand: {
      purple: '#6D56FA',
      text: {
        primary: '#15112B',
        secondary: '#15112B80',
      },
    },
  },
})

export default theme