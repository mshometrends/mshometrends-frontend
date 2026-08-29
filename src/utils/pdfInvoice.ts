import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Order } from '../types';
import { STORE_PHONE_DISPLAY, STORE_PHONE_RAW, getStoreWhatsAppNumber } from './whatsapp';

/**
 * Generates an official luxury PDF invoice for MS Home Trends
 */
export const generateOrderPDF = (order: Order): jsPDF => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth(); // 210mm
  const pageHeight = doc.internal.pageSize.getHeight(); // 297mm
  const margin = 14;

  // Colors
  const darkEmerald = [10, 56, 37]; // #0A3825
  const gold = [212, 175, 55]; // #D4AF37
  const softBg = [250, 249, 246]; // #FAF9F6
  const charcoal = [30, 41, 59]; // slate-800
  const lightGray = [241, 245, 249]; // slate-100
  const darkGreen = [6, 78, 59]; // emerald-900

  // 1. Luxury Header Banner
  doc.setFillColor(darkEmerald[0], darkEmerald[1], darkEmerald[2]);
  doc.rect(0, 0, pageWidth, 38, 'F');

  // Gold accent line under header
  doc.setFillColor(gold[0], gold[1], gold[2]);
  doc.rect(0, 38, pageWidth, 2.5, 'F');

  // Brand Name & Tagline
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.text('MS HOME TRENDS', margin, 18);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(212, 175, 55); // Gold
  doc.text('LUXURY CROCKERY & FINE HOUSEHOLD LIVING', margin, 24);

  doc.setFontSize(7.5);
  doc.setTextColor(220, 235, 225);
  doc.text(`Official WhatsApp: ${STORE_PHONE_DISPLAY} | Web: mshometrends.com`, margin, 31);

  // Top Right: OFFICIAL BILL / INVOICE badge
  doc.setFillColor(212, 175, 55);
  doc.roundedRect(pageWidth - margin - 52, 10, 52, 20, 2, 2, 'F');

  doc.setTextColor(10, 56, 37);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('OFFICIAL INVOICE', pageWidth - margin - 26, 17, { align: 'center' });

  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.text(`BILL #${order.invoiceNumber || 'INV-' + order.orderId}`, pageWidth - margin - 26, 25, {
    align: 'center',
  });

  // Current Y offset
  let currentY = 47;

  // 2. Order Metadata & Customer Information Grid
  // Left Box: Customer Details
  const colWidth = (pageWidth - margin * 2 - 6) / 2;

  // Customer Box Background
  doc.setFillColor(lightGray[0], lightGray[1], lightGray[2]);
  doc.roundedRect(margin, currentY, colWidth, 42, 2, 2, 'F');
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, currentY, colWidth, 42, 2, 2, 'S');

  // Customer Box Title
  doc.setFillColor(darkEmerald[0], darkEmerald[1], darkEmerald[2]);
  doc.roundedRect(margin, currentY, colWidth, 7, 2, 2, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text('BILLED & DELIVERED TO', margin + 4, currentY + 5);

  doc.setTextColor(charcoal[0], charcoal[1], charcoal[2]);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.text(order.customer?.fullName || 'Valued Customer', margin + 4, currentY + 13);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text(`Phone: ${order.customer?.phone || 'N/A'}`, margin + 4, currentY + 19);
  doc.text(`WhatsApp: ${order.customer?.whatsappNumber || order.customer?.phone || 'N/A'}`, margin + 4, currentY + 24);

  const fullAddress = `${order.customer?.address || ''}, ${order.customer?.city || ''} ${order.customer?.postalCode || ''}`.trim();
  const splitAddress = doc.splitTextToSize(`Address: ${fullAddress}`, colWidth - 8);
  doc.text(splitAddress, margin + 4, currentY + 29);

  // Right Box: Order & Payment Info
  const rightBoxX = margin + colWidth + 6;
  doc.setFillColor(lightGray[0], lightGray[1], lightGray[2]);
  doc.roundedRect(rightBoxX, currentY, colWidth, 42, 2, 2, 'F');
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(rightBoxX, currentY, colWidth, 42, 2, 2, 'S');

  // Right Box Title
  doc.setFillColor(darkEmerald[0], darkEmerald[1], darkEmerald[2]);
  doc.roundedRect(rightBoxX, currentY, colWidth, 7, 2, 2, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text('ORDER & PAYMENT DETAILS', rightBoxX + 4, currentY + 5);

  const orderDate = order.createdAt
    ? new Date(order.createdAt).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
    : new Date().toLocaleDateString('en-GB');

  doc.setTextColor(charcoal[0], charcoal[1], charcoal[2]);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.text('Order ID:', rightBoxX + 4, currentY + 14);
  doc.setTextColor(10, 56, 37);
  doc.text(order.orderId, rightBoxX + 28, currentY + 14);

  doc.setTextColor(charcoal[0], charcoal[1], charcoal[2]);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text('Date:', rightBoxX + 4, currentY + 20);
  doc.text(orderDate, rightBoxX + 28, currentY + 20);

  doc.text('Payment:', rightBoxX + 4, currentY + 26);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(10, 56, 37);
  const paymentMethod = order.payment?.method || 'Easypaisa';
  doc.text(paymentMethod, rightBoxX + 28, currentY + 26);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(charcoal[0], charcoal[1], charcoal[2]);
  doc.text('Status:', rightBoxX + 4, currentY + 32);
  const payStatus = order.payment?.status || 'Pending';
  doc.setFont('helvetica', 'bold');
  if (payStatus === 'Paid') {
    doc.setTextColor(16, 185, 129); // emerald
  } else {
    doc.setTextColor(217, 119, 6); // amber-600
  }
  doc.text(payStatus, rightBoxX + 28, currentY + 32);

  currentY += 48;

  // 3. Payment Instructions Strip (EasyPaisa / COD)
  const isEasypaisa = (order.payment?.method || '').toLowerCase().includes('easy') || (order.payment?.method || '').toLowerCase().includes('ep') || true;

  if (isEasypaisa) {
    doc.setFillColor(236, 253, 245); // emerald-50
    doc.roundedRect(margin, currentY, pageWidth - margin * 2, 14, 2, 2, 'F');
    doc.setDrawColor(167, 243, 208);
    doc.roundedRect(margin, currentY, pageWidth - margin * 2, 14, 2, 2, 'S');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(6, 78, 59); // emerald-900
    doc.text('EASYPAISA PAYMENT ACCOUNT:', margin + 4, currentY + 5.5);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(180, 83, 9); // amber-700
    doc.text('0324 2303895', margin + 64, currentY + 5.5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(6, 78, 59);
    doc.text('(Title: MS Home Trends) — Transfer bill amount & send screenshot to WhatsApp +92 324 2303895', margin + 92, currentY + 5.5);

    doc.setFontSize(7);
    doc.setTextColor(100, 116, 139);
    doc.text('Instant verification on WhatsApp within 15 minutes. 100% Insured & Breakage Protection Guarantee.', margin + 4, currentY + 10.5);

    currentY += 18;
  }

  // 4. Products Table
  const tableRows = (order.items || []).map((item, index) => {
    const unitPrice = Number(item.price) || 0;
    const qty = Number(item.quantity) || 1;
    const subtotal = Number(item.subtotal) || unitPrice * qty;
    return [
      String(index + 1),
      item.name || 'Luxury Dinnerware Product',
      String(qty),
      `Rs. ${unitPrice.toLocaleString('en-PK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      `Rs. ${subtotal.toLocaleString('en-PK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
    ];
  });

  autoTable(doc, {
    startY: currentY,
    head: [['#', 'Item Description', 'Qty', 'Unit Price', 'Total Amount']],
    body: tableRows,
    margin: { left: margin, right: margin },
    theme: 'plain',
    headStyles: {
      fillColor: [10, 56, 37],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 8.5,
      halign: 'left',
      cellPadding: 3,
    },
    styles: {
      fontSize: 8,
      cellPadding: 3,
      textColor: [30, 41, 59],
      lineColor: [226, 232, 240],
      lineWidth: 0.1,
    },
    columnStyles: {
      0: { halign: 'center', cellWidth: 10 },
      1: { halign: 'left' },
      2: { halign: 'center', cellWidth: 16 },
      3: { halign: 'right', cellWidth: 32 },
      4: { halign: 'right', cellWidth: 36, fontStyle: 'bold' },
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252],
    },
  });

  // Calculate position after table
  const finalTableY = (doc as any).lastAutoTable?.finalY || currentY + 50;
  currentY = finalTableY + 4;

  // 5. Pricing Summary Box (Right aligned)
  const subtotalAmount = Number(order.pricing?.subtotal ?? order.subtotalAmount ?? (order as any).subtotal ?? 0);
  const deliveryFee = Number(order.pricing?.deliveryCharges ?? order.shippingFee ?? (order as any).shipping ?? 0);
  const discountAmount = Number(order.pricing?.discount ?? order.discountAmount ?? 0);
  const grandTotal = Number(order.pricing?.total ?? order.totalAmount ?? (order as any).total ?? subtotalAmount + deliveryFee - discountAmount);

  const summaryWidth = 78;
  const summaryX = pageWidth - margin - summaryWidth;

  doc.setFillColor(lightGray[0], lightGray[1], lightGray[2]);
  doc.roundedRect(summaryX, currentY, summaryWidth, 36, 2, 2, 'F');
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(summaryX, currentY, summaryWidth, 36, 2, 2, 'S');

  // Subtotal row
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(charcoal[0], charcoal[1], charcoal[2]);
  doc.text('Subtotal:', summaryX + 4, currentY + 6);
  doc.text(`Rs. ${subtotalAmount.toLocaleString('en-PK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, summaryX + summaryWidth - 4, currentY + 6, { align: 'right' });

  // Delivery Charges row
  doc.text('Courier & Delivery:', summaryX + 4, currentY + 12);
  doc.text(`Rs. ${deliveryFee.toLocaleString('en-PK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, summaryX + summaryWidth - 4, currentY + 12, { align: 'right' });

  // Discount row (if any)
  if (discountAmount > 0) {
    doc.setTextColor(16, 185, 129);
    doc.text('Discount Applied:', summaryX + 4, currentY + 18);
    doc.text(`-Rs. ${discountAmount.toLocaleString('en-PK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, summaryX + summaryWidth - 4, currentY + 18, { align: 'right' });
  }

  // Grand Total Banner
  doc.setFillColor(darkEmerald[0], darkEmerald[1], darkEmerald[2]);
  doc.roundedRect(summaryX, currentY + 22, summaryWidth, 14, 2, 2, 'F');

  doc.setTextColor(212, 175, 55); // Gold
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.text('GRAND TOTAL BILL:', summaryX + 4, currentY + 30.5);

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(11);
  doc.text(`Rs. ${grandTotal.toLocaleString('en-PK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, summaryX + summaryWidth - 4, currentY + 30.5, { align: 'right' });

  // 6. Left side Barcode & Order Verification representation
  const barcodeX = margin;
  const barcodeY = currentY;
  const barcodeWidth = colWidth;

  doc.setFillColor(softBg[0], softBg[1], softBg[2]);
  doc.roundedRect(barcodeX, barcodeY, barcodeWidth, 36, 2, 2, 'F');
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(barcodeX, barcodeY, barcodeWidth, 36, 2, 2, 'S');

  // Draw simulated crisp vector barcode lines for Order ID
  const barStartY = barcodeY + 6;
  const barHeight = 15;
  const barStartX = barcodeX + 12;
  const idStr = `${order.orderId || 'MSHT'}`.toUpperCase();

  doc.setFillColor(15, 23, 42);
  let curBarX = barStartX;
  for (let i = 0; i < idStr.length; i++) {
    const charCode = idStr.charCodeAt(i);
    const pattern = (charCode % 5) + 1;
    doc.rect(curBarX, barStartY, 0.8, barHeight, 'F');
    curBarX += 1.4;
    if (pattern % 2 === 0) {
      doc.rect(curBarX, barStartY, 1.6, barHeight, 'F');
      curBarX += 2.4;
    }
    doc.rect(curBarX, barStartY, 0.6, barHeight, 'F');
    curBarX += 1.6;
  }
  // End guards
  doc.rect(curBarX, barStartY, 1.2, barHeight, 'F');
  curBarX += 2;
  doc.rect(curBarX, barStartY, 0.8, barHeight, 'F');

  // Barcode Number Label
  doc.setFont('courier', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(30, 41, 59);
  doc.text(`* ${order.orderId} *`, barcodeX + barcodeWidth / 2, barcodeY + 26, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(100, 116, 139);
  doc.text('OFFICIAL VERIFIED ORDER BARCODE', barcodeX + barcodeWidth / 2, barcodeY + 31, { align: 'center' });

  // 7. Footer & Security Seal
  const footerY = pageHeight - 22;
  doc.setDrawColor(212, 175, 55);
  doc.setLineWidth(0.5);
  doc.line(margin, footerY, pageWidth - margin, footerY);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(10, 56, 37);
  doc.text('MS HOME TRENDS — PAKISTAN’S PREMIER LUXURY TABLEWARE', margin, footerY + 5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(100, 116, 139);
  doc.text('Guaranteed Safe Delivery • 100% Insured Against Breakage in Transit', margin, footerY + 9);
  doc.text(`Customer Support / WhatsApp: ${STORE_PHONE_DISPLAY} | Email: info@mshometrends.com`, margin, footerY + 13);

  // Verification stamp badge right aligned
  doc.setFillColor(236, 253, 245);
  doc.roundedRect(pageWidth - margin - 42, footerY + 3, 42, 12, 1.5, 1.5, 'F');
  doc.setDrawColor(16, 185, 129);
  doc.roundedRect(pageWidth - margin - 42, footerY + 3, 42, 12, 1.5, 1.5, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.5);
  doc.setTextColor(6, 78, 59);
  doc.text('VERIFIED BILL', pageWidth - margin - 21, footerY + 7.5, { align: 'center' });
  doc.setFontSize(5.5);
  doc.setTextColor(16, 185, 129);
  doc.text('INSURED & PROTECTED', pageWidth - margin - 21, footerY + 11.5, { align: 'center' });

  return doc;
};

/**
 * Downloads the official PDF Invoice directly to the user's device
 */
export const downloadOrderPDF = (order: Order, fileName?: string): void => {
  try {
    const doc = generateOrderPDF(order);
    const safeName = fileName || `MS-Home-Trends-Bill-${order.orderId || 'Order'}.pdf`;
    doc.save(safeName);
  } catch (err) {
    console.error('[PDF Generation Error]', err);
    // Fallback print
    if (typeof window !== 'undefined') {
      window.print();
    }
  }
};

/**
 * Builds a complete self-contained WhatsApp invoice text message with all bill details
 */
export const buildComprehensiveWhatsAppMessage = (order: Order): string => {
  const customerName = order.customer?.fullName || 'Customer';
  const orderId = order.orderId;
  const phone = order.customer?.phone || order.customer?.whatsappNumber || 'N/A';
  const city = order.customer?.city || 'Pakistan';
  const address = order.customer?.address || '';
  const payMethod = order.payment?.method || 'Easypaisa';
  const isEasypaisa = payMethod.toLowerCase().includes('easy') || payMethod.toLowerCase().includes('ep');

  const subtotal = Number(order.pricing?.subtotal ?? order.subtotalAmount ?? (order as any).subtotal ?? 0);
  const deliveryFee = Number(order.pricing?.deliveryCharges ?? order.shippingFee ?? (order as any).shipping ?? 0);
  const discount = Number(order.pricing?.discount ?? order.discountAmount ?? 0);
  const grandTotal = Number(order.pricing?.total ?? order.totalAmount ?? (order as any).total ?? subtotal + deliveryFee - discount);

  const itemsList = (order.items || [])
    .map((item, idx) => `  ${idx + 1}. *${item.name}* (Qty: ${item.quantity || 1}) - Rs. ${(Number(item.subtotal || ((item.price || 0) * (item.quantity || 1)))).toLocaleString('en-PK')}`)
    .join('\n');

  const lines = [
    `*🏛️ MS HOME TRENDS - OFFICIAL ORDER BILL*`,
    `━━━━━━━━━━━━━━━━━━━━━━━━━━`,
    `📋 *Order ID:* \`${orderId}\``,
    `🧾 *Invoice #:* \`${order.invoiceNumber || 'INV-' + orderId}\``,
    `👤 *Customer:* ${customerName}`,
    `📞 *Phone/WhatsApp:* ${phone}`,
    `📍 *Delivery City & Address:* ${city} - ${address}`,
    `━━━━━━━━━━━━━━━━━━━━━━━━━━`,
    `📦 *ITEMS ORDERED:*`,
    itemsList || `  1. Luxury Crockery Set - Rs. ${grandTotal.toLocaleString('en-PK')}`,
    `━━━━━━━━━━━━━━━━━━━━━━━━━━`,
    `💰 *BILL & PRICING BREAKDOWN:*`,
    `• Subtotal: Rs. ${subtotal.toLocaleString('en-PK')}`,
    `• Delivery & Courier Charges: Rs. ${deliveryFee.toLocaleString('en-PK')}`,
    discount > 0 ? `• Discount: -Rs. ${discount.toLocaleString('en-PK')}` : null,
    `✨ *TOTAL PAYABLE BILL: Rs. ${grandTotal.toLocaleString('en-PK')}*`,
    `━━━━━━━━━━━━━━━━━━━━━━━━━━`,
    isEasypaisa
      ? `💳 *PAYMENT METHOD: EasyPaisa*\n• Account Title: *MS Home Trends*\n• EasyPaisa Number: *0324 2303895*\n\n📸 *Action Required:* Please find my EasyPaisa payment transfer screenshot attached with this message for instant verification.`
      : `💳 *PAYMENT METHOD: Cash on Delivery (COD)*\n• Payment will be handed to the courier partner upon delivery.`,
    `━━━━━━━━━━━━━━━━━━━━━━━━━━`,
    `✅ *100% Insured & Breakage Protected Delivery*`,
    `Thank you for shopping with MS Home Trends!`,
  ].filter(Boolean);

  return lines.join('\n');
};

/**
 * Opens WhatsApp chat directly to official number (+92 324 2303895) with comprehensive order invoice breakdown
 */
export const shareOrOpenWhatsAppWithPDF = (order: Order): void => {
  const storePhone = getStoreWhatsAppNumber(); // 923242303895
  const textMessage = buildComprehensiveWhatsAppMessage(order);

  // Directly open WhatsApp chat to official number +92 324 2303895 with complete invoice text
  const whatsappUrl = `https://wa.me/${storePhone}?text=${encodeURIComponent(textMessage)}`;
  if (typeof window !== 'undefined') {
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  }
};
