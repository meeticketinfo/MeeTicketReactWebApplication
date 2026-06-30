import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

// Simple flag to prevent multiple downloads
let isDownloadInProgress = false;

// Direct PDF download using html2canvas + jsPDF
export const downloadTicketAsPDF = async (filename = 'amrabad-ticket.pdf') => {
  // Prevent multiple simultaneous downloads
  if (isDownloadInProgress) {
    console.log('Download already in progress, skipping...');
    return false;
  }

  isDownloadInProgress = true;

  try {
    console.log('Starting PDF download...');

    // Get the ticket container
    const ticketElement = document.querySelector('.ticket-container');
    if (!ticketElement) {
      throw new Error('Ticket container not found');
    }

    // Hide download button temporarily
    const downloadButton = document.querySelector('.print-hide');
    if (downloadButton) {
      downloadButton.style.display = 'none';
    }

    // Wait a moment for the DOM to update
    await new Promise(resolve => setTimeout(resolve, 100));

    console.log('Capturing element as canvas...');

    // Capture the ticket as canvas with high quality
    const canvas = await html2canvas(ticketElement, {
      scale: 2, // High resolution
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      scrollX: 0,
      scrollY: 0,
      logging: false,
      width: ticketElement.scrollWidth,
      height: ticketElement.scrollHeight,
      windowWidth: ticketElement.scrollWidth,
      windowHeight: ticketElement.scrollHeight
    });

    console.log('Canvas captured, creating PDF...');

    // Create PDF
    const imgData = canvas.toDataURL('image/png', 1.0);
    
    // Calculate dimensions for A4
    const imgWidth = 210; // A4 width in mm
    const pageHeight = 297; // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    const pdf = new jsPDF({
      orientation: imgHeight > pageHeight ? 'portrait' : 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    let heightLeft = imgHeight;
    let position = 0;

    // Add first page
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight, '', 'FAST');
    heightLeft -= pageHeight;

    // Add additional pages if needed
    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight, '', 'FAST');
      heightLeft -= pageHeight;
    }

    console.log('PDF created, downloading...');

    // Automatically download the PDF
    pdf.save(filename);
    
    console.log('PDF downloaded successfully');

    // Restore download button
    setTimeout(() => {
      if (downloadButton) {
        downloadButton.style.display = 'flex';
      }
    }, 500);

    return true;

  } catch (error) {
    console.error('Error generating PDF:', error);
    return false;
  } finally {
    isDownloadInProgress = false;
  }
};

