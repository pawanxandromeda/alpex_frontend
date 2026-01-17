import { useState, useEffect } from 'react'
import { ToastContainer, toast } from 'react-toastify'
import { LiaSignInAltSolid } from 'react-icons/lia'
import { AiOutlineEye, AiOutlineEyeInvisible, AiOutlineLock, AiOutlineUser } from 'react-icons/ai'
import { FiAlertCircle, FiShield, FiSmartphone } from 'react-icons/fi'
import { MdOutlineEmail } from 'react-icons/md'
import axios from '@axios'
import * as jwtDecodeModule from 'jwt-decode'
const jwtDecode = jwtDecodeModule.default ?? jwtDecodeModule

function Login() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [isPasswordVisible, setIsPasswordVisible] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [isFocused, setIsFocused] = useState({
        username: false,
        password: false
    })

    // ✅ Moved token check to useEffect
    useEffect(() => {
        const accessToken = localStorage.getItem('accessToken')
        if (accessToken) {
            window.location.href = '/dashboard/todos'
        }
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            const response = await axios.post('auth/login', {
                username,
                password,
            })

            const { accessToken, refreshToken } = response.data

            if (!accessToken) {
                throw new Error('No access token returned from server')
            }

            // ✅ decode JWT to get role & userId
            let decoded
            if (typeof jwtDecode === 'function') {
                decoded = jwtDecode(accessToken)    
            } else {
                try {
                    // Fallback: decode JWT payload without external lib
                    decoded = JSON.parse(atob(accessToken.split('.')[1]))
                } catch (e) {
                    console.error('Failed to decode token', e)
                    throw e
                }
            }

            // Save tokens immediately so other parts can read them right away
            localStorage.setItem('accessToken', accessToken)
            localStorage.setItem('refreshToken', refreshToken)
            localStorage.setItem('username', username)
            localStorage.setItem('role', decoded.role)
            localStorage.setItem('userId', decoded.id)

            toast.success('Login successful! Redirecting...', {
                position: "top-right",
                autoClose: 1500,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            })

            // Redirect shortly after showing toast
            setTimeout(() => {
                if (decoded.role === 'admin') {
                    window.location.href = '/dashboard/todos'
                } else {
                    window.location.href = '/dashboard/todos'
                }
            }, 600)
        } catch (error) {
            console.error('Login error', error, error?.response)

            if (error.response?.status === 401) {
                toast.error(error.response.data?.message ?? 'Unauthorized', { 
                    autoClose: 2000,
                    position: "top-right",
                })
            } else {
                const msg = error.message ?? 'Server could not be accessed.'
                toast.error(msg, { 
                    autoClose: 2000,
                    position: "top-right",
                })
            }
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 flex items-center justify-center p-4">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-green-500/10 to-cyan-500/10 rounded-full blur-3xl"></div>
            </div>

            <div className="relative w-full max-w-6xl flex flex-col md:flex-row rounded-3xl overflow-hidden shadow-2xl shadow-blue-200/50 border border-white/30 backdrop-blur-sm bg-white/90">
                {/* Left Side - Login Form */}
                <div className="flex-1 p-8 md:p-12 lg:p-16">
                    <div className="max-w-md mx-auto">
                        {/* Logo and Welcome */}
                        <div className="mb-10 text-center md:text-left">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg shadow-blue-200 mb-6">
                                <FiShield className="h-8 w-8 text-white" />
                            </div>
                            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 to-blue-800 bg-clip-text text-transparent">
                                Welcome Back
                            </h1>
                            <p className="text-gray-600 mt-2">
                                Sign in to your account to continue
                            </p>
                        </div>

                        {/* Login Form */}
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Username Field */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 flex items-center">
                                    <AiOutlineUser className="mr-2 h-4 w-4 text-blue-500" />
                                    Username
                                </label>
                                <div className={`relative transition-all duration-300 ${isFocused.username ? 'transform scale-[1.02]' : ''}`}>
                                    <input
                                        type="text"
                                        className="w-full pl-12 pr-4 py-4 text-sm rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 bg-white/50 backdrop-blur-sm transition-all duration-200"
                                        onChange={(e) =>
                                            setUsername(e.target.value.toLowerCase())
                                        }
                                        onFocus={() => setIsFocused({...isFocused, username: true})}
                                        onBlur={() => setIsFocused({...isFocused, username: false})}
                                        required
                                        placeholder="Enter your username"
                                    />
                                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                                        <AiOutlineUser className="h-5 w-5 text-gray-400" />
                                    </div>
                                </div>
                            </div>

                            {/* Password Field */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 flex items-center">
                                    <AiOutlineLock className="mr-2 h-4 w-4 text-blue-500" />
                                    Password
                                </label>
                                <div className={`relative transition-all duration-300 ${isFocused.password ? 'transform scale-[1.02]' : ''}`}>
                                    <input
                                        type={isPasswordVisible ? 'text' : 'password'}
                                        className="w-full pl-12 pr-12 py-4 text-sm rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 bg-white/50 backdrop-blur-sm transition-all duration-200"
                                        onChange={(e) => setPassword(e.target.value)}
                                        onFocus={() => setIsFocused({...isFocused, password: true})}
                                        onBlur={() => setIsFocused({...isFocused, password: false})}
                                        required
                                        placeholder="Enter your password"
                                    />
                                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                                        <AiOutlineLock className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <button
                                        type="button"
                                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-600 transition-colors duration-200"
                                        onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                                    >
                                        {isPasswordVisible ? (
                                            <AiOutlineEyeInvisible className="h-5 w-5" />
                                        ) : (
                                            <AiOutlineEye className="h-5 w-5" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Forgot Password */}
                            <div className="flex items-center justify-end">
                                <a
                                    href="#"
                                    className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors duration-200"
                                    onClick={(e) => {
                                        e.preventDefault()
                                        toast.info('Contact administrator for password reset', {
                                            position: "top-right",
                                            autoClose: 3000,
                                        })
                                    }}
                                >
                                    Forgot password?
                                </a>
                            </div>

                            {/* Login Button */}
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-4 px-6 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium rounded-xl shadow-lg hover:shadow-xl shadow-blue-200 hover:shadow-blue-300 transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center"
                            >
                                {isLoading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-3"></div>
                                        Signing in...
                                    </>
                                ) : (
                                    <>
                                        Sign In
                                        <LiaSignInAltSolid className="ml-3 h-5 w-5" />
                                    </>
                                )}
                            </button>

                            {/* Divider */}
                            <div className="relative my-6">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-300"></div>
                                </div>
                                <div className="relative flex justify-center">
                                    <span className="bg-white px-4 text-sm text-gray-500">
                                        Or contact support
                                    </span>
                                </div>
                            </div>

                            {/* Support Contact */}
                            <div className="text-center">
                                <p className="text-sm text-gray-600">
                                    Don't have an account?{' '}
                                    <a
                                        href="../contact"
                                        className="font-medium text-blue-600 hover:text-blue-800 transition-colors duration-200"
                                        onClick={(e) => {
                                            e.preventDefault()
                                            window.location.href = '../contact'
                                        }}
                                    >
                                        Contact support
                                    </a>
                                </p>
                            </div>
                        </form>

                        {/* Features List */}
                        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="flex items-center space-x-3 p-3 rounded-lg bg-gradient-to-r from-blue-50 to-blue-100/30">
                                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                                    <FiShield className="h-5 w-5 text-white" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-800">Secure Login</p>
                                    <p className="text-xs text-gray-600">Enterprise-grade security</p>
                                </div>
                            </div>
                            
                            <div className="flex items-center space-x-3 p-3 rounded-lg bg-gradient-to-r from-green-50 to-green-100/30">
                                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
                                    <MdOutlineEmail className="h-5 w-5 text-white" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-800">24/7 Support</p>
                                    <p className="text-xs text-gray-600">Always here to help</p>
                                </div>
                            </div>
                            
                            <div className="flex items-center space-x-3 p-3 rounded-lg bg-gradient-to-r from-purple-50 to-purple-100/30">
                                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                                    <FiSmartphone className="h-5 w-5 text-white" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-800">Mobile Ready</p>
                                    <p className="text-xs text-gray-600">Access anywhere</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side - Image & Info */}
                <div className="hidden lg:flex lg:w-2/5 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-blue-800">
                        <img
                            src="/login.webp"
                            alt="Login Visual"
                            className="w-full h-full object-cover opacity-20"
                        />
                    </div>
                    
                    {/* Overlay Content */}
                    <div className="relative z-10 p-12 flex flex-col justify-between h-full">
                        <div>
                            <div className="inline-flex items-center space-x-3 bg-white/10 backdrop-blur-sm rounded-2xl px-4 py-3 mb-8">
                                <FiAlertCircle className="h-6 w-6 text-white" />
                                <span className="text-white font-medium">Secure Access Required</span>
                            </div>
                            
                            <h2 className="text-3xl font-bold text-white mb-4">
                                Pharmaceutical CRM
                            </h2>
                            <p className="text-blue-100">
                                Access your customer relationships, inventory, and sales data securely from anywhere.
                            </p>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center space-x-3">
                                <div className="w-2 h-2 bg-white rounded-full"></div>
                                <span className="text-white/90">Track customer relationships</span>
                            </div>
                            <div className="flex items-center space-x-3">
                                <div className="w-2 h-2 bg-white rounded-full"></div>
                                <span className="text-white/90">Manage inventory & orders</span>
                            </div>
                            <div className="flex items-center space-x-3">
                                <div className="w-2 h-2 bg-white rounded-full"></div>
                                <span className="text-white/90">Generate sales reports</span>
                            </div>
                            <div className="flex items-center space-x-3">
                                <div className="w-2 h-2 bg-white rounded-full"></div>
                                <span className="text-white/90">Compliance monitoring</span>
                            </div>
                        </div>

                        {/* Version Info */}
                        <div className="pt-6 border-t border-white/20">
                            <p className="text-white/70 text-sm">
                                Version 2.1.0 • Last updated: Today
                            </p>
                        </div>
                    </div>

                    {/* Animated Elements */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/10 to-transparent rounded-full blur-xl"></div>
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-blue-400/20 to-transparent rounded-full blur-xl"></div>
                </div>
            </div>

            {/* Toast Container */}
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
                className="mt-4"
            />

            {/* Footer */}
            <div className="absolute bottom-4 left-0 right-0 text-center">
                <p className="text-sm text-gray-500">
                    © {new Date().getFullYear()} Pharmaceutical CRM. All rights reserved.
                </p>
                <p className="text-xs text-gray-400 mt-1">
                    By signing in, you agree to our Terms of Service and Privacy Policy
                </p>
            </div>
        </div>
    )
}

export default Login