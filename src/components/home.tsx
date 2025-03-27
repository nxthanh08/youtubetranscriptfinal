import React, { useState } from "react";
import Header from "./Header";
import SearchBar from "./SearchBar";
import TranscriptDisplay from "./TranscriptDisplay";
import Footer from "./Footer";
import { API_ENDPOINTS } from "../config/api";

interface TranscriptData {
  text: string;
  videoTitle: string;
  videoId?: string;
}

const Home = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [transcriptData, setTranscriptData] = useState<TranscriptData | null>(
    null,
  );

  const handleExtractTranscript = async (url: string) => {
    setIsLoading(true);
    setError(null);

    try {
      // Call the Python backend API
      const response = await fetch(API_ENDPOINTS.transcript, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url,
          apiKey: "AIzaSyBlY66SBjiZ0swy5439aa3YDc1-9lOCpHo",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to extract transcript");
      }

      setTranscriptData({
        text: data.transcript,
        videoTitle: data.videoTitle,
        videoId: data.videoId,
      });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred",
      );
      setTranscriptData(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-primary-50 to-secondary-50">
      <Header />

      {/* Top Banner Ad */}
      <div className="w-full bg-gradient-to-r from-primary-100 to-secondary-100 py-4 px-4 text-center">
        <div className="max-w-6xl mx-auto border-2 border-dashed border-primary-300 rounded-xl p-4 flex items-center justify-center bg-white/80 backdrop-blur-sm shadow-custom">
          <p className="text-primary-700 font-medium">
            Top Banner Advertisement Area
          </p>
        </div>
      </div>

      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Side Ad - Left (visible on larger screens) */}
          <div className="hidden lg:block fixed left-4 top-1/4 w-[160px] h-[600px] border-2 border-dashed border-primary-300 rounded-xl p-2 bg-gradient-to-b from-primary-50 to-primary-100/50 backdrop-blur-sm shadow-custom">
            <div className="h-full flex items-center justify-center">
              <p className="text-primary-700 font-medium text-sm text-center">
                Sidebar Ad
                <br />
                (160x600)
              </p>
            </div>
          </div>

          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold tracking-tight mb-2">
              Extract YouTube Video Transcripts
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Get the transcript from any YouTube video with available captions.
              Simply paste the video URL below and click extract.
            </p>
          </div>

          <SearchBar
            onExtract={handleExtractTranscript}
            isLoading={isLoading}
            error={error}
          />

          {/* In-content Ad */}
          <div className="w-full border-2 border-dashed border-primary-300 rounded-xl p-6 bg-gradient-to-r from-primary-100/50 to-secondary-100/50 my-8 text-center shadow-custom backdrop-blur-sm">
            <p className="text-primary-700 font-medium">
              In-Content Advertisement
            </p>
          </div>

          {(isLoading || transcriptData || error) && (
            <div className="mt-8">
              <TranscriptDisplay
                transcript={transcriptData?.text}
                videoTitle={transcriptData?.videoTitle}
                videoId={transcriptData?.videoId}
                isLoading={isLoading}
                error={error || ""}
              />
            </div>
          )}

          {/* Side Ad - Right (visible on larger screens) */}
          <div className="hidden lg:block fixed right-4 top-1/4 w-[160px] h-[600px] border-2 border-dashed border-secondary-300 rounded-xl p-2 bg-gradient-to-b from-secondary-50 to-secondary-100/50 backdrop-blur-sm shadow-custom">
            <div className="h-full flex items-center justify-center">
              <p className="text-secondary-700 font-medium text-sm text-center">
                Sidebar Ad
                <br />
                (160x600)
              </p>
            </div>
          </div>

          <div className="mt-12 bg-white p-8 rounded-2xl shadow-custom">
            <h2 className="text-xl font-semibold mb-4">How It Works</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="flex flex-col items-center text-center p-4">
                <div className="bg-gradient-to-br from-primary-100 to-primary-200 p-4 rounded-full mb-4 shadow-md">
                  <span className="text-primary text-xl font-bold">1</span>
                </div>
                <h3 className="font-medium mb-2">Paste YouTube URL</h3>
                <p className="text-gray-600 text-sm">
                  Enter the full URL of any YouTube video with captions
                </p>
              </div>

              <div className="flex flex-col items-center text-center p-4">
                <div className="bg-gradient-to-br from-secondary-100 to-secondary-200 p-4 rounded-full mb-4 shadow-md">
                  <span className="text-secondary-700 text-xl font-bold">
                    2
                  </span>
                </div>
                <h3 className="font-medium mb-2">Extract Transcript</h3>
                <p className="text-gray-600 text-sm">
                  Our system connects to YouTube's API to retrieve available
                  captions
                </p>
              </div>

              <div className="flex flex-col items-center text-center p-4">
                <div className="bg-gradient-to-br from-primary-100 to-secondary-100 p-4 rounded-full mb-4 shadow-md">
                  <span className="text-primary-700 text-xl font-bold">3</span>
                </div>
                <h3 className="font-medium mb-2">Use the Transcript</h3>
                <p className="text-gray-600 text-sm">
                  Copy, download, or translate the transcript as needed
                </p>
              </div>
            </div>
          </div>

          {/* Bottom Banner Ad */}
          <div className="w-full border-2 border-dashed border-secondary-300 rounded-xl p-6 bg-gradient-to-r from-secondary-100/50 to-primary-100/50 my-8 text-center shadow-custom backdrop-blur-sm">
            <p className="text-secondary-700 font-medium">
              Bottom Banner Advertisement
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Home;
