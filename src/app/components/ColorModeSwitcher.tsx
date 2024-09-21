import { Button, useColorMode } from "@chakra-ui/react";
import { MoonIcon, SunIcon } from "@chakra-ui/icons";

const ColorModeSwitcher = () => {
  const { colorMode, toggleColorMode } = useColorMode(); // Manage dark/light mode

  return (
    <Button onClick={toggleColorMode} aria-label="Toggle Color Mode">
      {/* Show Moon icon in light mode, Sun icon in dark mode */}
      {colorMode === "light" ? <MoonIcon /> : <SunIcon />}
    </Button>
  );
};

export default ColorModeSwitcher;
