import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';

const SignUpPage = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        fullName: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        // All new accounts are created as admin
        const finalRole = 'admin';

        try {
            const response = await api.post('/auth/register', {
                username: formData.username,
                email: formData.email,
                fullName: formData.fullName,
                password: formData.password,
                role: finalRole
            });

            navigate('/login', { state: { message: 'Account created successfully! Please log in.' } });
        } catch (err) {
            console.error('Registration error:', err);
            setError(err.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-slate-900">
            <div className="w-full max-w-md p-8 space-y-6 bg-slate-800 rounded-2xl shadow-2xl text-center border border-slate-700">
                <h2 className="text-3xl font-bold text-white">Create Account</h2>
                <p className="text-slate-400">Join SupplySenseAI</p>

                {error && <div className="text-red-500 bg-red-100/10 p-2 rounded text-sm">{error}</div>}

                <form onSubmit={handleSubmit} className="mt-8 space-y-4">
                    <input
                        name="fullName"
                        type="text"
                        required
                        value={formData.fullName}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-slate-700 border border-slate-600 placeholder-slate-400 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-teal-400"
                        placeholder="Full Name"
                    />
                    <input
                        name="username"
                        type="text"
                        required
                        value={formData.username}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-slate-700 border border-slate-600 placeholder-slate-400 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-teal-400"
                        placeholder="Username"
                    />
                    <input
                        name="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-slate-700 border border-slate-600 placeholder-slate-400 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-teal-400"
                        placeholder="Email Address"
                    />
                    <input
                        name="password"
                        type="password"
                        required
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-slate-700 border border-slate-600 placeholder-slate-400 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-teal-400"
                        placeholder="Password"
                    />
                    <input
                        name="confirmPassword"
                        type="password"
                        required
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-slate-700 border border-slate-600 placeholder-slate-400 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-teal-400"
                        placeholder="Confirm Password"
                    />

                    <div className="text-center mb-4">
                        <p className="text-slate-300 text-sm">Account will be created with Admin privileges</p>
                    </div>

                    <button
                        type="submit"
                        className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-semibold rounded-md text-slate-900 bg-teal-400 hover:bg-teal-500 transition-colors duration-300"
                    >
                        Sign Up
                    </button>
                </form>

                <p className="text-sm text-slate-500 mt-4">
                    Already have an account? <Link to="/login" className="text-teal-400 hover:underline">Log in</Link>
                </p>
            </div>
        </div>
    );
};

export default SignUpPage;
