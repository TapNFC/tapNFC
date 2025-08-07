// IndexedDB utility for storing shared design data
const DB_NAME = 'QRDesignStorage';
const DB_VERSION = 1;
const STORE_NAME = 'sharedDesigns';

export type SharedDesign = {
  id: string;
  canvasData: any;
  htmlContent?: string; // HTML representation of the design
  metadata: {
    width: number;
    height: number;
    backgroundColor: string;
    title?: string;
    description?: string;
  };
  createdAt: Date;
  expiresAt?: Date;
};

export type DesignData = {
  id: string;
  canvasData: any;
  metadata: {
    width: number;
    height: number;
    backgroundColor: string;
    title?: string;
    description?: string;
    imageUrl?: string;
    designType?: string;
    previewUrl?: string;
  };
  qr_code_url?: string;
  qr_code_data?: string; // SVG data for the QR code
  createdAt: Date;
  updatedAt: Date;
};

export type TemplateData = {
  id: string;
  name: string;
  description?: string;
  category: string;
  canvasData: any;
  createdAt: Date;
  updatedAt: Date;
};

class IndexedDBManager {
  private db: IDBDatabase | null = null;

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => {
        reject(new Error('Failed to open IndexedDB'));
      };

      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // Create designs store
        if (!db.objectStoreNames.contains('designs')) {
          const designStore = db.createObjectStore('designs', { keyPath: 'id' });
          designStore.createIndex('createdAt', 'createdAt', { unique: false });
          designStore.createIndex('updatedAt', 'updatedAt', { unique: false });
        }

        // Create templates store
        if (!db.objectStoreNames.contains('templates')) {
          const templateStore = db.createObjectStore('templates', { keyPath: 'id' });
          templateStore.createIndex('name', 'name', { unique: false });
          templateStore.createIndex('category', 'category', { unique: false });
          templateStore.createIndex('createdAt', 'createdAt', { unique: false });
        }
      };
    });
  }

  async saveSharedDesign(design: SharedDesign): Promise<void> {
    if (!this.db) {
      await this.init();
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);

      const request = store.put(design);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(new Error('Failed to save shared design'));
    });
  }

  async getSharedDesign(id: string): Promise<SharedDesign | null> {
    if (!this.db) {
      await this.init();
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);

      const request = store.get(id);

      request.onsuccess = () => {
        const result = request.result;

        if (!result) {
          resolve(null);
          return;
        }

        // Check if design has expired
        if (result.expiresAt && new Date(result.expiresAt) < new Date()) {
          // Remove expired design
          this.deleteSharedDesign(id);
          resolve(null);
          return;
        }

        resolve(result);
      };

      request.onerror = () => reject(new Error('Failed to get shared design'));
    });
  }

  async deleteSharedDesign(id: string): Promise<void> {
    if (!this.db) {
      await this.init();
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);

      const request = store.delete(id);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(new Error('Failed to delete shared design'));
    });
  }

  async getAllSharedDesigns(): Promise<SharedDesign[]> {
    if (!this.db) {
      await this.init();
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);

      const request = store.getAll();

      request.onsuccess = () => {
        const results = request.result;
        const validDesigns = results.filter((design: SharedDesign) => {
          // Filter out expired designs
          if (design.expiresAt && new Date(design.expiresAt) < new Date()) {
            this.deleteSharedDesign(design.id); // Clean up expired designs
            return false;
          }
          return true;
        });

        resolve(validDesigns);
      };

      request.onerror = () => reject(new Error('Failed to get all shared designs'));
    });
  }

  async clearExpiredDesigns(): Promise<void> {
    if (!this.db) {
      await this.init();
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);

      const request = store.getAll();

      request.onsuccess = () => {
        const results = request.result;
        const expiredIds = results
          .filter((design: SharedDesign) =>
            design.expiresAt && new Date(design.expiresAt) < new Date(),
          )
          .map((design: SharedDesign) => design.id);

        // Delete expired designs
        const deletePromises = expiredIds.map(id => this.deleteSharedDesign(id));
        Promise.all(deletePromises).then(() => resolve()).catch(reject);
      };

      request.onerror = () => reject(new Error('Failed to clear expired designs'));
    });
  }
}

