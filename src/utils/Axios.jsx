import axios from 'axios'

const instance = axios.create({
    baseURL: 'http://localhost:5000/api/',
    headers: {
        'Content-Type': 'application/json',
    },
})

/* ============================
   REQUEST INTERCEPTOR
============================ */
instance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken')
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        // Debug: log outgoing requests (method and url)
        try {
            console.debug('[Axios] Request →', (config.method || '').toUpperCase(), config.url, { headers: config.headers })
        } catch (e) {
            console.debug('[Axios] Request →', config)
        }
        return config
    },
    (error) => {
        console.error('[Axios] Request error:', error)
        return Promise.reject(error)
    }
)

/* ============================
   RESPONSE INTERCEPTOR
   Auto Refresh Token
============================ */
instance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config

        if (
            error.response?.status === 401 &&
            !originalRequest._retry
        ) {
            originalRequest._retry = true

            try {
                const refreshToken =
                    localStorage.getItem('refreshToken')

                const res = await axios.post(
                    'http://localhost:5000/api/auth/refresh',
                    { refreshToken }
                )

                const { accessToken } = res.data

                localStorage.setItem('accessToken', accessToken)

                originalRequest.headers.Authorization = `Bearer ${accessToken}`

                return instance(originalRequest)
            } catch (err) {
                localStorage.clear()
                window.location.href = '/login'
                return Promise.reject(err)
            }
        }

        return Promise.reject(error)
    }
)

export default instance
