import jsPDF from 'jspdf';
import { format } from 'date-fns';

interface FlightSegment {
  departure: {
    iataCode: string;
    terminal?: string;
    at: string;
  };
  arrival: {
    iataCode: string;
    terminal?: string;
    at: string;
  };
  carrierCode: string;
  number: string;
}

interface Flight {
  id: string;
  itineraries: Array<{
    segments: FlightSegment[];
  }>;
  price: {
    total: string;
    currency: string;
  };
}

export const generateTicketPDF = (flight: Flight, passengerName: string) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 10; 
  const leftPadding = 40; 
  

  const centerText = (text: string, y: number) => {
    const textWidth = doc.getStringUnitWidth(text) * doc.getFontSize() / doc.internal.scaleFactor;
    const x = (pageWidth - textWidth) / 2;
    doc.text(text, x, y);
  };

  doc.setDrawColor(0, 105, 255); 
  doc.setLineWidth(0.5);
  doc.roundedRect(margin, margin, pageWidth - 2 * margin, pageHeight - 2 * margin, 5, 5);

  doc.setDrawColor(0, 105, 255);
  doc.setLineWidth(0.3);
  doc.line(margin, 35, pageWidth - margin, 35);

  doc.setLineDashPattern([1, 1], 0);
  doc.line(margin, pageHeight - 30, pageWidth - margin, pageHeight - 30);
  doc.setLineDashPattern([], 0);

  doc.setFontSize(24);
  doc.setTextColor(0, 105, 255);
  centerText('SkyRoute', 25);
  
  doc.setFontSize(12);
  doc.setTextColor(130, 130, 130);
  centerText('BOARDING PASS', 32);

  // Add passenger name
  doc.setFontSize(10);
  doc.setTextColor(130, 130, 130);
  doc.text('PASSENGER:', leftPadding, 45);
  doc.setTextColor(0);
  doc.setFontSize(12);
  doc.text(passengerName, leftPadding + 25, 45);

  // Move booking reference down
  doc.setFontSize(10);
  doc.setTextColor(130, 130, 130);
  doc.text('BOOKING REF:', leftPadding, 55);
  doc.setTextColor(0);
  doc.setFontSize(12);
  doc.text(flight.id, leftPadding + 25, 55);

  let yPosition = 70;

  flight.itineraries[0].segments.forEach((segment, index) => {
    doc.setFontSize(10);
    doc.setTextColor(130, 130, 130);
    doc.text('FLIGHT', leftPadding, yPosition);
    doc.setTextColor(0);
    doc.setFontSize(12);
    doc.text(`${segment.carrierCode} ${segment.number}`, leftPadding + 30, yPosition);

    yPosition += 12;

    const lineStartX = leftPadding + 40;
    const lineEndX = pageWidth - margin - 40;
    const lineY = yPosition + 8;
    
    doc.setDrawColor(0, 105, 255);
    doc.setLineWidth(0.3);
    doc.setLineDashPattern([3, 3], 0);
    doc.line(lineStartX, lineY, lineEndX, lineY);
    doc.setLineDashPattern([], 0);
    
    const planeX = (pageWidth / 2);
    doc.setFillColor(0, 105, 255);
    doc.circle(planeX, lineY, 2, 'F');

    // Departure
    doc.setFontSize(24);
    doc.setTextColor(0);
    doc.text(segment.departure.iataCode, leftPadding, yPosition + 5);
    doc.setFontSize(10);
    doc.setTextColor(130, 130, 130);
    doc.text(format(new Date(segment.departure.at), 'HH:mm'), leftPadding, yPosition + 15);
    doc.text(format(new Date(segment.departure.at), 'MMM d, yyyy'), leftPadding, yPosition + 20);
    if (segment.departure.terminal) {
      doc.text(`Terminal ${segment.departure.terminal}`, leftPadding, yPosition + 25);
    }

    // Arrival
    doc.setFontSize(24);
    doc.setTextColor(0);
    doc.text(segment.arrival.iataCode, pageWidth - margin - 70, yPosition + 5);
    doc.setFontSize(10);
    doc.setTextColor(130, 130, 130);
    doc.text(format(new Date(segment.arrival.at), 'HH:mm'), pageWidth - margin - 70, yPosition + 15);
    doc.text(format(new Date(segment.arrival.at), 'MMM d, yyyy'), pageWidth - margin - 70, yPosition + 20);
    if (segment.arrival.terminal) {
      doc.text(`Terminal ${segment.arrival.terminal}`, pageWidth - margin - 70, yPosition + 25);
    }

    yPosition += 35;

    // Adding layover information if there's another segment
    if (index < flight.itineraries[0].segments.length - 1) {
      const nextSegment = flight.itineraries[0].segments[index + 1];
      const layoverDuration = Math.round(
        (new Date(nextSegment.departure.at).getTime() -
          new Date(segment.arrival.at).getTime()) /
          (1000 * 60)
      );
      
      doc.setFillColor(240, 240, 240);
      const layoverY = yPosition - 5;
      doc.roundedRect(leftPadding, layoverY, pageWidth - leftPadding - margin - 30, 15, 3, 3, 'F');
      
      doc.setFontSize(10);
      doc.setTextColor(130, 130, 130);
      doc.text(`${layoverDuration} minute layover at ${segment.arrival.iataCode} Airport`, leftPadding + 10, layoverY + 10);
      
      yPosition += 20;
    }
  });

  doc.setFontSize(9);
  doc.setTextColor(130, 130, 130);
  centerText('Thank you for choosing SkyRoute', pageHeight - 20);
  centerText('Keep this ticket handy for your journey', pageHeight - 15);

  // Download the PDF with passenger name in the filename
  const safePassengerName = passengerName.replace(/[^a-z0-9]/gi, '-').toLowerCase();
  doc.save(`skyroute-ticket-${safePassengerName}-${flight.id}.pdf`);
}; 