
import jsPDF from 'jspdf';
import { supabase } from '@/integrations/supabase/client';

const A4_WIDTH = 210;
const A4_HEIGHT = 297;
const MARGIN = 20;
const INCHES_TO_MM = 25.4;
const IMAGE_SIZE = 4 * INCHES_TO_MM; // 4 inches converted to mm

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
    
    // Header section
    pdf.setFontSize(28);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(0, 51, 102);
    const title = reportType.replace(/_/g, ' ').toUpperCase();
    pdf.text(title, MARGIN, 30, { align: 'left' });
    
    // Report metadata
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(102, 102, 102);
    const date = new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    pdf.text(`Report ID: ${reportId}`, MARGIN, 45);
    pdf.text(`Date: ${date}`, MARGIN, 52);
    
    // Decorative line
    pdf.setDrawColor(0, 51, 102);
    pdf.setLineWidth(0.5);
    pdf.line(MARGIN, 60, A4_WIDTH - MARGIN, 60);
    
    let yPosition = 75;

    // Handle different report types with consistent formatting
    switch (reportType) {
      case 'supervisor_weekly':
      case 'manager_monthly':
        yPosition = addStaffEntries(pdf, reportData, yPosition);
        break;
      case 'event_incident':
        yPosition = addIncidentDetails(pdf, reportData, yPosition);
        break;
      case 'vehicle_handover':
        yPosition = addVehicleDetails(pdf, reportData, yPosition);
        break;
    }

    // Add description section if it exists
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

    // Add images on new pages with consistent 4x4 inch size
    if (reportType === 'vehicle_handover' && reportData.car_images) {
      for (const imageUrl of reportData.car_images) {
        await addImageToNewPage(pdf, imageUrl, 'Vehicle Photo');
      }
      if (reportData.mileage_image) {
        await addImageToNewPage(pdf, reportData.mileage_image, 'Mileage Photo');
      }
      if (reportData.receiver_id_image) {
        await addImageToNewPage(pdf, reportData.receiver_id_image, 'Receiver ID');
      }
      if (reportData.driving_license_image) {
        await addImageToNewPage(pdf, reportData.driving_license_image, 'Driving License');
      }
    } else if (reportData.photoUrl) {
      await addImageToNewPage(pdf, reportData.photoUrl, 'Photo Evidence');
    }

    // Add footer to all pages
    const pageCount = pdf.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      pdf.setPage(i);
      addFooter(pdf, i, pageCount);
    }

    // Generate and upload PDF
    const pdfBlob = pdf.output('blob');
    const fileName = `${userId}/${reportType}_${reportId}.pdf`;

    console.log('Uploading PDF with filename:', fileName);

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

    const { data: { publicUrl } } = supabase.storage
      .from('report_pdfs')
      .getPublicUrl(fileName);

    return publicUrl;
  } catch (error) {
    console.error('Error generating PDF:', error);
    return null;
  }
}

function addStaffEntries(pdf: jsPDF, reportData: any, startY: number): number {
  let yPosition = startY;
  
  if (reportData.staffEntries?.length > 0) {
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(0, 51, 102);
    pdf.text('Staff Evaluations', MARGIN, yPosition);
    yPosition += 12;

    reportData.staffEntries.forEach((entry: any, index: number) => {
      if (yPosition > A4_HEIGHT - 60) {
        pdf.addPage();
        yPosition = MARGIN;
      }

      // Staff member header
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(51, 51, 51);
      pdf.text(`Staff Member ${index + 1}`, MARGIN, yPosition);
      yPosition += 8;

      // Staff details
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'normal');
      const details = [
        { label: 'Name', value: entry.staff_name },
        { label: 'Shift', value: entry.shift },
        { label: 'Attendance', value: entry.attendance_rating },
        { label: 'Duties Performance', value: entry.duties_rating },
        { label: 'Uniform Compliance', value: entry.uniform_rating },
        { label: 'Overall Presence', value: entry.presence_rating }
      ];

      details.forEach(({ label, value }) => {
        pdf.text(`${label}: ${value || 'N/A'}`, MARGIN + 5, yPosition);
        yPosition += 6;
      });

      yPosition += 10;
    });
  }
  
  return yPosition;
}

