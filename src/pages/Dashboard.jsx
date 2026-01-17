import { useParams } from 'react-router-dom'
import { useState } from 'react'
import Sidebar from '@components/Sidebar'

import Overview from '../pages/menus/Overview'
import Todos from '../pages/menus/Todos'

import Employee from '../pages/sub-menus/hr-management/Employees'
import Expense from '../pages/sub-menus/hr-management/Expense'
import Candidates from '../pages/sub-menus/hr-management/Candidates'
import Attendance from '../pages/sub-menus/hr-management/Attendance'

import RawMaterial from '../pages/sub-menus/store/RawMaterial'
import PackingMaterial from '../pages/sub-menus/store/PackingMaterial'
import Dispencing from '../pages/sub-menus/store/Dispencing'
import Dispatch from '../pages/sub-menus/store/Dispatch'

import Sales from '../pages/menus/Sales'
import Accounts from '../pages/menus/Accounts'
import Designer from '../pages/menus/Designer'
import PPIC from '../pages/menus/PPIC'

import QC from '../pages/sub-menus/quality-control/QC'
import Approvals from '../pages/sub-menus/quality-control/Approvals'

import QA from '../pages/menus/QA'
import Customers from '../pages/menus/Customers'
import Production from '../pages/menus/Production'

function Dashboard() {
  const params = useParams()
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <>
      <Sidebar
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
      />

     <main
  className="transition-all duration-500 ease-out"
  style={{
    marginLeft: isCollapsed ? '80px' : '288px',
  }}
>

        {params.path === 'overview' && <Overview />}
        {params.path === 'todos' && <Todos />}

        {params.path === 'employees' && <Employee />}
        {params.path === 'expenses' && <Expense />}
        {params.path === 'candidates' && <Candidates />}
        {params.path === 'attendance' && <Attendance />}

        {params.path === 'rawmaterial' && <RawMaterial />}
        {params.path === 'packingmaterial' && <PackingMaterial />}
        {params.path === 'dispencing' && <Dispencing />}
        {params.path === 'dispatch' && <Dispatch />}

        {params.path === 'sales' && <Sales />}
        {params.path === 'designer' && <Designer />}
        {params.path === 'accounts' && <Accounts />}
        {params.path === 'ppic' && <PPIC />}

        {params.path === 'qc' && <QC />}
        {params.path === 'approvals' && <Approvals />}

        {params.path === 'qa' && <QA />}
        {params.path === 'customers' && <Customers />}
        {params.path === 'production' && <Production />}
      </main>
    </>
  )
}

export default Dashboard
