import {
    MdDashboard,
    MdProductionQuantityLimits,
    MdDesignServices,
    MdOutlineInventory2,
} from 'react-icons/md'

import { BsListTask, BsPeopleFill, BsBoxSeam } from 'react-icons/bs'

import {
    FaUserTie,
    FaUsers,
    FaWarehouse,
    FaMoneyCheckAlt,
    FaCogs,
    FaShippingFast,
    FaFlask,
} from 'react-icons/fa'

import { TbReportAnalytics, TbPackage, TbTestPipe } from 'react-icons/tb'
import { GiCardboardBox } from 'react-icons/gi'
import { BiLogOutCircle } from 'react-icons/bi'
import { HiUserGroup, HiClipboardCheck } from 'react-icons/hi'
import { AiOutlineCheckCircle } from 'react-icons/ai'

import handleLogout from '@utils/logout'

const username = localStorage.getItem('username')

export const hrItems = [
    {
        label: 'Employees',
        icon: <BsPeopleFill size={20} />,
        path: 'employees',
        roles: ['admin', 'hr'],
    },
    {
        label: 'Expenses',
        icon: <BsPeopleFill size={20} />,
        path: 'expenses',
        roles: ['admin', 'hr'],
    },
    {
        label: 'Candidates',
        icon: <FaUserTie size={20} />,
        path: 'candidates',
        roles: ['admin', 'hr'],
    },
    {
        label: 'Attendance',
        icon: <TbReportAnalytics size={20} />,
        path: 'attendance',
        roles: ['admin', 'hr'],
    },
]

export const storeItems = [
    {
        label: 'Raw Material',
        icon: <TbPackage size={20} />,
        path: 'rawmaterial',
        roles: ['admin', 'store'],
    },
    {
        label: 'Packing Material',
        icon: <GiCardboardBox size={20} />,
        path: 'packingmaterial',
        roles: ['admin', 'store'],
    },
    {
        label: 'Dispencing',
        icon: <MdOutlineInventory2 size={20} />,
        path: 'dispencing',
        roles: ['admin', 'store'],
    },
    {
        label: 'Dispatch',
        icon: <FaShippingFast size={20} />,
        path: 'dispatch',
        roles: ['admin', 'store'],
    },
]

export const qualityControlItems = [
    {
        label: 'QC Tests',
        icon: <TbTestPipe size={20} />,
        path: 'qc',
        roles: ['admin', 'qc'],
    },
    {
        label: 'Approvals',
        icon: <AiOutlineCheckCircle size={20} />,
        path: 'approvals',
        roles: ['admin', 'qc'],
    },
]

export const sidebarItems = [
    {
        label: 'Overview',
        icon: <MdDashboard size={20} />,
        path: 'overview',
        roles: ['admin'],
    },
    {
        label: 'Todos',
        icon: <BsListTask size={20} />,
        path: 'todos',
        roles: [
            'admin',
            'accounts',
            'qc',
            'store',
            'hr',
            'designer',
            'qa',
            'sales',
            'production',
            'ppic',
        ],
    },
    {
        label: 'HR Management',
        icon: <HiUserGroup size={20} />,
        isDropdown: true,
        id: 'hr-management',
        items: hrItems,
        roles: ['admin', 'hr'],
    },
    {
        label: 'Store',
        icon: <FaWarehouse size={20} />,
        isDropdown: true,
        id: 'store',
        items: storeItems,
        roles: ['admin', 'store'],
    },
    {
        label: 'Sales Records',
        icon: <BsBoxSeam size={20} />,
        path: 'sales',
        roles: ['admin', 'sales'],
    },
    {
        label: 'Accounts',
        icon: <FaMoneyCheckAlt size={20} />,
        path: 'accounts',
        roles: ['admin', 'accounts'],
    },
    {
        label: 'Designer',
        icon: <MdDesignServices size={20} />,
        path: 'designer',
        roles: ['admin', 'designer'],
    },
    {
        label: 'PPIC',
        icon: <FaCogs size={20} />,
        path: 'ppic',
        roles: ['admin', 'ppic'],
    },
    {
        label: 'Quality Control',
        icon: <FaFlask size={20} />,
        isDropdown: true,
        id: 'quality-control',
        items: qualityControlItems,
        roles: ['admin', 'qc'],
    },
    {
        label: 'QA',
        icon: <HiClipboardCheck size={20} />,
        path: 'qa',
        roles: ['admin', 'qa'],
    },
    {
        label: 'Customers',
        icon: <FaUsers size={20} />,
        path: 'customers',
        roles: ['admin', 'accounts'],
    },
    {
        label: 'Production',
        icon: <MdProductionQuantityLimits size={20} />,
        path: 'production',
        roles: ['admin', 'production'],
    },
    {
        label: 'Logout',
        icon: <BiLogOutCircle size={20} />,
        action: () => handleLogout(username),
        className: 'btn-error btn-outline',
        roles: [
            'admin',
            'accounts',
            'qc',
            'store',
            'hr',
            'designer',
            'qa',
            'sales',
            'production',
            'ppic',
        ],
    },
]
