import React from 'react';

// Hardcoded active transfers for demo, matching Vietnamese context
const activeTransfers = [
  { id: 1, name: 'BaoCao_Q4.pdf', size: '15.2 MB', progress: 75, speed: '2.5 MB/s', type: 'pdf' },
  { id: 2, name: 'hinhanh_dulich.jpg', size: '4.8 MB', progress: 30, speed: '1.1 MB/s', type: 'image' },
];

export const Status: React.FC = () => {
  return (
    <div className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      <div className="flex flex-wrap justify-between gap-3 mb-8">
        <p className="text-slate-800 dark:text-white text-4xl font-black leading-tight tracking-[-0.033em]">Trạng thái chuyển file</p>
      </div>

      <section className="mb-10">
        <h2 className="text-slate-800 dark:text-white text-[22px] font-bold leading-tight tracking-[-0.015em] pb-3 pt-5">Đang chuyển</h2>
        
        <div className="flex flex-col gap-2">
          {activeTransfers.map((item) => (
            <div key={item.id} className="flex flex-col sm:flex-row items-center gap-4 bg-white dark:bg-[#111a22] p-4 rounded-lg justify-between">
              <div className="flex items-center gap-4 flex-1 w-full">
                <div className="text-primary flex items-center justify-center rounded-lg bg-primary/20 shrink-0 size-12">
                  <span className="material-symbols-outlined">
                    {item.type === 'pdf' ? 'description' : 'image'}
                  </span>
                </div>
                <div className="flex flex-1 flex-col justify-center">
                  <p className="text-slate-800 dark:text-white text-base font-medium leading-normal">{item.name}</p>
                  <p className="text-slate-500 dark:text-[#92adc9] text-sm font-normal leading-normal">{item.size}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4 w-full sm:w-1/2">
                <div className="flex-1">
                  <p className="text-slate-500 dark:text-[#92adc9] text-sm font-normal leading-normal text-right mb-1">{item.progress}% - {item.speed}</p>
                  <div className="w-full overflow-hidden rounded-full bg-slate-200 dark:bg-[#324d67]">
                    <div className="h-2 rounded-full bg-primary" style={{ width: `${item.progress}%` }}></div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-primary transition-colors">
                    <span className="material-symbols-outlined">pause_circle</span>
                  </button>
                   <button className="text-slate-500 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-500 transition-colors">
                    <span className="material-symbols-outlined">cancel</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <div className="flex justify-between items-center pb-3 pt-5">
          <h2 className="text-slate-800 dark:text-white text-[22px] font-bold leading-tight tracking-[-0.015em]">Lịch sử chuyển</h2>
          <button className="text-sm text-slate-500 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-500 transition-colors font-medium">Xóa tất cả lịch sử</button>
        </div>
        
        <div className="flex flex-col gap-2">
           <div className="flex items-center gap-4 bg-white dark:bg-[#111a22] p-4 rounded-lg justify-between">
              <div className="flex items-center gap-4">
                 <div className="text-green-500 flex items-center justify-center rounded-lg bg-green-500/20 shrink-0 size-12">
                    <span className="material-symbols-outlined">check_circle</span>
                  </div>
                  <div className="flex flex-col justify-center">
                    <p className="text-slate-800 dark:text-white text-base font-medium leading-normal">TaiLieu_HocTap.zip</p>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">Thành công - 24/07/2023 10:30 AM</p>
                  </div>
              </div>
              <button className="text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors">
                <span className="material-symbols-outlined">delete</span>
              </button>
           </div>
           
           <div className="flex items-center gap-4 bg-white dark:bg-[#111a22] p-4 rounded-lg justify-between">
              <div className="flex items-center gap-4">
                 <div className="text-red-500 flex items-center justify-center rounded-lg bg-red-500/20 shrink-0 size-12">
                    <span className="material-symbols-outlined">cancel</span>
                  </div>
                  <div className="flex flex-col justify-center">
                    <p className="text-slate-800 dark:text-white text-base font-medium leading-normal">Video_GiaDinh.mp4</p>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">Thất bại - 24/07/2023 09:15 AM</p>
                  </div>
              </div>
              <div className="flex items-center gap-2">
                 <button className="text-primary hover:underline text-sm font-medium">Thử lại</button>
                 <button className="text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors">
                   <span className="material-symbols-outlined">delete</span>
                 </button>
              </div>
           </div>

           <div className="flex items-center gap-4 bg-white dark:bg-[#111a22] p-4 rounded-lg justify-between">
              <div className="flex items-center gap-4">
                 <div className="text-green-500 flex items-center justify-center rounded-lg bg-green-500/20 shrink-0 size-12">
                    <span className="material-symbols-outlined">check_circle</span>
                  </div>
                  <div className="flex flex-col justify-center">
                    <p className="text-slate-800 dark:text-white text-base font-medium leading-normal">AmThanh_Podcast.mp3</p>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">Thành công - 23/07/2023 04:55 PM</p>
                  </div>
              </div>
              <button className="text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors">
                <span className="material-symbols-outlined">delete</span>
              </button>
           </div>
        </div>
      </section>

    </div>
  );
};