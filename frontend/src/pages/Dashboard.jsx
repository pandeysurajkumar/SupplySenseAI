import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { formatDate, addDateFormatListener } from '../utils/dateUtils';

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dateFormat, setDateFormat] = useState(localStorage.getItem('dateFormat') || 'MM/DD/YYYY');

  useEffect(() => {
    fetchDashboardData();

    // Listen for date format changes
    const cleanup = addDateFormatListener((newFormat) => {
      setDateFormat(newFormat);
      // Re-format existing data with new format
      setReports(prev => prev.map(report => ({
        ...report,
        date: formatDate(report.createdAt, newFormat)
      })));
      setMaterials(prev => prev.map(material => ({
        ...material,
        date: formatDate(material.updatedAt, newFormat)
      })));
    });

    return cleanup;
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch materials
      const materialsRes = await api.get('/materials');
      const materialsData = materialsRes.data.data.slice(0, 4); // Show only first 4 materials

      // Fetch reports
      const reportsRes = await api.get('/reports');
      const reportsData = reportsRes.data.data.slice(0, 4); // Show only first 4 reports

      // Calculate stats
      const totalMaterials = materialsRes.data.count;
      const lowStockItems = materialsData.filter(m => m.currentStock <= m.reorderLevel).length;
      const recentReports = reportsRes.data.count;

      const statsData = [
        {
          label: 'Total Materials',
          value: totalMaterials.toString(),
          subtext: 'Active inventory items'
        },
        {
          label: 'Low Stock Items',
          value: lowStockItems.toString(),
          subtext: 'Requires attention',
          highlight: lowStockItems > 0 ? 'text-amber-600' : ''
        },
        {
          label: 'Recent Reports',
          value: recentReports.toString(),
          subtext: 'Generated reports'
        },
        {
          label: 'System Status',
          value: 'Online',
          subtext: 'All systems operational',
          highlight: 'text-teal-500'
        }
      ];

      // Format materials for display
      const formattedMaterials = materialsData.map(material => ({
        name: material.name,
        category: material.category,
        quantity: `${material.currentStock} ${material.unit}`,
        status: material.status === 'In Stock' ? 'in-stock' :
                material.status === 'Low Stock' ? 'low-stock' : 'out-of-stock',
        updatedAt: material.updatedAt // Keep original for re-formatting
      }));

      // Format reports for display
      const formattedReports = reportsData.map(report => ({
        name: report.name,
        type: report.type,
        date: formatDate(report.createdAt),
        status: report.status === 'Completed' ? 'completed' :
                report.status === 'In Progress' ? 'in-progress' : 'failed',
        createdAt: report.createdAt // Keep original for re-formatting
      }));

      setStats(statsData);
      setMaterials(formattedMaterials);
      setReports(formattedReports);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      // Set default empty state on error
      setStats([
        { label: 'Total Materials', value: '0', subtext: 'Active inventory items' },
        { label: 'Low Stock Items', value: '0', subtext: 'Requires attention' },
        { label: 'Recent Reports', value: '0', subtext: 'Generated reports' },
        { label: 'System Status', value: 'Online', subtext: 'All systems operational', highlight: 'text-teal-500' }
      ]);
      setMaterials([]);
      setReports([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="fade-in">
        <div className="text-center py-10">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
          <p className="mt-2 text-slate-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fade-in">
      {/* Dashboard Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Dashboard Overview</h1>
          <p className="text-slate-600 mt-1">Monitor your supply chain and generate insights</p>
        </div>
        <button
          onClick={fetchDashboardData}
          disabled={loading}
          className="bg-slate-100 text-slate-600 px-4 py-2 rounded-md hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium transition-colors flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h3 className="text-sm font-medium text-slate-500">{stat.label}</h3>
            <p className={`text-3xl font-bold text-slate-800 mt-1 ${stat.highlight || ''}`}>{stat.value}</p>
            <p className={`text-xs ${stat.highlight || 'text-slate-500'} mt-1`}>{stat.subtext}</p>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Material Inventory Status */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-slate-800">Material Inventory Status</h3>
            <button onClick={() => navigate('/app/materials')} className="text-sm font-medium text-teal-500 hover:underline">
              View All
            </button>
          </div>
          <div className="space-y-4">
            {materials.length > 0 ? (
              materials.map((material, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 rounded-md hover:bg-slate-50">
                  <div>
                    <p className="font-medium text-slate-700">{material.name}</p>
                    <p className="text-sm text-slate-500">{material.category}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-slate-700">{material.quantity}</p>
                    <span className={`status-badge status-${material.status}`}>
                      {material.status === 'in-stock' ? 'In Stock' : material.status === 'low-stock' ? 'Low Stock' : 'Out of Stock'}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-slate-500">
                <p className="text-sm">No materials found</p>
                <button
                  onClick={() => navigate('/app/materials')}
                  className="mt-2 text-teal-500 hover:text-teal-600 text-sm font-medium"
                >
                  Add your first material →
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Recent Reports */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-slate-800">Recent Reports & Analytics</h3>
            <button onClick={() => navigate('/app/reports')} className="text-sm font-medium text-teal-500 hover:underline">
              View All
            </button>
          </div>
          <div className="space-y-4">
            {reports.length > 0 ? (
              reports.map((report, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 rounded-md hover:bg-slate-50">
                  <div>
                    <p className="font-medium text-slate-700">{report.name}</p>
                    <p className="text-sm text-slate-500">{report.type}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-slate-500">{report.date}</p>
                    <span className={`status-badge status-${report.status}`}>
                      {report.status === 'completed' ? 'Completed' : report.status === 'in-progress' ? 'In Progress' : 'Failed'}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-slate-500">
                <p className="text-sm">No reports generated yet</p>
                <button
                  onClick={() => navigate('/app/reports')}
                  className="mt-2 text-teal-500 hover:text-teal-600 text-sm font-medium"
                >
                  Generate your first report →
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mt-6">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button onClick={() => navigate('/app/forecasting')} className="flex flex-col items-center justify-center p-4 bg-slate-50 rounded-lg hover:bg-teal-50 text-slate-600 hover:text-teal-600 transition-colors duration-200">
            <svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            <span className="text-sm font-medium">Generate Forecast</span>
          </button>
          <button onClick={() => navigate('/app/materials')} className="flex flex-col items-center justify-center p-4 bg-slate-50 rounded-lg hover:bg-teal-50 text-slate-600 hover:text-teal-600 transition-colors duration-200">
            <svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span className="text-sm font-medium">Add Material</span>
          </button>
          <button onClick={() => navigate('/app/reports')} className="flex flex-col items-center justify-center p-4 bg-slate-50 rounded-lg hover:bg-teal-50 text-slate-600 hover:text-teal-600 transition-colors duration-200">
            <svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span className="text-sm font-medium">Create Report</span>
          </button>
          <button onClick={() => navigate('/app/settings')} className="flex flex-col items-center justify-center p-4 bg-slate-50 rounded-lg hover:bg-teal-50 text-slate-600 hover:text-teal-600 transition-colors duration-200">
            <svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="text-sm font-medium">System Settings</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

