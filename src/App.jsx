import {
    BrowserRouter as Router,
    Route,
    Routes,
    Navigate,
} from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import Error404 from './pages/Error404'
import AccessError from './pages/AccessError'

import Home from './pages/Home'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Contact from './pages/Contact'
import Test from './utils/Test'

import MonthlyReport from './analytics/MonthlyReport'
import SalesReport from './analytics/SalesReport'
import MachineMaintenance from './analytics/MachineMaintenance'
import DebtorList from './analytics/DebtorList'
import CreditorList from './analytics/CreditorList'
import Enquiries from './analytics/Enquiries'
import ApiHeaders from './analytics/ApiHeaders'

import MenuPage from './pages/Menu'
import POSummary from './pages/menus/POSummary'

import PrivateRoute from './utils/PrivateRoute'

function App() {
    return (
        <section>
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
            />
            <Router>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/access-error" element={<AccessError />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/test" element={<Test />} />
                    <Route path="/menu" element={<MenuPage />} />
                    <Route path="/po-summary" element={<POSummary />} />
                    <Route path="/debtor-list" element={<DebtorList />} />
                    <Route path="/creditor-list" element={<CreditorList />} />
                    <Route path="/monthly-sales" element={<MonthlyReport />} />
                    <Route path="/sales-report" element={<SalesReport />} />
                    <Route path="/api-headers" element={<ApiHeaders />} />
                    <Route
                        path="/machine-maintenance"
                        element={<MachineMaintenance />}
                    />
                    = <Route path="/enquiries" element={<Enquiries />} />
                    <Route
                        path="/dashboard/:path"
                        element={
                            <PrivateRoute>
                                <Dashboard />
                            </PrivateRoute>
                        }
                    />
                    <Route path="*" element={<Error404 />} />
                </Routes>
            </Router>
        </section>
    )
}

export default App
