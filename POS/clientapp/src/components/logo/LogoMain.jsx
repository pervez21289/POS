import React from "react";

export default function LogoMain() {
    return (
        <div className="logo">
            {/* --- Icon / Symbol --- */}
            <div className="logo-icon">
                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    {/* Outer diamond */}
                    <path d="M12 2L22 12L12 22L2 12L12 2Z" />
                    {/* Inner diamond */}
                    <path d="M12 6L18 12L12 18L6 12L12 6Z" fill="white" fillOpacity="0.3" />
                    {/* Center dot */}
                    <circle cx="12" cy="12" r="2" fill="white" stroke="none" />
                </svg>
            </div>

            {/* --- Text: Nex + Bill + POS --- */}
            <div className="logo-text">
                <span className="nex">Nex</span>
                <span className="highlight">Bill</span>
                <span className="pos">POS</span>
            </div>
        </div>
    );
}