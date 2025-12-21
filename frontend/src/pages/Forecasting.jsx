import { useState, useRef, useEffect } from 'react';
import { Chart, registerables } from 'chart.js';
import api from '../utils/api'; // Assuming api utils exists

Chart.register(...registerables);

const Forecasting = () => {
  const [formData, setFormData] = useState({
    budget: '',
    location: 'Southern Region',
    towerType: 'Distribution Tower',
    substationType: 'Not Applicable',
    forecastPeriod: '1 Year',
    taxRate: 18
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showBreakdown, setShowBreakdown] = useState(false);
  const [forecastData, setForecastData] = useState(null);
  const [csvData, setCsvData] = useState(null);

  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        const text = evt.target.result;
        // Parse CSV with material-specific data
        const lines = text.split('\n');
        const headers = lines[0].split(',').map(h => h.trim());
        const data = [];

        for (let i = 1; i < lines.length; i++) {
          if (!lines[i].trim()) continue;
          const values = lines[i].split(',');
          const obj = {};
          headers.forEach((h, idx) => {
            obj[headers[idx]] = values[idx]?.trim();
          });

          // Handle both old and new CSV formats
          if (obj['material_name'] && obj['date'] && obj['quantity']) {
            // New format: material_name, date, quantity, unit
            data.push({
              material_name: obj['material_name'],
              date: obj['date'],
              quantity: parseFloat(obj['quantity']),
              unit: obj['unit'] || 'Units'
            });
          } else if (obj['date'] && obj['quantity']) {
            // Old format: date, quantity (assume generic material)
            data.push({
              material_name: 'General',
              date: obj['date'],
              quantity: parseFloat(obj['quantity']),
              unit: 'Units'
            });
          }
        }
        setCsvData(data);
        console.log('Parsed CSV data:', data);
      };
      reader.readAsText(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setShowBreakdown(false);

    try {
      const payload = { ...formData, historicalData: csvData };
      const res = await api.post('/forecasts/generate', payload);
      setForecastData(res.data.data);
      setShowBreakdown(true);
      // Wait for DOM update to render chart
      setTimeout(() => generateChart(res.data.data), 100);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to generate forecast');
    } finally {
      setLoading(false);
    }
  };

  const generateChart = (data) => {
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    const ctx = chartRef.current?.getContext('2d');
    if (!ctx) return;

    chartInstanceRef.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels: data.chartLabels,
        datasets: [
          {
            label: 'Demand Forecast',
            data: data.chartData,
            borderColor: '#4cc9f0',
            backgroundColor: 'rgba(76, 201, 240, 0.1)',
            tension: 0.4
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true
          }
        },
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  };

  const calculateCost = (quantity, unitCost) => {
    // Ensure quantity is a number
    const qty = typeof quantity === 'string' ? parseFloat(quantity.replace(/,/g, '')) : quantity;
    return (qty * unitCost).toLocaleString('en-IN');
  };

  // Safe calculation helper
  const getSubtotal = () => {
    if (!forecastData || !forecastData.materials) return 0;
    return forecastData.materials.reduce((sum, m) => {
      const qty = typeof m.quantity === 'string' ? parseFloat(m.quantity.replace(/,/g, '')) : m.quantity;
      return sum + (qty * m.unitCost);
    }, 0);
  };

  const subtotal = getSubtotal();
  const taxes = subtotal * (formData.taxRate / 100);
  const total = subtotal + taxes;

  return (
    <div className="fade-in">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mb-6">
        <h3 className="text-lg font-semibold text-slate-800 mb-1">Generate New Forecast</h3>
        <p className="text-sm text-slate-500">Use historical data and project parameters to predict future material needs.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 lg:col-span-1">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Forecast Parameters</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Upload Historical Data (CSV)</label>
              <input
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100"
              />
              <p className="text-xs text-slate-400 mt-1">
                Columns: date (YYYY-MM-DD), material_name, quantity, unit<br/>
                Example: 2024-01-01,Steel Cable,150,Kilometers
              </p>
            </div>
            <div>
              <label htmlFor="budget" className="block text-sm font-medium text-slate-700">Project Budget (₹ Crores)</label>
              <input
                type="number"
                id="budget"
                value={formData.budget}
                onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm"
                placeholder="e.g., 100"
                required
              />
            </div>
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-slate-700">Project Location</label>
              <select
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm"
              >
                <option>Northern Region</option>
                <option>Southern Region</option>
                <option>Eastern Region</option>
                <option>Western Region</option>
                <option>North-Eastern Region</option>
              </select>
            </div>
            <div>
              <label htmlFor="tower-type" className="block text-sm font-medium text-slate-700">Tower Type</label>
              <select
                id="tower-type"
                value={formData.towerType}
                onChange={(e) => setFormData({ ...formData, towerType: e.target.value })}
                className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm"
              >
                <option>Transmission Tower</option>
                <option>Distribution Tower</option>
                <option>Sub-station Tower</option>
                <option>Monopole Tower</option>
              </select>
            </div>
            <div>
              <label htmlFor="substation-type" className="block text-sm font-medium text-slate-700">Sub-station Type</label>
              <select
                id="substation-type"
                value={formData.substationType}
                onChange={(e) => setFormData({ ...formData, substationType: e.target.value })}
                className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm"
              >
                <option>Not Applicable</option>
                <option>AIS (Air Insulated)</option>
                <option>GIS (Gas Insulated)</option>
                <option>Hybrid</option>
              </select>
            </div>
            <div>
              <label htmlFor="forecast-period" className="block text-sm font-medium text-slate-700">Forecast Period</label>
              <select
                id="forecast-period"
                value={formData.forecastPeriod}
                onChange={(e) => setFormData({ ...formData, forecastPeriod: e.target.value })}
                className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm"
              >
                <option>6 Months</option>
                <option>1 Year</option>
                <option>2 Years</option>
              </select>
            </div>
            <div>
              <label htmlFor="tax-rate" className="block text-sm font-medium text-slate-700">Applicable Tax Rate (%)</label>
              <input
                type="number"
                id="tax-rate"
                value={formData.taxRate}
                onChange={(e) => setFormData({ ...formData, taxRate: parseFloat(e.target.value) })}
                className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className={`w-full text-white py-2.5 px-4 rounded-md font-semibold transition-colors ${loading ? 'bg-slate-500 cursor-not-allowed' : 'bg-slate-800 hover:bg-slate-900'}`}
            >
              {loading ? 'Processing...' : 'Generate Forecast'}
            </button>
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          </form>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 lg:col-span-2">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">
            Demand Forecast Chart
            {forecastData?.modelInfo && <span className="ml-2 text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full">Model: {forecastData.modelInfo}</span>}
          </h3>
          <div className="h-96">
            {showBreakdown ? (
              <canvas ref={chartRef}></canvas>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-slate-400">
                <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                </svg>
                <p className="text-slate-500">No chart data available</p>
                <p className="text-sm">Generate a forecast to see demand trends</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {showBreakdown && forecastData && (
        <div className="mt-6 bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Forecasted Material Breakdown</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Material</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Quantity</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Unit</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Confidence</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase">Estimated Cost (₹)</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {forecastData.materials.map((material, idx) => (
                  <tr key={idx}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{material.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{material.category}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{material.quantity.toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{material.unit}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-teal-600 font-semibold">{material.confidence}%</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 font-semibold text-right">₹{calculateCost(material.quantity, material.unitCost)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-slate-50">
                  <td colSpan="5" className="px-6 py-3 text-right text-sm font-semibold text-slate-700">Sub-total</td>
                  <td className="px-6 py-3 whitespace-nowrap text-sm text-slate-900 font-bold text-right">₹{subtotal.toLocaleString('en-IN')}</td>
                </tr>
                <tr className="bg-slate-50">
                  <td colSpan="5" className="px-6 py-3 text-right text-sm font-semibold text-slate-700">Taxes</td>
                  <td className="px-6 py-3 whitespace-nowrap text-sm text-slate-900 font-bold text-right">₹{taxes.toLocaleString('en-IN')}</td>
                </tr>
                <tr className="bg-slate-100">
                  <td colSpan="5" className="px-6 py-3 text-right text-md font-semibold text-slate-800">Total Estimated Cost</td>
                  <td className="px-6 py-3 whitespace-nowrap text-md text-slate-900 font-bold text-right">₹{total.toLocaleString('en-IN')}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Forecasting;

