
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
    
    // Set up document styling
    pdf.setFont('helvetica');
    
    // Add header with title
    pdf.setFontSize(24);
    pdf.setTextColor(44, 62, 80);
    const title = reportType.replace(/_/g, ' ').toUpperCase();
    pdf.text(title, MARGIN, 30);
    
    // Add date
    pdf.setFontSize(12);
    pdf.setTextColor(127, 140, 141);
    const date = new Date().toLocaleDateString();
    pdf.text(`Date: ${date}`, MARGIN, 40);
    
    // Add horizontal line
    pdf.setDrawColor(189, 195, 199);
    pdf.line(MARGIN, 45, A4_WIDTH - MARGIN, 45);
    
    // Add report content
    pdf.setFontSize(12);
    pdf.setTextColor(52, 73, 94);
    let yPosition = 60;

    // Handle staff entries if they exist
    if (reportData.staffEntries && reportData.staffEntries.length > 0) {
      pdf.setFont('helvetica', 'bold');
      pdf.text('Staff Evaluations:', MARGIN, yPosition);
      yPosition += 10;
      pdf.setFont('helvetica', 'normal');

      reportData.staffEntries.forEach((entry: any) => {
        // Add staff entry details
        pdf.text(`Staff Name: ${entry.staffName}`, MARGIN, yPosition);
        yPosition += 6;
        pdf.text(`Shift: ${entry.shift}`, MARGIN, yPosition);
        yPosition += 6;
        pdf.text(`Ratings:`, MARGIN, yPosition);
        yPosition += 6;
        pdf.text(`• Attendance: ${entry.attendanceRating}`, MARGIN + 5, yPosition);
        yPosition += 6;
        pdf.text(`• Duties: ${entry.dutiesRating}`, MARGIN + 5, yPosition);
        yPosition += 6;
        pdf.text(`• Uniform: ${entry.uniformRating}`, MARGIN + 5, yPosition);
        yPosition += 6;
        pdf.text(`• Presence: ${entry.presenceRating}`, MARGIN + 5, yPosition);
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
      pdf.setFont('helvetica', 'bold');
      pdf.text('Description:', MARGIN, yPosition);
      yPosition += 8;
      pdf.setFont('helvetica', 'normal');

      // Split description into lines that fit the page width
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
      // Always start photo on a new page
      pdf.addPage();
      pdf.setFont('helvetica', 'bold');
      pdf.text('Photo Evidence:', MARGIN, MARGIN);

      try {
        // Create an Image element to load the photo
        const img = new Image();
        await new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = reject;
          img.src = reportData.photoUrl;
        });

        // Calculate dimensions to fit A4 while maintaining aspect ratio
        const imgAspectRatio = img.width / img.height;
        let imgWidth = A4_WIDTH - (2 * MARGIN);
        let imgHeight = imgWidth / imgAspectRatio;

        // If height exceeds page height, scale down
        if (imgHeight > A4_HEIGHT - (3 * MARGIN)) {
          imgHeight = A4_HEIGHT - (3 * MARGIN);
          imgWidth = imgHeight * imgAspectRatio;
        }

        // Center the image horizontally
        const xPosition = (A4_WIDTH - imgWidth) / 2;
        
        pdf.addImage(
          reportData.photoUrl,
          'JPEG',
          xPosition,
          MARGIN + 10,
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

    // Add vehicle-specific content if it exists
    if (reportType === 'vehicle_handover') {
      // Handle vehicle details
      if (reportData.carImages && reportData.carImages.length > 0) {
        reportData.carImages.forEach((imageUrl: string) => {
          pdf.addPage();
          pdf.setFont('helvetica', 'bold');
          pdf.text('Vehicle Photo:', MARGIN, MARGIN);
          
          try {
            const img = new Image();
            img.src = imageUrl;
            
            const imgAspectRatio = img.width / img.height;
            let imgWidth = A4_WIDTH - (2 * MARGIN);
            let imgHeight = imgWidth / imgAspectRatio;

            if (imgHeight > A4_HEIGHT - (3 * MARGIN)) {
              imgHeight = A4_HEIGHT - (3 * MARGIN);
              imgWidth = imgHeight * imgAspectRatio;
            }

            const xPosition = (A4_WIDTH - imgWidth) / 2;
            
            pdf.addImage(
              imageUrl,
              'JPEG',
              xPosition,
              MARGIN + 10,
              imgWidth,
              imgHeight,
              undefined,
              'MEDIUM'
            );
          } catch (error) {
            console.error('Error adding vehicle image to PDF:', error);
            pdf.setTextColor(255, 0, 0);
            pdf.text('Error loading vehicle image', MARGIN, MARGIN + 20);
          }
        });
      }
    }

    // Add footer to all pages
    const pageCount = pdf.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      pdf.setPage(i);
      pdf.setFontSize(10);
      pdf.setTextColor(127, 140, 141);
      pdf.text(`Page ${i} of ${pageCount}`, MARGIN, 290);
      const timestamp = new Date().toLocaleString();
      pdf.text(`Generated on: ${timestamp}`, 105, 290, { align: 'center' });
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

    // Store reference in report_files table
    const { error: dbError } = await supabase
      .from('report_files')
      .insert({
        user_id: userId,
        report_type: reportType,
        file_name: fileName.split('/').pop() || '',
        file_path: fileName,
        report_id: reportId
      });

    if (dbError) {
      console.error('Error storing PDF reference:', dbError);
      return null;
    }

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
