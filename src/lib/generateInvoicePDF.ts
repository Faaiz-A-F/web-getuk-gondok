import { jsPDF } from "jspdf";

// Store information
const STORE_INFO = {
  name: "Getuk Gondok Hj. Sri Rahayu",
  address: "Jl. Mataram No.9A, RejowinagunSel, Kec. MagelangSel, Kota Magelang",
  phone: "085643730540",
  website: "getukgondok.my.id",
  logoPath: "/logo/13.png",
};

interface OrderItem {
  id?: string;
  quantity: number;
  price: number;
  subtotal?: number;
  product: {
    name: string;
  };
}

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  totalAmount: number;
  shippingCost?: number;
  createdAt: string;
  user: {
    name: string;
    email: string;
  };
  items: OrderItem[];
  notes?: string;
}

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
};

const formatDate = (date: string): string => {
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  const hours = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");
  const seconds = String(d.getSeconds()).padStart(2, "0");
  return `${day}/${month}/${year} | ${hours}:${minutes}:${seconds}`;
};

const ADMIN_FEE = 2000; // Rp 2.000

type FontStyle = "normal" | "bold";

export const generateInvoicePDF = (order: Order): void => {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a5", // Small receipt size
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 10;

  let yPos = margin;

  // Helper function to add centered text
  const addCenteredText = (
    text: string,
    y: number,
    fontSize: number,
    fontStyle: FontStyle = "normal"
  ) => {
    doc.setFontSize(fontSize);
    doc.setFont("helvetica", fontStyle);
    const textWidth = doc.getTextWidth(text);
    doc.text(text, (pageWidth - textWidth) / 2, y);
  };

  // Helper function to add left-aligned text
  const addText = (
    text: string,
    x: number,
    y: number,
    fontSize: number,
    fontStyle: FontStyle = "normal"
  ) => {
    doc.setFontSize(fontSize);
    doc.setFont("helvetica", fontStyle);
    doc.text(text, x, y);
  };

  // Helper function to add a horizontal line
  const addLine = (startY: number) => {
    doc.setLineWidth(0.3);
    doc.line(margin, startY, pageWidth - margin, startY);
  };

  // Helper function to add dashed line
  const addDashedLine = (startY: number) => {
    doc.setLineWidth(0.2);
    doc.setDrawColor(150, 150, 150);
    const dashLength = 3;
    const gapLength = 2;
    let x = margin;
    while (x < pageWidth - margin) {
      doc.line(x, startY, Math.min(x + dashLength, pageWidth - margin), startY);
      x += dashLength + gapLength;
    }
    doc.setDrawColor(0, 0, 0);
  };

  // ========== HEADER SECTION ==========
  
  // Add logo at top center
  try {
    const logoSize = 25; // mm
    const logoX = (pageWidth - logoSize) / 2;
    doc.addImage(STORE_INFO.logoPath, "PNG", logoX, yPos, logoSize, logoSize);
    yPos += logoSize + 3;
  } catch (error) {
    console.error("Error adding logo:", error);
    yPos += 5;
  }

  // Store address
  addCenteredText(STORE_INFO.address, yPos, 7, "normal");
  yPos += 4;

  // Phone and website on same line
  const contactText = `${STORE_INFO.phone} | ${STORE_INFO.website}`;
  addCenteredText(contactText, yPos, 7, "normal");
  yPos += 6;

  // ========== ORDER DETAILS SECTION ==========
  addDashedLine(yPos);
  yPos += 5;

  // Order number
  addText("Order ID:", margin, yPos, 8, "bold");
  addText(`#${order.orderNumber}`, margin + 30, yPos, 8, "normal");
  yPos += 4;

  // Date
  addText("Tanggal:", margin, yPos, 8, "bold");
  addText(formatDate(order.createdAt), margin + 30, yPos, 8, "normal");
  yPos += 4;

  // Customer
  addText("Pelanggan:", margin, yPos, 8, "bold");
  addText(order.user.name, margin + 30, yPos, 8, "normal");
  yPos += 6;

  addDashedLine(yPos);
  yPos += 5;

  // ========== ITEMS TABLE HEADER ==========
  addText("Nama", margin, yPos, 8, "bold");
  addText("Qty", margin + 60, yPos, 8, "bold");
  addText("Harga", margin + 75, yPos, 8, "bold");
  yPos += 4;

  addLine(yPos);
  yPos += 4;

  // ========== ITEMS ==========
  let subtotal = 0;
  
  order.items.forEach((item) => {
    const itemSubtotal = Number(item.quantity) * Number(item.price);
    subtotal += itemSubtotal;

    // Item name (truncate if too long)
    let itemName = item.product.name;
    if (itemName.length > 25) {
      itemName = itemName.substring(0, 22) + "...";
    }
    addText(itemName, margin, yPos, 8, "normal");
    
    // Quantity
    addText(item.quantity.toString(), margin + 60, yPos, 8, "normal");
    
    // Price
    addText(formatCurrency(itemSubtotal), margin + 75, yPos, 8, "normal");
    
    yPos += 4;
  });

  // Notes section (if exists)
  if (order.notes && order.notes.trim() !== "") {
    yPos += 2;
    addText("Catatan:", margin, yPos, 7, "bold");
    yPos += 3;
    addText(order.notes, margin, yPos, 7, "normal");
    yPos += 4;
  }

  yPos += 2;
  addDashedLine(yPos);
  yPos += 5;

  // ========== SUMMARY SECTION ==========
  // Subtotal
  addText("Subtotal:", margin, yPos, 8, "normal");
  addText(formatCurrency(subtotal), margin + 75, yPos, 8, "normal");
  yPos += 4;

  // Admin Fee
  addText("Biaya Admin:", margin, yPos, 8, "normal");
  addText(formatCurrency(ADMIN_FEE), margin + 75, yPos, 8, "normal");
  yPos += 5;

  addLine(yPos);
  yPos += 4;

  // Total
  const total = subtotal + ADMIN_FEE;
  addText("TOTAL", margin, yPos, 10, "bold");
  addText(formatCurrency(total), margin + 75, yPos, 10, "bold");
  yPos += 6;

  addDashedLine(yPos);
  yPos += 8;

  // ========== FOOTER SECTION ==========
  // Thank you message
  addCenteredText(
    "Terima Kasih Telah Berbelanja Di",
    yPos,
    8,
    "normal"
  );
  yPos += 4;
  addCenteredText(STORE_INFO.name, yPos, 8, "bold");
  yPos += 6;

  // Website message
  addCenteredText(
    `Pesan anti ribet di ${STORE_INFO.website}`,
    yPos,
    7,
    "normal"
  );
  yPos += 6;

  // Direction arrows
  addCenteredText("<<<<>>>>", yPos, 10, "bold");

  // Save the PDF
  doc.save(`Struk-${order.orderNumber}.pdf`);
};

