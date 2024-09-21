"use client";

import { useEffect, useState } from "react";
import {
  Box,
  Heading,
  Input,
  Button,
  VStack,
  Select,
  HStack,
  Spinner,
  useToast,
  Text,
  IconButton,
} from "@chakra-ui/react";
import { RepeatIcon } from "@chakra-ui/icons";
import { EmailList } from "../../helpers/emailList";
import CreateEmail from "../../helpers/createEmail";

// Define the structure for Email
interface Email {
  subject: string;
  from: string;
  to: string;
  date: string;
  text: string;
  uid: string;
}

interface DomainResponse {
  domains: string[];
}

interface EmailResponse {
  emails: Email[];
  total: number;
}

export default function HomePage() {
  // State to manage emails and loading status
  const [emails, setEmails] = useState<Email[]>([]); // Filtered emails
  const [allEmails, setAllEmails] = useState<Email[]>([]); // Unfiltered list of emails
  const [loadingEmails, setLoadingEmails] = useState(true); // Email loading state
  const [loadingDomains, setLoadingDomains] = useState(true); // Domain loading state
  const [searchQuery, setSearchQuery] = useState(""); // Search filter
  const [availableDomains, setAvailableDomains] = useState<string[]>([]); // List of available domains
  const [availableRecipients, setAvailableRecipients] = useState<string[]>([]); // List of recipients
  const [selectedRecipient, setSelectedRecipient] =
    useState<string>("example@gmail.com"); // Default recipient put your default email example@gmail.com
  const [page, setPage] = useState(0); // Current page
  const [totalEmails, setTotalEmails] = useState(0); // Total number of emails
  const toast = useToast();

  const limit = 50; // Number of emails to fetch per page
  const totalPages = Math.ceil(totalEmails / limit); // Calculate total pages

  // Helper to show toast notifications
  const showToast = (
    title: string,
    status: "success" | "error" | "warning",
    description?: string
  ) => {
    toast({
      title,
      description: description || "",
      status,
      duration: 3000,
      isClosable: true,
    });
  };

  // Helper to extract the email address from "Name <email>" format
  const extractEmail = (input: string) => {
    const emailMatch = input.match(/<(.+?)>/); // Extract email inside < >
    return emailMatch ? emailMatch[1] : input; // Return the email or the input if no match
  };

  // Fetch emails from API, with pagination and recipient filtering
  const fetchEmails = async (page: number, recipient?: string) => {
    setLoadingEmails(true);
    try {
      const res = await fetch(
        `/api/emails?page=${page}&limit=${limit}${
          recipient ? `&recipient=${recipient}` : ""
        }`
      );
      if (!res.ok) throw new Error(`Error: ${res.status} ${res.statusText}`);
      const data: EmailResponse = await res.json();

      setAllEmails(data.emails); // Store original emails
      setEmails(data.emails); // Display filtered emails
      setTotalEmails(data.total); // Update the total email count
    } catch (error) {
      showToast("Error fetching emails", "error", error.message);
    } finally {
      setLoadingEmails(false);
    }
  };

  // Fetch the list of available domains
  const fetchDomains = async () => {
    setLoadingDomains(true);
    try {
      const res = await fetch("/api/domains");
      const domainData: DomainResponse = await res.json();
      setAvailableDomains(domainData.domains || []); // Update available domains
    } catch (error) {
      showToast("Error fetching domains", "error", error.message);
    } finally {
      setLoadingDomains(false);
    }
  };

  // Fetch recipients from localStorage or API
  const fetchRecipients = async () => {
    try {
      const storedRecipients = localStorage.getItem("recipients");
      if (storedRecipients) {
        setAvailableRecipients(JSON.parse(storedRecipients)); // Load recipients from local storage
      } else {
        const res = await fetch("/api/emails");
        const emailData: EmailResponse = await res.json();
        const recipients = [
          ...new Set(emailData.emails.map((email: Email) => email.to)),
        ];
        setAvailableRecipients(recipients);
        localStorage.setItem("recipients", JSON.stringify(recipients)); // Cache recipients locally
      }
    } catch (error) {
      showToast("Error fetching recipients", "error", error.message);
    }
  };

  // Handle email deletion
  const handleDeleteEmail = async (uid: string) => {
    try {
      const res = await fetch("/api/emails", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid, recipient: selectedRecipient }),
      });
      const result = await res.json();
      if (result.success) {
        showToast("Email deleted successfully", "success");
        fetchEmails(page, selectedRecipient); // Refresh emails after deletion
      } else {
        showToast(result.message || "Failed to delete email", "error");
      }
    } catch (error) {
      showToast("Error deleting email", "error");
    }
  };

  // Debounce search input to prevent too many re-renders
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const filtered = allEmails.filter(
        (email) =>
          email.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
          email.from.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setEmails(filtered); // Update the filtered emails
    }, 300); // Wait 300ms before filtering

    return () => clearTimeout(timeoutId); // Clear timeout on unmount or new search query
  }, [searchQuery, allEmails]);

  // Initial fetch for emails, domains, and recipients
  useEffect(() => {
    fetchEmails(0, selectedRecipient); // Fetch initial email list
    fetchDomains(); // Fetch domains independently
    fetchRecipients(); // Fetch recipients
  }, []);

  // Handle recipient dropdown change
  const handleRecipientChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const selected = event.target.value;
    setSelectedRecipient(selected);
    fetchEmails(0, selected || undefined); // Fetch emails for the selected recipient
  };

  // Handle email creation and update local state
  const handleCreateEmail = (email: string) => {
    showToast(
      "New Email Created",
      "success",
      `Email address ${email} created successfully.`
    );
    const updatedRecipients = [...availableRecipients, email];
    setAvailableRecipients(updatedRecipients); // Update recipients
    localStorage.setItem("recipients", JSON.stringify(updatedRecipients)); // Cache the new recipient
    setSelectedRecipient(email);
    fetchEmails(0, email); // Fetch emails for the new email address
  };

  // Fetch emails for a specific email address
  const fetchEmailsForAddress = (emailAddress: string) => {
    setSelectedRecipient(emailAddress);
    fetchEmails(0, emailAddress);
  };

  // Handle page changes
  const handlePageChange = (newPage: number) => {
    if (newPage >= 0 && newPage < totalPages) {
      setPage(newPage);
      fetchEmails(newPage, selectedRecipient); // Fetch emails for the new page
    }
  };

  return (
    <Box p={8} maxW="1200px" mx="auto">
      <Box
        display="grid"
        gridTemplateColumns={{ base: "1fr", md: "2fr 1fr" }}
        gap={6}
        mt={8}
      >
        {/* Left Column: Email Inbox */}
        <Box>
          <Heading size="md" color="teal.500">
            Email Inbox
          </Heading>

          <Input
            placeholder="Search by subject or sender"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            mt={4}
            mb={4}
            size="lg"
          />

          <HStack spacing={4} mt={4} mb={6}>
            <Select
              placeholder="Filter by recipient"
              value={selectedRecipient}
              onChange={handleRecipientChange}
            >
              <option value="">Show All</option>
              {availableRecipients.map((recipient, index) => (
                <option key={index} value={recipient}>
                  {extractEmail(recipient)}
                </option>
              ))}
            </Select>
            <IconButton
              icon={<RepeatIcon />}
              colorScheme="teal"
              aria-label="Refresh"
              onClick={() => fetchEmails(page, selectedRecipient)}
              isLoading={loadingEmails}
            />
          </HStack>

          {loadingEmails ? (
            <Box display="flex" justifyContent="center" mt={4}>
              <Spinner size="xl" />
            </Box>
          ) : (
            <Box>
              {emails.length > 0 ? (
                <EmailList emails={emails} onDelete={handleDeleteEmail} />
              ) : (
                <Text>No emails found for this search.</Text>
              )}
            </Box>
          )}

          <HStack spacing={4} justifyContent="center" mt={6}>
            <Button
              onClick={() => handlePageChange(page - 1)}
              isDisabled={loadingEmails || page === 0}
            >
              Previous
            </Button>
            <Text>
              Page {page + 1} of {totalPages}
            </Text>
            <Button
              onClick={() => handlePageChange(page + 1)}
              isDisabled={loadingEmails || page + 1 >= totalPages}
            >
              Next
            </Button>
          </HStack>
        </Box>

        {/* Right Column: Menu and Create Email */}
        <VStack spacing={6} align="stretch">
          <Heading size="md" color="teal.500">
            Menu
          </Heading>

          {/* Show spinner while domains are loading */}
          {loadingDomains ? (
            <Box display="flex" justifyContent="center" mt={4}>
              <Spinner size="lg" />
            </Box>
          ) : (
            <CreateEmail
              availableDomains={availableDomains}
              onCreateEmail={handleCreateEmail}
              fetchEmailsForAddress={fetchEmailsForAddress}
            />
          )}
        </VStack>
      </Box>
    </Box>
  );
}
