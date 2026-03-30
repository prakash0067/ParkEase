import { jsPDF } from "jspdf";
import QRCode from 'qrcode';

export const generateReceiptPDF = async (receiptData) => {
    const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: [80, 150] // Sleek "Ticket" size
    });

    const qrCodeDataUrl = await QRCode.toDataURL(`https://etherscan.io/tx/${receiptData.hash}`);

    // --- Background & Styling ---
    doc.setFillColor(10, 14, 23); // Dark Cyberpunk Blue
    doc.rect(0, 0, 80, 150, 'F');
    
    // Header Line
    doc.setDrawColor(59, 130, 246); // Neon Blue
    doc.setLineWidth(1);
    doc.line(5, 15, 75, 15);

    // --- Content ---
    doc.setTextColor(255, 255, 255);
    doc.setFont("courier", "bold");
    doc.setFontSize(16);
    doc.text("PARKEASE", 40, 10, { align: "center" });

    doc.setFontSize(10);
    doc.setTextColor(150, 150, 150);
    doc.text("DIGITAL PARKING RECEIPT", 40, 22, { align: "center" });

    // Details Grid
    doc.setTextColor(59, 130, 246);
    doc.text("LICENSE PLATE:", 10, 35);
    doc.setTextColor(255, 255, 255);
    doc.text(`${receiptData.plate}`, 10, 40);

    doc.setTextColor(59, 130, 246);
    doc.text("SLOT ASSIGNED:", 10, 50);
    doc.setTextColor(255, 255, 255);
    doc.text(`#${receiptData.slotId}`, 10, 55);

    doc.setTextColor(59, 130, 246);
    doc.text("FEE PAID:", 10, 65);
    doc.setTextColor(0, 230, 118); // Neon Green
    doc.text(`${receiptData.fee} ETH`, 10, 70);

    doc.setTextColor(59, 130, 246);
    doc.text("DATE/TIME:", 10, 80);
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(8);
    doc.text(`${receiptData.date}`, 10, 85);

    // QR Code
    doc.addImage(qrCodeDataUrl, 'PNG', 20, 95, 40, 40);
    
    doc.setFontSize(7);
    doc.setTextColor(100, 100, 100);
    doc.text("SCAN TO VERIFY ON BLOCKCHAIN", 40, 140, { align: "center" });

    // Save PDF
    doc.save(`ParkEase_Receipt_${receiptData.slotId}.pdf`);
};