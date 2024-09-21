"use client"; // Mark this as a client-side component

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation"; // Use next/navigation for app router
import { Box, Heading, Text, VStack, Spinner } from "@chakra-ui/react";

// Email interface to define the email structure
interface Email {
  subject: string;
  from: string;
  to: string;
  date: string;
  text: string;
}

export default function EmailViewPage() {
  const searchParams = useSearchParams(); // Get search parameters using next/navigation
  const email = searchParams.get("email"); // Fetch the email from the URL params

  const [emails, setEmails] = useState<Email[]>([]); // Holds fetched emails
  const [loading, setLoading] = useState(true); // Loading state for API fetch
  const [error, setError] = useState<string | null>(null); // Error state

  // Fetch emails for the given email address when the component mounts or email changes
  useEffect(() => {
    if (email) {
      fetchEmailsForAddress(email);
    }
  }, [email]);

  // Fetch emails for a specific email address
  const fetchEmailsForAddress = async (emailAddress: string) => {
    setLoading(true); // Set loading state while fetching
    setError(null); // Reset any previous errors

    try {
      const res = await fetch(
        `/api/emails/${encodeURIComponent(emailAddress)}`
      );
      if (!res.ok) throw new Error("Failed to fetch emails");

      const data = await res.json();
      setEmails(data.emails); // Update the state with fetched emails
    } catch (error) {
      setError("Error fetching emails. Please try again later.");
    } finally {
      setLoading(false); // Turn off loading state
    }
  };

  return (
    <Box p={8} maxW="800px" mx="auto">
      <Heading size="lg" color="teal.500">
        Emails for {email}
      </Heading>

      {loading ? (
        // Show a loading spinner while emails are being fetched
        <Box display="flex" justifyContent="center" mt={4}>
          <Spinner size="xl" />
        </Box>
      ) : error ? (
        // Show an error message if something went wrong
        <Text color="red.500" mt={4}>
          {error}
        </Text>
      ) : emails.length > 0 ? (
        // Display the fetched emails
        <VStack spacing={4} mt={4} align="stretch">
          {emails.map((emailItem, index) => (
            <Box key={index} p={4} borderWidth="1px" borderRadius="lg">
              <Text fontWeight="bold">{emailItem.subject}</Text>
              <Text fontSize="sm" color="gray.500">
                From: {emailItem.from}
              </Text>
              <Text fontSize="sm" color="gray.500">
                To: {emailItem.to}
              </Text>
              <Text fontSize="sm" color="gray.500">
                Date: {new Date(emailItem.date).toLocaleString()}
              </Text>
              <Text mt={2}>{emailItem.text}</Text>
            </Box>
          ))}
        </VStack>
      ) : (
        // Show a message if no emails are found
        <Text mt={4}>No emails found for this address.</Text>
      )}
    </Box>
  );
}
