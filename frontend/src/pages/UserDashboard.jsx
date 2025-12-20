import { useNavigate } from 'react-router-dom';

const UserDashboard = () => {
    const navigate = useNavigate();

    const stats = [
        { label: 'Assigned Materials', value: '12', subtext: 'Items under your care' },
        { label: 'Pending Requests', value: '3', subtext: 'Awaiting approval', highlight: 'text-amber-600' },
    ];

    return (
        <div className="fade-in">
            <h1 className="text-2xl font-bold text-slate-800 mb-6">User Dashboard</h1>

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

            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <h3 className="text-lg font-semibold text-slate-800 mb-4">My Activities</h3>
                <p className="text-slate-500">You have access to basic material viewing and reporting features.</p>

                <div className="mt-6 flex space-x-4">
                    <button onClick={() => navigate('/app/materials')} className="px-4 py-2 bg-teal-50 text-teal-700 rounded-lg hover:bg-teal-100 transition-colors">
                        View Materials
                    </button>
                    <button onClick={() => navigate('/app/reports')} className="px-4 py-2 bg-slate-50 text-slate-700 rounded-lg hover:bg-slate-100 transition-colors">
                        View Reports
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UserDashboard;
