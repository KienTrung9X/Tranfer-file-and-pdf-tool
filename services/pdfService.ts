import { PDFDocument, degrees } from 'pdf-lib';
import download from 'downloadjs';

export const PdfService = {
  /**
   * Rotate all pages in a PDF file
   * @param file The PDF file
   * @param rotationAngle Angle in degrees (90, 180, 270, etc.)
   */
  rotatePdf: async (file: File, rotationAngle: number): Promise<void> => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const pages = pdfDoc.getPages();

      pages.forEach((page) => {
        const currentRotation = page.getRotation().angle;
        page.setRotation(degrees(currentRotation + rotationAngle));
      });

      const pdfBytes = await pdfDoc.save();
      download(pdfBytes, `rotated-${file.name}`, 'application/pdf');
    } catch (error) {
      console.error('Error rotating PDF:', error);
      throw new Error('Không thể xoay file PDF. Vui lòng thử lại.');
    }
  },

  /**
   * Extract specific pages from a PDF to a new file
   * @param file The PDF file
   * @param pageString String representing pages (e.g., "1, 3, 5-7")
   */
  splitPdf: async (file: File, pageString: string): Promise<void> => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const srcDoc = await PDFDocument.load(arrayBuffer);
      const newDoc = await PDFDocument.create();
      const totalPages = srcDoc.getPageCount();

      // Parse page string
      const pageIndices: number[] = [];
      const parts = pageString.split(',');

      parts.forEach((part) => {
        const range = part.trim().split('-');
        if (range.length === 2) {
          const start = parseInt(range[0]) - 1;
          const end = parseInt(range[1]) - 1;
          for (let i = start; i <= end; i++) {
            if (i >= 0 && i < totalPages) pageIndices.push(i);
          }
        } else {
          const pageNum = parseInt(range[0]) - 1;
          if (pageNum >= 0 && pageNum < totalPages) pageIndices.push(pageNum);
        }
      });

      // Dedup and sort
      const uniqueIndices = [...new Set(pageIndices)].sort((a, b) => a - b);

      if (uniqueIndices.length === 0) {
        throw new Error('Không có trang nào hợp lệ được chọn.');
      }

      const copiedPages = await newDoc.copyPages(srcDoc, uniqueIndices);
      copiedPages.forEach((page) => newDoc.addPage(page));

      const pdfBytes = await newDoc.save();
      download(pdfBytes, `split-${file.name}`, 'application/pdf');
    } catch (error) {
      console.error('Error splitting PDF:', error);
      throw error;
    }
  },
};
