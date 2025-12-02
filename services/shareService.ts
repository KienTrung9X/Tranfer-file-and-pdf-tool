import { supabase } from './supabaseClient';

// File sharing using Supabase
export class ShareService {
  static async shareFiles(files: File[]): Promise<string> {
    const shareId = this.generateShareId();
    const uploadPromises = [];
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const fileName = `${shareId}/${i}_${file.name}`;
      
      // Upload file to Supabase Storage
      const uploadPromise = supabase.storage
        .from('files')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });
      
      uploadPromises.push(uploadPromise);
    }
    
    try {
      await Promise.all(uploadPromises);
      
      // Store session metadata in database
      await supabase
        .from('sessions')
        .insert({
          id: shareId,
          file_count: files.length,
          file_names: files.map(f => f.name),
          expires_at: new Date(Date.now() + 30 * 60 * 1000).toISOString()
        });
      
      return shareId;
    } catch (error) {
      console.error('Error uploading files:', error);
      throw error;
    }
  }
  
  static async getSharedFiles(shareId: string): Promise<any[]> {
    try {
      // Get session info
      const { data: session } = await supabase
        .from('sessions')
        .select('*')
        .eq('id', shareId)
        .single();
      
      if (!session || new Date(session.expires_at) < new Date()) {
        return [];
      }
      
      // Get file URLs
      const files = [];
      for (let i = 0; i < session.file_count; i++) {
        const fileName = `${shareId}/${i}_${session.file_names[i]}`;
        const { data } = supabase.storage
          .from('files')
          .getPublicUrl(fileName);
        
        files.push({
          name: session.file_names[i],
          url: data.publicUrl
        });
      }
      
      return files;
    } catch (error) {
      console.error('Error getting shared files:', error);
      return [];
    }
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