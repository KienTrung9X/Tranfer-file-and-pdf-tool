import React, { useState, useCallback } from 'react';
import { PdfService } from '../services/pdfService';
import { Link } from 'react-router-dom';

export const RotatePdf: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type === 'application/pdf') {
      setFile(droppedFile);
      setError(null);
    } else {
      setError('Vui lòng chọn file PDF.');
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type === 'application/pdf') {
        setFile(selectedFile);
        setError(null);
      } else {
        setError('Vui lòng chọn file PDF.');
      }
    }
  };

  const handleRotate = async (angle: number) => {
    if (!file) return;

    setIsProcessing(true);
    setError(null);

    try {
      await PdfService.rotatePdf(file, angle);
    } catch (err: any) {
      setError(err.message || 'Đã xảy ra lỗi khi xoay file.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex-1 w-full max-w-4xl mx-auto px-4 py-8">
      <Link to="/pdf-tools" className="inline-flex items-center text-gray-500 hover:text-primary mb-6 transition-colors">
        <span className="material-symbols-outlined mr-1">arrow_back</span> Quay lại
      </Link>

      <div className="bg-white dark:bg-surface-dark rounded-xl shadow-sm border border-gray-200 dark:border-border-dark p-6 sm:p-10">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Xoay file PDF</h1>
          <p className="text-gray-500 dark:text-gray-400">Xoay tất cả các trang trong file PDF của bạn.</p>
        </div>

        {!file ? (
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-10 cursor-pointer hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
          >
            <span className="material-symbols-outlined text-5xl text-gray-400 mb-4">upload_file</span>
            <p className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">Kéo thả file PDF vào đây</p>
            <p className="text-sm text-gray-500 mb-6">hoặc</p>
            <label className="btn-primary cursor-pointer bg-primary hover:bg-primary-hover text-white px-6 py-2 rounded-lg font-bold transition-colors">
              Chọn file
              <input type="file" accept="application/pdf" className="hidden" onChange={handleFileChange} />
            </label>
            {error && <p className="mt-4 text-red-500 text-sm">{error}</p>}
          </div>
        ) : (
          <div className="flex flex-col gap-8">
            <div className="flex items-center justify-between bg-gray-50 dark:bg-background-dark p-4 rounded-lg border border-gray-200 dark:border-border-dark">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-red-500 text-3xl">picture_as_pdf</span>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{file.name}</p>
                  <p className="text-sm text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
              </div>
              <button onClick={() => { setFile(null); setError(null); }} className="text-gray-400 hover:text-red-500">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                onClick={() => handleRotate(-90)}
                disabled={isProcessing}
                className="flex flex-col items-center justify-center p-6 border border-gray-200 dark:border-border-dark rounded-xl hover:border-primary dark:hover:border-primary hover:bg-gray-50 dark:hover:bg-white/5 transition-all group"
              >
                <span className="material-symbols-outlined text-4xl text-gray-600 dark:text-gray-300 group-hover:text-primary mb-2">rotate_left</span>
                <span className="font-medium text-gray-900 dark:text-white">Xoay Trái 90°</span>
              </button>

              <button
                onClick={() => handleRotate(90)}
                disabled={isProcessing}
                className="flex flex-col items-center justify-center p-6 border border-gray-200 dark:border-border-dark rounded-xl hover:border-primary dark:hover:border-primary hover:bg-gray-50 dark:hover:bg-white/5 transition-all group"
              >
                <span className="material-symbols-outlined text-4xl text-gray-600 dark:text-gray-300 group-hover:text-primary mb-2">rotate_right</span>
                <span className="font-medium text-gray-900 dark:text-white">Xoay Phải 90°</span>
              </button>
            </div>

            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            {isProcessing && <p className="text-primary text-sm text-center font-medium animate-pulse">Đang xử lý file...</p>}
          </div>
        )}
      </div>
    </div>
  );
};
