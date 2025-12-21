import { useState, useEffect } from 'react';
import api from '../utils/api';

const Reports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('All Types');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [generatingReport, setGeneratingReport] = useState(false);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const params = {};
      if (searchTerm) params.search = searchTerm;
      if (typeFilter !== 'All Types') params.type = typeFilter;
      if (statusFilter !== 'All Status') params.status = statusFilter;

      const response = await api.get('/reports', { params });
      setReports(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching reports:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [searchTerm, typeFilter, statusFilter]);

  const handleGenerateReport = async (reportType) => {
    try {
      setGeneratingReport(true);

      // Create a report based on type
      let reportData = {
        name: `${reportType} Report - ${new Date().toLocaleDateString()}`,
        type: reportType,
        status: 'In Progress',
        description: `Generated ${reportType.toLowerCase()} report`
      };

      // Add specific data based on report type
      if (reportType === 'Forecast') {
        // Get forecast data
        try {
          const forecastResponse = await api.get('/forecasts');
          reportData.data = {
            forecasts: forecastResponse.data.data,
            totalForecasts: forecastResponse.data.count
          };
        } catch (error) {
          console.error('Error fetching forecast data:', error);
        }
      } else if (reportType === 'Inventory') {
        // Get materials data
        try {
          const materialsResponse = await api.get('/materials');
          reportData.data = {
            materials: materialsResponse.data.data,
            totalMaterials: materialsResponse.data.count
          };
        } catch (error) {
          console.error('Error fetching materials data:', error);
        }
      } else if (reportType === 'Usage') {
        // Get combined data
        try {
          const [materialsRes, forecastsRes] = await Promise.all([
            api.get('/materials'),
            api.get('/forecasts')
          ]);
          reportData.data = {
            materials: materialsRes.data.data,
            forecasts: forecastsRes.data.data,
            summary: {
              totalMaterials: materialsRes.data.count,
              totalForecasts: forecastsRes.data.count
            }
          };
        } catch (error) {
          console.error('Error fetching usage data:', error);
        }
      }

      // Create the report in database
      const response = await api.post('/reports', reportData);

      // Simulate processing time
      setTimeout(() => {
        // Update report status to completed
        api.put(`/reports/${response.data.data._id}`, {
          status: 'Completed',
          fileSize: `${(Math.random() * 5 + 1).toFixed(1)} MB`
        }).then(() => {
          fetchReports(); // Refresh the list
        });
      }, 2000);

      setShowGenerateModal(false);
      fetchReports(); // Refresh immediately to show "In Progress"

    } catch (error) {
      console.error('Error generating report:', error);
      alert('Failed to generate report');
    } finally {
      setGeneratingReport(false);
    }
  };

  const handleDownload = async (report) => {
    try {
      // Generate CSV content based on report type
      let csvContent = '';

      if (report.type === 'Forecast' && report.data?.forecasts) {
        csvContent = 'Name,Type,Budget,Status,Created Date\n';
        report.data.forecasts.forEach(forecast => {
          csvContent += `${forecast.projectName || 'N/A'},${forecast.towerType || 'N/A'},${forecast.budget || 0},${forecast.status || 'N/A'},${new Date(forecast.createdAt).toLocaleDateString()}\n`;
        });
      } else if (report.type === 'Inventory' && report.data?.materials) {
        csvContent = 'Name,Category,Stock,Unit,Status,Supplier\n';
        report.data.materials.forEach(material => {
          csvContent += `${material.name},${material.category},${material.currentStock},${material.unit},${material.status},${material.supplier?.name || 'N/A'}\n`;
        });
      } else {
        // Generic data
        csvContent = 'Report Name,Type,Status,Created Date\n';
        csvContent += `${report.name},${report.type},${report.status},${new Date(report.createdAt).toLocaleDateString()}\n`;
      }

      // Create and download file
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${report.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

    } catch (error) {
      console.error('Error downloading report:', error);
      alert('Failed to download report');
    }
  };

  const handleView = (report) => {
    // Show report details in a modal or new view
    const details = `
Report: ${report.name}
Type: ${report.type}
Status: ${report.status}
Created: ${new Date(report.createdAt).toLocaleDateString()}

${report.data ? JSON.stringify(report.data, null, 2) : 'No detailed data available'}
    `;

    alert(details); // For now, show in alert. Could be enhanced to show in modal
  };

  const formatFileSize = (report) => {
    if (report.fileSize) return report.fileSize;

    // Estimate size based on data
    if (report.data) {
      const dataSize = JSON.stringify(report.data).length;
      return `${(dataSize / 1024 / 1024).toFixed(1)} MB`;
    }

    return 'N/A';
  };

  return (
    <div className="fade-in">
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 mb-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search reports by name..."
            className="w-full md:w-72 px-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-teal-400 sm:text-sm"
          />
          <div className="flex items-center gap-4">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="rounded-md border-slate-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm"
            >
              <option>All Types</option>
              <option>Forecast</option>
              <option>Inventory</option>
              <option>Usage</option>
              <option>Review</option>
              <option>Summary</option>
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-md border-slate-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm"
            >
              <option>All Status</option>
              <option>Completed</option>
              <option>In Progress</option>
              <option>Failed</option>
            </select>
            <button
              onClick={() => setShowGenerateModal(true)}
              className="bg-slate-800 text-white py-2 px-4 rounded-md hover:bg-slate-900 font-semibold"
            >
              Generate Report
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-10">Loading reports...</div>
      ) : reports.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl border border-dashed border-slate-300 text-slate-500">
          <p className="text-lg">No reports found.</p>
          <p className="text-sm">Click "Generate Report" to create a new report.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reports.map((report) => (
            <div key={report._id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h4 className="text-lg font-semibold text-slate-800">{report.name}</h4>
                  <div className="flex items-center gap-4 mt-2">
                    <span className={`status-badge status-${report.type.toLowerCase()}`}>
                      {report.type}
                    </span>
                    <span className={`status-badge status-${report.status.toLowerCase().replace(' ', '-')}`}>
                      {report.status}
                    </span>
                    <span className="text-sm text-slate-500">Size: {formatFileSize(report)}</span>
                  </div>
                  {report.description && (
                    <p className="text-sm text-slate-600 mt-2">{report.description}</p>
                  )}
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-slate-500">
                    {new Date(report.createdAt).toLocaleDateString()}
                  </span>
                  <button
                    onClick={() => handleDownload(report)}
                    disabled={report.status !== 'Completed'}
                    className={`font-medium ${
                      report.status === 'Completed'
                        ? 'text-teal-600 hover:text-teal-700'
                        : 'text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    Download
                  </button>
                  <button
                    onClick={() => handleView(report)}
                    className="text-slate-600 hover:text-slate-700 font-medium"
                  >
                    View
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Generate Report Modal */}
      {showGenerateModal && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
              <h3 className="text-lg font-semibold text-slate-800">Generate New Report</h3>
              <button
                onClick={() => setShowGenerateModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-sm text-slate-600 mb-4">
                Select the type of report you want to generate:
              </p>
              <div className="grid grid-cols-1 gap-3">
                {[
                  { type: 'Forecast', desc: 'Analysis of demand forecasting data' },
                  { type: 'Inventory', desc: 'Current inventory status and materials' },
                  { type: 'Usage', desc: 'Material usage and procurement analysis' },
                  { type: 'Review', desc: 'Supplier performance review' },
                  { type: 'Summary', desc: 'Annual procurement summary' }
                ].map((option) => (
                  <button
                    key={option.type}
                    onClick={() => handleGenerateReport(option.type)}
                    disabled={generatingReport}
                    className="text-left p-4 border border-slate-200 rounded-lg hover:border-teal-300 hover:bg-teal-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <h4 className="font-semibold text-slate-800">{option.type} Report</h4>
                    <p className="text-sm text-slate-600">{option.desc}</p>
                  </button>
                ))}
              </div>
              {generatingReport && (
                <div className="text-center py-4">
                  <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-teal-600"></div>
                  <p className="text-sm text-slate-600 mt-2">Generating report...</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports;

