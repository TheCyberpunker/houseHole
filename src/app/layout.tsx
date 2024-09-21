"use client"; // This is necessary for Chakra UI's client-side rendering

import { ChakraProvider, Box, Text, Flex } from "@chakra-ui/react";
import { ReactNode, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import theme from "../theme"; // Assuming you have a custom Chakra theme
import ColorModeSwitcher from "./components/ColorModeSwitcher"; // Import the toggle button
import StatusBar from "./components/StatusBar"; // Re-add StatusBar

export default function RootLayout({ children }: { children: ReactNode }) {
  // Create a QueryClient instance for React Query
  const [queryClient] = useState(() => new QueryClient());

  return (
    <html lang="en">
      <head>
        <title>houseHole</title>
        <meta
          name="description"
          content="A mailbox application powered by IMAP"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        <QueryClientProvider client={queryClient}>
          <ChakraProvider theme={theme}>
            <Box as="main" variant="layoutContainer">
              {/* Header with Title and Color Mode Switcher */}
              <Flex
                justifyContent="center" // Centers the title and switcher
                alignItems="center"
                mb={6}
                position="relative" // Keep the ColorModeSwitcher independent of title centering
              >
                {/* Title */}
                <Text
                  className="modern-title"
                  data-text="houseHole"
                  textAlign="center"
                  flex="1" // Ensures the title remains centered
                >
                  houseHole
                </Text>

                {/* Color Mode Toggle Button */}
                <Box position="absolute" right="250px">
                  {" "}
                  {/* Position the button to the right */}
                  <ColorModeSwitcher />
                </Box>
              </Flex>

              {/* Children content */}
              <Box flex="1">{children}</Box>

              {/* Status bar */}
              <StatusBar />
            </Box>
          </ChakraProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
