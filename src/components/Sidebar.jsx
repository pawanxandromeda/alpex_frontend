import { useNavigate, useLocation } from 'react-router-dom'
    import { useState, useEffect } from 'react'
    import { ToastContainer } from 'react-toastify'
import { sidebarItems } from "@data/sidebar-data";
    import { BsChevronDown, BsChevronLeft, BsChevronRight } from 'react-icons/bs'
    import { HiMenu } from 'react-icons/hi'

    function Sidebar({ isCollapsed, setIsCollapsed }) {
    const navigate = useNavigate()
    const location = useLocation()
    const authorization = localStorage.getItem('role')

    const [openDropdowns, setOpenDropdowns] = useState({})
    const [filteredSidebarItems, setFilteredSidebarItems] = useState([])
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    //   const [isCollapsed, setIsCollapsed] = useState(false) // ← new: collapsible desktop sidebar

    const toggleDropdown = (id) => {
        setOpenDropdowns((prev) => ({
        ...prev,
        [id]: !prev[id],
        }))
    }

    const hasRole = (userRole, itemRoles) => {
        if (!userRole || !itemRoles) return false
        const role = userRole.toLowerCase()
        if (role === 'admin') return true
        return itemRoles.map(r => r.toLowerCase()).includes(role)
    }

    useEffect(() => {
        const filterItems = () => {
        if (!authorization || authorization === 'admin') {
            setFilteredSidebarItems(sidebarItems)
            return
        }

        const filtered = sidebarItems.filter(
            (item) => item.roles && hasRole(authorization, item.roles)
        )

        filtered.forEach((item) => {
            if (item.items) {
            item.items = item.items.filter(
                (subItem) => subItem.roles && hasRole(authorization, subItem.roles)
            )
            }
        })

        setFilteredSidebarItems(filtered)
        }

        filterItems()
    }, [authorization])

    const isActive = (path) => path && location.pathname.includes(path)

    const handleItemClick = (item) => {
        if (item.isDropdown && item.id) {
        toggleDropdown(item.id)
        return
        }
        if (item.path) {
        navigate(`../dashboard/${item.path}`)
        if (window.innerWidth < 768) setMobileMenuOpen(false)
        }
        if (item.action) {
        item.action()
        if (window.innerWidth < 768) setMobileMenuOpen(false)
        }
    }

    // Close mobile menu on resize to desktop
    useEffect(() => {
        const handleResize = () => {
        if (window.innerWidth >= 768) setMobileMenuOpen(false)
        }
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    // Body scroll lock for mobile menu
    useEffect(() => {
        document.body.style.overflow = mobileMenuOpen ? 'hidden' : 'auto'
        return () => {
        document.body.style.overflow = 'auto'
        }
    }, [mobileMenuOpen])

    return (
        <>
        {/* ================== DESKTOP SIDEBAR ================== */}
        <aside
    className={`
        fixed top-0 left-0 h-screen z-50
        transition-all duration-500 ease-out
        bg-black overflow-y-auto
    `}
    style={{
        width: isCollapsed ? '80px' : '288px',
    }}
    >
            {/* Header + Collapse toggle */}
            <div className="relative flex items-center justify-between px-5 py-6 border-b border-white/5">
            {!isCollapsed && (
                <div className="flex items-center gap-3">
                <img
                    src="/logo.webp"
                    alt="Logo"
                    className="h-9 w-auto rounded-xl shadow-lg shadow-black/40 "
                />
                </div>
            )}

            <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="p-2.5 rounded-full hover:bg-white/5 transition-colors duration-200"
                title={isCollapsed ? 'Expand' : 'Collapse'}
            >
                {isCollapsed ? (
                <BsChevronRight className="w-5 h-5 text-neutral-400" />
                ) : (
                <BsChevronLeft className="w-5 h-5 text-neutral-400" />
                )}
            </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto px-3 py-6 scrollbar-hide">
            <ul className="space-y-1.5">
                {filteredSidebarItems.map((item) => (
                <li key={item.id || item.label}>
                    {/* Main Item */}
                    <div
                    onClick={() => handleItemClick(item)}
                    className={`
                        group relative flex items-center gap-4 px-4 py-3.5 rounded-2xl
                        transition-all duration-300 cursor-pointer
                        ${
                        isActive(item.path)
                            ? 'bg-indigo-600/15 text-white'
                            : 'text-neutral-400 hover:bg-white/5 hover:text-neutral-100'
                        }
                        ${isCollapsed ? 'justify-center' : ''}
                    `}
                    >
                    <div
                        className={`
                        flex items-center justify-center w-8 h-8 rounded-xl transition-all duration-300
                        ${isActive(item.path) ? 'bg-indigo-600/30' : 'bg-neutral-800/40 group-hover:bg-neutral-700/60'}
                        `}
                    >
                        {item.icon}
                    </div>

                    {!isCollapsed && (
                        <>
                        <span className="flex-1 font-medium tracking-tight text-[15px]">
                            {item.label}
                        </span>

                        {item.isDropdown && (
                            <BsChevronDown
                            className={`w-4 h-4 transition-transform duration-300 ${
                                openDropdowns[item.id] ? 'rotate-180' : ''
                            }`}
                            />
                        )}
                        </>
                    )}
                    </div>

                    {/* Dropdown Items - only when expanded */}
                    {item.isDropdown && openDropdowns[item.id] && !isCollapsed && (
                    <ul className="mt-1.5 ml-12 space-y-1 animate-fadeIn">
                        {item.items.map((subItem) => (
                        <li key={subItem.label}>
                            <div
                            onClick={() => handleItemClick(subItem)}
                            className={`
                                flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm
                                transition-all duration-300 cursor-pointer
                                ${
                                isActive(subItem.path)
                                    ? 'bg-indigo-600/10 text-indigo-300'
                                    : 'text-neutral-400 hover:bg-white/5 hover:text-neutral-200'
                                }
                            `}
                            >
                            {subItem.icon}
                            <span className="font-medium tracking-tight">
                                {subItem.label}
                            </span>
                            </div>
                        </li>
                        ))}
                    </ul>
                    )}
                </li>
                ))}
            </ul>
            </nav>
        </aside>

        {/* ================== MOBILE HEADER + DRAWER ================== */}
        <div className="md:hidden">
            {/* Top Bar */}
            <div className="fixed top-0 left-0 right-0 z-40 bg-neutral-950/90 backdrop-blur-xl border-b border-white/5">
            <div className="flex items-center justify-between px-5 py-4">
                <img
                src="/logo.webp"
                alt="Logo"
                className="h-8 w-auto rounded-xl"
                />

                <button
                onClick={() => setMobileMenuOpen(true)}
                className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
                >
                <HiMenu className="w-6 h-6 text-white" />
                </button>
            </div>
            </div>

            {/* Backdrop */}
            {mobileMenuOpen && (
            <div
                className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm md:hidden"
                onClick={() => setMobileMenuOpen(false)}
            />
            )}

            {/* Mobile Drawer - slides from right like iOS */}
            <div
            className={`
                fixed inset-y-0 right-0 z-50 w-4/5 max-w-sm bg-neutral-950
                transform transition-transform duration-500 ease-out
                ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}
                shadow-2xl border-l border-white/5
            `}
            >
            <div className="flex flex-col h-full">
                <div className="flex items-center justify-between px-6 py-6 border-b border-white/5">
                <img src="/logo.webp" alt="Logo" className="h-9 rounded-xl" />
                <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-3 rounded-full hover:bg-white/10 transition-colors"
                >
                    <BsChevronRight className="w-6 h-6 text-neutral-300" />
                </button>
                </div>

                <nav className="flex-1 overflow-y-auto px-4 py-6">
                {/* same list structure as desktop but mobile optimized */}
                <ul className="space-y-2">
                    {filteredSidebarItems.map((item) => (
                    <li key={item.id || item.label}>
                        <div
                        onClick={() => handleItemClick(item)}
                        className={`
                            flex items-center gap-4 px-5 py-4 rounded-2xl
                            ${isActive(item.path)
                            ? 'bg-indigo-600/20 text-white'
                            : 'text-neutral-300 hover:bg-white/5'}
                        `}
                        >
                        <div className="w-10 h-10 rounded-xl bg-neutral-800/60 flex items-center justify-center text-xl">
                            {item.icon}
                        </div>
                        <span className="flex-1 font-medium text-base">{item.label}</span>
                        {item.isDropdown && <BsChevronDown className="w-5 h-5 opacity-70" />}
                        </div>

                        {item.isDropdown && openDropdowns[item.id] && (
                        <ul className="mt-1 pl-14 space-y-1.5">
                            {item.items.map((sub) => (
                            <li key={sub.label}>
                                <div
                                onClick={() => handleItemClick(sub)}
                                className={`
                                    flex items-center gap-3 px-5 py-3 rounded-xl text-sm
                                    ${isActive(sub.path)
                                    ? 'bg-indigo-600/15 text-indigo-300'
                                    : 'text-neutral-400 hover:bg-white/5'}
                                `}
                                >
                                {sub.icon}
                                <span>{sub.label}</span>
                                </div>
                            </li>
                            ))}
                        </ul>
                        )}
                    </li>
                    ))}
                </ul>
                </nav>
            </div>
            </div>
        </div>

        <ToastContainer theme="dark" position="bottom-right" />
        </>
    )
    }

    export default Sidebar