import React from 'react'

const StatCard = ({
    icon: Icon,
    title,
    value,
    description,
    variant = 'blue',
    className = '',
    trend = null,
    percentage = null,
    loading = false,
    onClick,
}) => {
    const variants = {
        blue: {
            gradient: 'from-blue-500/10 via-blue-500/5 to-transparent',
            iconBg: 'bg-gradient-to-br from-blue-500 to-blue-600',
            iconColor: 'text-white',
            textColor: 'text-blue-700',
            border: 'border-blue-500/10',
            lightText: 'text-blue-600/70',
        },
        green: {
            gradient: 'from-emerald-500/10 via-emerald-500/5 to-transparent',
            iconBg: 'bg-gradient-to-br from-emerald-500 to-emerald-600',
            iconColor: 'text-white',
            textColor: 'text-emerald-700',
            border: 'border-emerald-500/10',
            lightText: 'text-emerald-600/70',
        },
        red: {
            gradient: 'from-rose-500/10 via-rose-500/5 to-transparent',
            iconBg: 'bg-gradient-to-br from-rose-500 to-rose-600',
            iconColor: 'text-white',
            textColor: 'text-rose-700',
            border: 'border-rose-500/10',
            lightText: 'text-rose-600/70',
        },
        purple: {
            gradient: 'from-purple-500/10 via-purple-500/5 to-transparent',
            iconBg: 'bg-gradient-to-br from-purple-500 to-purple-600',
            iconColor: 'text-white',
            textColor: 'text-purple-700',
            border: 'border-purple-500/10',
            lightText: 'text-purple-600/70',
        },
        orange: {
            gradient: 'from-orange-500/10 via-orange-500/5 to-transparent',
            iconBg: 'bg-gradient-to-br from-orange-500 to-orange-600',
            iconColor: 'text-white',
            textColor: 'text-orange-700',
            border: 'border-orange-500/10',
            lightText: 'text-orange-600/70',
        },
        indigo: {
            gradient: 'from-indigo-500/10 via-indigo-500/5 to-transparent',
            iconBg: 'bg-gradient-to-br from-indigo-500 to-indigo-600',
            iconColor: 'text-white',
            textColor: 'text-indigo-700',
            border: 'border-indigo-500/10',
            lightText: 'text-indigo-600/70',
        },
        gray: {
            gradient: 'from-gray-500/10 via-gray-500/5 to-transparent',
            iconBg: 'bg-gradient-to-br from-gray-600 to-gray-700',
            iconColor: 'text-white',
            textColor: 'text-gray-700',
            border: 'border-gray-500/10',
            lightText: 'text-gray-600/70',
        },
    }

    const selectedVariant = variants[variant] || variants.blue

    const renderTrendIndicator = () => {
        if (!trend) return null
        
        const isPositive = trend === 'up'
        return (
            <div className={`ml-2 flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                isPositive 
                    ? 'bg-emerald-100/50 text-emerald-700' 
                    : 'bg-rose-100/50 text-rose-700'
            }`}>
                {isPositive ? '↑' : '↓'}
                {percentage && (
                    <span className="ml-0.5">{percentage}%</span>
                )}
            </div>
        )
    }

    const renderSkeleton = () => (
        <div className="animate-pulse">
            <div className="flex items-center">
                <div className="h-12 w-12 rounded-full bg-gray-200/50"></div>
                <div className="ml-4 flex-grow space-y-2">
                    <div className="h-4 w-24 rounded bg-gray-200/50"></div>
                    <div className="h-8 w-16 rounded bg-gray-200/50"></div>
                    <div className="h-3 w-32 rounded bg-gray-200/50"></div>
                </div>
            </div>
        </div>
    )

    return (
        <div 
            className={`group relative rounded-2xl bg-gradient-to-br from-white/60 to-white/30 backdrop-blur-sm border ${selectedVariant.border} shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-[1.02] ${onClick ? 'cursor-pointer' : ''} ${className}`}
            onClick={onClick}
            role={onClick ? "button" : undefined}
            tabIndex={onClick ? 0 : undefined}
        >
            {/* Background gradient */}
            <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${selectedVariant.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
            
            {/* Content */}
            <div className="relative p-6">
                {loading ? (
                    renderSkeleton()
                ) : (
                    <>
                        <div className="flex items-start justify-between">
                            <div className="flex items-center">
                                <div className={`rounded-2xl p-3 shadow-lg ${selectedVariant.iconBg}`}>
                                    <Icon className={`h-6 w-6 ${selectedVariant.iconColor}`} />
                                </div>
                            </div>
                            
                            {trend && (
                                <div className="flex items-center">
                                    {renderTrendIndicator()}
                                </div>
                            )}
                        </div>
                        
                        <div className="mt-6">
                            <h3 className={`text-sm font-medium ${selectedVariant.lightText} font-sf-pro-medium uppercase tracking-wider`}>
                                {title}
                            </h3>
                            <div className="mt-2 flex items-baseline">
                                <p className={`text-3xl font-bold ${selectedVariant.textColor} font-sf-pro`}>
                                    {value}
                                </p>
                                {trend && (
                                    <div className="ml-3">
                                        {renderTrendIndicator()}
                                    </div>
                                )}
                            </div>
                            {description && (
                                <p className={`mt-2 text-sm ${selectedVariant.lightText} font-sf-pro-text`}>
                                    {description}
                                </p>
                            )}
                        </div>
                        
                        {/* Progress bar indicator */}
                        {percentage && (
                            <div className="mt-4">
                                <div className="h-1.5 w-full rounded-full bg-gray-200/50 overflow-hidden">
                                    <div 
                                        className={`h-full rounded-full ${selectedVariant.iconBg} transition-all duration-1000 ease-out`}
                                        style={{ width: `${Math.min(Math.abs(percentage), 100)}%` }}
                                    ></div>
                                </div>
                            </div>
                        )}
                        
                        {/* Hover effect line */}
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-current to-transparent opacity-0 group-hover:opacity-20 transition-opacity duration-500"></div>
                    </>
                )}
            </div>
            
            {/* Corner accent */}
            <div className={`absolute top-0 right-0 h-12 w-12 bg-gradient-to-br ${selectedVariant.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500 rounded-tr-2xl rounded-bl-2xl`}></div>
            
            {/* Click indicator */}
            {onClick && (
                <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="rounded-full bg-white/20 p-1.5 backdrop-blur-sm">
                        <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                    </div>
                </div>
            )}
        </div>
    )
}

export default StatCard