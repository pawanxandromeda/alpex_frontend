import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import {
    FiSend,
    FiArrowLeft,
    FiUser,
    FiMail,
    FiPhone,
    FiMessageSquare,
} from 'react-icons/fi'

function Contact() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        message: '',
    })
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [formErrors, setFormErrors] = useState({})

    const navigate = useNavigate()

    const validateForm = () => {
        const errors = {}
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        const phoneRegex = /^[0-9]{10}$/

        if (!formData.name.trim()) errors.name = 'Name is required'
        if (!formData.email.trim()) errors.email = 'Email is required'
        else if (!emailRegex.test(formData.email))
            errors.email = 'Invalid email format'
        if (formData.phone && !phoneRegex.test(formData.phone))
            errors.phone = 'Phone should be 10 digits'
        if (!formData.message.trim()) errors.message = 'Message is required'
        else if (formData.message.trim().length < 10)
            errors.message = 'Message is too short'

        setFormErrors(errors)
        return Object.keys(errors).length === 0
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData({ ...formData, [name]: value })
        if (formErrors[name]) setFormErrors({ ...formErrors, [name]: null })
    }

    const resetForm = () => {
        setFormData({
            name: '',
            email: '',
            phone: '',
            message: '',
        })
        setFormErrors({})
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!validateForm()) return

        setIsSubmitting(true)
        try {
            await new Promise((resolve) => setTimeout(resolve, 1500))
            console.log('Query Submitted:', formData)
            toast.success('Your query has been submitted successfully!', {
                position: 'top-right',
                autoClose: 3000,
            })
            resetForm()
        } catch (error) {
            toast.error('Failed to submit query. Please try again.', {
                position: 'top-right',
                autoClose: 3000,
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="min-h-screen bg-gray-200 lg:grid lg:grid-cols-5">
            <div className="relative h-40 bg-blue-50 sm:h-56 lg:hidden">
                <img
                    src="/contact.webp"
                    alt="Customer support"
                    className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4">
                    <h1 className="text-2xl font-bold text-white">
                        Get in touch
                    </h1>
                    <p className="text-sm text-gray-100">
                        We're here to help with your questions
                    </p>
                </div>
            </div>

            <div className="flex flex-col justify-center px-4 py-8 sm:px-6 lg:col-span-2 lg:p-12">
                <div className="mb-6 hidden space-y-2 lg:block">
                    <h1 className="text-2xl font-bold text-gray-800 lg:text-3xl">
                        Get in touch
                    </h1>
                    <p className="text-sm text-gray-600">
                        Have questions or need assistance? Our team is here to
                        help. We'll respond within 2 business hours.
                    </p>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="space-y-4 sm:space-y-6"
                >
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                            <label
                                htmlFor="name"
                                className="flex items-center gap-2 text-sm font-medium text-gray-700"
                            >
                                <FiUser className="text-gray-500" /> Full Name
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className={`input input-bordered w-full py-2 text-base transition-all focus:ring-2 focus:ring-blue-300 ${
                                    formErrors.name ? 'input-error' : ''
                                }`}
                                placeholder="e.g. Rahul Sharma"
                            />
                            {formErrors.name && (
                                <p className="text-sm text-red-500">
                                    {formErrors.name}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <label
                                htmlFor="email"
                                className="flex items-center gap-2 text-sm font-medium text-gray-700"
                            >
                                <FiMail className="text-gray-500" /> Email
                                Address
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className={`input input-bordered w-full py-2 text-base transition-all focus:ring-2 focus:ring-blue-300 ${
                                    formErrors.email ? 'input-error' : ''
                                }`}
                                placeholder="e.g. rahul@example.com"
                            />
                            {formErrors.email && (
                                <p className="text-sm text-red-500">
                                    {formErrors.email}
                                </p>
                            )}
                        </div>
                    </div>

                    <div>
                        <div className="space-y-2">
                            <label
                                htmlFor="phone"
                                className="flex items-center gap-2 text-sm font-medium text-gray-700"
                            >
                                <FiPhone className="text-gray-500" /> Phone
                                Number
                            </label>
                            <input
                                type="tel"
                                id="phone"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                className={`input input-bordered w-full py-2 text-base transition-all focus:ring-2 focus:ring-blue-300 ${
                                    formErrors.phone ? 'input-error' : ''
                                }`}
                                placeholder="e.g. 9923XXXXX1"
                            />
                            {formErrors.phone && (
                                <p className="text-sm text-red-500">
                                    {formErrors.phone}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label
                            htmlFor="message"
                            className="flex items-center gap-2 text-sm font-medium text-gray-700"
                        >
                            <FiMessageSquare className="text-gray-500" /> Your
                            Message
                        </label>
                        <textarea
                            id="message"
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            className={`textarea textarea-bordered min-h-24 w-full transition-all focus:ring-2 focus:ring-blue-300 sm:min-h-32 ${
                                formErrors.message ? 'textarea-error' : ''
                            }`}
                            placeholder="Please describe your query in detail..."
                            rows="4"
                        />
                        {formErrors.message && (
                            <p className="text-sm text-red-500">
                                {formErrors.message}
                            </p>
                        )}
                    </div>

                    <div className="rounded border border-gray-200 bg-white p-4 shadow-sm lg:hidden">
                        <h3 className="text-base font-semibold text-gray-800">
                            Need immediate assistance?
                        </h3>
                        <p className="mt-1 text-xs text-gray-600">
                            Our support team is available Monday-Friday, 9am to
                            6pm.
                        </p>
                        <div className="mt-2 flex flex-col space-y-1 text-xs sm:flex-row sm:items-center sm:space-x-4 sm:space-y-0">
                            <span className="font-medium text-blue-600">
                                support@example.com
                            </span>
                            <span className="font-medium text-blue-600">
                                +91 8800-XXXXXX
                            </span>
                        </div>
                    </div>

                    <div className="flex flex-col gap-4 pt-2 sm:flex-row sm:justify-between">
                        <button
                            className="btn btn-outline order-2 w-full sm:order-1 sm:w-auto"
                            type="button"
                            onClick={() => navigate(-1)}
                        >
                            <FiArrowLeft className="sm:mr-1" />
                            <span className="ml-1 sm:ml-0">Back</span>
                        </button>
                        <button
                            className="btn btn-primary order-1 w-full px-6 transition-colors hover:bg-blue-700 sm:order-2 sm:w-auto"
                            type="submit"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <>
                                    <span className="loading loading-spinner loading-sm"></span>
                                    <span>Submitting...</span>
                                </>
                            ) : (
                                <>
                                    <FiSend className="mr-1" />
                                    <span>Send Message</span>
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>

            <div className="hidden bg-blue-50 lg:col-span-3 lg:block">
                <div className="flex h-full w-full items-center justify-center">
                    <div className="relative h-full w-full">
                        <img
                            src="/contact.webp"
                            alt="Customer support team"
                            className="h-full w-full object-cover shadow-lg"
                        />
                        <div className="absolute bottom-8 left-8 max-w-md rounded bg-white/90 p-6 shadow-lg backdrop-blur-sm">
                            <h3 className="mb-2 text-xl font-bold text-gray-800">
                                Need immediate assistance?
                            </h3>
                            <p className="text-sm text-gray-700">
                                Our support team is available Monday-Friday, 9am
                                to 6pm.
                            </p>
                            <div className="mt-3 flex items-center gap-4 text-sm">
                                <span className="font-medium text-blue-600">
                                    support@example.com
                                </span>
                                <span className="font-medium text-blue-600">
                                    +91 8800-XXXXXX
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Contact
