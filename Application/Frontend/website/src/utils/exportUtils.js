/**
 * Utility function to convert an array of JSON objects into a downloadable CSV file.
 * @param {Array<Object>} data Array of objects to export
 * @param {String} filename Output CSV filename
 */
export function exportToCSV(data, filename = 'export.csv') {
  if (!data || data.length === 0) {
    alert('No data available to export.');
    return;
  }

  // Extract CSV headers
  const headers = Object.keys(data[0]);
  const csvRows = [];

  // Add Header Row
  csvRows.push(headers.join(','));

  // Add Data Rows
  for (const row of data) {
    const values = headers.map(header => {
      const val = row[header];
      const escaped = ('' + (val ?? '')).replace(/"/g, '""');
      return `"${escaped}"`;
    });
    csvRows.push(values.join(','));
  }

  // Generate Blob and Trigger Download
  const csvString = csvRows.join('\n');
  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Triggers native browser print dialog for PDF export.
 */
export function exportToPDF() {
  window.print();
}
