import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Phone, Eye, EyeOff, Loader, Plane } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import toast from 'react-hot-toast';

interface RegisterFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
}

const RegisterForm = () => {
  const navigate = useNavigate();
  const { register: registerUser, isLoading } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const { register, handleSubmit, formState: { errors }, watch } = useForm<RegisterFormData>();
  const password = watch('password');

  const onSubmit = async (data: RegisterFormData) => {
    try {
      await registerUser({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        password: data.password,
        preferredCurrency: 'NGN'
      });
      toast.success('Welcome to Flyeasy! Your account has been created.');
      navigate('/dashboard');
    } catch (error) {
      toast.error('Failed to create account. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-ivory-50 via-champagne-50 to-ivory-100 px-6 py-12">
      <div className="max-w-lg w-full">
        <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl p-10 border border-champagne-200">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="bg-gradient-to-r from-navy-800 to-navy-900 p-4 rounded-2xl w-16 h-16 flex items-center justify-center mx-auto mb-6 shadow-lg">
              <Plane className="h-8 w-8 text-ivory-50" />
            </div>
            <h1 className="font-serif text-3xl font-bold text-navy-900 mb-3">Join Flyeasy</h1>
            <p className="font-sans text-charcoal-600">Begin your luxury travel experience</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-sans text-sm font-medium text-charcoal-700 mb-3">
                  First Name
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gold-500" />
                  <input
                    type="text"
                    {...register('firstName', { required: 'First name is required' })}
                    className="w-full pl-12 pr-4 py-4 border border-champagne-200 rounded-xl focus:ring-2 focus:ring-gold-400 focus:border-transparent transition-all font-sans text-charcoal-800 bg-ivory-50/50"
                    placeholder="John"
                  />
                </div>
                {errors.firstName && (
                  <p className="mt-2 font-sans text-sm text-red-600">{errors.firstName.message}</p>
                )}
              </div>

              <div>
                <label className="block font-sans text-sm font-medium text-charcoal-700 mb-3">
                  Last Name
                </label>
                <input
                  type="text"
                  {...register('lastName', { required: 'Last name is required' })}
                  className="w-full px-4 py-4 border border-champagne-200 rounded-xl focus:ring-2 focus:ring-gold-400 focus:border-transparent transition-all font-sans text-charcoal-800 bg-ivory-50/50"
                  placeholder="Doe"
                />
                {errors.lastName && (
                  <p className="mt-2 font-sans text-sm text-red-600">{errors.lastName.message}</p>
                )}
              </div>
            </div>

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
                  placeholder="john@example.com"
                />
              </div>
              {errors.email && (
                <p className="mt-2 font-sans text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="block font-sans text-sm font-medium text-charcoal-700 mb-3">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gold-500" />
                <input
                  type="tel"
                  {...register('phone', { required: 'Phone number is required' })}
                  className="w-full pl-12 pr-4 py-4 border border-champagne-200 rounded-xl focus:ring-2 focus:ring-gold-400 focus:border-transparent transition-all font-sans text-charcoal-800 bg-ivory-50/50"
                  placeholder="+234 800 000 0000"
                />
              </div>
              {errors.phone && (
                <p className="mt-2 font-sans text-sm text-red-600">{errors.phone.message}</p>
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
                      value: 8,
                      message: 'Password must be at least 8 characters'
                    }
                  })}
                  className="w-full pl-12 pr-12 py-4 border border-champagne-200 rounded-xl focus:ring-2 focus:ring-gold-400 focus:border-transparent transition-all font-sans text-charcoal-800 bg-ivory-50/50"
                  placeholder="Create a secure password"
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

            <div>
              <label className="block font-sans text-sm font-medium text-charcoal-700 mb-3">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gold-500" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  {...register('confirmPassword', { 
                    required: 'Please confirm your password',
                    validate: value => value === password || 'Passwords do not match'
                  })}
                  className="w-full pl-12 pr-12 py-4 border border-champagne-200 rounded-xl focus:ring-2 focus:ring-gold-400 focus:border-transparent transition-all font-sans text-charcoal-800 bg-ivory-50/50"
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-charcoal-400 hover:text-charcoal-600 transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-2 font-sans text-sm text-red-600">{errors.confirmPassword.message}</p>
              )}
            </div>

            <div>
              <label className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  {...register('acceptTerms', { required: 'You must accept the terms and conditions' })}
                  className="h-4 w-4 text-navy-800 focus:ring-gold-400 border-champagne-300 rounded mt-1"
                />
                <span className="font-sans text-sm text-charcoal-600 leading-relaxed">
                  I agree to the{' '}
                  <Link to="/terms" className="text-navy-800 hover:text-navy-900 transition-colors">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link to="/privacy" className="text-navy-800 hover:text-navy-900 transition-colors">
                    Privacy Policy
                  </Link>
                </span>
              </label>
              {errors.acceptTerms && (
                <p className="mt-2 font-sans text-sm text-red-600">{errors.acceptTerms.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-navy-800 to-navy-900 text-ivory-50 py-4 px-6 rounded-xl font-sans font-semibold text-lg hover:from-navy-700 hover:to-navy-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-3 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              {isLoading ? (
                <>
                  <Loader className="h-5 w-5 animate-spin" />
                  <span>Creating your account...</span>
                </>
              ) : (
                <span>Join Flyeasy</span>
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="font-sans text-charcoal-600">
              Already have an account?{' '}
              <Link to="/login" className="text-navy-800 hover:text-navy-900 font-medium transition-colors">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;