export const previewInvoicePDF = (order: Order): string => {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a5",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 10;
  let yPos = margin;

  const addCenteredText = (
    text: string,
    y: number,
    fontSize: number,
    fontStyle: "normal" | "bold" = "normal"
  ) => {
    doc.setFontSize(fontSize);
    doc.setFont("helvetica", fontStyle);
    const textWidth = doc.getTextWidth(text);
    doc.text(text, (pageWidth - textWidth) / 2, y);
  };

  const addText = (
    text: string,
    x: number,
    y: number,
    fontSize: number,
    fontStyle: "normal" | "bold" = "normal"
  ) => {
    doc.setFontSize(fontSize);
    doc.setFont("helvetica", fontStyle);
    doc.text(text, x, y);
  };

  const addLine = (startY: number) => {
    doc.setLineWidth(0.3);
    doc.line(margin, startY, pageWidth - margin, startY);
  };

  const addDashedLine = (startY: number) => {
    doc.setLineWidth(0.2);
    doc.setDrawColor(150, 150, 150);
    const dashLength = 3;
    const gapLength = 2;
    let x = margin;
    while (x < pageWidth - margin) {
      doc.line(x, startY, Math.min(x + dashLength, pageWidth - margin), startY);
      x += dashLength + gapLength;
    }
    doc.setDrawColor(0, 0, 0);
  };

  // Add logo at top center
  try {
    const logoSize = 25; // mm
    const logoX = (pageWidth - logoSize) / 2;
    doc.addImage(STORE_INFO.logoPath, "PNG", logoX, yPos, logoSize, logoSize);
    yPos += logoSize + 3;
  } catch (error) {
    console.error("Error adding logo:", error);
    yPos += 5;
  }

  addCenteredText(STORE_INFO.address, yPos, 7, "normal");
  yPos += 4;
  addCenteredText(`${STORE_INFO.phone} | ${STORE_INFO.website}`, yPos, 7, "normal");
  yPos += 6;

  addDashedLine(yPos);
  yPos += 5;

  addText("Order ID:", margin, yPos, 8, "bold");
  addText(`#${order.orderNumber}`, margin + 30, yPos, 8, "normal");
  yPos += 4;

  addText("Tanggal:", margin, yPos, 8, "bold");
  addText(formatDate(order.createdAt), margin + 30, yPos, 8, "normal");
  yPos += 4;

  addText("Pelanggan:", margin, yPos, 8, "bold");
  addText(order.user.name, margin + 30, yPos, 8, "normal");
  yPos += 6;

  addDashedLine(yPos);
  yPos += 5;

  addText("Nama", margin, yPos, 8, "bold");
  addText("Qty", margin + 60, yPos, 8, "bold");
  addText("Harga", margin + 75, yPos, 8, "bold");
  yPos += 4;

  addLine(yPos);
  yPos += 4;

  let subtotal = 0;
  order.items.forEach((item) => {
    const itemSubtotal = Number(item.quantity) * Number(item.price);
    subtotal += itemSubtotal;

    let itemName = item.product.name;
    if (itemName.length > 25) {
      itemName = itemName.substring(0, 22) + "...";
    }
    addText(itemName, margin, yPos, 8, "normal");
    addText(item.quantity.toString(), margin + 60, yPos, 8, "normal");
    addText(formatCurrency(itemSubtotal), margin + 75, yPos, 8, "normal");
    yPos += 4;
  });

  if (order.notes && order.notes.trim() !== "") {
    yPos += 2;
    addText("Catatan:", margin, yPos, 7, "bold");
    yPos += 3;
    addText(order.notes, margin, yPos, 7, "normal");
    yPos += 4;
  }

  yPos += 2;
  addDashedLine(yPos);
  yPos += 5;

  addText("Subtotal:", margin, yPos, 8, "normal");
  addText(formatCurrency(subtotal), margin + 75, yPos, 8, "normal");
  yPos += 4;

  addText("Biaya Admin:", margin, yPos, 8, "normal");
  addText(formatCurrency(ADMIN_FEE), margin + 75, yPos, 8, "normal");
  yPos += 5;

  addLine(yPos);
  yPos += 4;

  const total = subtotal + ADMIN_FEE;
  addText("TOTAL", margin, yPos, 10, "bold");
  addText(formatCurrency(total), margin + 75, yPos, 10, "bold");
  yPos += 6;

  addDashedLine(yPos);
  yPos += 8;

  addCenteredText("Terima Kasih Telah Berbelanja Di", yPos, 8, "normal");
  yPos += 4;
  addCenteredText(STORE_INFO.name, yPos, 8, "bold");
  yPos += 6;
  addCenteredText(`Pesan anti ribet di ${STORE_INFO.website}`, yPos, 7, "normal");
  yPos += 6;
  addCenteredText("<<<<>>>>", yPos, 10, "bold");

  // Return as data URL for preview
  return doc.output("datauristring");
};
