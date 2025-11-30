import React from 'react';
import { Link } from 'react-router-dom';

export const PdfTools: React.FC = () => {
  return (
    <div className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-black text-gray-900 dark:text-white sm:text-4xl mb-4">
          Công cụ PDF
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          Chỉnh sửa file PDF của bạn nhanh chóng và dễ dàng ngay trên trình duyệt.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {/* Split PDF Card */}
        <Link to="/pdf-tools/split" className="group relative flex flex-col items-center p-8 bg-white dark:bg-surface-dark rounded-2xl border border-gray-200 dark:border-border-dark hover:border-primary dark:hover:border-primary transition-all shadow-sm hover:shadow-md">
          <div className="h-16 w-16 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-600 dark:text-red-400 mb-6 group-hover:scale-110 transition-transform">
            <span className="material-symbols-outlined text-4xl">cut</span>
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Tách PDF</h3>
          <p className="text-center text-sm text-gray-500 dark:text-gray-400">
            Trích xuất các trang cụ thể hoặc chia nhỏ file PDF lớn thành nhiều file nhỏ hơn.
          </p>
        </Link>

        {/* Rotate PDF Card */}
        <Link to="/pdf-tools/rotate" className="group relative flex flex-col items-center p-8 bg-white dark:bg-surface-dark rounded-2xl border border-gray-200 dark:border-border-dark hover:border-primary dark:hover:border-primary transition-all shadow-sm hover:shadow-md">
          <div className="h-16 w-16 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-6 group-hover:scale-110 transition-transform">
            <span className="material-symbols-outlined text-4xl">rotate_right</span>
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Xoay PDF</h3>
          <p className="text-center text-sm text-gray-500 dark:text-gray-400">
            Xoay các trang PDF của bạn theo hướng mong muốn (90, 180, 270 độ).
          </p>
        </Link>
      </div>
    </div>
  );
};
