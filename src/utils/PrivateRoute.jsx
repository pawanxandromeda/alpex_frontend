import { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import PropTypes from 'prop-types'
import axios from '@axios'

const ROUTE_MAP = {
    accounts: [
        '/dashboard/todos',
        '/dashboard/accounts',
        '/dashboard/customers',
    ],
    qc: ['/dashboard/todos', '/dashboard/qc', '/dashboard/approvals'],
    store: [
        '/dashboard/todos',
        '/dashboard/rawmaterial',
        '/dashboard/packingmaterial',
        '/dashboard/dispencing',
        '/dashboard/dispatch',
    ],
    hr: [
        '/dashboard/todos',
        '/dashboard/employees',
        '/dashboard/candidates',
        '/dashboard/attendance',
    ],
    designer: ['/dashboard/todos', '/dashboard/designer'],
    qa: ['/dashboard/todos', '/dashboard/qa'],
    sales: ['/dashboard/todos', '/dashboard/sales', '/dashboard/customers'],
    production: ['/dashboard/todos', '/dashboard/production'],
    ppic: ['/dashboard/todos', '/dashboard/ppic'],
}

const PrivateRoute = ({ children }) => {
    const navigate = useNavigate()
    const location = useLocation()

    const verifyToken = async () => {
        try {
            const accessToken = localStorage.getItem('accessToken')
            const refreshToken = localStorage.getItem('refreshToken')
            console.log('Verifying token present:', !!accessToken)

            if (!accessToken) {
                throw new Error('Authentication token not found')
            }

            // Try to decode token and check expiry locally
            let payload = null
            try {
                payload = JSON.parse(atob(accessToken.split('.')[1]))
            } catch (e) {
                console.warn('Failed to decode access token payload', e)
            }

            const now = Math.floor(Date.now() / 1000)

            if (payload?.exp && payload.exp > now) {
                // Token is still valid
                const username = localStorage.getItem('username') || ''
                const authorization = localStorage.getItem('role') || ''
                return { valid: true, username, authorization }
            }

            // Token expired: try refresh if we have a refresh token
            if (!refreshToken) {
                throw new Error('Refresh token not available')
            }

            const res = await axios.post('auth/refresh', { refreshToken })
            const { accessToken: newAccessToken } = res.data

            if (!newAccessToken) {
                throw new Error('Refresh failed to return new access token')
            }

            localStorage.setItem('accessToken', newAccessToken)

            // update role if present in refreshed token
            try {
                const newPayload = JSON.parse(atob(newAccessToken.split('.')[1]))
                if (newPayload?.role) localStorage.setItem('role', newPayload.role)
            } catch (e) {
                console.warn('Failed to decode refreshed token payload', e)
            }

            return {
                valid: true,
                username: localStorage.getItem('username') || '',
                authorization: localStorage.getItem('role') || '',
            }
        } catch (error) {
            console.error('Authentication error:', error?.message || error)
            return { valid: false }
        }
    }

    useEffect(() => {
        const checkToken = async () => {
            const result = await verifyToken()

            if (!result.valid) {
                localStorage.clear()
                navigate('/login')
                return
            }

            const userRoles = result.authorization
                .trim()
                .split(/\s+/)
                .map((role) => role.toLowerCase())

            const isAdmin = userRoles.includes('admin')

            if (isAdmin) return

            const allowedRoutes = userRoles.reduce((routes, role) => {
                return routes.concat(ROUTE_MAP[role] || [])
            }, [])

            const uniqueAllowedRoutes = [...new Set(allowedRoutes)]

            console.log('User roles:', userRoles)
            console.log('Allowed routes:', uniqueAllowedRoutes)
            console.log('Current path:', location.pathname)

            const isAuthorized = uniqueAllowedRoutes.some((route) =>
                location.pathname.startsWith(route)
            )

            if (!isAuthorized) {
                navigate('/access-error')
            }
        }

        checkToken()
    }, [navigate, location.pathname])

    return children || null
}

PrivateRoute.propTypes = {
    children: PropTypes.node,
}

export default PrivateRoute
