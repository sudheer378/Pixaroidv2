declare module "pdfjs-dist/build/pdf.mjs" {
  type PdfViewport = {
    width: number;
    height: number;
  };

  type PdfPage = {
    getViewport(options: { scale: number }): PdfViewport;
    render(options: { canvasContext: CanvasRenderingContext2D; viewport: PdfViewport }): {
      promise: Promise<void>;
    };
    cleanup(): void;
  };

  type PdfDocument = {
    numPages: number;
    getPage(pageNumber: number): Promise<PdfPage>;
    destroy(): Promise<void>;
  };

  export function getDocument(options: {
    data: Uint8Array;
    disableWorker?: boolean;
  }): { promise: Promise<PdfDocument> };
}
