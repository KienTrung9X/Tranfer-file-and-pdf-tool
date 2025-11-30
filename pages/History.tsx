import React, { useEffect, useState } from 'react';
import { FileService } from '../services/fileService';
import { FileTransfer, TransferStatus } from '../types';

export const History: React.FC = () => {
  const [transfers, setTransfers] = useState<FileTransfer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await FileService.getTransfers();
        setTransfers(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const getStatusBadge = (status: TransferStatus) => {
    switch (status) {
      case TransferStatus.COMPLETED:
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-green-100 dark:bg-green-500/20 px-2 py-1 text-xs font-medium text-green-700 dark:text-green-400">
            <span className="size-1.5 rounded-full bg-green-500"></span> Thành công
          </span>
        );
      case TransferStatus.FAILED:
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-red-100 dark:bg-red-500/20 px-2 py-1 text-xs font-medium text-red-700 dark:text-red-400">
            <span className="size-1.5 rounded-full bg-red-500"></span> Thất bại
          </span>
        );
      case TransferStatus.TRANSFERRING:
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-100 dark:bg-blue-500/20 px-2 py-1 text-xs font-medium text-blue-700 dark:text-blue-400">
             <span className="size-1.5 rounded-full bg-blue-500 animate-pulse"></span> Đang chuyển
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 dark:bg-gray-500/20 px-2 py-1 text-xs font-medium text-gray-700 dark:text-gray-400">
             <span className="size-1.5 rounded-full bg-gray-500"></span> Hàng chờ
          </span>
        );
    }
  };

  const getFileIcon = (type: string) => {
    if (type.includes('pdf')) return <span className="material-symbols-outlined text-primary">description</span>;
    if (type.includes('image')) return <span className="material-symbols-outlined text-yellow-500">image</span>;
    if (type.includes('video')) return <span className="material-symbols-outlined text-red-500">slideshow</span>;
    if (type.includes('zip') || type.includes('compressed')) return <span className="material-symbols-outlined text-gray-500">folder_zip</span>;
    return <span className="material-symbols-outlined text-primary">description</span>;
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const time = date.toLocaleTimeString('vi-VN', {hour: '2-digit', minute:'2-digit'});
    const d = date.toLocaleDateString('vi-VN');
    return `${time}, ${d}`;
  }

  return (
    <div className="flex justify-center py-5 px-4 sm:px-10 md:px-20 lg:px-40">
      <div className="flex flex-col max-w-[960px] flex-1 gap-6 p-4 sm:p-6 md:p-8">
        
        <div className="flex flex-wrap justify-between items-start gap-4">
          <div className="flex min-w-72 flex-col gap-2">
            <h1 className="text-black dark:text-white text-4xl font-black leading-tight tracking-[-0.033em]">Lịch Sử Chuyển File</h1>
            <p className="text-gray-600 dark:text-[#92adc9] text-base font-normal leading-normal">
              Xem lại tất cả các lần chuyển file, tìm kiếm theo tên hoặc lọc theo trạng thái và ngày.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          {/* Search Bar */}
          <label className="flex flex-col min-w-40 h-12 w-full">
            <div className="flex w-full flex-1 items-stretch rounded-lg h-full">
              <div className="text-gray-500 dark:text-[#92adc9] flex bg-gray-100 dark:bg-[#233648] items-center justify-center pl-4 rounded-l-lg border-r-0">
                <span className="material-symbols-outlined">search</span>
              </div>
              <input
                className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-r-lg text-black dark:text-white focus:outline-0 focus:ring-0 border-none bg-gray-100 dark:bg-[#233648] h-full placeholder:text-gray-500 placeholder:dark:text-[#92adc9] px-4 pl-2 text-base font-normal leading-normal"
                placeholder="Tìm kiếm theo tên file..."
              />
            </div>
          </label>

          {/* Filters */}
          <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
            <button className="flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-lg bg-gray-100 dark:bg-[#233648] px-3">
              <span className="material-symbols-outlined text-black dark:text-white">filter_list</span>
              <p className="text-black dark:text-white text-sm font-medium leading-normal">Trạng thái: Tất cả</p>
              <span className="material-symbols-outlined text-black dark:text-white">arrow_drop_down</span>
            </button>
            <button className="flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-lg bg-gray-100 dark:bg-[#233648] px-3">
              <span className="material-symbols-outlined text-black dark:text-white">date_range</span>
              <p className="text-black dark:text-white text-sm font-medium leading-normal">Khoảng ngày</p>
              <span className="material-symbols-outlined text-black dark:text-white">arrow_drop_down</span>
            </button>
            <button className="flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-lg bg-gray-100 dark:bg-[#233648] px-3">
              <span className="material-symbols-outlined text-black dark:text-white">devices</span>
              <p className="text-black dark:text-white text-sm font-medium leading-normal">Thiết bị</p>
              <span className="material-symbols-outlined text-black dark:text-white">arrow_drop_down</span>
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto bg-white dark:bg-[#1A2836] rounded-xl shadow-md">
          <table className="w-full text-left">
            <thead className="border-b border-gray-200 dark:border-b-[#233648]">
              <tr>
                {['Tên file', 'Kích thước', 'Thời gian', 'Nguồn / Đích', 'Trạng thái', 'Hành động'].map((header, i) => (
                  <th key={i} className={`p-4 text-xs font-bold uppercase text-gray-500 dark:text-[#92adc9] tracking-wider ${header === 'Hành động' ? 'text-right' : ''}`}>
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-[#233648]">
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-500 dark:text-[#92adc9]">Đang tải dữ liệu...</td>
                </tr>
              ) : transfers.map((item) => (
                <tr key={item.id}>
                  <td className="p-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      {getFileIcon(item.type)}
                      <span className="text-sm font-medium text-black dark:text-white">{item.name}</span>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-gray-600 dark:text-[#92adc9] whitespace-nowrap">{formatBytes(item.size)}</td>
                  <td className="p-4 text-sm text-gray-600 dark:text-[#92adc9] whitespace-nowrap">
                    {formatDate(item.createdAt)}
                  </td>
                  <td className="p-4 text-sm text-gray-600 dark:text-[#92adc9] whitespace-nowrap">
                    {item.source} → {item.destination}
                  </td>
                  <td className="p-4">
                    {getStatusBadge(item.status)}
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2">
                      {item.status === TransferStatus.FAILED ? (
                         <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 text-gray-500 dark:text-[#92adc9]"><span className="material-symbols-outlined">refresh</span></button>
                      ) : (
                         <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 text-gray-500 dark:text-[#92adc9]"><span className="material-symbols-outlined">download</span></button>
                      )}
                      <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 text-gray-500 dark:text-[#92adc9]"><span className="material-symbols-outlined">{item.status === TransferStatus.FAILED ? 'delete' : 'more_horiz'}</span></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <nav aria-label="Pagination" className="flex items-center justify-between pt-4">
          <div className="hidden sm:block">
            <p className="text-sm text-gray-600 dark:text-[#92adc9]">
              Hiển thị <span className="font-medium text-black dark:text-white">1</span> tới <span className="font-medium text-black dark:text-white">{transfers.length}</span> của <span className="font-medium text-black dark:text-white">97</span> kết quả
            </p>
          </div>
          <div className="flex flex-1 justify-between sm:justify-end">
            <a href="#" className="relative inline-flex items-center rounded-md border border-gray-300 dark:border-[#233648] bg-white dark:bg-[#1A2836] px-4 py-2 text-sm font-medium text-gray-700 dark:text-[#92adc9] hover:bg-gray-50 dark:hover:bg-white/5">Trước</a>
            <a href="#" className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 dark:border-[#233648] bg-white dark:bg-[#1A2836] px-4 py-2 text-sm font-medium text-gray-700 dark:text-[#92adc9] hover:bg-gray-50 dark:hover:bg-white/5">Sau</a>
          </div>
        </nav>

      </div>
    </div>
  );
};