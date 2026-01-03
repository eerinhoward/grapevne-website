import React, { useState } from 'react'

function ContactForm({ isOpen, onClose, emailTo = 'universities@grapevneapp.com' }) {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        organization: '',
        reason: '',
        message: ''
    })
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submitStatus, setSubmitStatus] = useState(null)

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = () => {
        if (!formData.name || !formData.email || !formData.message) {
            setSubmitStatus('error')
            return
        }

        setIsSubmitting(true)

        try {
            const subject = encodeURIComponent(`Contact Form Submission from ${formData.name}`)
            const body = encodeURIComponent(
                `Name: ${formData.name}\nEmail: ${formData.email}\nOrganization: ${formData.organization}\nReason: ${formData.reason}\n\nMessage:\n${formData.message}`
            )

            window.location.href = `mailto:${emailTo}?subject=${subject}&body=${body}`

            setSubmitStatus('success')
            setTimeout(() => {
                setFormData({ name: '', email: '', organization: '', reason: '', message: '' })
                setSubmitStatus(null)
                onClose()
            }, 2000)
        } catch (error) {
            setSubmitStatus('error')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="w-full max-w-2xl mx-auto overflow-hidden transition-all duration-300 ease-in-out"
            style={{
                maxHeight: isOpen ? '1000px' : '0',
                opacity: isOpen ? 1 : 0,
                transform: isOpen ? 'translateY(0)' : 'translateY(-10px)',
                transition: 'all 300ms ease-in-out',
                overflow: 'hidden',
                marginTop: isOpen ? '1.5rem' : '0'
            }}
        >
            <div className="bg-gray-50 rounded-2xl p-8 shadow-lg">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-2xl font-bold" style={{ color: '#1a1a1a' }}>Get in Touch</h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
                        aria-label="Close form"
                    >
                        ×
                    </button>
                </div>

                <div className="space-y-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium mb-2" style={{ color: '#1a1a1a' }}>
                            Name *
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            style={{ backgroundColor: 'white' }}
                        />
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-sm font-medium mb-2" style={{ color: '#1a1a1a' }}>
                            Email *
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            style={{ backgroundColor: 'white' }}
                        />
                    </div>

                    <div className="mb-6">
                        <label htmlFor="organization" className="block text-sm font-medium mb-1.5" style={{ color: '#1a1a1a' }}>
                            Organization
                        </label>
                        <input
                            type="text"
                            id="organization"
                            name="organization"
                            value={formData.organization}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            style={{ backgroundColor: 'white' }}
                        />
                    </div>

                    <div className="mb-6">
                        <label htmlFor="reason" className="block text-sm font-medium mb-1.5" style={{ color: '#1a1a1a' }}>
                            Reason for Contact
                        </label>
                        <select
                            id="reason"
                            name="reason"
                            value={formData.reason}
                            onChange={handleChange}
                            className="w-full px-4 py-2.5 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm appearance-none bg-no-repeat bg-right"
                            style={{
                                backgroundColor: 'white',
                                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23666' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
                                backgroundPosition: 'right 12px center',
                                backgroundSize: '12px',
                                color: formData.reason ? '#1a1a1a' : '#999'
                            }}
                        >
                            <option value="">Select an option</option>
                            <option value="1">Option 1</option>
                            <option value="2">Option 2</option>
                            <option value="3">Option 3</option>
                            <option value="4">Option 4</option>
                        </select>
                    </div>

                    <div>
                        <label htmlFor="message" className="block text-sm font-medium mb-2" style={{ color: '#1a1a1a' }}>
                            Message *
                        </label>
                        <textarea
                            id="message"
                            name="message"
                            rows="5"
                            value={formData.message}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                            style={{ backgroundColor: 'white' }}
                        />
                    </div>

                    {submitStatus === 'success' && (
                        <div className="text-green-600 text-sm">
                            Opening your email client...
                        </div>
                    )}

                    {submitStatus === 'error' && (
                        <div className="text-red-600 text-sm">
                            Please fill in all required fields.
                        </div>
                    )}

                    <div className="flex gap-4 pt-2">
                        <button
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            className="flex-1 bg-black text-white px-8 py-3 rounded-full text-base font-medium hover:bg-gray-800 transition-colors disabled:bg-gray-400"
                        >
                            {isSubmitting ? 'Submitting...' : 'Submit'}
                        </button>
                        <button
                            onClick={onClose}
                            className="px-8 py-3 rounded-full text-base font-medium border border-gray-300 hover:bg-gray-100 transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ContactForm