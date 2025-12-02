import React, { useCallback, useState, useEffect } from 'react';
import { ShareService } from '../services/shareService';

export const Upload: React.FC = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [sessionCode, setSessionCode] = useState('');
  const [showCopyFeedback, setShowCopyFeedback] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [currentFileName, setCurrentFileName] = useState('');

  // Remove auto-generation of session code

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  }, []);

  const handleFiles = async (files: File[]) => {
    setIsUploading(true);
    setUploadProgress(0);
    
    try {
      const newFiles = [...uploadedFiles, ...files];
      
      // Upload with progress tracking
      const shareId = await ShareService.shareFiles(newFiles, {
        onProgress: (progress: number, fileName: string) => {
          setUploadProgress(progress);
          setCurrentFileName(fileName);
        }
      });
      
      setUploadedFiles(newFiles);
      setSessionCode(shareId);
      setUploadProgress(100);
      
      setTimeout(() => {
        setIsUploading(false);
        setUploadProgress(0);
        setCurrentFileName('');
      }, 1000);
    } catch (error) {
      console.error('Error sharing files:', error);
      setIsUploading(false);
      setUploadProgress(0);
      setCurrentFileName('');
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      handleFiles(files);
    }
  };

  const copyToClipboard = () => {
    if (sessionCode) {
      navigator.clipboard.writeText(sessionCode);
      setShowCopyFeedback(true);
      setTimeout(() => setShowCopyFeedback(false), 2000);
    }
  };

  // Generate QR code URL only when there are files
  const downloadUrl = sessionCode && uploadedFiles.length > 0 ? `${window.location.origin}/#/download/${sessionCode}` : '';
  const qrUrl = downloadUrl 
    ? `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(downloadUrl)}&color=000000&bgcolor=ffffff`
    : '';

  return (
    <div className="flex-1 px-4 py-8 sm:py-12 md:py-16 w-full max-w-7xl mx-auto">
      <div className="flex flex-col items-center gap-8 lg:gap-12">
        
        <div className="flex w-full flex-col gap-2 text-center lg:text-left">
          <h1 className="text-3xl font-black text-gray-900 dark:text-white sm:text-4xl md:text-5xl">
            Gửi file từ máy tính của bạn
          </h1>
          <p className="text-base text-gray-500 dark:text-gray-400 sm:text-lg">
            Dễ dàng chuyển file giữa máy tính và thiết bị di động.
          </p>
        </div>

        <div className="grid w-full grid-cols-1 gap-8 lg:grid-cols-5 lg:gap-10">
          
          {/* Upload Area */}
          <div className="flex flex-col rounded-xl border border-gray-200 bg-white dark:border-white/10 dark:bg-white/5 lg:col-span-3">
            <div className="flex flex-col items-center gap-6 p-6 sm:p-8 h-full">
              <div className="flex w-full flex-col items-center gap-2 text-center">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Tải lên file</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Kéo thả hoặc chọn file để gửi</p>
              </div>
              
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`flex w-full flex-col items-center gap-6 rounded-lg border-2 border-dashed px-6 py-10 transition-colors duration-200 cursor-pointer
                  ${isDragging 
                    ? 'border-primary bg-primary/5' 
                    : 'border-gray-300 dark:border-white/20 hover:border-primary hover:bg-primary/5 dark:hover:border-primary dark:hover:bg-primary/10'
                  }`}
              >
                <div className="flex flex-col items-center gap-3 text-center pointer-events-none">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <span className="material-symbols-outlined text-3xl">upload</span>
                  </div>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">Kéo & Thả file vào đây</p>
                  <p className="text-sm font-normal text-gray-500 dark:text-gray-400">hoặc</p>
                </div>
                
                <label className="flex h-11 min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg bg-primary px-5 text-base font-bold text-white shadow-sm transition-all hover:bg-primary-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
                  <span>{isUploading ? 'Đang tải...' : 'Chọn file'}</span>
                  <input type="file" className="hidden" multiple onChange={handleFileInput} disabled={isUploading} />
                </label>
              </div>
              
              {isUploading && (
                <div className="w-full space-y-3">
                  <div className="text-center">
                    <p className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                      Đang tải lên: {currentFileName}
                    </p>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full transition-all duration-300 ease-out"
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {uploadProgress.toFixed(0)}%
                    </p>
                  </div>
                </div>
              )}
              
              {uploadedFiles.length > 0 && !isUploading && (
                <div className="w-full space-y-2">
                  <h4 className="font-medium text-gray-900 dark:text-white">Files đã tải lên:</h4>
                  {uploadedFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-green-600">check_circle</span>
                        <span className="text-sm font-medium">{file.name}</span>
                        <span className="text-xs text-gray-500">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              <div className="flex items-center gap-2 px-4 py-2 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 rounded-md text-sm">
                <span className="material-symbols-outlined text-lg">timer</span>
                <span>Lưu ý: File sẽ tự động bị xóa vĩnh viễn sau 30 phút.</span>
              </div>
            </div>
          </div>

          {/* Connect Device Area */}
          <div className="flex flex-col rounded-xl border border-gray-200 bg-white dark:border-white/10 dark:bg-white/5 lg:col-span-2">
            <div className="flex h-full flex-col items-center justify-center gap-6 p-6 sm:p-8">
              {uploadedFiles.length > 0 ? (
                <>
                  <div className="flex flex-col items-center gap-2 text-center">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">Tải về trên điện thoại</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Quét mã QR để tải files về điện thoại</p>
                  </div>
                  
                  <div className="flex h-40 w-40 items-center justify-center rounded-lg bg-white p-2">
                    {qrUrl ? (
                      <img
                        src={qrUrl}
                        alt="QR code for download"
                        className="h-full w-full object-contain"
                      />
                    ) : (
                      <div className="h-full w-full bg-gray-200 animate-pulse rounded"></div>
                    )}
                  </div>
                  
                  <div className="flex w-full max-w-xs flex-col items-center gap-3">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Mã tải về (Hết hạn sau 30p)</p>
                    <div className="flex w-full items-center gap-2 rounded-lg border border-gray-200 bg-background-light p-3 dark:border-white/10 dark:bg-background-dark">
                      <span className="flex-1 text-center text-xl font-semibold tracking-widest text-gray-700 dark:text-gray-300">
                        {sessionCode}
                      </span>
                      <button 
                        onClick={copyToClipboard}
                        className="relative flex h-8 w-8 items-center justify-center rounded-md text-gray-500 transition-colors hover:bg-gray-200 hover:text-gray-800 dark:text-gray-400 dark:hover:bg-white/10 dark:hover:text-white" 
                        title="Sao chép"
                      >
                        <span className="material-symbols-outlined text-xl">
                          {showCopyFeedback ? 'check' : 'content_copy'}
                        </span>
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center gap-4 text-center py-8">
                  <span className="material-symbols-outlined text-6xl text-gray-300">qr_code_scanner</span>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Chưa có file</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Tải file lên để tạo mã QR</p>
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};