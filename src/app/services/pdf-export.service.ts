import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class PdfExportService {
  /**
   * Renders a DOM node to a multi-page A4 PDF (html2canvas scales long tables).
   */
  async exportHtmlElementToPdf(
    element: HTMLElement | null,
    fileName: string,
  ): Promise<void> {
    if (!element) {
      await Swal.fire({
        icon: 'warning',
        text: 'Visualice el reporte antes de generar el PDF.',
      });
      return;
    }

    Swal.fire({
      allowOutsideClick: false,
      icon: 'info',
      text: 'Espere por favor...',
      showConfirmButton: false,
    });
    Swal.showLoading();

    const margin = 15;
    const doc = new jsPDF('p', 'pt', 'a4');
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const contentWidth = pageWidth - 2 * margin;
    const usableHeight = pageHeight - 2 * margin;

    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
      });

      const imgData = canvas.toDataURL('image/png');
      const imgHeight = (canvas.height * contentWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = margin;

      doc.addImage(
        imgData,
        'PNG',
        margin,
        position,
        contentWidth,
        imgHeight,
        undefined,
        'FAST',
      );
      heightLeft -= usableHeight;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight + margin;
        doc.addPage();
        doc.addImage(
          imgData,
          'PNG',
          margin,
          position,
          contentWidth,
          imgHeight,
          undefined,
          'FAST',
        );
        heightLeft -= usableHeight;
      }

      Swal.close();
      doc.save(fileName);
    } catch (e) {
      console.error(e);
      Swal.close();
      await Swal.fire({
        icon: 'error',
        text: 'No se pudo generar el PDF.',
      });
    }
  }
}
