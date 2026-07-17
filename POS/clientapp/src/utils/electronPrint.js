/**
 * Electron Print Utility
 * Handles printing for both Electron and browser environments
 */

/**
 * Check if the app is running inside Electron
 */
export const isElectron = () => {
  return !!(window.electronPOS);
};

/**
 * Print directly in Electron or fallback to browser print dialog
 * @param {string} htmlContent - The HTML content to print
 * @param {Object} options - Print options (optional)
 */
export const printReceipt = async (htmlContent, options = {}) => {
  if (isElectron()) {
    // Running in Electron - use direct printing
    console.log('=== ELECTRON PRINT DEBUG ===');
    console.log('Initial options passed:', options);
    
    // Get saved printer configuration
    const printerConfig = await getDefaultPrinter();
    console.log('Printer config from getDefaultPrinter():', printerConfig);
    
    let configuredPrinter = printerConfig.printerName;
    console.log('Configured printer name:', configuredPrinter);
    
    // FALLBACK: If no printer configured, get first available printer
    if (!configuredPrinter) {
      console.warn('No printer configured. Trying to use first available printer...');
      try {
        const printers = await window.electronPOS.listPrinters();
        if (printers.length > 0) {
          configuredPrinter = printers[0].name;
          console.warn('Using first available printer:', configuredPrinter);
          console.warn('Please go to Printer Settings to save your preferred printer.');
        } else {
          console.error('ERROR: No printers found at all!');
        }
      } catch (error) {
        console.error('Error getting printers:', error);
      }
    }
    
    // Combine options: Use provided options OR configured printer
    const printOptions = {
      ...options,
      deviceName: options.deviceName || configuredPrinter
    };
    
    console.log('Final print options to send to Electron:', printOptions);
    console.log('=======================================');
    
    // Create a hidden iframe to render the content
    const printFrame = document.createElement('iframe');
    printFrame.style.position = 'absolute';
    printFrame.style.width = '0';
    printFrame.style.height = '0';
    printFrame.style.border = 'none';
    printFrame.style.visibility = 'hidden';
    document.body.appendChild(printFrame);
    
    try {
      // Write content to iframe
      const frameDoc = printFrame.contentWindow.document;
      frameDoc.open();
      frameDoc.write(htmlContent);
      frameDoc.close();
      
      // Wait a moment for content to render
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Call the Electron print API with configured printer
      await window.electronPOS.printNow(printOptions);
      console.log('Print job sent to printer:', configuredPrinter || 'default');
      
      // Clean up after a short delay
      setTimeout(() => {
        document.body.removeChild(printFrame);
      }, 500);
    } catch (error) {
      console.error('Electron print failed:', error);
      document.body.removeChild(printFrame);
    }
  } else {
    // Running in browser - use traditional popup window
    console.log('Printing via browser popup...');
    const printWindow = window.open('', '_blank', 'width=320,height=600');
    if (!printWindow) {
      console.error('Failed to open print window');
      return;
    }
    
    printWindow.document.write(htmlContent);
    printWindow.document.close();
  }
};

/**
 * Get list of available printers (Electron only)
 */
export const getAvailablePrinters = async () => {
  if (isElectron()) {
    try {
      const printers = await window.electronPOS.listPrinters();
      console.log('Available printers:', printers);
      return printers;
    } catch (error) {
      console.error('Failed to get printers:', error);
      return [];
    }
  }
  return [];
};

/**
 * Print with a specific printer (Electron only)
 * @param {string} htmlContent - The HTML content to print
 * @param {string} printerName - The name of the printer
 */
export const printWithPrinter = async (htmlContent, printerName) => {
  if (isElectron()) {
    await printReceipt(htmlContent, { deviceName: printerName });
  } else {
    // Fallback to regular print
    await printReceipt(htmlContent);
  }
};

/**
 * Get saved printer configuration (Electron only)
 */
export const getPrinterConfig = async () => {
  if (isElectron()) {
    try {
      return await window.electronPOS.getPrinterConfig();
    } catch (error) {
      console.error('Failed to get printer config:', error);
      return { defaultPrinter: null };
    }
  }
  return { defaultPrinter: null };
};

/**
 * Save printer configuration (Electron only)
 * @param {Object} config - Configuration object with defaultPrinter
 */
export const savePrinterConfig = async (config) => {
  if (isElectron()) {
    try {
      return await window.electronPOS.savePrinterConfig(config);
    } catch (error) {
      console.error('Failed to save printer config:', error);
      return { success: false };
    }
  }
  return { success: false };
};

/**
 * Get current default printer name (Electron only)
 */
export const getDefaultPrinter = async () => {
  if (isElectron()) {
    try {
      return await window.electronPOS.getDefaultPrinter();
    } catch (error) {
      console.error('Failed to get default printer:', error);
      return { printerName: null };
    }
  }
  return { printerName: null };
};
