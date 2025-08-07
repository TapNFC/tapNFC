/* eslint-disable no-console */
import type { DesignData } from './indexedDB';
import { designDB } from './indexedDB';

// Test function to verify IndexedDB is working correctly
export async function testIndexedDBFunctionality(): Promise<boolean> {
  try {
    console.log('Testing IndexedDB functionality...');

    // Initialize the database
    await designDB.init();
    console.log('✅ IndexedDB initialized successfully');

    // Create a test design
    const testDesign: DesignData = {
      id: `test_design_${Date.now()}`,
      canvasData: {
        version: '5.2.4',
        objects: [
          {
            type: 'text',
            left: 100,
            top: 100,
            width: 200,
            height: 50,
            text: 'Test Design Element',
            fontSize: 24,
            fill: '#000000',
            fontFamily: 'Arial',
          },
          {
            type: 'rect',
            left: 100,
            top: 200,
            width: 150,
            height: 100,
            fill: '#3b82f6',
            stroke: '#1e40af',
            strokeWidth: 2,
          },
          {
            elementType: 'button',
            left: 100,
            top: 350,
            width: 120,
            height: 40,
            buttonData: {
              text: 'Test Button',
              backgroundColor: '#10b981',
              textColor: '#ffffff',
              borderRadius: 8,
              action: { type: 'url', value: 'https://example.com' },
            },
          },
        ],
        background: '#ffffff',
      },
      metadata: {
        width: 375,
        height: 667,
        backgroundColor: '#ffffff',
        title: 'Test Design',
        description: 'Test design for IndexedDB functionality',
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Save the test design
    await designDB.saveDesign(testDesign);
    console.log('✅ Test design saved successfully');

    // Retrieve the test design
    const retrievedDesign = await designDB.getDesign(testDesign.id);
    if (!retrievedDesign) {
      throw new Error('Failed to retrieve saved design');
    }
    console.log('✅ Test design retrieved successfully');

    // Verify the data integrity
    if (retrievedDesign.id !== testDesign.id) {
      throw new Error('Design ID mismatch');
    }
    if (retrievedDesign.canvasData.objects.length !== testDesign.canvasData.objects.length) {
      throw new Error('Canvas objects count mismatch');
    }
    if (retrievedDesign.metadata.width !== testDesign.metadata.width) {
      throw new Error('Metadata width mismatch');
    }
    console.log('✅ Data integrity verified');

    // Test updating the design
    const updatedDesign = {
      ...retrievedDesign,
      metadata: {
        ...retrievedDesign.metadata,
        title: 'Updated Test Design',
      },
      updatedAt: new Date(),
    };
    await designDB.saveDesign(updatedDesign);
    console.log('✅ Design update successful');

    // Clean up - delete the test design
    await designDB.deleteDesign(testDesign.id);
    console.log('✅ Test design cleanup successful');

    // Verify deletion
    const deletedDesign = await designDB.getDesign(testDesign.id);
    if (deletedDesign !== null) {
      throw new Error('Design was not properly deleted');
    }
    console.log('✅ Design deletion verified');

    console.log('🎉 All IndexedDB tests passed!');
    return true;
  } catch (error) {
    console.error('❌ IndexedDB test failed:', error);
    return false;
  }
}

// Test migration from localStorage to IndexedDB
export async function testMigrationFromLocalStorage(): Promise<boolean> {
  try {
    console.log('Testing migration from localStorage...');

    // Create a test design in localStorage
    const testDesignId = `migration_test_${Date.now()}`;
    const testCanvasData = {
      version: '5.2.4',
      objects: [
        {
          type: 'text',
          left: 50,
          top: 50,
          text: 'Migration Test',
          fontSize: 20,
          fill: '#000000',
        },
      ],
      width: 400,
      height: 300,
      background: '#f0f0f0',
    };

    localStorage.setItem(`design_${testDesignId}`, JSON.stringify(testCanvasData));
    console.log('✅ Test design added to localStorage');

    // Initialize IndexedDB (this should trigger migration)
    await designDB.init();
    await designDB.migrateFromLocalStorage();
    console.log('✅ Migration completed');

    // Check if the design was migrated to IndexedDB
    const migratedDesign = await designDB.getDesign(testDesignId);
    if (!migratedDesign) {
      throw new Error('Design was not migrated to IndexedDB');
    }
    console.log('✅ Design successfully migrated to IndexedDB');

    // Verify the migrated data
    if (migratedDesign.canvasData.objects[0].text !== 'Migration Test') {
      throw new Error('Migrated data is incorrect');
    }
    console.log('✅ Migrated data verified');

    // Check if localStorage entry was removed
    const localStorageEntry = localStorage.getItem(`design_${testDesignId}`);
    if (localStorageEntry !== null) {
      console.log('⚠️ localStorage entry was not removed (this is OK for backward compatibility)');
    }

    // Clean up
    await designDB.deleteDesign(testDesignId);
    localStorage.removeItem(`design_${testDesignId}`);
    console.log('✅ Migration test cleanup successful');

    console.log('🎉 Migration test passed!');
    return true;
  } catch (error) {
    console.error('❌ Migration test failed:', error);
    return false;
  }
}

// Run all tests
export async function runAllTests(): Promise<void> {
  console.log('🧪 Starting IndexedDB functionality tests...');

  const basicTest = await testIndexedDBFunctionality();
  const migrationTest = await testMigrationFromLocalStorage();

  if (basicTest && migrationTest) {
    console.log('🎉 All tests passed! IndexedDB is working correctly.');
  } else {
    console.error('❌ Some tests failed. Check the logs above for details.');
  }
}

// Add a utility function to check if IndexedDB is supported
export function isIndexedDBSupported(): boolean {
  return typeof window !== 'undefined' && 'indexedDB' in window;
}

// Add a utility function to get design preview URL
export function getDesignPreviewUrl(designId: string, baseUrl?: string, slug?: string): string {
  const base = baseUrl || (typeof window !== 'undefined' ? window.location.origin : '');
  const previewIdentifier = slug || designId;
  return `${base}/en/preview/${previewIdentifier}`;
}
