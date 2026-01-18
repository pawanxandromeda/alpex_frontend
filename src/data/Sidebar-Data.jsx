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

/* ================= HR ================= */
export const hrItems = [
  {
    label: 'Employees',
    icon: <BsPeopleFill size={20} />,
    path: 'employees',
    department: ['hr'],
  },
  {
    label: 'Expenses',
    icon: <BsPeopleFill size={20} />,
    path: 'expenses',
    department: ['hr'],
  },
  {
    label: 'Candidates',
    icon: <FaUserTie size={20} />,
    path: 'candidates',
    department: ['hr'],
  },
  {
    label: 'Attendance',
    icon: <TbReportAnalytics size={20} />,
    path: 'attendance',
    department: ['hr'],
  },
]

/* ================= STORE ================= */
export const storeItems = [
  {
    label: 'Raw Material',
    icon: <TbPackage size={20} />,
    path: 'rawmaterial',
    department: ['store'],
  },
  {
    label: 'Packing Material',
    icon: <GiCardboardBox size={20} />,
    path: 'packingmaterial',
    department: ['store'],
  },
  {
    label: 'Dispencing',
    icon: <MdOutlineInventory2 size={20} />,
    path: 'dispencing',
    department: ['store'],
  },
  {
    label: 'Dispatch',
    icon: <FaShippingFast size={20} />,
    path: 'dispatch',
    department: ['store'],
  },
]

/* ================= QUALITY CONTROL ================= */
export const qualityControlItems = [
  {
    label: 'QC Tests',
    icon: <TbTestPipe size={20} />,
    path: 'qc',
    department: ['qc'],
  },
  {
    label: 'Approvals',
    icon: <AiOutlineCheckCircle size={20} />,
    path: 'approvals',
    department: ['qc'],
  },
]

/* ================= MAIN SIDEBAR ================= */
export const sidebarItems = [
  {
    label: 'Overview',
    icon: <MdDashboard size={20} />,
    path: 'overview',
    department: [], // admin only (handled in Sidebar.jsx)
  },
  {
    label: 'Todos',
    icon: <BsListTask size={20} />,
    path: 'todos',
    department: [
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
    department: ['hr'],
  },
  {
    label: 'Store',
    icon: <FaWarehouse size={20} />,
    isDropdown: true,
    id: 'store',
    items: storeItems,
    department: ['store'],
  },
  {
    label: 'Sales Records',
    icon: <BsBoxSeam size={20} />,
    path: 'sales',
    department: ['sales'],
  },
  {
    label: 'Accounts',
    icon: <FaMoneyCheckAlt size={20} />,
    path: 'accounts',
    department: ['accounts'],
  },
  {
    label: 'Designer',
    icon: <MdDesignServices size={20} />,
    path: 'designer',
    department: ['designer'],
  },
  {
    label: 'PPIC',
    icon: <FaCogs size={20} />,
    path: 'ppic',
    department: ['ppic'],
  },
  {
    label: 'Quality Control',
    icon: <FaFlask size={20} />,
    isDropdown: true,
    id: 'quality-control',
    items: qualityControlItems,
    department: ['qc'],
  },
  {
    label: 'QA',
    icon: <HiClipboardCheck size={20} />,
    path: 'qa',
    department: ['qa'],
  },
  {
    label: 'Customers',
    icon: <FaUsers size={20} />,
    path: 'customers',
    department: ['sales', 'accounts'],
  },
  {
    label: 'Production',
    icon: <MdProductionQuantityLimits size={20} />,
    path: 'production',
    department: ['production'],
  },
  {
    label: 'Logout',
    icon: <BiLogOutCircle size={20} />,
    action: () => handleLogout(username),
    department: [
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

export default sidebarItems
