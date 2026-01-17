import { useState } from 'react';

function Header({ 
    heading, 
    description, 
    buttonName, 
    handleClick,
    notificationCount = 0,
    hasUpdates = false 
}) {
    const [showNotifications, setShowNotifications] = useState(false);
    const [notifications, setNotifications] = useState([
        { id: 1, title: "System Updated", message: "All systems are running optimally", time: "2 min ago", read: false },
        { id: 2, title: "Performance Boost", message: "Memory usage optimized by 15%", time: "1 hour ago", read: false },
        { id: 3, title: "Welcome Back", message: "Continue where you left off", time: "Yesterday", read: true }
    ]);

    const unreadCount = notifications.filter(n => !n.read).length;

    const markAllAsRead = () => {
        setNotifications(notifications.map(n => ({ ...n, read: true })));
    };

    const clearAllNotifications = () => {
        setNotifications([]);
    };

    return (
        <div className="mb-8 bg-gradient-to-r from-gray-50 to-gray-100/80 px-4 py-6 sm:px-6 border-b border-gray-300/30">
            <div className="mx-auto flex max-w-full items-center justify-between">
                {/* Left side: Heading and Description */}
                <div className="flex flex-col items-start justify-between space-y-3 md:flex-row md:items-center md:space-y-0">
                    <div>
                        <div className="flex items-center">
                            {/* Apple-like subtle indicator */}
                            <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 mr-3 animate-pulse"></div>
                            <h1 className="text-2xl font-semibold text-gray-900 tracking-tight font-sf-pro">
                                {heading}
                            </h1>
                            {hasUpdates && (
                                <span className="ml-2 px-1.5 py-0.5 text-[10px] font-medium bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-full animate-pulse">
                                    NEW
                                </span>
                            )}
                        </div>
                        <p className="mt-1.5 text-sm text-gray-600 font-light pl-4 tracking-wide">
                            {description}
                        </p>
                    </div>
                </div>

                {/* Right side: Notifications and Button */}
                <div className="flex items-center space-x-3">
                    {/* Notification Bell */}
                    <div className="relative">
                        <button
                            onClick={() => setShowNotifications(!showNotifications)}
                            className="relative p-2 rounded-xl hover:bg-gray-200/50 transition-all duration-200 ease-out group"
                            aria-label="Notifications"
                        >
                            <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                            </svg>
                            
                            {unreadCount > 0 && (
                                <span className="absolute -top-1 -right-1 flex items-center justify-center w-4 h-4 text-xs font-medium text-white bg-gradient-to-r from-red-500 to-pink-500 rounded-full animate-bounce">
                                    {unreadCount}
                                </span>
                            )}
                            
                            {/* Hover effect */}
                            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                        </button>

                        {/* Notification Dropdown */}
                        {showNotifications && (
                            <>
                                <div 
                                    className="fixed inset-0 z-40" 
                                    onClick={() => setShowNotifications(false)}
                                />
                                <div className="absolute right-0 mt-2 w-80 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-300/50 z-50 overflow-hidden">
                                    <div className="p-4 border-b border-gray-200/50">
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-lg font-semibold text-gray-900 font-sf-pro">Notifications</h3>
                                            <div className="flex space-x-2">
                                                {unreadCount > 0 && (
                                                    <button
                                                        onClick={markAllAsRead}
                                                        className="text-xs text-blue-600 hover:text-blue-700 font-medium px-2 py-1 rounded-lg hover:bg-blue-50 transition-colors"
                                                    >
                                                        Mark all read
                                                    </button>
                                                )}
                                                <button
                                                    onClick={clearAllNotifications}
                                                    className="text-xs text-gray-500 hover:text-gray-700 font-medium px-2 py-1 rounded-lg hover:bg-gray-100 transition-colors"
                                                >
                                                    Clear all
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="max-h-96 overflow-y-auto">
                                        {notifications.length > 0 ? (
                                            notifications.map((notification) => (
                                                <div 
                                                    key={notification.id}
                                                    className={`p-4 border-b border-gray-100/50 hover:bg-gray-50/80 transition-colors ${!notification.read ? 'bg-blue-50/30' : ''}`}
                                                >
                                                    <div className="flex items-start">
                                                        <div className={`flex-shrink-0 w-2 h-2 mt-1.5 rounded-full ${notification.read ? 'bg-gray-400' : 'bg-gradient-to-r from-blue-500 to-cyan-400'}`}></div>
                                                        <div className="ml-3 flex-1">
                                                            <div className="flex justify-between items-start">
                                                                <h4 className="text-sm font-medium text-gray-900">{notification.title}</h4>
                                                                <span className="text-xs text-gray-500">{notification.time}</span>
                                                            </div>
                                                            <p className="mt-1 text-sm text-gray-600">{notification.message}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="p-8 text-center">
                                                <div className="w-12 h-12 mx-auto rounded-full bg-gray-100 flex items-center justify-center mb-3">
                                                    <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                </div>
                                                <p className="text-gray-500 text-sm">No notifications</p>
                                            </div>
                                        )}
                                    </div>
                                    
                                    {notifications.length > 0 && (
                                        <div className="p-4 border-t border-gray-200/50 bg-gradient-to-r from-gray-50/50 to-gray-100/50">
                                            <button 
                                                onClick={() => setShowNotifications(false)}
                                                className="w-full py-2.5 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100/50 rounded-xl transition-colors duration-200"
                                            >
                                                Close
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </>
                        )}
                    </div>

                    {/* Main Action Button */}
                    {buttonName && (
                        <button
                            className="group relative inline-flex items-center justify-center px-5 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-gray-900 to-gray-800 hover:from-gray-800 hover:to-gray-700 active:from-gray-700 active:to-gray-600 rounded-xl transition-all duration-300 ease-out shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-gray-900/20 overflow-hidden"
                            onClick={handleClick}
                        >
                            {/* Shine effect */}
                            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                            
                           
                            {buttonName}
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Header;