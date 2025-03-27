import React, { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchBarProps {
  onExtract?: (url: string) => void;
  isLoading?: boolean;
  error?: string | null;
}

const SearchBar = ({
  onExtract = () => {},
  isLoading = false,
  error = null,
}: SearchBarProps) => {
  const [url, setUrl] = useState<string>("");
  const [isValidUrl, setIsValidUrl] = useState<boolean>(true);

  const validateYoutubeUrl = (url: string): boolean => {
    // Basic YouTube URL validation
    const youtubeRegex =
      /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11}).*$/;
    return youtubeRegex.test(url);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputUrl = e.target.value;
    setUrl(inputUrl);

    // Only validate if there's input
    if (inputUrl.trim()) {
      setIsValidUrl(validateYoutubeUrl(inputUrl));
    } else {
      setIsValidUrl(true); // Reset validation when input is empty
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!url.trim()) {
      setIsValidUrl(false);
      return;
    }

    if (validateYoutubeUrl(url)) {
      onExtract(url);
    } else {
      setIsValidUrl(false);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-6 bg-white rounded-2xl shadow-custom">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label
            htmlFor="youtube-url"
            className="text-sm font-medium text-gray-700"
          >
            Enter YouTube Video URL
          </label>
          <div className="relative">
            <Input
              id="youtube-url"
              type="text"
              placeholder="https://www.youtube.com/watch?v=..."
              value={url}
              onChange={handleInputChange}
              className={cn(
                "pr-10",
                !isValidUrl && "border-red-500 focus-visible:ring-red-500",
              )}
              disabled={isLoading}
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
          </div>
          {!isValidUrl && (
            <p className="text-sm text-red-500 mt-1">
              Please enter a valid YouTube video URL
            </p>
          )}
          {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
        </div>

        <Button
          type="submit"
          className="w-full bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 shadow-custom hover:shadow-custom-hover transition-all duration-300 text-white font-medium py-6"
          disabled={isLoading || !url.trim()}
        >
          {isLoading ? "Extracting..." : "Extract Transcript"}
        </Button>

        <p className="text-xs text-gray-500 text-center">
          Enter a YouTube video URL to extract its transcript. The video must
          have captions available.
        </p>
      </form>
    </div>
  );
};

export default SearchBar;
