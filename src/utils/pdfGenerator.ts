
import jsPDF from 'jspdf';
import { supabase } from '@/integrations/supabase/client';

const A4_WIDTH = 210;
const A4_HEIGHT = 297;
const MARGIN = 20;

export async function generateReportPDF(
  reportData: any,
  reportType: string,
  reportId: string,
  userId: string
): Promise<string | null> {
  try {
    console.log('Generating PDF for report:', reportId);
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });
    
    // Add company logo or header (you can add a logo image here)
    pdf.setFontSize(28);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(0, 51, 102); // Dark blue color
    const title = reportType.replace(/_/g, ' ').toUpperCase();
    pdf.text(title, MARGIN, 30, { align: 'left' });
    
    // Add report ID and date
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(102, 102, 102); // Gray color
    const date = new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    pdf.text(`Report ID: ${reportId}`, MARGIN, 45);
    pdf.text(`Date: ${date}`, MARGIN, 52);
    
    // Add decorative line
    pdf.setDrawColor(0, 51, 102); // Dark blue color
    pdf.setLineWidth(0.5);
    pdf.line(MARGIN, 60, A4_WIDTH - MARGIN, 60);
    
    let yPosition = 75;

    // Handle staff entries if they exist
    if (reportData.staffEntries && reportData.staffEntries.length > 0) {
      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(0, 51, 102);
      pdf.text('Staff Evaluations', MARGIN, yPosition);
      yPosition += 12;

      reportData.staffEntries.forEach((entry: any) => {
        // Staff name and shift header
        pdf.setFontSize(14);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(51, 51, 51);
        pdf.text(`${entry.staffName}`, MARGIN, yPosition);
        yPosition += 7;
        
        pdf.setFontSize(12);
        pdf.setFont('helvetica', 'italic');
        pdf.setTextColor(102, 102, 102);
        pdf.text(`Shift: ${entry.shift}`, MARGIN + 5, yPosition);
        yPosition += 10;

        // Ratings section
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(51, 51, 51);
        const ratings = [
          { label: 'Attendance', value: entry.attendanceRating },
          { label: 'Duties Performance', value: entry.dutiesRating },
          { label: 'Uniform Compliance', value: entry.uniformRating },
          { label: 'Overall Presence', value: entry.presenceRating }
        ];

        ratings.forEach(rating => {
          pdf.text(`• ${rating.label}: `, MARGIN + 5, yPosition);
          pdf.setFont('helvetica', 'bold');
          pdf.text(rating.value, MARGIN + 45, yPosition);
          pdf.setFont('helvetica', 'normal');
          yPosition += 7;
        });

        yPosition += 10;

        // Check if we need a new page
        if (yPosition > A4_HEIGHT - MARGIN) {
          pdf.addPage();
          yPosition = MARGIN;
        }
      });
    }

    // Add description if it exists
    if (reportData.description) {
      if (yPosition > A4_HEIGHT - 60) {
        pdf.addPage();
        yPosition = MARGIN;
      }

      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(0, 51, 102);
      pdf.text('Description', MARGIN, yPosition);
      yPosition += 10;

      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(51, 51, 51);

      const descriptionLines = pdf.splitTextToSize(
        reportData.description,
        A4_WIDTH - (2 * MARGIN)
      );
      
      descriptionLines.forEach((line: string) => {
        if (yPosition > A4_HEIGHT - MARGIN) {
          pdf.addPage();
          yPosition = MARGIN;
        }
        pdf.text(line, MARGIN, yPosition);
        yPosition += 6;
      });
    }

    // Handle photo evidence if it exists
    if (reportData.photoUrl) {
      pdf.addPage();
      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(0, 51, 102);
      pdf.text('Photo Evidence', MARGIN, MARGIN);

      try {
        const img = new Image();
        await new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = reject;
          img.src = reportData.photoUrl;
        });

        const imgAspectRatio = img.width / img.height;
        let imgWidth = A4_WIDTH - (2 * MARGIN);
        let imgHeight = imgWidth / imgAspectRatio;

        if (imgHeight > A4_HEIGHT - (3 * MARGIN)) {
          imgHeight = A4_HEIGHT - (3 * MARGIN);
          imgWidth = imgHeight * imgAspectRatio;
        }

        const xPosition = (A4_WIDTH - imgWidth) / 2;
        
        pdf.addImage(
          reportData.photoUrl,
          'JPEG',
          xPosition,
          MARGIN + 15,
          imgWidth,
          imgHeight,
          undefined,
          'MEDIUM'
        );
      } catch (error) {
        console.error('Error adding image to PDF:', error);
        pdf.setTextColor(255, 0, 0);
        pdf.text('Error loading image', MARGIN, MARGIN + 20);
      }
    }

    // Add footer to all pages
    const pageCount = pdf.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      pdf.setPage(i);
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'italic');
      pdf.setTextColor(128, 128, 128);
      
      // Add page numbers
      pdf.text(`Page ${i} of ${pageCount}`, MARGIN, A4_HEIGHT - 15);
      
      // Add timestamp
      const timestamp = new Date().toLocaleString('en-US', {
        dateStyle: 'medium',
        timeStyle: 'short'
      });
      pdf.text(`Generated: ${timestamp}`, A4_WIDTH - MARGIN - 50, A4_HEIGHT - 15, { align: 'right' });
      
      // Add a line above the footer
      pdf.setDrawColor(200, 200, 200);
      pdf.setLineWidth(0.1);
      pdf.line(MARGIN, A4_HEIGHT - 20, A4_WIDTH - MARGIN, A4_HEIGHT - 20);
    }

    // Generate PDF file
    const pdfBlob = pdf.output('blob');
    const fileName = `${userId}/${reportType}_${reportId}.pdf`;

    console.log('Uploading PDF with filename:', fileName);

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('report_pdfs')
      .upload(fileName, pdfBlob, {
        contentType: 'application/pdf',
        upsert: true
      });

    if (uploadError) {
      console.error('Error uploading PDF:', uploadError);
      return null;
    }

    console.log('PDF uploaded successfully:', uploadData);

    // Get the public URL
    const { data: { publicUrl } } = supabase.storage
      .from('report_pdfs')
      .getPublicUrl(fileName);

    console.log('PDF generated and stored successfully:', publicUrl);
    return publicUrl;
  } catch (error) {
    console.error('Error generating PDF:', error);
    return null;
  }
}
