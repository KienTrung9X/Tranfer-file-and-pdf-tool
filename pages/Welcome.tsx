import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export const Welcome: React.FC = () => {
  const [sessionCode, setSessionCode] = useState('');

  useEffect(() => {
    // Generate a random 6-character code (e.g., A4B-9Y1)
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    const formattedCode = result.slice(0, 3) + '-' + result.slice(3);
    setSessionCode(formattedCode);
  }, []);

  // Generate QR code URL using a public API
  const qrUrl = sessionCode 
    ? `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(sessionCode)}&color=000000&bgcolor=ffffff`
    : '';

  return (
    <div className="flex flex-col min-h-[calc(100vh-64px)] w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      <div className="flex flex-col gap-12 sm:gap-20">
        {/* Hero Section */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div className="flex flex-col gap-6 text-center md:text-left">
            <div className="flex flex-col gap-2">
              <h1 className="text-4xl sm:text-5xl font-black text-gray-900 dark:text-white leading-tight tracking-tighter">
                Chào mừng đến với FileTransfer!
              </h1>
              <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300">
                Cách đơn giản nhất để chuyển file giữa điện thoại và máy tính của bạn.
              </p>
            </div>
            <div className="flex justify-center md:justify-start">
              <Link
                to="/upload"
                className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-6 bg-primary text-white text-base font-bold leading-normal tracking-wide shadow-lg shadow-primary/30 hover:bg-primary-hover transition-colors"
              >
                <span className="truncate">Bắt đầu ngay</span>
              </Link>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <img 
              className="w-full max-w-sm h-auto rounded-xl object-cover shadow-2xl" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAereYzX-d6e0v4DmKt6AL6mcRTgXhdHvSUvMIRl5aXl79A0n_krhR9T5aL2CZdcjYxhEMrzBMssPZufezdJ_D8iCh0ijpmWNmxLv3fzRMyjarLP4TiN5p6wrXpz-smCWIthSCke27bdgOCTIFLPVORkcPiy8TKTYKEGEJ4ijTuYAtFaCpdIZ2Nfh0e9sVX0Vc02mEKg8N45-qki10dWtcDUmcIopl9EhCTgZMqtnj_UZSOthT5PWR-auaXBZyKgSMbV9_jtvEZPvPS" 
              alt="A modern desk setup"
            />
          </div>
        </section>

        <div id="connect" className="flex flex-col gap-8 sm:gap-12">
          <section>
            <h2 className="text-2xl sm:text-3xl font-bold leading-tight tracking-tight text-gray-900 dark:text-white text-center">
              Bắt đầu chỉ với 3 bước đơn giản
            </h2>
          </section>

          {/* Steps Grid */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="flex flex-col gap-4 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-background-dark/50 p-6 text-center items-center">
              <div className="flex items-center justify-center h-12 w-12 rounded-full bg-primary/10 text-primary mb-2">
                <span className="material-symbols-outlined text-3xl">phone_iphone</span>
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">1. Mở ứng dụng trên điện thoại</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Tải và khởi động ứng dụng FileTransfer từ cửa hàng ứng dụng trên điện thoại của bạn.</p>
              </div>
            </div>
            <div className="flex flex-col gap-4 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-background-dark/50 p-6 text-center items-center">
              <div className="flex items-center justify-center h-12 w-12 rounded-full bg-primary/10 text-primary mb-2">
                <span className="material-symbols-outlined text-3xl">qr_code_scanner</span>
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">2. Chọn 'Quét mã QR'</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Nhấn vào nút 'Kết nối với máy tính' để mở camera trên điện thoại của bạn.</p>
              </div>
            </div>
            <div className="flex flex-col gap-4 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-background-dark/50 p-6 text-center items-center">
              <div className="flex items-center justify-center h-12 w-12 rounded-full bg-primary/10 text-primary mb-2">
                <span className="material-symbols-outlined text-3xl">link</span>
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">3. Quét mã QR</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Hướng camera vào mã QR trên màn hình này để kết nối ngay lập tức.</p>
              </div>
            </div>
          </section>
        </div>

        {/* Connection Module */}
        <section className="flex flex-col items-center gap-6 rounded-xl border border-primary/20 bg-primary/5 dark:bg-background-dark/30 p-8 sm:p-12 mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 dark:text-white text-center">
            Quét mã QR này bằng điện thoại của bạn
          </h2>
          <div className="bg-white p-4 rounded-lg shadow-md">
            {qrUrl ? (
              <img 
                className="w-48 h-48 sm:w-64 sm:h-64 object-contain" 
                src={qrUrl}
                alt="QR code for connection" 
              />
            ) : (
              <div className="w-48 h-48 sm:w-64 sm:h-64 bg-gray-200 animate-pulse rounded"></div>
            )}
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Hoặc nhập mã này trên điện thoại: 
            <strong className="text-gray-800 dark:text-gray-200 font-mono text-lg tracking-widest bg-gray-200 dark:bg-white/10 px-3 py-1 rounded ml-2">
              {sessionCode || '...'}
            </strong>
          </p>
        </section>
      </div>
    </div>
  );
};