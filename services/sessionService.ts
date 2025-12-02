// Simple session storage service using localStorage
export class SessionService {
  private static getSessionKey(code: string): string {
    return `session_${code}`;
  }

  static saveFiles(code: string, files: File[]): void {
    const fileData = files.map(file => ({
      name: file.name,
      size: file.size,
      type: file.type,
      lastModified: file.lastModified,
      // Convert file to base64 for storage
      data: ''
    }));

    // Store file metadata
    localStorage.setItem(this.getSessionKey(code), JSON.stringify({
      files: fileData,
      timestamp: Date.now()
    }));

    // Store actual files in separate keys
    files.forEach((file, index) => {
      const reader = new FileReader();
      reader.onload = () => {
        localStorage.setItem(`${this.getSessionKey(code)}_file_${index}`, reader.result as string);
      };
      reader.readAsDataURL(file);
    });
  }

  static async getFiles(code: string): Promise<{ name: string; size: number; type: string; data: string }[]> {
    const sessionData = localStorage.getItem(this.getSessionKey(code));
    if (!sessionData) return [];

    const { files } = JSON.parse(sessionData);
    const result = [];

    for (let i = 0; i < files.length; i++) {
      const fileData = localStorage.getItem(`${this.getSessionKey(code)}_file_${i}`);
      if (fileData) {
        result.push({
          ...files[i],
          data: fileData
        });
      }
    }

    return result;
  }

  static clearSession(code: string): void {
    const sessionData = localStorage.getItem(this.getSessionKey(code));
    if (sessionData) {
      const { files } = JSON.parse(sessionData);
      // Remove all file data
      for (let i = 0; i < files.length; i++) {
        localStorage.removeItem(`${this.getSessionKey(code)}_file_${i}`);
      }
    }
    localStorage.removeItem(this.getSessionKey(code));
  }
}