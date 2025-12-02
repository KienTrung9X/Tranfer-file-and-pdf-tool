import { supabase } from './supabaseClient';

// File sharing using Supabase with progress tracking
export class ShareService {
  static async shareFiles(files: File[], options?: { onProgress?: (progress: number, fileName: string) => void }): Promise<string> {
    const shareId = this.generateShareId();
    const { onProgress } = options || {};
    
    try {
      // Upload files to Supabase Storage
      const uploadPromises = files.map(async (file, index) => {
        const fileName = `${shareId}/${index}_${file.name}`;
        
        if (onProgress) {
          onProgress((index / files.length) * 50, file.name);
        }
        
        const { data, error } = await supabase.storage
          .from('files')
          .upload(fileName, file, {
            cacheControl: '3600',
            upsert: false
          });
        
        if (error) throw error;
        return { name: file.name, path: fileName };
      });
      
      const uploadResults = await Promise.all(uploadPromises);
      
      if (onProgress) {
        onProgress(75, 'Lưu thông tin session...');
      }
      
      // Store session metadata
      const { error: dbError } = await supabase
        .from('sessions')
        .insert({
          id: shareId,
          file_count: files.length,
          file_names: files.map(f => f.name),
          expires_at: new Date(Date.now() + 30 * 60 * 1000).toISOString()
        });
      
      if (dbError) throw dbError;
      
      if (onProgress) {
        onProgress(100, 'Hoàn thành!');
      }
      
      return shareId;
    } catch (error) {
      console.error('Supabase upload failed, using fallback:', error);
      
      // Fallback to localStorage
      const fileData = [];
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (onProgress) {
          onProgress((i / files.length) * 100, file.name);
        }
        
        const base64 = await this.fileToBase64(file);
        fileData.push({
          name: file.name,
          size: file.size,
          type: file.type,
          data: base64
        });
      }
      
      const shareData = {
        files: fileData,
        timestamp: Date.now(),
        expires: Date.now() + (30 * 60 * 1000)
      };
      
      localStorage.setItem(`share_${shareId}`, JSON.stringify(shareData));
      sessionStorage.setItem(`share_${shareId}`, JSON.stringify(shareData));
      
      return shareId;
    }
  }
  
  static async getSharedFiles(shareId: string): Promise<any[]> {
    try {
      // Try Supabase first
      const { data: session, error } = await supabase
        .from('sessions')
        .select('*')
        .eq('id', shareId)
        .single();
      
      if (!error && session && new Date(session.expires_at) > new Date()) {
        // Get file URLs from Supabase Storage
        const files = [];
        for (let i = 0; i < session.file_count; i++) {
          const fileName = `${shareId}/${i}_${session.file_names[i]}`;
          const { data } = supabase.storage
            .from('files')
            .getPublicUrl(fileName);
          
          files.push({
            name: session.file_names[i],
            url: data.publicUrl,
            size: 0 // Size not stored in this version
          });
        }
        return files;
      }
    } catch (error) {
      console.log('Supabase fetch failed, trying fallback:', error);
    }
    
    // Fallback to localStorage
    let shareData = localStorage.getItem(`share_${shareId}`);
    
    if (!shareData) {
      shareData = sessionStorage.getItem(`share_${shareId}`);
    }
    
    if (!shareData) {
      console.log('No share data found for:', shareId);
      return [];
    }
    
    try {
      const data = JSON.parse(shareData);
      
      if (Date.now() > data.expires) {
        this.cleanupShare(shareId);
        return [];
      }
      
      return data.files;
    } catch (error) {
      console.error('Error parsing share data:', error);
      return [];
    }
  }
  
  private static cleanupShare(shareId: string): void {
    localStorage.removeItem(`share_${shareId}`);
    sessionStorage.removeItem(`share_${shareId}`);
    sessionStorage.removeItem(`url_${shareId}`);
  }
  
  private static fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }
  
  private static generateShareId(): string {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result.slice(0, 3) + '-' + result.slice(3);
  }
  

}