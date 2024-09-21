import { extendTheme } from "@chakra-ui/react";

// Import fonts or external styles globally in your CSS, not inside JavaScript/TypeScript
// You can use the <Head> component in Next.js _app.tsx to include external fonts

// Define global styles for the body and other elements
const globalStyles = (props: any) => ({
  body: {
    bg: props.colorMode === "dark" ? "gray.900" : "gray.50",
    color: props.colorMode === "dark" ? "gray.200" : "gray.800",
    transition: "background-color 0.2s ease",
    lineHeight: "tall",
    fontFamily: "'Inter', sans-serif",
  },
  a: {
    color: props.colorMode === "dark" ? "teal.400" : "teal.600",
    _hover: {
      textDecoration: "underline",
    },
    wordBreak: "break-word",
    overflowWrap: "break-word",
  },
  p: {
    marginBottom: "1rem",
    lineHeight: "1.75",
    wordBreak: "break-word",
    overflowWrap: "break-word",
  },
  img: {
    display: "block",
    maxWidth: "100%",
    height: "auto",
    marginBottom: "1rem",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "1rem",
    th: {
      padding: "8px",
      borderBottom: "1px solid",
      borderColor: props.colorMode === "dark" ? "gray.700" : "gray.300",
    },
    td: {
      padding: "8px",
      borderBottom: "1px solid",
      borderColor: props.colorMode === "dark" ? "gray.700" : "gray.300",
      wordBreak: "break-word",
      overflowWrap: "break-word",
    },
  },
  blockquote: {
    marginLeft: "0",
    paddingLeft: "1rem",
    borderLeft: "4px solid",
    borderColor: props.colorMode === "dark" ? "teal.600" : "teal.400",
    color: props.colorMode === "dark" ? "gray.300" : "gray.700",
    fontStyle: "italic",
    wordBreak: "break-word",
    overflowWrap: "break-word",
  },
  div: {
    wordWrap: "break-word",
    overflowWrap: "break-word",
    whiteSpace: "pre-wrap",
    maxWidth: "100%",
  },
  "@keyframes gradientBG": {
    "0%": { backgroundPosition: "0% 50%" },
    "50%": { backgroundPosition: "100% 50%" },
    "100%": { backgroundPosition: "0% 50%" },
  },
  "@keyframes pulse": {
    "0%": { transform: "scale(1)" },
    "50%": { transform: "scale(1.05)" },
    "100%": { transform: "scale(1)" },
  },
  ".modern-title": {
    fontFamily: "'Poppins', sans-serif",
    fontSize: "6rem",
    fontWeight: "bold",
    textAlign: "center",
    background: "linear-gradient(300deg, #ff6b6b, #4ecdc4, #45b7d1, #6a5acd)",
    backgroundSize: "300% 300%",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    animation: "gradientBG 10s ease infinite, slidein 3s ease-in-out infinite",
    letterSpacing: "1px",
    position: "relative",
    "&::before": {
      content: "attr(data-text)",
      position: "absolute",
      left: "650",
      top: "2",
      zIndex: "-1",
      background: "linear-gradient(120deg, #c0c0c0, #f0f0f0, #c0c0c0)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      opacity: "0.2",
      filter: "blur(3px)",
    },
  },
});

// Extend Chakra theme
const theme = extendTheme({
  styles: {
    global: globalStyles,
  },
  components: {
    Box: {
      variants: {
        pageContainer: {
          p: 8,
          maxW: "1200px",
          mx: "auto",
        },
        emailGrid: {
          display: "grid",
          gridTemplateColumns: { base: "1fr", md: "2fr 1fr" },
          gap: 6,
          mt: 8,
        },
      },
    },
    Heading: {
      variants: {
        emailHeading: {
          color: "teal.500",
          fontSize: "1.25rem",
          fontWeight: "semibold",
        },
      },
    },
    Button: {
      baseStyle: {
        borderRadius: "lg",
        fontWeight: "bold",
        _hover: {
          transform: "translateY(-2px)",
          boxShadow: "lg",
        },
        _active: {
          transform: "translateY(0)",
          boxShadow: "sm",
        },
      },
      variants: {
        solid: (props: any) => ({
          bg: props.colorMode === "dark" ? "teal.400" : "teal.600",
          color: "white",
          _hover: {
            bg: props.colorMode === "dark" ? "teal.300" : "teal.500",
          },
        }),
        outline: (props: any) => ({
          borderColor: props.colorMode === "dark" ? "teal.400" : "teal.600",
          _hover: {
            bg: props.colorMode === "dark" ? "teal.400" : "teal.600",
            color: "white",
          },
        }),
      },
    },
    Input: {
      baseStyle: {
        field: {
          _focus: {
            borderColor: "teal.500",
            boxShadow: "0 0 0 1px teal.500",
          },
        },
      },
    },
    Spinner: {
      baseStyle: {
        color: "teal.500",
        speed: "0.8s",
        thickness: "3px",
      },
    },
  },
  colors: {
    brand: {
      50: "#e6fffa",
      100: "#b2f5ea",
      200: "#81e6d9",
      300: "#4fd1c5",
      400: "#38b2ac",
      500: "#319795",
      600: "#2c7a7b",
      700: "#285e61",
      800: "#234e52",
      900: "#1d4044",
    },
  },
  config: {
    initialColorMode: "dark",
    useSystemColorMode: true,
  },
});

export default theme;
