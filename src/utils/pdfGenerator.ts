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
    
    // Add report header
    pdf.setFontSize(20);
    pdf.text(reportType.replace(/_/g, ' ').toUpperCase(), 20, 20);
    
    // Add report content
    pdf.setFontSize(12);
    let yPosition = 40;
    
    Object.entries(reportData).forEach(([key, value]) => {
      if (typeof value === 'object') {
        pdf.text(`${key}:`, 20, yPosition);
        yPosition += 10;
        Object.entries(value as object).forEach(([subKey, subValue]) => {
          pdf.text(`  ${subKey}: ${String(subValue)}`, 30, yPosition);
          yPosition += 10;
        });
      } else {
        pdf.text(`${key}: ${String(value)}`, 20, yPosition);
        yPosition += 10;
      }
    });

    // Generate PDF file
    const pdfBlob = pdf.output('blob');
    const fileName = `${reportType}_${reportId}.pdf`;

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

    // Store reference in report_files table
    const { error: dbError } = await supabase
      .from('report_files')
      .insert({
        user_id: userId,
        report_type: reportType,
        file_name: fileName,
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