import React from 'react';

// Main App component that renders the PrivacyPolicy
function App() {
    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 sm:p-6 lg:p-8">
            <PrivacyPolicy />
        </div>
    );
}

// PrivacyPolicy component
function PrivacyPolicy() {
    return (
        <div className="bg-white shadow-lg rounded-lg p-6 sm:p-8 lg:p-10 max-w-4xl mx-auto my-8 border border-gray-200">
            {/* Header Section */}
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-6 text-center">
                Privacy Policy for NexBillPOS
            </h1>
            <p className="text-sm text-gray-500 mb-8 text-center">
                Last updated: August 3, 2025
            </p>

            {/* Introduction Section */}
            <section className="mb-8">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4 border-b-2 border-indigo-500 pb-2">
                    1. Introduction
                </h2>
                <p className="text-gray-700 leading-relaxed">
                    Welcome to NexBillPOS! We are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website nexbillpos.com and use our services. Please read this Privacy Policy carefully. If you do not agree with the terms of this Privacy Policy, please do not access the site or use our services.
                </p>
            </section>

            {/* Information We Collect Section */}
            <section className="mb-8">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4 border-b-2 border-indigo-500 pb-2">
                    2. Information We Collect
                </h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                    We may collect information about you in a variety of ways. The information we may collect on the Site includes:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                    <li>
                        <span className="font-semibold">Personal Data:</span> Personally identifiable information, such as your name, shipping address, email address, and telephone number, and demographic information, such as your age, gender, hometown, and interests, that you voluntarily give to us when you register with the Site or when you choose to participate in various activities related to the Site, such as online chat and message boards.
                    </li>
                    <li>
                        <span className="font-semibold">Derivative Data:</span> Information our servers automatically collect when you access the Site, such as your IP address, your browser type, your operating system, your access times, and the pages you have viewed directly before and after accessing the Site.
                    </li>
                    <li>
                        <span className="font-semibold">Financial Data:</span> Financial information, such as data related to your payment method (e.g., valid credit card number, card brand, expiration date) that we may collect when you purchase, order, return, exchange, or request information about our services from the Site.
                    </li>
                </ul>
            </section>

            {/* How We Use Your Information Section */}
            <section className="mb-8">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4 border-b-2 border-indigo-500 pb-2">
                    3. How We Use Your Information
                </h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                    Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you via the Site to:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                    <li>Create and manage your account.</li>
                    <li>Process your transactions and send you related information, including purchase confirmations and invoices.</li>
                    <li>Email you regarding your account or order.</li>
                    <li>Enable user-to-user communications.</li>
                    <li>Generate a personal profile about you to make your visit to the Site more personalized.</li>
                    <li>Increase the efficiency and operation of the Site.</li>
                    <li>Monitor and analyze usage and trends to improve your experience with the Site.</li>
                    <li>Notify you of updates to the Site.</li>
                    <li>Request feedback and contact you about your use of the Site.</li>
                    <li>Resolve disputes and troubleshoot problems.</li>
                </ul>
            </section>

            {/* Data Security Section */}
            <section className="mb-8">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4 border-b-2 border-indigo-500 pb-2">
                    4. Data Security
                </h2>
                <p className="text-gray-700 leading-relaxed">
                    We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable, and no method of data transmission can be guaranteed against any interception or other type of misuse.
                </p>
            </section>

            {/* Your Choices Section */}
            <section className="mb-8">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4 border-b-2 border-indigo-500 pb-2">
                    5. Your Choices
                </h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                    You have choices regarding the information you provide to us.
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                    <li>
                        <span className="font-semibold">Account Information:</span> You may at any time review or change the information in your account or terminate your account by:
                        <ul className="list-circle list-inside ml-6 mt-2">
                            <li>Logging into your account settings and updating your account.</li>
                            <li>Contacting us using the contact information provided below.</li>
                        </ul>
                    </li>
                    <li>
                        <span className="font-semibold">Emails and Communications:</span> If you no longer wish to receive correspondence, emails, or other communications from us, you may opt-out by:
                        <ul className="list-circle list-inside ml-6 mt-2">
                            <li>Noting your preferences at the time you register your account with the Site.</li>
                            <li>Logging into your account settings and updating your preferences.</li>
                            <li>Contacting us using the contact information provided below.</li>
                        </ul>
                    </li>
                </ul>
            </section>

            {/* Changes to This Policy Section */}
            <section className="mb-8">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4 border-b-2 border-indigo-500 pb-2">
                    6. Changes to This Policy
                </h2>
                <p className="text-gray-700 leading-relaxed">
                    We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date. You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.
                </p>
            </section>

            {/* Contact Us Section */}
            <section>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4 border-b-2 border-indigo-500 pb-2">
                    7. Contact Us
                </h2>
                <p className="text-gray-700 leading-relaxed">
                    If you have any questions about this Privacy Policy, please contact us:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4 mt-4">
                    <li>By email: <a href="mailto:privacy@nexbillpos.com" className="text-indigo-600 hover:underline">privacy@nexbillpos.com</a></li>
                    <li>By visiting this page on our website: <a href="https://nexbillpos.com/contact" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">nexbillpos.com/contact</a></li>
                </ul>
            </section>
        </div>
    );
}

export default App;
