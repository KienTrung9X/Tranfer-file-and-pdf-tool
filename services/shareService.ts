// Simple file sharing using localStorage and base64
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
    
    // Store in localStorage
    const shareData = {
      files: fileData,
      timestamp: Date.now(),
      expires: Date.now() + (30 * 60 * 1000) // 30 minutes
    };
    
    localStorage.setItem(`share_${shareId}`, JSON.stringify(shareData));
    
    // Also try to store in sessionStorage for cross-tab access
    sessionStorage.setItem(`share_${shareId}`, JSON.stringify(shareData));
    
    return shareId;
  }
  
  static async getSharedFiles(shareId: string): Promise<any[]> {
    // Try localStorage first
    let shareData = localStorage.getItem(`share_${shareId}`);
    
    // Fallback to sessionStorage
    if (!shareData) {
      shareData = sessionStorage.getItem(`share_${shareId}`);
    }
    
    if (!shareData) {
      console.log('No share data found for:', shareId);
      return [];
    }
    
    try {
      const data = JSON.parse(shareData);
      
      // Check if expired
      if (Date.now() > data.expires) {
        localStorage.removeItem(`share_${shareId}`);
        sessionStorage.removeItem(`share_${shareId}`);
        return [];
      }
      
      return data.files;
    } catch (error) {
      console.error('Error parsing share data:', error);
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