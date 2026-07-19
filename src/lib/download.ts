import type { CoverData } from "./cover-types";

export async function captureCanvas(node: HTMLElement) {
  const html2canvas = (await import("html2canvas-pro")).default;
  return await html2canvas(node, {
    scale: 2,
    backgroundColor: null,
    useCORS: true,
    logging: false,
  });
}

function safeFile(data: CoverData) {
  const base = (data.assignmentTitle || data.subject || "cover").trim().replace(/[^\w\-]+/g, "_").slice(0, 60);
  return `${base || "cover"}_${data.studentName?.replace(/[^\w\-]+/g, "_").slice(0, 30) || "student"}`;
}

export async function downloadPng(node: HTMLElement, data: CoverData) {
  const canvas = await captureCanvas(node);
  const url = canvas.toDataURL("image/png");
  const a = document.createElement("a");
  a.href = url;
  a.download = `${safeFile(data)}.png`;
  a.click();
}

export async function downloadPdf(node: HTMLElement, data: CoverData) {
  const canvas = await captureCanvas(node);
  const imgData = canvas.toDataURL("image/jpeg", 0.95);
  const { jsPDF } = await import("jspdf");
  const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const w = pdf.internal.pageSize.getWidth();
  const h = pdf.internal.pageSize.getHeight();
  pdf.addImage(imgData, "JPEG", 0, 0, w, h);
  pdf.save(`${safeFile(data)}.pdf`);
}