// Alternative method using text-based PDF generation
export const downloadTicketAsTextPDF = async (filename = 'amrabad-ticket.pdf') => {
  if (isDownloadInProgress) {
    return false;
  }

  isDownloadInProgress = true;

  try {
    console.log('Creating text-based PDF...');

    // Extract ticket data from DOM
    const ticketData = extractTicketData();
    
    // Create PDF
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    // Add content to PDF
    let yPosition = 20;
    const pageWidth = 210;
    const margin = 20;

    // Header - MEETICKET
    pdf.setFontSize(20);
    pdf.setFont(undefined, 'bold');
    pdf.text('MEETICKET', pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 8;
    
    pdf.setFontSize(12);
    pdf.setFont(undefined, 'normal');
    pdf.text('GOVERNMENT OF TELANGANA', pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 15;

    // Title - Your Ticket
    pdf.setFontSize(18);
    pdf.setFont(undefined, 'bold');
    pdf.setTextColor(52, 142, 32); // Green color
    pdf.text('Your Ticket', pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 15;

    // Package name
    pdf.setFontSize(14);
    pdf.setTextColor(0, 0, 0);
    pdf.text(ticketData.packageName || 'Package Name Not Available', pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 20;

    // Guest Details Section
    pdf.setFontSize(12);
    pdf.setFont(undefined, 'bold');
    pdf.text('Guest Details:', margin, yPosition);
    yPosition += 8;

    pdf.setFont(undefined, 'normal');
    pdf.text(`Guest Name: ${ticketData.guestName}`, margin, yPosition);
    yPosition += 6;
    pdf.text(`Mobile No: ${ticketData.mobile}`, margin, yPosition);
    yPosition += 6;
    pdf.text(`Email ID: ${ticketData.email}`, margin, yPosition);
    yPosition += 6;
    pdf.text(`Date: ${ticketData.bookingDate}`, margin, yPosition);
    yPosition += 6;
    pdf.text(`Ticket ID: #${ticketData.ticketId}`, margin, yPosition);
    yPosition += 15;

    // Package Details
    pdf.setFont(undefined, 'bold');
    pdf.text('Package Details:', margin, yPosition);
    yPosition += 8;
    
    pdf.setFont(undefined, 'normal');
    pdf.text(`Package: ${ticketData.packageName}`, margin, yPosition);
    yPosition += 6;
    pdf.text(`Payment Type: ${ticketData.paymentMode}`, margin, yPosition);
    yPosition += 15;

    // Booking Details
    pdf.setFont(undefined, 'bold');
    pdf.text('Booking Details:', margin, yPosition);
    yPosition += 10;

    pdf.setFont(undefined, 'normal');
    pdf.setFontSize(10);
    
    if (ticketData.bookingItems.length > 0) {
      ticketData.bookingItems.forEach((item, index) => {
        pdf.text(`${index + 1}. ${item.roomName || 'Cottage'} - Count: ${item.roomCount || '1'}`, margin, yPosition);
        yPosition += 5;
        pdf.text(`   Check-in: ${item.checkIn} | Check-out: ${item.checkOut}`, margin + 5, yPosition);
        yPosition += 5;
        pdf.text(`   Amount: ₹${item.amount ? item.amount.toLocaleString() : '0'}`, margin + 5, yPosition);
        yPosition += 8;
      });
    }

    // Grand Total
    yPosition += 5;
    pdf.setFont(undefined, 'bold');
    pdf.setFontSize(12);
    pdf.text(`Grand Total: ₹${ticketData.grandTotal}`, margin, yPosition);
    yPosition += 15;

    // Instructions
    pdf.setFont(undefined, 'bold');
    pdf.text('Visitor Instructions:', margin, yPosition);
    yPosition += 8;
    
    pdf.setFontSize(9);
    pdf.setFont(undefined, 'normal');
    const instructions = [
      '• Check-in is at 12:30 PM and check-out is by 10:00 AM the next day.',
      '• Valid Government ID proof is mandatory for all guests at check-in.',
      '• Evening Jungle Safari and morning forest trek are included in your package.',
      '• Alcohol, smoking, loud music, and plastic items are strictly prohibited.',
      '• Follow all safety instructions given by forest staff.'
    ];

    instructions.forEach(instruction => {
      const lines = pdf.splitTextToSize(instruction, 170);
      lines.forEach(line => {
        if (yPosition > 280) { // Near bottom of page
          pdf.addPage();
          yPosition = 20;
        }
        pdf.text(line, margin, yPosition);
        yPosition += 5;
      });
    });

    // Save the PDF
    pdf.save(filename);
    console.log('Text-based PDF downloaded successfully');

    return true;

  } catch (error) {
    console.error('Error creating text-based PDF:', error);
    return false;
  } finally {
    isDownloadInProgress = false;
  }
};

// Helper function to extract ticket data from DOM
const extractTicketData = () => {
  const container = document.querySelector('.ticket-container');
  
  // Extract package name
  let packageName = 'Package Name Not Available';
  const packageElement = container.querySelector('h3');
  if (packageElement) {
    packageName = packageElement.textContent.trim();
  }

  return {
    packageName,
    guestName: extractTextByLabel('GUEST NAME:') || 'Not Available',
    mobile: extractTextByLabel('MOBILE NO:') || 'Not Available',
    email: extractTextByLabel('EMAIL ID:') || 'Not Available',
    bookingDate: extractTextByLabel('DATE:') || 'Not Available',
    ticketId: extractTextByLabel('Ticket ID:')?.replace('#', '') || 'Not Available',
    paymentMode: extractTextByLabel('Payment Type:') || 'Not Available',
    bookingItems: extractBookingItems(),
    grandTotal: extractGrandTotal()
  };
};

const extractTextByLabel = (label) => {
  const container = document.querySelector('.ticket-container');
  const spans = container.querySelectorAll('span');
  
  for (let span of spans) {
    if (span.textContent.includes(label)) {
      let nextElement = span.nextElementSibling;
      if (nextElement && nextElement.tagName === 'SPAN') {
        return nextElement.textContent.trim();
      }
      
      const parent = span.parentElement;
      if (parent && parent.nextElementSibling) {
        const nextSpan = parent.nextElementSibling.querySelector('span');
        if (nextSpan) {
          return nextSpan.textContent.trim();
        }
      }
    }
  }
  return null;
};

const extractBookingItems = () => {
  const items = [];
  const tableRows = document.querySelectorAll('.ticket-container tbody tr');
  
  tableRows.forEach(row => {
    const cells = row.querySelectorAll('td');
    if (cells.length >= 6) {
      items.push({
        roomName: cells[1]?.textContent?.trim() || 'Cottage',
        roomCount: cells[2]?.textContent?.trim() || '1',
        checkIn: cells[3]?.textContent?.trim() || 'N/A',
        checkOut: cells[4]?.textContent?.trim() || 'N/A',
        amount: parseFloat(cells[7]?.textContent?.replace(/[₹,]/g, '')) || 0
      });
    }
  });
  
  return items;
};

const extractGrandTotal = () => {
  const container = document.querySelector('.ticket-container');
  const spans = container.querySelectorAll('span');
  
  for (let span of spans) {
    if (span.textContent.includes('Grand Total:')) {
      const nextSpan = span.nextElementSibling;
      if (nextSpan) {
        return nextSpan.textContent.replace(/[₹,]/g, '').trim();
      }
    }
  }
  
  // Fallback: calculate from table
  const tableRows = document.querySelectorAll('.ticket-container tbody tr');
  let total = 0;
  tableRows.forEach(row => {
    const cells = row.querySelectorAll('td');
    if (cells.length >= 8) {
      const amount = parseFloat(cells[7]?.textContent?.replace(/[₹,]/g, '')) || 0;
      total += amount;
    }
  });
  
  return total.toLocaleString();
};

// Main download function - tries canvas method first, then text method
export const downloadTicketReliable = async (filename = 'amrabad-ticket.pdf') => {
  try {
    console.log('Attempting canvas-based PDF download...');
    const canvasSuccess = await downloadTicketAsPDF(filename);
    
    if (canvasSuccess) {
      console.log('Canvas-based PDF download successful');
      return true;
    } else {
      console.log('Canvas method failed, trying text-based PDF...');
      const textSuccess = await downloadTicketAsTextPDF(filename);
      
      if (textSuccess) {
        console.log('Text-based PDF download successful');
        return true;
      } else {
        console.log('Both PDF methods failed');
        return false;
      }
    }
  } catch (error) {
    console.error('All PDF download methods failed:', error);
    return false;
  }
};

