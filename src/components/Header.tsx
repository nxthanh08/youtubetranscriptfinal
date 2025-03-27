import React from "react";
import { Button } from "./ui/button";
import { YoutubeIcon } from "lucide-react";

interface HeaderProps {
  title?: string;
  description?: string;
}

const Header = ({
  title = "YouTube Transcript Extractor",
  description = "Extract and view transcripts from YouTube videos easily",
}: HeaderProps) => {
  return (
    <header className="w-full py-6 px-8 border-b bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-between shadow-md">
      <div className="flex items-center gap-3">
        <YoutubeIcon className="h-10 w-10 text-white drop-shadow-md" />
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            {title}
          </h1>
          <p className="text-sm text-white/80">{description}</p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="sm"
          className="bg-white/20 text-white border-white/30 hover:bg-white/30"
        >
          About
        </Button>
        <Button
          size="sm"
          className="bg-white text-primary-600 hover:bg-white/90 shadow-custom hover:shadow-custom-hover transition-all duration-300"
        >
          Get Started
        </Button>
      </div>
    </header>
  );
};

export default Header;
