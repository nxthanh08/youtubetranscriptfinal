import React, { useState } from "react";
import { Button } from "./ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import {
  Copy,
  Download,
  Languages,
  FileText,
  ChevronDown,
  FileJson,
  FileSpreadsheet,
  File,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

export type ExportFormat = "txt" | "srt" | "vtt" | "csv" | "pdf";

interface TranscriptActionsProps {
  transcript: string;
  onTranslate: () => void;
  onExport?: (format: ExportFormat) => void;
  isTranslating?: boolean;
  isLoading?: boolean;
}

const TranscriptActions = ({
  transcript = "Sample transcript content for demonstration purposes.",
  onTranslate = () => {},
  onExport = () => {},
  isTranslating = false,
  isLoading = false,
}: TranscriptActionsProps) => {
  const copyToClipboard = () => {
    navigator.clipboard.writeText(transcript);
    // In a real implementation, you would show a toast notification here
  };

  const downloadTranscript = () => {
    onExport("txt");
  };

  return (
    <div className="flex items-center justify-between w-full p-5 bg-gradient-to-r from-primary-50 to-secondary-50 border-b border-gray-200 rounded-t-2xl">
      <div className="text-sm text-gray-500">
        {isLoading
          ? "Loading transcript..."
          : `${transcript.length} characters`}
      </div>

      <div className="flex space-x-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                onClick={copyToClipboard}
                disabled={isLoading || !transcript}
                className="hover:bg-primary-100 hover:text-primary-700 transition-colors duration-300"
              >
                <Copy className="h-4 w-4 mr-2" />
                Copy
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Copy transcript to clipboard</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <DropdownMenu>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={isLoading || !transcript}
                    className="hover:bg-primary-100 hover:text-primary-700 transition-colors duration-300"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export
                    <ChevronDown className="h-3 w-3 ml-1" />
                  </Button>
                </DropdownMenuTrigger>
              </TooltipTrigger>
              <TooltipContent>
                <p>Export transcript in different formats</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={() => onExport("txt")}>
              <FileText className="h-4 w-4 mr-2" />
              <span>Text (.txt)</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onExport("srt")}>
              <FileJson className="h-4 w-4 mr-2" />
              <span>SubRip (.srt)</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onExport("vtt")}>
              <FileJson className="h-4 w-4 mr-2" />
              <span>WebVTT (.vtt)</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onExport("csv")}>
              <FileSpreadsheet className="h-4 w-4 mr-2" />
              <span>CSV (.csv)</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onExport("pdf")}>
              <File className="h-4 w-4 mr-2" />
              <span>PDF (.pdf)</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                onClick={onTranslate}
                disabled={isLoading || !transcript || isTranslating}
                className="hover:bg-primary-100 hover:text-primary-700 transition-colors duration-300"
              >
                <Languages className="h-4 w-4 mr-2" />
                {isTranslating ? "Translating..." : "Translate"}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Translate transcript</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};

export default TranscriptActions;
