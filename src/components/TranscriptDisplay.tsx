import React, { useState, useEffect } from "react";
import { Card } from "./ui/card";
import { AlertCircle, Loader2, Languages } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import TranscriptActions, { ExportFormat } from "./TranscriptActions";
import TranslationOptions from "./TranslationOptions";
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
import { convertToSRT, convertToVTT, convertToCSV } from "../lib/utils";
import { API_ENDPOINTS } from "../config/api";

interface TranscriptDisplayProps {
  transcript?: string;
  isLoading?: boolean;
  error?: string;
  videoTitle?: string;
  videoId?: string;
}

const TranscriptDisplay = ({
  transcript = "",
  isLoading = false,
  error = "",
  videoTitle = "YouTube Video",
  videoId = "",
}: TranscriptDisplayProps) => {
  const [isTranslating, setIsTranslating] = useState(false);
  const [translatedText, setTranslatedText] = useState("");
  const [currentLanguage, setCurrentLanguage] = useState("en");
  const [availableLanguages, setAvailableLanguages] = useState<
    { code: string; name: string }[]
  >([]);
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [isLoadingLanguages, setIsLoadingLanguages] = useState(false);

  const handleTranslate = () => {
    setIsTranslating(true);
  };

  useEffect(() => {
    if (transcript && videoId) {
      fetchAvailableLanguages(videoId);
    }
  }, [transcript, videoId]);

  const fetchAvailableLanguages = async (videoId: string) => {
    if (!videoId) return;

    setIsLoadingLanguages(true);
    try {
      const response = await fetch(
        `${API_ENDPOINTS.languages}?videoId=${videoId}&apiKey=AIzaSyBlY66SBjiZ0swy5439aa3YDc1-9lOCpHo`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch available languages");
      }

      setAvailableLanguages(data.languages || []);
    } catch (error) {
      console.error("Error fetching languages:", error);
      // Fallback to default languages if API fails
      setAvailableLanguages([
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
      ]);
    } finally {
      setIsLoadingLanguages(false);
    }
  };

  const downloadTranscriptInLanguage = async (languageCode: string) => {
    try {
      const response = await fetch(API_ENDPOINTS.transcriptLanguage, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          videoId: videoId,
          language: languageCode,
          apiKey: "AIzaSyBlY66SBjiZ0swy5439aa3YDc1-9lOCpHo",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to get transcript in selected language",
        );
      }

      // Download the transcript
      const element = document.createElement("a");
      const file = new Blob([data.transcript], { type: "text/plain" });
      element.href = URL.createObjectURL(file);
      element.download = `youtube-transcript-${languageCode}.txt`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    } catch (error) {
      console.error("Error downloading transcript:", error);
      alert("Failed to download transcript in selected language");
    }
  };

  const handleLanguageTranslate = async (language: string) => {
    setCurrentLanguage(language);

    try {
      const response = await fetch(API_ENDPOINTS.translate, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: transcript,
          language: language,
          apiKey: "AIzaSyBlY66SBjiZ0swy5439aa3YDc1-9lOCpHo",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Translation failed");
      }

      setTranslatedText(data.translatedText);
    } catch (error) {
      console.error("Translation error:", error);
      // Fallback to simple prefix if API fails
      setTranslatedText(`[Translated to ${language}] ${transcript}`);
    }
  };

  const handleBackToOriginal = () => {
    setIsTranslating(false);
    setTranslatedText("");
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center h-64 p-6">
          <Loader2 className="h-10 w-10 text-primary animate-spin mb-4" />
          <p className="text-gray-500">Loading transcript...</p>
        </div>
      );
    }

    if (error) {
      return (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      );
    }

    if (!transcript) {
      return (
        <div className="flex flex-col items-center justify-center h-64 p-6 text-center">
          <AlertCircle className="h-10 w-10 text-gray-400 mb-4" />
          <p className="text-gray-500 mb-2">No transcript available</p>
          <p className="text-gray-400 text-sm">
            This video may not have captions, or they might be disabled.
          </p>
        </div>
      );
    }

    return (
      <div className="p-6 whitespace-pre-wrap text-gray-700 overflow-y-auto max-h-[500px] leading-relaxed">
        {isTranslating ? translatedText || transcript : transcript}
      </div>
    );
  };

  const handleExport = async (format: ExportFormat) => {
    const textToExport = isTranslating ? translatedText : transcript;
    let content = "";
    let mimeType = "text/plain";
    let fileExtension = "txt";

    switch (format) {
      case "srt":
        content = convertToSRT(textToExport);
        mimeType = "text/plain";
        fileExtension = "srt";
        break;
      case "vtt":
        content = convertToVTT(textToExport);
        mimeType = "text/vtt";
        fileExtension = "vtt";
        break;
      case "csv":
        content = convertToCSV(textToExport);
        mimeType = "text/csv";
        fileExtension = "csv";
        break;
      case "pdf":
        try {
          // For PDF we would normally use a library like jsPDF
          // This is a simplified version that just shows a message
          alert("PDF export would require a PDF generation library like jsPDF");
          return;
        } catch (error) {
          console.error("Error generating PDF:", error);
          alert("Failed to generate PDF");
          return;
        }
      case "txt":
      default:
        content = textToExport;
        mimeType = "text/plain";
        fileExtension = "txt";
        break;
    }

    // Create and download the file
    const element = document.createElement("a");
    const file = new Blob([content], { type: mimeType });
    element.href = URL.createObjectURL(file);
    element.download = `youtube-transcript.${fileExtension}`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-2xl shadow-custom overflow-hidden">
      {(transcript || isLoading) && (
        <TranscriptActions
          transcript={isTranslating ? translatedText : transcript}
          onTranslate={handleTranslate}
          onExport={handleExport}
          isTranslating={isTranslating}
          isLoading={isLoading}
        />
      )}

      <div className="relative">
        {videoTitle && transcript && (
          <div className="px-6 py-3 bg-gradient-to-r from-primary-50 to-secondary-50 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-medium text-gray-700 truncate">
                {videoTitle}
              </h3>

              {availableLanguages.length > 0 && (
                <div className="flex items-center space-x-2">
                  <Select
                    value={selectedLanguage}
                    onValueChange={setSelectedLanguage}
                  >
                    <SelectTrigger className="w-[180px] h-8 text-xs">
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Available Languages</SelectLabel>
                        {availableLanguages.map((language) => (
                          <SelectItem key={language.code} value={language.code}>
                            {language.name}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8 text-xs"
                    onClick={() =>
                      downloadTranscriptInLanguage(selectedLanguage)
                    }
                    disabled={isLoadingLanguages}
                  >
                    <Languages className="h-3 w-3 mr-1" />
                    Download
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="flex">
          <div
            className={`flex-grow ${isTranslating ? "border-r border-gray-200" : ""}`}
          >
            {renderContent()}
          </div>

          {isTranslating && (
            <div className="w-72 p-4 bg-gray-50">
              <TranslationOptions
                onTranslate={handleLanguageTranslate}
                onBackToOriginal={handleBackToOriginal}
                isTranslating={isTranslating}
                currentLanguage={currentLanguage}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TranscriptDisplay;
