import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

export const Download: React.FC = () => {
  const { code } = useParams<{ code: string }>();
  const [files, setFiles] = useState<any[]>([]);

  useEffect(() => {
    // Simulate loading files for this session
    if (code) {
      // In real app, fetch files from backend using the code
      setFiles([
        { name: 'example.pdf', size: '2.5 MB', url: '#' },
        { name: 'document.docx', size: '1.2 MB', url: '#' }
      ]);
    }
  }, [code]);

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
        {files.length > 0 ? (
          <div className="space-y-3">
            {files.map((file, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary">description</span>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{file.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{file.size}</p>
                  </div>
                </div>
                <button className="bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-lg font-medium transition-colors">
                  <span className="material-symbols-outlined mr-2">download</span>
                  Tải
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <span className="material-symbols-outlined text-6xl text-gray-400 mb-4">folder_open</span>
            <p className="text-gray-500 dark:text-gray-400">Không có file nào để tải</p>
          </div>
        )}
      </div>
    </div>
  );
};