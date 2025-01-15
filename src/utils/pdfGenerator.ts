import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
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
          pdf.text(`  ${subKey}: ${subValue}`, 30, yPosition);
          yPosition += 10;
        });
      } else {
        pdf.text(`${key}: ${value}`, 20, yPosition);
        yPosition += 10;
      }
    });

    // Generate PDF file
    const pdfBlob = pdf.output('blob');
    const fileName = `${userId}/${reportType}_${reportId}.pdf`;

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

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('report_pdfs')
      .getPublicUrl(fileName);

    // Store reference in report_files table
    const { error: dbError } = await supabase
      .from('report_files')
      .insert({
        user_id: userId,
        report_type: reportType,
        file_name: fileName.split('/').pop(),
        file_path: fileName,
        report_id: reportType !== 'vehicle_handover' ? reportId : null,
        vehicle_report_id: reportType === 'vehicle_handover' ? reportId : null,
      });

    if (dbError) {
      console.error('Error storing PDF reference:', dbError);
      return null;
    }

    console.log('PDF generated and stored successfully:', publicUrl);
    return publicUrl;
  } catch (error) {
    console.error('Error generating PDF:', error);
    return null;
  }
}