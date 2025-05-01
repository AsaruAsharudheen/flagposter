import React, { useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import './poster.css';

const Poster = () => {
  const [uploadedImage, setUploadedImage] = useState(null);
  const textRef = useRef(null);
  const posterRef = useRef(null);

  const handleImageChange = e => {
    const file = e.target.files[0];
    if (file) {
      setUploadedImage(URL.createObjectURL(file));
    }
  };

  const handleDownloadImage = () => {
    if (!posterRef.current) return;

    const posterElement = posterRef.current;
    const { width, height } = posterElement.getBoundingClientRect();

    html2canvas(posterElement, {
      useCORS: true,
      allowTaint: false,
      scale: 8, // HIGH resolution for sharp output
      width: width,
      height: height,
      backgroundColor: null,
    }).then(canvas => {
      const link = document.createElement('a');
      link.download = 'poster.png';
      link.href = canvas.toDataURL('image/png', 1.0); // Max quality
      link.click();
    });
  };

  const handleDownloadPDF = () => {
    if (!posterRef.current) return;

    html2canvas(posterRef.current, {
      useCORS: true,
      allowTaint: false,
      scale: 2,
    }).then(canvas => {
      const imgData = canvas.toDataURL('image/png');

      const pdf = new jsPDF('portrait', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      // Image size in pixels
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;

      // Convert pixel dimensions to mm (approx. 1px = 0.264583 mm)
      const pxToMm = 0.264583;
      const imgMmWidth = imgWidth * pxToMm;
      const imgMmHeight = imgHeight * pxToMm;

      // Calculate scaled dimensions to fit A4
      const scale = Math.min(pdfWidth / imgMmWidth, pdfHeight / imgMmHeight);
      const finalWidth = imgMmWidth * scale;
      const finalHeight = imgMmHeight * scale;

      // Center the image
      const marginX = (pdfWidth - finalWidth) / 2;
      const marginY = (pdfHeight - finalHeight) / 2;

      pdf.addImage(imgData, 'PNG', marginX, marginY, finalWidth, finalHeight);
      pdf.save('poster.pdf');
    });
  };

  return (
    <div className="poster-container">
      <div className="poster-wrapper" ref={posterRef}>
        {/* Background Poster */}
        <img src="/new.png" alt="Poster Background" className="poster-bg" />

        {/* Uploaded Image Layer */}
        {uploadedImage && (
          <img src={uploadedImage} alt="Uploaded" className="image-layer" />
        )}

        {/* Upload Area */}
        {!uploadedImage && (
          <label className="upload-area">
            <span className="upload-text">Click to upload image</span>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              hidden
            />
          </label>
        )}

        {/* Editable Text */}
        <p
          className="custom-text"
          contentEditable
          suppressContentEditableWarning
          ref={textRef}
        ></p>
      </div>

      {/* Buttons */}
      <button className="download-button" onClick={handleDownloadImage}>
        Download as Image
      </button>
      <button className="download-button" onClick={handleDownloadPDF}>
        Download as PDF
      </button>
    </div>
  );
};

export default Poster;
