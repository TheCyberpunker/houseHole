import { useEffect, useState } from "react";
import {
  Box,
  Flex,
  Text,
  Spinner,
  useToast,
  SlideFade,
} from "@chakra-ui/react";

interface StatusBarProps {
  pollInterval?: number; // Interval in milliseconds to poll IMAP status
}

export default function StatusBar({ pollInterval = 60000 }: StatusBarProps) {
  const [imapStatus, setImapStatus] = useState<
    "connected" | "disconnected" | "unknown"
  >("unknown");
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  // Function to check IMAP server status
  const checkImapStatus = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/imap-status");
      const data = await res.json();

      if (res.ok && data.status === "connected") {
        setImapStatus("connected");
      } else {
        setImapStatus("disconnected");
      }
    } catch (error) {
      setImapStatus("disconnected");
      toast({
        title: "Error fetching IMAP status",
        description: "Could not connect to the IMAP server.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  // Poll IMAP status every `pollInterval` milliseconds
  useEffect(() => {
    checkImapStatus();
    const intervalId = setInterval(checkImapStatus, pollInterval);
    return () => clearInterval(intervalId);
  }, [pollInterval]);

  return (
    <SlideFade in={true} offsetY="20px">
      <Box
        position="fixed"
        bottom="20px"
        right="20px"
        bg="rgba(0, 0, 0, 0.5)" // Semi-transparent black background
        backdropFilter="blur(10px)" // Glassmorphism effect
        borderRadius="lg"
        padding="12px 20px"
        boxShadow="lg"
        display="flex"
        alignItems="center"
        zIndex="1000"
        maxWidth="320px"
        color="white"
      >
        {/* Show spinner while loading IMAP status */}
        {loading ? (
          <Spinner size="sm" color="white" />
        ) : (
          <Flex align="center" justify="space-between" gap={3} width="100%">
            {/* Display IMAP status text */}
            <Text fontSize="md" fontWeight="medium">
              IMAP Status:
            </Text>

            {/* Display appropriate status color */}
            {imapStatus === "connected" && (
              <Text fontSize="md" fontWeight="bold" color="green.400">
                OK
              </Text>
            )}
            {imapStatus === "disconnected" && (
              <Text fontSize="md" fontWeight="bold" color="red.400">
                Disconnected
              </Text>
            )}
            {imapStatus === "unknown" && (
              <Text fontSize="md" fontWeight="bold" color="yellow.400">
                Unknown
              </Text>
            )}
          </Flex>
        )}
      </Box>
    </SlideFade>
  );
}
