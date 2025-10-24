import React, { useEffect, useRef, useState } from 'react';

const ExcelViewer = ({ data, onSave, onClose }) => {
  const containerRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Load LuckySheet CSS and JS
    const loadLuckySheet = async () => {
      try {
        // Load CSS
        const cssLink = document.createElement('link');
        cssLink.rel = 'stylesheet';
        cssLink.href = 'https://cdn.jsdelivr.net/npm/luckysheet@latest/dist/plugins/css/pluginsCss.css';
        document.head.appendChild(cssLink);

        // Load JS
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/luckysheet@latest/dist/luckysheet.umd.js';
        script.onload = () => {
          setIsLoaded(true);
        };
        document.head.appendChild(script);
      } catch (error) {
        console.error('Failed to load LuckySheet:', error);
      }
    };

    loadLuckySheet();
  }, []);

  useEffect(() => {
    if (isLoaded && containerRef.current) {
      // Initialize LuckySheet
      window.luckysheet.create({
        container: containerRef.current,
        data: data || [
          {
            name: 'Sheet1',
            color: '',
            index: 0,
            status: 1,
            order: 0,
            data: [
              ['Customer Name', 'Phone', 'Priority', 'Segment', 'Reason', 'Time'],
              ['Marie Uwimana', '+250 789 456 789', 'High', 'Gold', 'Churn Risk', '14:30'],
              ['Francine Mutoni', '+250 788 234 567', 'Medium', 'Silver', 'Product Offer', '15:00'],
              ['Grace Mukamana', '+250 787 345 678', 'High', 'Gold', 'Retention Call', '15:30'],
              ['John Nkurunziza', '+250 786 456 789', 'Low', 'Bronze', 'Follow-up', '16:00']
            ],
            config: {},
            pivotTable: null,
            isPivotTable: false,
            chart: []
          }
        ],
        options: {
          container: containerRef.current,
          title: 'BK Pulse - Customer Data',
          lang: 'en',
          allowCopy: true,
          allowEdit: true,
          enableAddRow: true,
          enableAddCol: true,
          showConfigWindowResize: true,
          showToolbarConfig: {
            undoRedo: true,
            paintFormat: true,
            currencyFormat: true,
            percentageFormat: true,
            numberDecrease: true,
            numberIncrease: true,
            moreFormats: true,
            font: true,
            fontSize: true,
            bold: true,
            italic: true,
            strikethrough: true,
            underline: true,
            textColor: true,
            fillColor: true,
            border: true,
            mergeCell: true,
            horizontalAlignMode: true,
            verticalAlignMode: true,
            textWrapMode: true,
            textRotateMode: true,
            image: true,
            link: true,
            chart: true,
            postil: true,
            pivotTable: true,
            function: true,
            frozenMode: true,
            sortAndFilter: true,
            conditionalFormat: true,
            dataVerification: true,
            splitColumn: true,
            screenshot: true,
            findAndReplace: true,
            protection: true,
            print: true
          }
        }
      });

      // Set up save functionality
      window.luckysheet.getSheetData = () => {
        return window.luckysheet.getSheetData();
      };
    }
  }, [isLoaded, data]);

  const handleSave = () => {
    if (window.luckysheet) {
      const sheetData = window.luckysheet.getSheetData();
      onSave(sheetData);
    }
  };

  const handleExport = () => {
    if (window.luckysheet) {
      const sheetData = window.luckysheet.getSheetData();
      const csvContent = sheetData.map(row => 
        row.map(cell => `"${cell || ''}"`).join(',')
      ).join('\n');
      
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `bk_pulse_data_${new Date().toISOString().split('T')[0]}.csv`;
      link.click();
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-[95vw] h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-bold text-gray-900">Excel Viewer - BK Pulse</h2>
          <div className="flex space-x-2">
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
            >
              Save
            </button>
            <button
              onClick={handleExport}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Export
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            >
              Close
            </button>
          </div>
        </div>

        {/* Excel Container */}
        <div className="flex-1 p-4">
          {!isLoaded ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading Excel viewer...</p>
              </div>
            </div>
          ) : (
            <div 
              ref={containerRef} 
              className="w-full h-full"
              style={{ minHeight: '600px' }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export { ExcelViewer };
export default ExcelViewer;
