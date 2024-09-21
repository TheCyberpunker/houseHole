import React from "react";
import {
  Box,
  VStack,
  Text,
  Badge,
  Heading,
  IconButton,
  useColorModeValue,
} from "@chakra-ui/react";
import { DeleteIcon } from "@chakra-ui/icons";
import DOMPurify from "dompurify";
import LazyLoad from "react-lazyload";

interface Email {
  subject: string;
  from: string;
  to: string;
  date: string;
  text: string; // Plain text content
  html?: string; // HTML content (if available)
  uid: string; // UID for deleting emails
}

interface EmailListProps {
  emails: Email[];
  onDelete: (uid: string) => void;
}

export const EmailList = ({ emails, onDelete }: EmailListProps) => {
  const hoverBgColor = useColorModeValue("gray.50", "gray.700");

  // Sort emails by most recent date first
  const sortedEmails = [...emails].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <VStack spacing={4} align="stretch" w="full">
      {sortedEmails.map((email) => {
        const content = email.html
          ? processEmailContent(email.html, true)
          : processEmailContent(email.text, false);

        return (
          <Box
            key={email.uid}
            p={4}
            mb={4}
            borderWidth="1px"
            borderRadius="lg"
            boxShadow="sm"
            _hover={{ boxShadow: "md", backgroundColor: hoverBgColor }}
            transition="all 0.3s"
          >
            {/* Email Subject and Metadata */}
            <Heading size="md" color="blue.600">
              {email.subject}
            </Heading>
            <Text fontSize="sm" color="gray.600">
              From:{" "}
              <Badge ml={2} colorScheme="green">
                {email.from}
              </Badge>
            </Text>
            <Text fontSize="sm" color="gray.600">
              To:{" "}
              <Badge ml={2} colorScheme="blue">
                {email.to}
              </Badge>
            </Text>
            <Text fontSize="sm" color="gray.500" mb={2}>
              Date: {new Date(email.date).toLocaleString()}
            </Text>

            {/* Email Body */}
            <Box
              mt={4}
              maxWidth="100%"
              sx={{
                img: {
                  maxWidth: "100%",
                  height: "auto",
                },
                table: {
                  width: "100%",
                  borderCollapse: "collapse",
                },
                "*": {
                  wordWrap: "break-word",
                  overflowWrap: "break-word",
                  wordBreak: "break-word",
                },
                a: {
                  wordBreak: "break-all",
                },
                whiteSpace: "pre-wrap",
                display: "block",
              }}
            >
              <LazyLoad>
                {/* Render sanitized HTML or plain text content */}
                <div dangerouslySetInnerHTML={{ __html: content }} />
              </LazyLoad>
            </Box>

            {/* Delete Button */}
            <IconButton
              aria-label="Delete Email"
              icon={<DeleteIcon />}
              colorScheme="red"
              mt={4}
              onClick={() => onDelete(email.uid)}
            />
          </Box>
        );
      })}
    </VStack>
  );
};

// Helper function to sanitize and process email content
const processEmailContent = (content: string, isHtml: boolean) => {
  if (isHtml) {
    // Sanitize HTML content
    const sanitizedContent = DOMPurify.sanitize(content, {
      USE_PROFILES: { html: true },
      FORBID_TAGS: ["script", "style"],
      FORBID_ATTR: ["onerror", "onload", "onclick"],
    });

    // Prevent data URI images from rendering
    const contentWithoutDataUriImages = sanitizedContent.replace(
      /<img[^>]+src=["']data:image\/[^"']+["'][^>]*>/gi,
      (match) => {
        const dataUriText =
          match.match(/src=["'](data:image\/[^"']+)["']/i)?.[1] ||
          "[Embedded Image]";
        return `<span>${dataUriText}</span>`;
      }
    );

    // Inject CSS for handling long words and URLs
    const style = `
      <style>
        body {
          margin: 0;
          padding: 0;
          word-wrap: break-word;
          overflow-wrap: break-word;
          word-break: break-word;
          font-family: sans-serif;
        }
        a {
          word-break: break-all;
        }
        img {
          max-width: 100%;
          height: auto;
        }
        table {
          width: 100%;
          border-collapse: collapse;
        }
      </style>
    `;

    return style + contentWithoutDataUriImages;
  } else {
    // Process plain text content: convert URLs to clickable links and sanitize
    const urlRegex = /(?<!data:)((https?|ftp):\/\/[^\s/$.?#].[^\s]*)/gi;
    let processedText = content.replace(
      urlRegex,
      (match) =>
        `<a href="${match}" target="_blank" rel="noopener noreferrer">${match}</a>`
    );

    // Truncate data URIs
    processedText = processedText.replace(
      /(data:image\/[a-zA-Z]+;base64,)[^ \t\n\r<]+/g,
      "$1[...truncated]"
    );

    // Replace newlines with <br> tags
    processedText = processedText.replace(/\n/g, "<br>");

    // Sanitize the processed text
    return DOMPurify.sanitize(processedText, {
      ALLOWED_TAGS: ["a", "br", "span"],
      ALLOWED_ATTR: ["href", "target", "rel"],
    });
  }
};
