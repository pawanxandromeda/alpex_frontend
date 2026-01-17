import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Error404() {
    const navigate = useNavigate()
    const [visible, setVisible] = useState(false)

    useEffect(() => {
        setVisible(true)
    }, [])

    return (
        <div className="relative h-screen overflow-hidden bg-gray-900">
            <div className="absolute inset-0">
                <img
                    src="/fog-error.webp"
                    className="h-full w-full object-cover"
                    alt="Error background"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40"></div>
            </div>

            <div className="absolute inset-0 flex items-center justify-center text-white">
                <div
                    className={`w-full px-8 transition-opacity duration-1000 ${visible ? 'opacity-100' : 'opacity-0'}`}
                >
                    <div className="mb-4 flex justify-center">
                        <span className="text-sm font-medium text-white">
                            FOG ERROR
                        </span>
                    </div>

                    <h1 className="text-center text-8xl font-extrabold tracking-wider text-white text-opacity-80 md:text-9xl">
                        <span className="opacity-80 shadow-white drop-shadow-lg">
                            404
                        </span>
                    </h1>

                    <h2 className="mt-6 text-center text-2xl font-bold text-white">
                        Page not found
                    </h2>

                    <p className="mx-auto mt-4 max-w-md text-center text-sm text-gray-300">
                        The page you are looking for might have been removed,
                        had its name changed, or is temporarily unavailable.
                    </p>

                    <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
                        <button
                            className="rounded border-2 border-white bg-transparent px-5 py-2 text-white transition-colors duration-300 hover:bg-white hover:text-gray-900"
                            onClick={() => navigate('/')}
                        >
                            Back to Home
                        </button>
                        <button
                            className="text-md rounded bg-white px-5 py-2 text-gray-900 transition-colors duration-300 hover:bg-opacity-90"
                            onClick={() => navigate(-1)}
                        >
                            Go Back
                        </button>
                    </div>
                </div>
            </div>

            <div className="absolute bottom-0 left-0 right-0 z-10 px-6 py-8 text-center text-sm text-gray-100">
                Alpex Pharma &copy; {new Date().getFullYear()} • All rights
                reserved • Designed by Arpit
            </div>
        </div>
    )
}

export default Error404
