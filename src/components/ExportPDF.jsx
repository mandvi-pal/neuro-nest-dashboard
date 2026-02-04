import { jsPDF } from "jspdf";

function ExportPDF({ child, results }) {
  const handleExport = () => {
    const doc = new jsPDF();
    const lineHeight = 10;
    let y = 20;

    // --- 🎨 PDF Styling Helpers ---
    const addLine = (yPos) => {
      doc.setDrawColor(200, 200, 200);
      doc.line(20, yPos, 190, yPos);
    };

    // --- 🧠 Header ---
    doc.setFillColor(52, 152, 219); // Blue Header
    doc.rect(0, 0, 210, 40, 'F');
    
    doc.setFont("helvetica", "bold");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.text("NeuroNest Screening Report", 20, 25);
    
    y = 50;
    doc.setTextColor(0, 0, 0);

    // --- 👶 Child Info Section ---
    doc.setFontSize(14);
    doc.text("Child Information", 20, y);
    y += 5;
    addLine(y);
    y += 10;

    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text("Name:", 20, y);
    doc.setFont("helvetica", "normal");
    doc.text(`${child?.name || "N/A"}`, 45, y); 
    
    doc.setFont("helvetica", "bold");
    doc.text("Age:", 110, y);
    doc.setFont("helvetica", "normal");
    // Screenshot mein age_months null tha, isliye hum || check use kar rahe hain
    doc.text(`${child?.age_months || child?.age || "N/A"} months`, 125, y); 
    y += lineHeight;

    doc.setFont("helvetica", "bold");
    doc.text("Gender:", 20, y);
    doc.setFont("helvetica", "normal");
    doc.text(`${child?.gender || "N/A"}`, 45, y);
    y += 15;

    // --- 📊 Screening Results Section ---
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Assessment Results", 20, y);
    y += 5;
    addLine(y);
    y += 10;

    // Results array hai ya object, uska check
    const resultsArray = Array.isArray(results) ? results : (results ? [results] : []);

    if (resultsArray.length === 0 || !resultsArray[0]) {
      doc.setFont("helvetica", "italic");
      doc.text("No screening results available yet.", 25, y);
      y += lineHeight;
    } else {
      resultsArray.forEach((r, i) => {
        if (!r) return; // Skip if null
        
        doc.setFont("helvetica", "bold");
        doc.setFontSize(12);
        doc.text(`Test ${i + 1}: ${r.game || "General Assessment"}`, 25, y);
        y += lineHeight;

        doc.setFont("helvetica", "normal");
        doc.setFontSize(11);

        // Dynamic fields check
        if (r.motor !== undefined) {
          doc.text(`• Motor Skills: ${r.motor}`, 30, y); y += lineHeight;
        }
        if (r.language !== undefined) {
          doc.text(`• Language Skills: ${r.language}`, 30, y); y += lineHeight;
        }
        if (r.score !== undefined) {
          doc.text(`• Performance Score: ${r.score}`, 30, y); y += lineHeight;
        }

        // Recommendation Box
        doc.setDrawColor(52, 152, 219);
        doc.setLineWidth(0.5);
        doc.rect(25, y - 2, 160, 15);
        doc.setFont("helvetica", "bold");
        doc.text(`Recommendation:`, 30, y + 8);
        doc.setFont("helvetica", "normal");
        doc.text(`${r.recommendation || "Continue regular monitoring"}`, 65, y + 8);
        
        y += 25; // Space for next result
      });
    }

    // --- 📅 Footer ---
    const now = new Date().toLocaleString();
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    addLine(275);
    doc.text(`Generated on: ${now} | NeuroNest AI Systems`, 20, 282);

    // 💾 Save with proper name
    const fileName = child?.name ? `${child.name}_Report.pdf` : "Screening_Report.pdf";
    doc.save(fileName);
  };

  return (
    <button
      onClick={handleExport}
      className="export-pdf-btn"
      style={{
        marginTop: '1rem',
        padding: '0.8rem 1.5rem',
        backgroundColor: '#2ecc71', // Green color for success/export
        color: '#fff',
        border: 'none',
        borderRadius: '8px',
        fontWeight: 'bold',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}
    >
      <span>📄</span> Export Professional Report
    </button>
  );
}

export default ExportPDF;