import React, { useCallback, useState, useEffect } from 'react';

export const Upload: React.FC = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [sessionCode, setSessionCode] = useState('');
  const [showCopyFeedback, setShowCopyFeedback] = useState(false);

  useEffect(() => {
    // Generate a random 6-character code
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    const formattedCode = result.slice(0, 3) + '-' + result.slice(3);
    setSessionCode(formattedCode);
  }, []);

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
    // Handle file drop logic here
    console.log('Files dropped:', e.dataTransfer.files);
    alert(`Đã nhận ${e.dataTransfer.files.length} file. Kiểm tra console.`);
  }, []);

  const copyToClipboard = () => {
    if (sessionCode) {
      navigator.clipboard.writeText(sessionCode);
      setShowCopyFeedback(true);
      setTimeout(() => setShowCopyFeedback(false), 2000);
    }
  };

  // Generate QR code URL using a public API
  const qrUrl = sessionCode 
    ? `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(sessionCode)}&color=000000&bgcolor=ffffff`
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
                  <span>Chọn file</span>
                  <input type="file" className="hidden" multiple onChange={(e) => console.log(e.target.files)} />
                </label>
              </div>
            </div>
          </div>

          {/* Connect Device Area */}
          <div className="flex flex-col rounded-xl border border-gray-200 bg-white dark:border-white/10 dark:bg-white/5 lg:col-span-2">
            <div className="flex h-full flex-col items-center justify-center gap-6 p-6 sm:p-8">
              <div className="flex flex-col items-center gap-2 text-center">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Kết nối thiết bị di động</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Quét mã QR hoặc nhập mã trên điện thoại để kết nối.</p>
              </div>
              
              <div className="flex h-40 w-40 items-center justify-center rounded-lg bg-white p-2">
                {qrUrl ? (
                  <img
                    src={qrUrl}
                    alt="QR code for mobile connection"
                    className="h-full w-full object-contain"
                  />
                ) : (
                  <div className="h-full w-full bg-gray-200 animate-pulse rounded"></div>
                )}
              </div>
              
              <div className="flex w-full max-w-xs flex-col items-center gap-3">
                <p className="text-sm text-gray-500 dark:text-gray-400">Mã của bạn</p>
                <div className="flex w-full items-center gap-2 rounded-lg border border-gray-200 bg-background-light p-3 dark:border-white/10 dark:bg-background-dark">
                  <span className="flex-1 text-center text-xl font-semibold tracking-widest text-gray-700 dark:text-gray-300">
                    {sessionCode || '...'}
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
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};