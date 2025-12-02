// Simple file sharing using URL encoding
export class ShareService {
  static async shareFiles(files: File[]): Promise<string> {
    const shareId = this.generateShareId();
    const fileData = [];
    
    for (const file of files) {
      const base64 = await this.fileToBase64(file);
      fileData.push({
        name: file.name,
        size: file.size,
        type: file.type,
        data: base64
      });
    }
    
    // Store in both localStorage and create encoded URL
    const shareData = {
      files: fileData,
      timestamp: Date.now(),
      expires: Date.now() + (30 * 60 * 1000) // 30 minutes
    };
    
    localStorage.setItem(`share_${shareId}`, JSON.stringify(shareData));
    sessionStorage.setItem(`share_${shareId}`, JSON.stringify(shareData));
    
    // Also encode small files directly in URL for cross-device sharing
    try {
      const compressedData = btoa(JSON.stringify(shareData));
      if (compressedData.length < 2000) { // URL length limit
        sessionStorage.setItem(`url_${shareId}`, compressedData);
      }
    } catch (e) {
      console.log('Data too large for URL encoding');
    }
    
    return shareId;
  }
  
  static async getSharedFiles(shareId: string): Promise<any[]> {
    // Try multiple sources
    let shareData = localStorage.getItem(`share_${shareId}`);
    
    if (!shareData) {
      shareData = sessionStorage.getItem(`share_${shareId}`);
    }
    
    // Try URL encoded data
    if (!shareData) {
      const urlData = sessionStorage.getItem(`url_${shareId}`);
      if (urlData) {
        try {
          shareData = atob(urlData);
        } catch (e) {
          console.error('Error decoding URL data:', e);
        }
      }
    }
    
    // Try URL parameters (for direct links)
    if (!shareData) {
      const urlParams = new URLSearchParams(window.location.search);
      const encodedData = urlParams.get('data');
      if (encodedData) {
        try {
          shareData = atob(encodedData);
        } catch (e) {
          console.error('Error decoding URL parameter:', e);
        }
      }
    }
    
    if (!shareData) {
      console.log('No share data found for:', shareId);
      return [];
    }
    
    try {
      const data = JSON.parse(shareData);
      
      // Check if expired
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