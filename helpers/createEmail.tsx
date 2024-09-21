import {
  Box,
  Button,
  Input,
  Select,
  Text,
  VStack,
  HStack,
  useToast,
  List,
  ListItem,
  IconButton,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { RepeatIcon, DeleteIcon, CopyIcon } from "@chakra-ui/icons"; // Import icons for actions

interface CreateEmailProps {
  availableDomains: string[];
  onCreateEmail: (email: string) => void; // Notify parent about new email creation
  fetchEmailsForAddress: (emailAddress: string) => void; // Fetch emails for the new email
}

export default function CreateEmail({
  availableDomains,
  onCreateEmail,
  fetchEmailsForAddress,
}: CreateEmailProps) {
  const [username, setUsername] = useState(""); // Username input state
  const [selectedDomain, setSelectedDomain] = useState(""); // Selected domain state
  const [savedEmails, setSavedEmails] = useState<string[]>([]); // List of created emails
  const [newDomain, setNewDomain] = useState(""); // New domain input state
  const [registeredDomains, setRegisteredDomains] =
    useState<string[]>(availableDomains); // List of registered domains
  const toast = useToast();

  // Sync registered domains with available domains prop
  useEffect(() => {
    setRegisteredDomains(availableDomains);
  }, [availableDomains]);

  // Function to copy an email to the clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: "Copied to clipboard",
        description: `${text} was copied to your clipboard`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    });
  };

  // Handle email creation
  const handleCreateEmail = () => {
    if (username && selectedDomain) {
      const newEmail = `${username}@${selectedDomain}`;
      setSavedEmails((prev) => [...prev, newEmail]); // Add new email to the list

      onCreateEmail(newEmail); // Notify parent about the created email
      fetchEmailsForAddress(newEmail); // Fetch emails for the new email address

      // Clear inputs after creation
      setUsername("");
      setSelectedDomain("");
    } else {
      toast({
        title: "Invalid input",
        description: "Please enter a username and select a domain.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  // Handle domain registration
  const handleRegisterDomain = async () => {
    if (!newDomain) {
      toast({
        title: "Domain cannot be empty",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      const res = await fetch("/api/domains", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domain: newDomain }),
      });

      const data = await res.json();
      if (res.ok) {
        setRegisteredDomains((prev) => [...prev, newDomain]); // Add the new domain to the list
        setNewDomain(""); // Clear input after success
        toast({
          title: "Domain registered successfully!",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } else {
        toast({
          title: data.error || "Error registering domain",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: "Error registering domain",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  // Handle domain deletion
  const handleDeleteDomain = async (domain: string) => {
    try {
      const res = await fetch(
        `/api/domains?domain=${encodeURIComponent(domain)}`,
        { method: "DELETE" }
      );
      const data = await res.json();
      if (res.ok) {
        setRegisteredDomains((prev) => prev.filter((d) => d !== domain)); // Remove deleted domain
        toast({
          title: "Domain deleted successfully!",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } else {
        toast({
          title: data.error || "Error deleting domain",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: "Error deleting domain",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <VStack spacing={4} align="stretch" w="full">
      {/* Tabs to switch between email creation and domain registration */}
      <Tabs>
        <TabList>
          <Tab>Create Email Address</Tab>
          <Tab>Register Domain</Tab>
        </TabList>

        <TabPanels>
          {/* Tab for Creating Email Address */}
          <TabPanel>
            <Box>
              <Text fontWeight="bold" mb={2}>
                Enter a username:
              </Text>
              <Input
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </Box>

            <Box>
              <Text fontWeight="bold" mb={2}>
                Select a domain:
              </Text>
              <Select
                mb={6}
                placeholder="Select domain"
                value={selectedDomain}
                onChange={(e) => setSelectedDomain(e.target.value)}
              >
                {registeredDomains.map((domain, index) => (
                  <option key={index} value={domain}>
                    {domain}
                  </option>
                ))}
              </Select>
            </Box>

            <Button
              colorScheme="teal"
              onClick={handleCreateEmail}
              disabled={!username || !selectedDomain}
            >
              Create Email Address
            </Button>

            {/* List of saved email addresses */}
            <Box mt={6}>
              <Text fontWeight="bold" mb={2}>
                Saved Email Addresses:
              </Text>
              <List spacing={2}>
                {savedEmails.map((email, index) => (
                  <ListItem
                    key={index}
                    p={2}
                    border="1px"
                    borderColor="gray.200"
                    borderRadius="md"
                    display="flex"
                    justifyContent="space-between"
                  >
                    <Text>{email}</Text>
                    <HStack>
                      {/* Fetch emails for the saved address */}
                      <IconButton
                        aria-label="Get emails"
                        icon={<RepeatIcon />}
                        onClick={() => fetchEmailsForAddress(email)}
                      />

                      {/* Copy email to clipboard */}
                      <IconButton
                        aria-label="Copy email"
                        icon={<CopyIcon />}
                        onClick={() => copyToClipboard(email)}
                      />
                    </HStack>
                  </ListItem>
                ))}
              </List>
            </Box>
          </TabPanel>

          {/* Tab for Registering a New Domain */}
          <TabPanel>
            <Box>
              <Text fontWeight="bold" mb={2}>
                Enter a new domain:
              </Text>
              <Input
                placeholder="New domain"
                value={newDomain}
                onChange={(e) => setNewDomain(e.target.value)}
              />
            </Box>

            <Button
              onClick={handleRegisterDomain}
              colorScheme="teal"
              size="lg"
              mt={4}
            >
              Register Domain
            </Button>

            {/* List of registered domains with delete option */}
            <Box mt={6}>
              <Text fontWeight="bold" mb={2}>
                Registered Domains:
              </Text>
              <List spacing={2}>
                {registeredDomains.map((domain, index) => (
                  <ListItem
                    key={index}
                    p={2}
                    border="1px"
                    borderColor="gray.200"
                    borderRadius="md"
                    display="flex"
                    justifyContent="space-between"
                  >
                    <Text>{domain}</Text>
                    <IconButton
                      aria-label="Delete domain"
                      icon={<DeleteIcon />}
                      onClick={() => handleDeleteDomain(domain)}
                    />
                  </ListItem>
                ))}
              </List>
            </Box>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </VStack>
  );
}
