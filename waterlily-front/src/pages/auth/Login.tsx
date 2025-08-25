import React, { useState, useEffect } from "react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { useForm } from "react-hook-form";
import { useAuthStore } from "@/store/authStore";
import { useNavigate, useLocation } from "react-router-dom";

interface LoginFormData {
  email: string;
  password: string;
  name?: string;
}

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/home";

  const { login, register: registerUser, error, isLoading, clearError } = useAuthStore();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<LoginFormData>();

  // Clear errors when switching between login/register
  useEffect(() => {
    clearError();
    reset();
  }, [isLogin, clearError, reset]);

  const onSubmit = async (data: LoginFormData) => {
    const success = isLogin 
      ? await login({ email: data.email, password: data.password })
      : await registerUser({
          name: data.name!,
          email: data.email,
          password: data.password,
        });

    if (success) {
      navigate(from, { replace: true });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50/70 p-4">
      {/* Decorative elements */}
      <div className="fixed top-1/4 left-10 w-72 h-72 bg-purple-100/40 rounded-full blur-3xl opacity-50 animate-pulse-slow -z-10"></div>
      <div className="fixed bottom-1/4 right-10 w-96 h-96 bg-indigo-100/40 rounded-full blur-3xl opacity-40 animate-pulse-slow delay-1000 -z-10"></div>

      <div className="mb-8 text-center">
        <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 2a8 8 0 100 16 8 8 0 000-16zM8 8a2 2 0 114 0 2 2 0 01-4 0zm2 6a6 6 0 01-6-6h12a6 6 0 01-6 6z" clipRule="evenodd" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {isLogin ? "Welcome Back" : "Create Account"}
        </h1>
        <p className="text-gray-600">
          {isLogin ? "Sign in to continue to SurveyHub" : "Join us to start creating surveys"}
        </p>
      </div>

      <Card className="w-full max-w-md p-8 shadow-xl border-0 bg-white/90 backdrop-blur-sm rounded-2xl">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {!isLogin && (
            <Input
              label="Full Name"
              type="text"
              placeholder="Enter your name"
              registration={register("name", {
                required: !isLogin ? "Name is required" : false,
                minLength: {
                  value: 2,
                  message: "Name must be at least 2 characters",
                },
              })}
              error={errors.name?.message}
            />
          )}

          <Input
            label="Email Address"
            type="email"
            placeholder="Enter your email"
            registration={register("email", {
              required: "Email is required",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Enter a valid email address",
              },
            })}
            error={errors.email?.message}
          />

          <Input
            label="Password"
            type="password"
            placeholder="Enter your password"
            registration={register("password", {
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters",
              },
            })}
            error={errors.password?.message}
          />

          {error && (
            <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          <Button
            type="submit"
            isLoading={isLoading}
            className="w-full py-3 rounded-xl font-medium"
            size="lg"
          >
            {isLogin ? "Sign In" : "Create Account"}
          </Button>
        </form>

        <div className="mt-6 pt-5 border-t border-gray-200">
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="text-gray-600 hover:text-indigo-600 transition-colors text-center w-full"
          >
            {isLogin 
              ? "Don't have an account? Sign up" 
              : "Already have an account? Sign in"}
          </button>
        </div>
      </Card>
    </div>
  );
};

export default Login;