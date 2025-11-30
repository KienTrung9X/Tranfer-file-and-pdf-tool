import React, { useState, useCallback } from 'react';
import { PdfService } from '../services/pdfService';
import { Link } from 'react-router-dom';

export const SplitPdf: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [pageRange, setPageRange] = useState('');
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

  const handleSplit = async () => {
    if (!file || !pageRange) return;

    setIsProcessing(true);
    setError(null);

    try {
      await PdfService.splitPdf(file, pageRange);
    } catch (err: any) {
      setError(err.message || 'Đã xảy ra lỗi khi tách file.');
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
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Tách file PDF</h1>
          <p className="text-gray-500 dark:text-gray-400">Chọn trang bạn muốn trích xuất từ file PDF của bạn.</p>
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
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between bg-gray-50 dark:bg-background-dark p-4 rounded-lg border border-gray-200 dark:border-border-dark">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-red-500 text-3xl">picture_as_pdf</span>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{file.name}</p>
                  <p className="text-sm text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
              </div>
              <button onClick={() => { setFile(null); setPageRange(''); setError(null); }} className="text-gray-400 hover:text-red-500">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Nhập số trang cần tách (Ví dụ: 1, 3, 5-10)
              </label>
              <input
                type="text"
                value={pageRange}
                onChange={(e) => setPageRange(e.target.value)}
                placeholder="VD: 1,3,5-7"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-border-dark bg-white dark:bg-background-dark text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
              />
              <p className="text-xs text-gray-500">Nhập các trang bạn muốn giữ lại trong file mới.</p>
            </div>

            {error && <p className="text-red-500 text-sm text-center">{error}</p>}

            <button
              onClick={handleSplit}
              disabled={!pageRange || isProcessing}
              className={`w-full py-3 rounded-lg font-bold text-white transition-all flex items-center justify-center gap-2
                ${!pageRange || isProcessing ? 'bg-gray-400 cursor-not-allowed' : 'bg-primary hover:bg-primary-hover shadow-lg shadow-primary/30'}
              `}
            >
              {isProcessing ? (
                <>
                  <span className="material-symbols-outlined animate-spin">progress_activity</span>
                  Đang xử lý...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined">cut</span>
                  Tách File PDF
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
