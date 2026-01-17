import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'

import { ThemeProvider, CssBaseline, createTheme } from '@mui/material'

import './styles/App.css'

const theme = createTheme()

createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <App />
        </ThemeProvider>
    </React.StrictMode>
)