// Export a singleton instance
export const indexedDBManager = new IndexedDBManager();

// Utility functions for easier usage
export const saveSharedDesign = (design: SharedDesign) => indexedDBManager.saveSharedDesign(design);
export const getSharedDesign = (id: string) => indexedDBManager.getSharedDesign(id);
export const deleteSharedDesign = (id: string) => indexedDBManager.deleteSharedDesign(id);
export const getAllSharedDesigns = () => indexedDBManager.getAllSharedDesigns();
export const clearExpiredDesigns = () => indexedDBManager.clearExpiredDesigns();

class DesignIndexedDB {
  private dbName = 'DesignEditorDB';
  private version = 1;
  private db: IDBDatabase | null = null;

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);

      request.onerror = () => {
        reject(new Error('Failed to open IndexedDB'));
      };

      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // Create designs store
        if (!db.objectStoreNames.contains('designs')) {
          const designStore = db.createObjectStore('designs', { keyPath: 'id' });
          designStore.createIndex('createdAt', 'createdAt', { unique: false });
          designStore.createIndex('updatedAt', 'updatedAt', { unique: false });
        }

        // Create templates store
        if (!db.objectStoreNames.contains('templates')) {
          const templateStore = db.createObjectStore('templates', { keyPath: 'id' });
          templateStore.createIndex('name', 'name', { unique: false });
          templateStore.createIndex('category', 'category', { unique: false });
          templateStore.createIndex('createdAt', 'createdAt', { unique: false });
        }
      };
    });
  }

  private async ensureDB(): Promise<IDBDatabase> {
    if (!this.db) {
      await this.init();
    }
    if (!this.db) {
      throw new Error('Database not initialized');
    }
    return this.db;
  }

  // Design operations
  async saveDesign(designData: DesignData): Promise<void> {
    const db = await this.ensureDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['designs'], 'readwrite');
      const store = transaction.objectStore('designs');

      const now = new Date();
      const dataToSave = {
        ...designData,
        updatedAt: now,
        createdAt: designData.createdAt || now,
      };

      const request = store.put(dataToSave);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(new Error('Failed to save design'));
    });
  }

  async getDesign(id: string): Promise<DesignData | null> {
    const db = await this.ensureDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['designs'], 'readonly');
      const store = transaction.objectStore('designs');
      const request = store.get(id);

      request.onsuccess = () => {
        const result = request.result;
        if (result) {
          // Convert date strings back to Date objects
          result.createdAt = new Date(result.createdAt);
          result.updatedAt = new Date(result.updatedAt);
        }
        resolve(result || null);
      };
      request.onerror = () => reject(new Error('Failed to get design'));
    });
  }

  async getAllDesigns(): Promise<DesignData[]> {
    const db = await this.ensureDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['designs'], 'readonly');
      const store = transaction.objectStore('designs');
      const request = store.getAll();

      request.onsuccess = () => {
        const results = request.result.map((item: any) => ({
          ...item,
          createdAt: new Date(item.createdAt),
          updatedAt: new Date(item.updatedAt),
        }));
        resolve(results);
      };
      request.onerror = () => reject(new Error('Failed to get designs'));
    });
  }

  async deleteDesign(id: string): Promise<void> {
    const db = await this.ensureDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['designs'], 'readwrite');
      const store = transaction.objectStore('designs');
      const request = store.delete(id);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(new Error('Failed to delete design'));
    });
  }

  // Template operations
  async saveTemplate(templateData: TemplateData): Promise<void> {
    const db = await this.ensureDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['templates'], 'readwrite');
      const store = transaction.objectStore('templates');

      const now = new Date();
      const dataToSave = {
        ...templateData,
        updatedAt: now,
        createdAt: templateData.createdAt || now,
      };

      const request = store.put(dataToSave);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(new Error('Failed to save template'));
    });
  }

  async getTemplate(id: string): Promise<TemplateData | null> {
    const db = await this.ensureDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['templates'], 'readonly');
      const store = transaction.objectStore('templates');
      const request = store.get(id);

      request.onsuccess = () => {
        const result = request.result;
        if (result) {
          result.createdAt = new Date(result.createdAt);
          result.updatedAt = new Date(result.updatedAt);
        }
        resolve(result || null);
      };
      request.onerror = () => reject(new Error('Failed to get template'));
    });
  }

  async getAllTemplates(): Promise<TemplateData[]> {
    const db = await this.ensureDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['templates'], 'readonly');
      const store = transaction.objectStore('templates');
      const request = store.getAll();

      request.onsuccess = () => {
        const results = request.result.map((item: any) => ({
          ...item,
          createdAt: new Date(item.createdAt),
          updatedAt: new Date(item.updatedAt),
        }));
        resolve(results);
      };
      request.onerror = () => reject(new Error('Failed to get templates'));
    });
  }

  async deleteTemplate(id: string): Promise<void> {
    const db = await this.ensureDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['templates'], 'readwrite');
      const store = transaction.objectStore('templates');
      const request = store.delete(id);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(new Error('Failed to delete template'));
    });
  }

  // Utility methods
  async migrateFromLocalStorage(): Promise<void> {
    try {
      // Migrate designs
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith('design_')) {
          try {
            const data = localStorage.getItem(key);
            if (data) {
              const canvasData = JSON.parse(data);
              const designId = key.replace('design_', '');

              const designData: DesignData = {
                id: designId,
                canvasData,
                metadata: {
                  width: canvasData.width || 375,
                  height: canvasData.height || 667,
                  backgroundColor: canvasData.background || '#ffffff',
                  title: `Design ${designId}`,
                  description: 'Migrated from localStorage',
                },
                createdAt: new Date(),
                updatedAt: new Date(),
              };

              await this.saveDesign(designData);
              localStorage.removeItem(key);
            }
          } catch (error) {
            console.warn(`Failed to migrate design ${key}:`, error);
          }
        }
      }

      // Migrate templates
      const templatesKey = 'design-templates';
      const templatesData = localStorage.getItem(templatesKey);
      if (templatesData) {
        try {
          const templates = JSON.parse(templatesData);
          if (Array.isArray(templates)) {
            for (const template of templates) {
              const templateData: TemplateData = {
                id: template.id,
                name: template.name,
                description: template.description,
                category: template.category || 'General',
                canvasData: template.data,
                createdAt: new Date(template.createdAt || Date.now()),
                updatedAt: new Date(template.updatedAt || Date.now()),
              };
              await this.saveTemplate(templateData);
            }
            localStorage.removeItem(templatesKey);
          }
        } catch (error) {
          console.warn('Failed to migrate templates:', error);
        }
      }
    } catch (error) {
      console.warn('Migration from localStorage failed:', error);
    }
  }

  async clearAll(): Promise<void> {
    const db = await this.ensureDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['designs', 'templates'], 'readwrite');

      const clearDesigns = transaction.objectStore('designs').clear();
      const clearTemplates = transaction.objectStore('templates').clear();

      let completed = 0;
      const checkComplete = () => {
        completed++;
        if (completed === 2) {
          resolve();
        }
      };

      clearDesigns.onsuccess = checkComplete;
      clearTemplates.onsuccess = checkComplete;

      clearDesigns.onerror = () => reject(new Error('Failed to clear designs'));
      clearTemplates.onerror = () => reject(new Error('Failed to clear templates'));
    });
  }
}

// Create singleton instance
export const designDB = new DesignIndexedDB();

// Utility functions for design management
export const generateDesignId = () => {
  return `design_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
};

export const generateTemplateId = () => {
  return `template_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
};

export const formatDesignTitle = (designId: string, customTitle?: string) => {
  if (customTitle) {
    return customTitle;
  }

  // Extract timestamp from design ID for better default titles
  const timestampMatch = designId.match(/design_(\d+)_/);
  if (timestampMatch) {
    const timestamp = Number.parseInt(timestampMatch[1] || '0');
    const date = new Date(timestamp);
    return `Design ${date.toLocaleDateString()}`;
  }

  return `Design ${designId.slice(-8)}`;
};

// Initialize on first import
if (typeof window !== 'undefined') {
  designDB.init().then(() => {
    // Auto-migrate from localStorage on first load
    designDB.migrateFromLocalStorage().catch(console.warn);
  }).catch(console.error);
}
