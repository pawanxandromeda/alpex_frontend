import axios from '@axios'
import { toast } from 'react-toastify'

const handleLogout = async () => {
    try {
        // Get userId before clearing localStorage
        const userId = localStorage.getItem('userId')
        const username = localStorage.getItem('username')
        
        // Send logout request to server
        const response = await axios.post('auth/logout', { userId })
        
        if (response.status === 200) {
            // Clear localStorage after successful server logout
            localStorage.clear()
            
            toast.success('You have been logged out.', {
                onClose: () => (window.location.href = '/login'),
                autoClose: 1000,
            })
        }
    } catch (error) {
        // Even if server logout fails, clear local storage for security
        localStorage.clear()
        
        const message = error.response?.data?.message || 
                       (error.request ? 'No response from server.' : 'An error occurred.')
        
        console.error('Logout error:', message)
        
        toast.error(message, {
            onClose: () => (window.location.href = '/login'),
            autoClose: 2000,
        })
    }
}

export default handleLogout
