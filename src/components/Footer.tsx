import React from "react";
import { Github, Heart } from "lucide-react";

interface FooterProps {
  createdBy?: string;
  githubUrl?: string;
}

const Footer = ({
  createdBy = "YouTube Transcript Team",
  githubUrl = "https://github.com/yourusername/youtube-transcript-extractor",
}: FooterProps) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full py-6 px-8 border-t bg-gradient-to-r from-primary-900/90 to-secondary-900/90 text-white">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center text-sm">
        <div className="mb-2 md:mb-0">
          <p>
            © {currentYear} {createdBy}. All rights reserved.
          </p>
        </div>

        <div className="flex items-center space-x-4">
          <p className="flex items-center">
            Made with <Heart className="h-4 w-4 mx-1 text-red-500" /> for
            YouTube creators
          </p>

          <a
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center hover:text-secondary-300 transition-colors"
          >
            <Github className="h-4 w-4 mr-1" />
            <span>GitHub</span>
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
