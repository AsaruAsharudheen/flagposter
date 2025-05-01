import React, { useRef, useState } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import './poster.css';

const Poster = () => {
  const [uploadedImage, setUploadedImage] = useState(null);
  const posterRef = useRef(null);

  const handleImageChange = e => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setUploadedImage(imageUrl);
    }
  };

  const downloadImage = async type => {
    if (!posterRef.current) return;

    // Wait until all images are loaded
    await Promise.all(
      Array.from(posterRef.current.querySelectorAll('img')).map(img => {
        if (img.complete) return Promise.resolve();
        return new Promise(res => {
          img.onload = res;
          img.onerror = res;
        });
      })
    );

    const canvas = await html2canvas(posterRef.current, {
      useCORS: true,
      backgroundColor: null,
      scale: 3, // High resolution
    });

    const image = canvas.toDataURL('image/png');

    if (type === 'png') {
      const link = document.createElement('a');
      link.href = image;
      link.download = 'poster.png';
      link.click();
    } else if (type === 'pdf') {
      const pdf = new jsPDF('portrait', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      const pxToMm = 0.264583;
      const imgMmWidth = canvas.width * pxToMm;
      const imgMmHeight = canvas.height * pxToMm;

      const scale = Math.min(pdfWidth / imgMmWidth, pdfHeight / imgMmHeight);
      const finalWidth = imgMmWidth * scale;
      const finalHeight = imgMmHeight * scale;
      const marginX = (pdfWidth - finalWidth) / 2;
      const marginY = (pdfHeight - finalHeight) / 2;

      pdf.addImage(image, 'PNG', marginX, marginY, finalWidth, finalHeight);
      pdf.save('poster.pdf');
    }
  };

  return (
    <div className="poster-container">
      <div className="poster-wrapper" ref={posterRef}>
        <img
          src="/new.png"
          alt="Poster Background"
          className="poster-bg"
          crossOrigin="anonymous"
        />
        {uploadedImage && (
          <img
            src={uploadedImage}
            alt="Uploaded"
            className="image-layer"
            crossOrigin="anonymous"
          />
        )}
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
        <p
          className="custom-text"
          contentEditable
          suppressContentEditableWarning
        ></p>
      </div>

      <button className="download-button" onClick={() => downloadImage('png')}>
        Download as PNG
      </button>

      <button className="download-button" onClick={() => downloadImage('pdf')}>
        Download as PDF
      </button>
    </div>
  );
};

export default Poster;
