import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ShareService } from '../services/shareService';

export const Download: React.FC = () => {
  const { code } = useParams<{ code: string }>();
  const [files, setFiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFiles = async () => {
      if (code) {
        try {
          const sharedFiles = await ShareService.getSharedFiles(code);
          setFiles(sharedFiles);
        } catch (error) {
          console.error('Error loading files:', error);
        }
      }
      setLoading(false);
    };
    
    loadFiles();
  }, [code]);

  const downloadFile = (file: any) => {
    const link = document.createElement('a');
    link.href = file.data || file.url;
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex-1 px-4 py-8 sm:py-12 md:py-16 w-full max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Tải file - Mã: {code}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Nhấn vào file để tải xuống
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-500 dark:text-gray-400">Đang tải files...</p>
          </div>
        ) : files.length > 0 ? (
          <div className="space-y-3">
            {files.map((file, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary">description</span>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{file.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{file.size ? `${(file.size / 1024 / 1024).toFixed(2)} MB` : 'File'}</p>
                  </div>
                </div>
                <button 
                  onClick={() => downloadFile(file)}
                  className="bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
                >
                  <span className="material-symbols-outlined">download</span>
                  Tải
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <span className="material-symbols-outlined text-6xl text-gray-400 mb-4">folder_open</span>
            <p className="text-gray-500 dark:text-gray-400">Không có file nào để tải</p>
            <p className="text-sm text-gray-400 mt-2">Mã: {code}</p>
            <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-800 rounded text-left text-xs">
              <p>Debug info:</p>
              <p>localStorage keys: {Object.keys(localStorage).filter(k => k.startsWith('share_')).join(', ')}</p>
              <p>sessionStorage keys: {Object.keys(sessionStorage).filter(k => k.startsWith('share_')).join(', ')}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};