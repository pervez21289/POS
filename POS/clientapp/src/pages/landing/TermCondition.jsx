import React, { useState } from 'react';

// Main App component that renders the TermsAndConditions component
export default function TermCondition() {
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [showTerms, setShowTerms] = useState(true); // State to control visibility of the terms component

    // Function to handle accepting the terms
    const handleAcceptTerms = () => {
        setTermsAccepted(true);
        setShowTerms(false); // Hide terms after acceptance
        console.log("Terms and Conditions Accepted!");
        // In a real POS system, you would likely store this acceptance in a database
        // or proceed to the next step in the workflow.
    };

    // Function to handle declining the terms
    const handleDeclineTerms = () => {
        setTermsAccepted(false);
        setShowTerms(false); // Hide terms after declining
        console.log("Terms and Conditions Declined.");
        // In a real POS system, declining might prevent the user from proceeding
        // or log them out, depending on the business logic.
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-100 flex items-center justify-center p-4">
            {showTerms ? (
                <div className="bg-white rounded-xl shadow-2xl p-6 md:p-8 lg:p-10 w-full max-w-2xl border border-gray-200">
                    <h1 className="text-3xl font-extrabold text-center text-gray-800 mb-6">
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
                            Terms and Conditions
                        </span>
                    </h1>

                    <div className="max-h-96 overflow-y-auto bg-gray-50 p-4 rounded-lg border border-gray-200 text-gray-700 text-sm leading-relaxed mb-6">
                        <p className="mb-3">
                            Welcome to our Point of Sale (POS) system. By using this system, you agree to comply with and be bound by the following terms and conditions of use, which, together with our privacy policy, govern [Your Company Name]'s relationship with you in relation to this system.
                        </p>
                        <h2 className="font-bold text-base mb-2">1. Acceptance of Terms</h2>
                        <p className="mb-3">
                            By accessing or using the POS system, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, you must not use this system.
                        </p>
                        <h2 className="font-bold text-base mb-2">2. Use of the System</h2>
                        <p className="mb-3">
                            This POS system is provided for the purpose of facilitating sales transactions, inventory management, and related business operations. Unauthorized use, including but not limited to, data mining, reverse engineering, or any activity that disrupts the system's integrity, is strictly prohibited.
                        </p>
                        <h2 className="font-bold text-base mb-2">3. Data Privacy</h2>
                        <p className="mb-3">
                            We are committed to protecting your privacy. All data collected through this POS system will be handled in accordance with our Privacy Policy. By using the system, you consent to such processing and warrant that all data provided by you is accurate.
                        </p>
                        <h2 className="font-bold text-base mb-2">4. Limitation of Liability</h2>
                        <p className="mb-3">
                            [Your Company Name] will not be liable for any direct, indirect, incidental, consequential, or punitive damages arising out of your access to, use of, or inability to use the POS system, or any errors or omissions in the content thereof.
                        </p>
                        <h2 className="font-bold text-base mb-2">5. Changes to Terms</h2>
                        <p className="mb-3">
                            [Your Company Name] reserves the right to modify these Terms and Conditions at any time. Your continued use of the system after any such changes constitutes your acceptance of the new Terms and Conditions.
                        </p>
                        <p>
                            For any questions regarding these terms, please contact us at [Contact Information].
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <button
                            onClick={handleAcceptTerms}
                            className="flex items-center justify-center px-6 py-3 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-500 focus:ring-opacity-50 transition duration-300 ease-in-out transform hover:scale-105 shadow-lg"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                            Accept Terms
                        </button>
                        <button
                            onClick={handleDeclineTerms}
                            className="flex items-center justify-center px-6 py-3 bg-red-500 text-white font-bold rounded-lg hover:bg-red-600 focus:outline-none focus:ring-4 focus:ring-red-500 focus:ring-opacity-50 transition duration-300 ease-in-out transform hover:scale-105 shadow-lg"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            Decline
                        </button>
                    </div>
                </div>
            ) : (
                <div className="bg-white rounded-xl shadow-2xl p-6 md:p-8 w-full max-w-md text-center border border-gray-200">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">
                        {termsAccepted ? "Terms Accepted!" : "Terms Declined."}
                    </h2>
                    <p className="text-gray-600 mb-6">
                        {termsAccepted
                            ? "You can now proceed with using the POS system."
                            : "You have declined the terms. Access to certain features may be restricted."}
                    </p>
                    <button
                        onClick={() => setShowTerms(true)}
                        className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 transition duration-200 ease-in-out"
                    >
                        Review Terms Again
                    </button>
                </div>
            )}
        </div>
    );
}
