import React, { useRef, useEffect, useState } from "react";
import { Box } from "@chakra-ui/react";

interface EmailIframeProps {
  content: string;
}

export const EmailIframe = ({ content }: EmailIframeProps) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [height, setHeight] = useState("0px");

  useEffect(() => {
    const iframe = iframeRef.current;

    if (iframe) {
      const iframeDocument =
        iframe.contentDocument || iframe.contentWindow?.document;
      if (iframeDocument) {
        iframeDocument.open();
        iframeDocument.write(content);
        iframeDocument.close();

        const adjustHeight = () => {
          const iframeBody = iframeDocument.body;
          if (iframeBody) {
            const iframeHeight = iframeBody.scrollHeight;
            setHeight(`${iframeHeight}px`);
          }
        };

        // Adjust iframe height on load and after content updates
        iframe.onload = adjustHeight;

        // Use MutationObserver to track changes in the iframe body and adjust height
        const observer = new MutationObserver(adjustHeight);

        observer.observe(iframeDocument.body, {
          childList: true,
          subtree: true,
        });

        // Clean up the observer on component unmount
        return () => {
          observer.disconnect();
        };
      }
    }
  }, [content]);

  return (
    <Box w="full">
      <iframe
        ref={iframeRef}
        title="Email Content"
        style={{
          width: "100%",
          height: height,
          border: "none",
          overflow: "hidden",
        }}
        sandbox="allow-same-origin allow-scripts" // Added 'allow-scripts' to enable scripts inside iframe if needed
        scrolling="no"
      />
    </Box>
  );
};
