import React, { useState } from "react";
import { Globe, Check, ArrowLeft } from "lucide-react";
import { Button } from "./ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel,
} from "./ui/select";

interface TranslationOptionsProps {
  onTranslate?: (language: string) => void;
  onBackToOriginal?: () => void;
  isTranslating?: boolean;
  currentLanguage?: string;
}

const TranslationOptions = ({
  onTranslate = () => {},
  onBackToOriginal = () => {},
  isTranslating = false,
  currentLanguage = "en",
}: TranslationOptionsProps) => {
  const [selectedLanguage, setSelectedLanguage] = useState(currentLanguage);

  const languages = [
    { code: "en", name: "English" },
    { code: "es", name: "Spanish" },
    { code: "fr", name: "French" },
    { code: "de", name: "German" },
    { code: "it", name: "Italian" },
    { code: "pt", name: "Portuguese" },
    { code: "ru", name: "Russian" },
    { code: "ja", name: "Japanese" },
    { code: "ko", name: "Korean" },
    { code: "zh", name: "Chinese" },
    { code: "ar", name: "Arabic" },
    { code: "hi", name: "Hindi" },
    { code: "vi", name: "Vietnamese" },
  ];

  const handleLanguageChange = (value: string) => {
    setSelectedLanguage(value);
  };

  const handleTranslate = () => {
    onTranslate(selectedLanguage);
  };

  return (
    <div className="bg-white p-5 rounded-xl shadow-custom w-full max-w-xs">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium flex items-center text-primary-700">
          <Globe className="mr-2 h-5 w-5 text-primary-500" />
          Translation Options
        </h3>
        {isTranslating && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onBackToOriginal}
            className="flex items-center text-xs"
          >
            <ArrowLeft className="mr-1 h-4 w-4" />
            Original
          </Button>
        )}
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            Target Language
          </label>
          <Select value={selectedLanguage} onValueChange={handleLanguageChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Languages</SelectLabel>
                {languages.map((language) => (
                  <SelectItem key={language.code} value={language.code}>
                    {language.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <Button
          className="w-full bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 text-white shadow-custom hover:shadow-custom-hover transition-all duration-300"
          onClick={handleTranslate}
          disabled={isTranslating && selectedLanguage === currentLanguage}
        >
          {isTranslating ? "Change Language" : "Translate"}
          {isTranslating && selectedLanguage === currentLanguage && (
            <Check className="ml-2 h-4 w-4" />
          )}
        </Button>
      </div>
    </div>
  );
};

export default TranslationOptions;
