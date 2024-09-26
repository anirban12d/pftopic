import { useEffect, useCallback } from "react";
import { getDocument } from "pdfjs-dist/build/pdf";
import * as PDFJS from "pdfjs-dist";
import * as pdfjsWorker from "pdfjs-dist/build/pdf.worker";

export default function PDFConverter({
  file,
  setIsLoading,
  setError,
  submitted,
  setSubmitted,
}) {
  const convertPDFToImage = useCallback(async (file) => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await getDocument({ data: arrayBuffer }).promise;
      const page = await pdf.getPage(1);

      const scale = 2;
      const viewport = page.getViewport({ scale });

      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
      canvas.height = viewport.height;
      canvas.width = viewport.width;

      await page.render({ canvasContext: context, viewport }).promise;

      return new Promise((resolve) => {
        canvas.toBlob(resolve, "image/png");
      });
    } catch (error) {
      console.error("Error converting PDF to image:", error);
      throw new Error("Failed to convert PDF to image");
    }
  }, []);

  const downloadImage = useCallback((blob, fileName) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.style.display = "none";
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }, []);

  useEffect(() => {
    if (submitted && file) {
      const convert = async () => {
        try {
          const imageBlob = await convertPDFToImage(file);
          downloadImage(imageBlob, "first-page.png");
          alert("Image downloaded successfully");
        } catch (error) {
          console.error("Error:", error);
          setError(
            error.message || "An error occurred while processing the PDF",
          );
        } finally {
          setIsLoading(false);
          setSubmitted(false);
        }
      };

      convert();
    }
  }, [
    submitted,
    file,
    convertPDFToImage,
    downloadImage,
    setIsLoading,
    setError,
    setSubmitted,
  ]);

  return null;
}
