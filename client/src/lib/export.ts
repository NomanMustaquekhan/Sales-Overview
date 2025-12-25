import jsPDF from "jspdf";
import * as XLSX from "xlsx";
import type { DashboardData } from "@shared/schema";

export function exportToPDF(data: DashboardData) {
  const doc = new jsPDF();
  let yPosition = 10;

  // Title
  doc.setFontSize(20);
  doc.text("Sales Overview Dashboard Report", 10, yPosition);
  yPosition += 15;

  // Date
  doc.setFontSize(10);
  doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 10, yPosition);
  yPosition += 10;

  // Regions Section
  doc.setFontSize(14);
  doc.text("Regional Summary", 10, yPosition);
  yPosition += 8;

  doc.setFontSize(10);
  const regionHeaders = ["Region", "Total Order", "Lumps", "Pellet", "Fines"];
  const regionData = data.regions.map((r) => [
    r.name,
    r.totalOrder.toFixed(2),
    r.lumps.toFixed(2),
    r.pellet.toFixed(2),
    r.fines.toFixed(2),
  ]);

  doc.autoTable({
    startY: yPosition,
    head: [regionHeaders],
    body: regionData,
    margin: 10,
  });

  yPosition = (doc as any).lastAutoTable.finalY + 10;

  // Mode Summaries Section
  doc.setFontSize(14);
  doc.text("Mode Summaries", 10, yPosition);
  yPosition += 8;

  const summaryHeaders = ["Category", "Under 21", "Over 21", "Short Close", "Total"];
  const summaryData = data.modeSummaries.map((s) => [
    s.category.toUpperCase(),
    s.under21.toFixed(2),
    s.over21.toFixed(2),
    s.shortClose.toFixed(2),
    s.total.toFixed(2),
  ]);

  doc.autoTable({
    startY: yPosition,
    head: [summaryHeaders],
    body: summaryData,
    margin: 10,
  });

  // Save PDF
  doc.save("sales-overview-report.pdf");
}

export function exportToExcel(data: DashboardData) {
  const workbook = XLSX.utils.book_new();

  // Regions sheet
  const regionsSheet = XLSX.utils.json_to_sheet(
    data.regions.map((r) => ({
      Region: r.name,
      "Total Order": r.totalOrder,
      Lumps: r.lumps,
      Pellet: r.pellet,
      Fines: r.fines,
      "Pellet 76": r.pellet76,
    }))
  );
  XLSX.utils.book_append_sheet(workbook, regionsSheet, "Regions");

  // Locations sheet
  const locationsSheet = XLSX.utils.json_to_sheet(
    data.locations.map((l) => ({
      Location: l.name,
      Region: l.regionKey,
      Distance: l.distance,
      Freight: l.freight,
      "Freight Rate": l.freightRate,
      Capacity: l.capacity,
      "Bal EXW": l.balExw,
      "Bal FOR": l.balFor,
      "Pellet 76": l.pellet76,
    }))
  );
  XLSX.utils.book_append_sheet(workbook, locationsSheet, "Locations");

  // Summaries sheet
  const summariesSheet = XLSX.utils.json_to_sheet(
    data.modeSummaries.map((s) => ({
      Category: s.category,
      "Under 21": s.under21,
      "Over 21": s.over21,
      "Short Close": s.shortClose,
      Total: s.total,
    }))
  );
  XLSX.utils.book_append_sheet(workbook, summariesSheet, "Summaries");

  // Save Excel
  XLSX.writeFile(workbook, "sales-overview-report.xlsx");
}
