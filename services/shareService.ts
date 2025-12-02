// Simple file sharing using URL and localStorage
export class ShareService {
  static async shareFiles(files: File[]): Promise<string> {
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
    
    // Store in localStorage with timestamp
    const shareId = this.generateShareId();
    const shareData = {
      files: fileData,
      timestamp: Date.now(),
      expires: Date.now() + (30 * 60 * 1000) // 30 minutes
    };
    
    localStorage.setItem(`share_${shareId}`, JSON.stringify(shareData));
    
    // Clean up expired shares
    this.cleanupExpiredShares();
    
    return shareId;
  }
  
  static getSharedFiles(shareId: string): any[] {
    const shareData = localStorage.getItem(`share_${shareId}`);
    if (!shareData) return [];
    
    const data = JSON.parse(shareData);
    
    // Check if expired
    if (Date.now() > data.expires) {
      localStorage.removeItem(`share_${shareId}`);
      return [];
    }
    
    return data.files;
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
  
  private static cleanupExpiredShares(): void {
    const keys = Object.keys(localStorage);
    const now = Date.now();
    
    keys.forEach(key => {
      if (key.startsWith('share_')) {
        try {
          const data = JSON.parse(localStorage.getItem(key) || '{}');
          if (data.expires && now > data.expires) {
            localStorage.removeItem(key);
          }
        } catch (e) {
          localStorage.removeItem(key);
        }
      }
    });
  }
}