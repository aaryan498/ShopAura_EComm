'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { FiEye, FiEyeOff, FiMail, FiLock, FiUser } from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [passwordMatchError, setPasswordMatchError] = useState<string | null>(null);

  // Password strength rules: [length, specialChar, upperCase, lowerCase, number]
  const [passwordStrength, setPasswordStrength] = useState<boolean[]>([false, false, false, false, false]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    if (formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword) {
      setPasswordMatchError('Passwords do not match.');
    } else {
      setPasswordMatchError(null);
    }
  }, [formData.password, formData.confirmPassword]);

  useEffect(() => {
    const password = formData.password;
    const newStrength = [
      password.length >= 8, // Length > 8
      /[!@#$%^&*(),.?":{}|<>]/.test(password), // At least 1 special character
      /[A-Z]/.test(password), // At least 1 uppercase character
      /[a-z]/.test(password), // At least 1 lowercase character
      /[0-9]/.test(password), // At least 1 number
    ];
    setPasswordStrength(newStrength);
  }, [formData.password]);

  const isPasswordStrong = useMemo(() => passwordStrength.every(rule => rule), [passwordStrength]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setPasswordMatchError(null);

    if (!isPasswordStrong) {
      setError('Password does not meet all strength requirements.');
      setIsLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setPasswordMatchError('Passwords do not match.');
      setIsLoading(false);
      return;
    }

    // Placeholder for actual registration logic
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));
      console.log('Registration successful!', formData);
      // Redirect or update auth state
      // router.push('/auth/login'); // Example redirect
    } catch (err) {
      setError('An unexpected error occurred during registration. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Simulate Google sign-up
      await new Promise((resolve) => setTimeout(resolve, 1500));
      console.log('Sign up with Google successful!');
      // Redirect or update auth state
    } catch (err) {
      setError('Failed to sign up with Google.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="flex items-center justify-center min-h-[calc(100vh-10rem)] bg-background py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full space-y-8 bg-card p-8 md:p-10 rounded-xl shadow-lg border border-border"
      >
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-foreground">
            Create your ShopAura account
          </h2>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <a href="/auth/login" className="font-medium text-primary hover:text-primary/80">
              Sign in here
            </a>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleRegister}>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-destructive/10 border border-destructive text-destructive p-3 rounded-md text-sm text-center"
            >
              {error}
            </motion.div>
          )}

          <div className="rounded-md shadow-sm -space-y-px">
            {/* First Name */}
            <div>
              <label htmlFor="firstName" className="sr-only">First Name</label>
              <div className="relative">
                <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  autoComplete="given-name"
                  required
                  className="appearance-none rounded-t-md relative block w-full px-10 py-3 border border-border placeholder-muted-foreground text-foreground focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm bg-input"
                  placeholder="First Name"
                  value={formData.firstName}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            {/* Middle Name */}
            <div>
              <label htmlFor="middleName" className="sr-only">Middle Name</label>
              <div className="relative">
                <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  id="middleName"
                  name="middleName"
                  type="text"
                  autoComplete="additional-name"
                  className="appearance-none relative block w-full px-10 py-3 border border-border placeholder-muted-foreground text-foreground focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm bg-input"
                  placeholder="Middle Name (Optional)"
                  value={formData.middleName}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            {/* Last Name */}
            <div>
              <label htmlFor="lastName" className="sr-only">Last Name</label>
              <div className="relative">
                <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  autoComplete="family-name"
                  required
                  className="appearance-none relative block w-full px-10 py-3 border border-border placeholder-muted-foreground text-foreground focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm bg-input"
                  placeholder="Last Name"
                  value={formData.lastName}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            {/* Email */}
            <div>
              <label htmlFor="email-address" className="sr-only">Email address</label>
              <div className="relative">
                <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="appearance-none relative block w-full px-10 py-3 border border-border placeholder-muted-foreground text-foreground focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm bg-input"
                  placeholder="Email address"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            {/* Password */}
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <div className="relative">
                <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  className="appearance-none relative block w-full px-10 py-3 border border-border placeholder-muted-foreground text-foreground focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm bg-input"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleInputChange}
                />
                <motion.span
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-muted-foreground hover:text-foreground"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                </motion.span>
              </div>
            </div>
            {/* Password Strength Indicator */}
            <div className="flex justify-between mt-2 space-x-1">
              {passwordStrength.map((isMet, index) => (
                <div
                  key={index}
                  className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
                    isMet ? 'bg-success' : 'bg-muted-foreground'
                  }`}
                ></div>
              ))}
            </div>
            {/* Re-enter Password */}
            <div>
              <label htmlFor="confirmPassword" className="sr-only">Re-enter Password</label>
              <div className="relative">
                <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  className="appearance-none rounded-b-md relative block w-full px-10 py-3 border border-border placeholder-muted-foreground text-foreground focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm bg-input"
                  placeholder="Re-enter Password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                />
                <motion.span
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-muted-foreground hover:text-foreground"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                >
                  {showConfirmPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                </motion.span>
              </div>
              {passwordMatchError && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-destructive text-xs mt-2 text-center"
                >
                  {passwordMatchError}
                </motion.div>
              )}
            </div>
          </div>

          <div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading || !isPasswordStrong || passwordMatchError !== null}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-lg font-semibold rounded-md text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              {isLoading ? (
                <span className="flex items-center">
                  <svg className="animate-spin h-5 w-5 text-primary-foreground mr-3" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing up...
                </span>
              ) : (
                'Sign up'
              )}
            </motion.button>
          </div>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-card text-muted-foreground">Or continue with</span>
          </div>
        </div>

        <div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleGoogleSignUp}
            disabled={isLoading}
            className="group relative w-full flex justify-center items-center py-3 px-4 border border-border text-lg font-semibold rounded-md text-foreground bg-secondary hover:bg-secondary/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            <FcGoogle className="h-6 w-6 mr-2" />
            Sign up with Google
          </motion.button>
        </div>
      </motion.div>
    </section>
  );
};

export default RegisterForm;