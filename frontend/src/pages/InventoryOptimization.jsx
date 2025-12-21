import { useState, useEffect } from 'react';
import api from '../utils/api';
import { useNavigate } from 'react-router-dom';

const InventoryOptimization = () => {
    const [optimizationData, setOptimizationData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [forecastName, setForecastName] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchOptimizationData();
    }, []);

    const fetchOptimizationData = async () => {
        try {
            setLoading(true);
            const res = await api.get('/inventory/optimization');
            setOptimizationData(res.data.data.optimizationItems);
            setForecastName(res.data.data.forecastName);
            setError(null);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch optimization data');
        } finally {
            setLoading(false);
        }
    };

    const handleRefreshAnalysis = () => {
        // Refresh the page to reload all data
        window.location.reload();
    };

    const handleDeleteAnalysis = async () => {
        if (window.confirm('Are you sure you want to delete all analysis data? This will clear all forecasts and analysis results.')) {
            try {
                setLoading(true);
                // Delete all forecasts from database
                const forecastsRes = await api.get('/forecasts');
                const forecasts = forecastsRes.data.data;

                // Delete each forecast
                for (const forecast of forecasts) {
                    await api.delete(`/forecasts/${forecast._id}`);
                }

                // Clear local state
                setOptimizationData([]);
                setForecastName('No Active Forecast');
                setError(null);

                alert('All analysis data has been cleared successfully.');
            } catch (err) {
                console.error('Error deleting analysis:', err);
                alert('Failed to delete analysis data. Please try again.');
            } finally {
                setLoading(false);
            }
        }
    };

    if (loading) return <div className="p-6">Loading inventory analysis...</div>;
    if (error) return <div className="p-6 text-red-500">Error: {error}</div>;

    return (
        <div className="fade-in">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mb-6">
                <div className="flex justify-between items-center mb-4">
                <div>
                    <h3 className="text-xl font-semibold text-slate-800 mb-1">Inventory Optimization & Procurement</h3>
                    <p className="text-sm text-slate-500">Analyzing stock against forecast: <span className="font-semibold text-slate-700">{forecastName}</span></p>
                </div>
                    <div className="flex gap-3">
                        <button
                            onClick={handleRefreshAnalysis}
                            disabled={loading}
                            className="bg-slate-100 text-slate-600 px-4 py-2 rounded-md hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium transition-colors"
                        >
                            🔄 Refresh Analysis
                        </button>
                <button
                            onClick={handleDeleteAnalysis}
                            disabled={loading}
                            className="bg-red-100 text-red-600 px-4 py-2 rounded-md hover:bg-red-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium transition-colors"
                >
                            🗑️ Delete Analysis
                </button>
                    </div>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-4">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm text-red-700">{error}</p>
                            </div>
                        </div>
                    </div>
                )}

                <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <h3 className="text-sm font-medium text-blue-800">Analysis Information</h3>
                            <div className="mt-2 text-sm text-blue-700">
                                <p>• <strong>Refresh Analysis:</strong> Reloads the page to fetch latest data</p>
                                <p>• <strong>Delete Analysis:</strong> Removes all forecasts and analysis data</p>
                                <p>• Generate forecasts first to see meaningful analysis results</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200">
                        <thead className="bg-slate-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Material</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Current Stock</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Forecasted Demand</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Shortage</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase">Action</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-slate-200">
                            {optimizationData.map((item, idx) => (
                                <tr key={idx} className={item.status === 'Shortage' ? 'bg-red-50' : ''}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-slate-900">{item.materialName}</div>
                                        <div className="text-xs text-slate-500">{item.category}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                                        {item.currentStock} <span className="text-xs">{item.unit}</span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                                        {item.forecastedDemand} <span className="text-xs">{item.unit}</span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${item.status === 'Shortage' ? 'bg-red-100 text-red-800' :
                                                item.status === 'Surplus' ? 'bg-yellow-100 text-yellow-800' :
                                                    'bg-green-100 text-green-800'}`}>
                                            {item.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                                        {item.shortage > 0 ? (
                                            <span className="font-bold text-red-600">{item.shortage} {item.unit}</span>
                                        ) : '-'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                                        {item.recommendation !== 'None' && (
                                            <button className={`font-medium ${item.status === 'Shortage' ? 'text-teal-600 hover:text-teal-900' : 'text-slate-400 cursor-not-allowed'}`}>
                                                {item.recommendation}
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            {optimizationData.length === 0 && (
                                <tr>
                                    <td colSpan="6" className="px-6 py-10 text-center text-slate-500">
                                        No materials found to analyze.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default InventoryOptimization;