function addIncidentDetails(pdf: jsPDF, reportData: any, startY: number): number {
  let yPosition = startY;

  pdf.setFontSize(16);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(0, 51, 102);
  pdf.text('Incident Details', MARGIN, yPosition);
  yPosition += 12;

  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(51, 51, 51);

  const details = [
    { label: 'Staff Name', value: reportData.staff_name },
    { label: 'Shift', value: reportData.shift },
    { label: 'Location', value: reportData.location },
    { label: 'Incident Date', value: reportData.incident_date },
    { label: 'Reporting Time', value: reportData.reporting_time },
    { label: 'Action Taken', value: reportData.action_taken },
    { label: 'Reporting Person', value: reportData.reporting_person }
  ];

  details.forEach(({ label, value }) => {
    if (yPosition > A4_HEIGHT - MARGIN) {
      pdf.addPage();
      yPosition = MARGIN;
    }
    pdf.text(`${label}: ${value || 'N/A'}`, MARGIN, yPosition);
    yPosition += 8;
  });

  return yPosition;
}

function addVehicleDetails(pdf: jsPDF, reportData: any, startY: number): number {
  let yPosition = startY;

  pdf.setFontSize(16);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(0, 51, 102);
  pdf.text('Vehicle Information', MARGIN, yPosition);
  yPosition += 12;

  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(51, 51, 51);

  const details = [
    { label: 'Car Model', value: reportData.car_model },
    { label: 'Plate Number', value: reportData.plate_number },
    { label: 'Mileage', value: reportData.mileage },
    { label: 'Project', value: reportData.project },
    { label: 'Condition', value: reportData.condition }
  ];

  details.forEach(({ label, value }) => {
    if (yPosition > A4_HEIGHT - MARGIN) {
      pdf.addPage();
      yPosition = MARGIN;
    }
    pdf.text(`${label}: ${value || 'N/A'}`, MARGIN, yPosition);
    yPosition += 8;
  });

  return yPosition;
}

async function addImageToNewPage(pdf: jsPDF, imageUrl: string, title: string): Promise<void> {
  try {
    pdf.addPage();
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(0, 51, 102);
    pdf.text(title, MARGIN, MARGIN);

    const img = new Image();
    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = reject;
      img.src = imageUrl;
    });

    // Calculate center position for 4x4 inch image
    const xPosition = (A4_WIDTH - IMAGE_SIZE) / 2;
    const yPosition = (A4_HEIGHT - IMAGE_SIZE) / 2;
    
    pdf.addImage(
      imageUrl,
      'JPEG',
      xPosition,
      yPosition,
      IMAGE_SIZE,
      IMAGE_SIZE,
      undefined,
      'MEDIUM'
    );
  } catch (error) {
    console.error('Error adding image to PDF:', error);
    pdf.setTextColor(255, 0, 0);
    pdf.text('Error loading image', MARGIN, MARGIN + 20);
  }
}

function addFooter(pdf: jsPDF, currentPage: number, totalPages: number): void {
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'italic');
  pdf.setTextColor(128, 128, 128);
  
  // Add page numbers
  pdf.text(`Page ${currentPage} of ${totalPages}`, MARGIN, A4_HEIGHT - 15);
  
  // Add timestamp
  const timestamp = new Date().toLocaleString('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short'
  });
  pdf.text(`Generated: ${timestamp}`, A4_WIDTH - MARGIN - 50, A4_HEIGHT - 15, { align: 'right' });
  
  // Add line above footer
  pdf.setDrawColor(200, 200, 200);
  pdf.setLineWidth(0.1);
  pdf.line(MARGIN, A4_HEIGHT - 20, A4_WIDTH - MARGIN, A4_HEIGHT - 20);
}
