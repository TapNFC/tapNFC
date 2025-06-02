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

        // Create object store if it doesn't exist
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
          store.createIndex('createdAt', 'createdAt', { unique: false });
          store.createIndex('expiresAt', 'expiresAt', { unique: false });
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
