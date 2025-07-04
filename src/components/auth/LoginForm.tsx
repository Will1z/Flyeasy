import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Loader, Plane } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import toast from 'react-hot-toast';

interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

const LoginForm = () => {
  const navigate = useNavigate();
  const { login, isLoading } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>();

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data.email, data.password);
      toast.success('Welcome back to Flyeasy');
      navigate('/dashboard');
    } catch (error) {
      toast.error('Invalid credentials. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-ivory-50 via-champagne-50 to-ivory-100 px-6 py-12">
      <div className="max-w-md w-full">
        <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl p-10 border border-champagne-200">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="bg-gradient-to-r from-navy-800 to-navy-900 p-4 rounded-2xl w-16 h-16 flex items-center justify-center mx-auto mb-6 shadow-lg">
              <Plane className="h-8 w-8 text-ivory-50" />
            </div>
            <h1 className="font-serif text-3xl font-bold text-navy-900 mb-3">Welcome Back</h1>
            <p className="font-sans text-charcoal-600">Continue your luxury travel journey</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block font-sans text-sm font-medium text-charcoal-700 mb-3">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gold-500" />
                <input
                  type="email"
                  {...register('email', { 
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Please enter a valid email address'
                    }
                  })}
                  className="w-full pl-12 pr-4 py-4 border border-champagne-200 rounded-xl focus:ring-2 focus:ring-gold-400 focus:border-transparent transition-all font-sans text-charcoal-800 bg-ivory-50/50"
                  placeholder="Enter your email"
                />
              </div>
              {errors.email && (
                <p className="mt-2 font-sans text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="block font-sans text-sm font-medium text-charcoal-700 mb-3">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gold-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  {...register('password', { 
                    required: 'Password is required',
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters'
                    }
                  })}
                  className="w-full pl-12 pr-12 py-4 border border-champagne-200 rounded-xl focus:ring-2 focus:ring-gold-400 focus:border-transparent transition-all font-sans text-charcoal-800 bg-ivory-50/50"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-charcoal-400 hover:text-charcoal-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-2 font-sans text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  {...register('rememberMe')}
                  className="h-4 w-4 text-navy-800 focus:ring-gold-400 border-champagne-300 rounded"
                />
                <span className="ml-3 font-sans text-sm text-charcoal-600">Remember me</span>
              </label>
              <Link to="/forgot-password" className="font-sans text-sm text-navy-800 hover:text-navy-900 transition-colors">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-navy-800 to-navy-900 text-ivory-50 py-4 px-6 rounded-xl font-sans font-semibold text-lg hover:from-navy-700 hover:to-navy-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-3 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              {isLoading ? (
                <>
                  <Loader className="h-5 w-5 animate-spin" />
                  <span>Signing you in...</span>
                </>
              ) : (
                <span>Sign In</span>
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="font-sans text-charcoal-600">
              New to Flyeasy?{' '}
              <Link to="/register" className="text-navy-800 hover:text-navy-900 font-medium transition-colors">
                Create your account
              </Link>
            </p>
          </div>

          {/* Demo Credentials */}
          <div className="mt-8 p-4 bg-champagne-50 rounded-xl border border-champagne-200">
            <p className="font-sans text-sm text-charcoal-600 text-center">
              <strong>Demo Access:</strong> Use any email and password to explore
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;