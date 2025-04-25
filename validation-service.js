/**
 * ValidationService.js - Service for data validation and sanitization
 * Provides utility methods for validating and cleaning user input
 */
class ValidationService {
    /**
     * Sanitize a string to prevent XSS attacks
     * @param {string} input - String to sanitize
     * @returns {string} Sanitized string
     */
    static sanitizeString(input) {
        if (typeof input !== 'string') {
            return '';
        }
        
        // Create a temporary element
        const tempElement = document.createElement('div');
        tempElement.textContent = input;
        
        // Return the sanitized string
        return tempElement.innerHTML
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }
    
    /**
     * Sanitize an object's string properties
     * @param {Object} obj - Object to sanitize
     * @returns {Object} Sanitized object
     */
    static sanitizeObject(obj) {
        const sanitized = {};
        
        for (const [key, value] of Object.entries(obj)) {
            if (typeof value === 'string') {
                sanitized[key] = this.sanitizeString(value);
            } else if (typeof value === 'object' && value !== null) {
                sanitized[key] = this.sanitizeObject(value);
            } else {
                sanitized[key] = value;
            }
        }
        
        return sanitized;
    }
    
    /**
     * Validate email format
     * @param {string} email - Email to validate
     * @returns {boolean} Whether the email is valid
     */
    static isValidEmail(email) {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailRegex.test(email);
    }
    
    /**
     * Validate phone number format
     * @param {string} phone - Phone number to validate
     * @returns {boolean} Whether the phone number is valid
     */
    static isValidPhone(phone) {
        // Simple regex for international phone numbers
        const phoneRegex = /^\+?[0-9]{10,15}$/;
        return phoneRegex.test(phone);
    }
    
    /**
     * Validate ID format (UUID v4)
     * @param {string} id - ID to validate
     * @returns {boolean} Whether the ID is valid
     */
    static isValidId(id) {
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        return uuidRegex.test(id);
    }
    
    /**
     * Validate booking data
     * @param {Object} bookingData - Booking data to validate
     * @returns {Object} Validation result with isValid flag and errors
     */
    static validateBookingData(bookingData) {
        const errors = [];
        const sanitizedData = this.sanitizeObject(bookingData);
        
        // Validate expert ID
        if (!bookingData.expertId || !this.isValidId(bookingData.expertId)) {
            errors.push('Expert ID is invalid');
        }
        
        // Validate date and time
        if (!bookingData.date || !this.isValidDate(bookingData.date)) {
            errors.push('Date is invalid');
        }
        
        // Validate duration
        if (!bookingData.durationMinutes || !Number.isInteger(bookingData.durationMinutes) || 
            bookingData.durationMinutes < 15 || bookingData.durationMinutes > 180) {
            errors.push('Duration must be between 15 and 180 minutes');
        }
        
        // Validate contact information
        if (bookingData.contactEmail && !this.isValidEmail(bookingData.contactEmail)) {
            errors.push('Email is invalid');
        }
        
        if (bookingData.contactPhone && !this.isValidPhone(bookingData.contactPhone)) {
            errors.push('Phone number is invalid');
        }
        
        return {
            isValid: errors.length === 0,
            errors,
            data: sanitizedData
        };
    }
    
    /**
     * Validate date format and ensure it's in the future
     * @param {string} dateString - Date string to validate
     * @returns {boolean} Whether the date is valid
     */
    static isValidDate(dateString) {
        // Try to parse the date
        const date = new Date(dateString);
        
        // Check if date is valid and in the future
        if (isNaN(date.getTime())) {
            return false;
        }
        
        // Date should be in the future
        const now = new Date();
        return date > now;
    }
    
    /**
     * Validate search parameters
     * @param {Object} searchParams - Search parameters to validate
     * @returns {Object} Validation result with isValid flag and errors
     */
    static validateSearchParams(searchParams) {
        const errors = {};
        
        // Validate expert type
        if (!searchParams['expert-type']) {
            errors['expert-type'] = 'Veuillez sélectionner un type d\'expertise';
        }
        
        // Validate subject
        if (!searchParams['consultation-subject']) {
            errors['consultation-subject'] = 'Veuillez sélectionner un sujet de consultation';
        }
        
        // Validate availability
        if (!searchParams['availability']) {
            errors['availability'] = 'Veuillez sélectionner une disponibilité';
        }
        
        return {
            isValid: Object.keys(errors).length === 0,
            errors
        };
    }
}

// Export the service
window.ValidationService = ValidationService;
