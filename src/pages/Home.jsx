import React from 'react'
import { Link } from 'react-router-dom'
import { FaChartLine, FaRobot, FaChartBar } from 'react-icons/fa'
import { MdOutlineStart } from 'react-icons/md'

import { TbExternalLink } from 'react-icons/tb'
import { GrLinkNext } from 'react-icons/gr'

const LandingPage = () => {
    return (
        <div className="min-h-screen bg-white">
            <header className="border-b border-gray-100">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between py-4">
                        <div className="flex items-center">
                            <span className="text-2xl font-bold text-primary">
                                <img src="./logo.webp" className="w-52" />
                            </span>
                        </div>
                        <div className="flex items-center">
                            <Link
                                to="/login"
                                className="mr-4 text-sm font-medium text-gray-800 hover:opacity-80"
                            >
                                Log in
                            </Link>
                            <Link
                                to="/contact"
                                className="btn btn-primary hidden md:flex"
                            >
                                Contact Sales <TbExternalLink />
                            </Link>
                        </div>
                    </div>
                </div>
            </header>

            <div className="bg-gray-100 py-16">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="lg:flex lg:items-center lg:justify-between">
                        <div className="space-y-8 lg:w-1/2">
                            <div className="w-max bg-primary/10 p-2 text-sm font-medium text-primary">
                                Introducing our next-level analytics
                            </div>
                            <h1 className="mt-2 text-5xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
                                The Future of
                                <div className="my-2" />
                                Product Analytics
                            </h1>
                            <p className="mt-4 max-w-lg text-sm text-gray-500">
                                Simple analytics with AI-assisted insights and
                                flawless visualization for Smarter Product
                                Decisions.
                            </p>

                            <Link to="/login" className="btn btn-primary">
                                Get Started
                                <GrLinkNext className="text-xs" />
                            </Link>
                        </div>

                        <div className="mt-10 lg:mt-0 lg:w-1/2">
                            <div className="bg-white p-6">
                                <h3 className="mb-4 text-2xl font-medium text-gray-900">
                                    Sales Analytics
                                </h3>
                                <p className="text-sm text-gray-500">
                                    Daily revenue and performance
                                </p>
                                <div className="grid lg:grid-cols-2">
                                    <div className="space-y-6">
                                        <div className="mt-6 space-y-1">
                                            <p className="border-l-4 pl-2 text-sm text-gray-500">
                                                Amazon
                                            </p>
                                            <p className="text-xl text-gray-900">
                                                ₹14,768
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                2134 Sales
                                            </p>
                                        </div>

                                        <div className="mt-6 space-y-1">
                                            <p className="border-l-4 pl-2 text-sm text-gray-500">
                                                Ebay
                                            </p>
                                            <p className="text-xl text-gray-900">
                                                ₹14,768
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                Weekly Total
                                            </p>
                                        </div>
                                    </div>
                                    <img
                                        src="./sales.jpg"
                                        className="mt-6 lg:mt-0"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-indigo-900 py-16 text-white">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mb-12 text-center">
                        <h2 className="text-3xl font-bold">
                            From data to decision
                        </h2>
                        <p className="mt-4 text-indigo-200">
                            Let our AI-powered analytics transform your data
                            into actionable insights and strategies.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                        <div className="bg-indigo-800 p-6">
                            <div className="mb-4 flex h-48 items-center justify-center bg-indigo-700 p-4">
                                <div className="relative flex h-full w-full flex-col items-center justify-center">
                                    <FaChartBar className="mb-4 h-16 w-16 text-indigo-300" />
                                    <div className="flex w-full justify-between space-x-2">
                                        {[40, 65, 85, 45, 95, 75].map(
                                            (height, i) => (
                                                <div
                                                    key={i}
                                                    className="flex flex-1 items-end"
                                                >
                                                    <div
                                                        className="w-full rounded-t bg-indigo-400 transition-all duration-500 ease-in-out hover:bg-indigo-300"
                                                        style={{
                                                            height: `${height}%`,
                                                        }}
                                                    />
                                                </div>
                                            )
                                        )}
                                    </div>
                                </div>
                            </div>
                            <h3 className="text-lg font-medium">
                                Performance Analytics
                            </h3>
                            <p className="mt-2 text-sm text-indigo-200">
                                Automatically track, collect, and analyze all
                                aspects of your business performance with our
                                intuitive dashboard and real-time updates.
                            </p>
                        </div>

                        <div className="bg-indigo-800 p-6">
                            <div className="mb-4 flex h-48 items-center justify-center bg-indigo-700">
                                <div className="flex flex-col items-center justify-center">
                                    <FaRobot className="mb-4 h-16 w-16 text-indigo-300" />
                                    <div className="grid grid-cols-3 gap-3">
                                        <div className="h-10 w-10 animate-pulse rounded-full bg-green-400"></div>
                                        <div className="h-10 w-10 animate-pulse rounded-full bg-blue-400 delay-100"></div>
                                        <div className="h-10 w-10 animate-pulse rounded-full bg-red-400 delay-200"></div>
                                    </div>
                                </div>
                            </div>
                            <h3 className="text-lg font-medium">
                                AI-powered Data Journey Mapping
                            </h3>
                            <p className="mt-2 text-sm text-indigo-200">
                                Let our advanced algorithms analyze your
                                customer journeys and identify key touchpoints
                                to optimize your sales funnel.
                            </p>
                        </div>

                        <div className="bg-indigo-800 p-6">
                            <div className="mb-4 flex h-48 items-center justify-center bg-indigo-700 p-4">
                                <div className="flex w-full flex-col items-center">
                                    <FaChartLine className="mb-4 h-16 w-16 text-indigo-300" />
                                    <div className="w-full space-y-3">
                                        <div className="h-3 w-full animate-pulse rounded bg-indigo-500"></div>
                                        <div className="h-3 w-3/4 animate-pulse rounded bg-indigo-400 delay-100"></div>
                                        <div className="h-3 w-1/2 animate-pulse rounded bg-indigo-300 delay-200"></div>
                                        <div className="h-3 w-2/3 animate-pulse rounded bg-indigo-200 delay-300"></div>
                                    </div>
                                </div>
                            </div>
                            <h3 className="text-lg font-medium">
                                Real-time Insights
                            </h3>
                            <p className="mt-2 text-sm text-indigo-200">
                                Watch your business metrics update in real-time
                                and receive intelligent recommendations based on
                                emerging trends and patterns.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-gray-100 py-16">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="bg-primary/10 p-8 md:p-12 lg:flex lg:items-center lg:justify-between">
                        <div>
                            <h2 className="text-2xl font-extrabold text-gray-900">
                                Ready to transform your analytics?
                            </h2>
                            <p className="mt-3 max-w-lg text-sm text-gray-500">
                                Join thousands of companies making better
                                decisions with Apyres.
                            </p>
                        </div>
                        <div className="mt-3 flex flex-col lg:mt-0">
                            <Link to="/contact" className="btn btn-primary">
                                Start Trial
                                <MdOutlineStart />
                            </Link>
                            <p className="mt-2 text-center text-sm text-gray-500">
                                No credit card required
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <footer className="border-t border-gray-100 bg-gray-50">
                <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                    <div className="md:flex md:items-center md:justify-between">
                        <div className="flex justify-center md:justify-start">
                            <img src="./logo.webp" className="w-60" />
                        </div>
                        <div className="mt-8 md:mt-0">
                            <p className="text-center text-sm text-gray-500">
                                &copy; 2025 Alpex Pharma Analytics. All rights
                                reserved.
                            </p>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    )
}

export default LandingPage
