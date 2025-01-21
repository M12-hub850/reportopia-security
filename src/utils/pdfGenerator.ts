import jsPDF from 'jspdf';
import { supabase } from '@/integrations/supabase/client';

export async function generateReportPDF(
  reportData: any,
  reportType: string,
  reportId: string,
  userId: string
): Promise<string | null> {
  try {
    console.log('Generating PDF for report:', reportId);
    const pdf = new jsPDF();
    
    // Set up document styling
    pdf.setFont('helvetica');
    
    // Add header with logo and title
    pdf.setFontSize(24);
    pdf.setTextColor(44, 62, 80); // Dark blue color
    const title = reportType.replace(/_/g, ' ').toUpperCase();
    pdf.text(title, 20, 30);
    
    // Add date
    pdf.setFontSize(12);
    pdf.setTextColor(127, 140, 141); // Gray color
    const date = new Date().toLocaleDateString();
    pdf.text(`Date: ${date}`, 20, 40);
    
    // Add horizontal line
    pdf.setDrawColor(189, 195, 199);
    pdf.line(20, 45, 190, 45);
    
    // Add report content
    pdf.setFontSize(12);
    pdf.setTextColor(52, 73, 94);
    let yPosition = 60;
    
    Object.entries(reportData).forEach(([key, value]) => {
      // Skip null or undefined values
      if (value === null || value === undefined) return;
      
      // Format the key for better readability
      const formattedKey = key
        .replace(/([A-Z])/g, ' $1')
        .replace(/_/g, ' ')
        .replace(/^\w/, c => c.toUpperCase());
      
      if (typeof value === 'object') {
        // Handle nested objects
        pdf.setFont('helvetica', 'bold');
        pdf.text(`${formattedKey}:`, 20, yPosition);
        yPosition += 8;
        pdf.setFont('helvetica', 'normal');
        
        Object.entries(value as object).forEach(([subKey, subValue]) => {
          // Skip null, undefined, or empty values
          if (subValue === null || subValue === undefined || subValue === '') return;
          
          const formattedSubKey = subKey
            .replace(/([A-Z])/g, ' $1')
            .replace(/_/g, ' ')
            .replace(/^\w/, c => c.toUpperCase());
          
          // Format boolean values
          const displayValue = typeof subValue === 'boolean' 
            ? (subValue ? 'Yes' : 'No')
            : String(subValue);
          
          // Add bullet point for nested items
          pdf.text(`• ${formattedSubKey}: ${displayValue}`, 30, yPosition);
          yPosition += 8;
        });
        yPosition += 4; // Add extra space after nested objects
      } else {
        // Handle simple key-value pairs
        pdf.setFont('helvetica', 'bold');
        const displayValue = typeof value === 'boolean'
          ? (value ? 'Yes' : 'No')
          : String(value);
        pdf.text(`${formattedKey}:`, 20, yPosition);
        pdf.setFont('helvetica', 'normal');
        pdf.text(displayValue, 80, yPosition);
        yPosition += 8;
      }
      
      // Add a new page if we're running out of space
      if (yPosition > 270) {
        pdf.addPage();
        yPosition = 20;
      }
    });
    
    // Add footer
    const pageCount = pdf.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      pdf.setPage(i);
      pdf.setFontSize(10);
      pdf.setTextColor(127, 140, 141);
      pdf.text(`Page ${i} of ${pageCount}`, 20, 290);
      const timestamp = new Date().toLocaleString();
      pdf.text(`Generated on: ${timestamp}`, 105, 290, { align: 'center' });
    }

    // Generate PDF file
    const pdfBlob = pdf.output('blob');
    const fileName = `${userId}/${reportType}_${reportId}.pdf`;

    console.log('Uploading PDF with filename:', fileName);

    // Upload to Supabase Storage with user-specific folder
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