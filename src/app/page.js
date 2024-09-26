"use client";

import { useState, useCallback, useEffect } from "react";
import dynamic from "next/dynamic";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const PDFConverter = dynamic(() => import("./PDFConverter"), { ssr: false });

export default function PDFUploadForm() {
  const [pdfFile, setPdfFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isPDFJSLoaded, setIsPDFJSLoaded] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    setIsPDFJSLoaded(true);
  }, []);

  const handleFileChange = useCallback((event) => {
    const file = event.target.files[0];
    if (file && file.type === "application/pdf") {
      setPdfFile(file);
      setError(null);
    } else {
      setPdfFile(null);
      setError("Please select a valid PDF file.");
    }
  }, []);

  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault();
      setSubmitted(true);
      if (!pdfFile) {
        setError("Please select a PDF file");
        return;
      }
      setIsLoading(true);
      setError(null);
    },
    [pdfFile],
  );

  return (
    <div className="bg-white flex w-screen h-screen items-center justify-center">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          type="file"
          accept=".pdf"
          onChange={handleFileChange}
          disabled={isLoading}
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              e.preventDefault(); // Prevent accidental form submission with "Enter"
            }
          }}
        />
        <Button
          type="submit"
          variant="ghost"
          disabled={!pdfFile || isLoading}
          className="bg-black text-white"
        >
          {isLoading ? "Processing..." : "Convert and Download"}
        </Button>
        {error && <p style={{ color: "red" }}>{error}</p>}
        {isPDFJSLoaded && pdfFile && submitted && (
          <PDFConverter
            file={pdfFile}
            setIsLoading={setIsLoading}
            setError={setError}
            submitted={submitted}
            setSubmitted={setSubmitted}
          />
        )}
      </form>
    </div>
  );
}
