// Format date as "04-08-2025 08:39 AM"
export function formatDateTime(date = new Date()) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';

    hours = hours % 12 || 12;
    const formattedHours = String(hours).padStart(2, '0');

    return `${day}-${month}-${year} ${formattedHours}:${minutes} ${ampm}`;
}

// Format date as "2025-08-04"
export function formatToISO(date = new Date()) {
    return date.toISOString().split('T')[0];
}

// Get current timestamp
export function getCurrentTimestamp() {
    return Date.now();
}
