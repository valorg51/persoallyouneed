/**
 * FormValidator.js - Form validation utility
 * Provides methods for validating form inputs against rules
 */
class FormValidator {
    /**
     * Validate form values against validation rules
     * @param {Object} values - Form field values
     * @param {Object} rules - Validation rules
     * @returns {Object} Validation result with isValid flag and errors
     */
    validate(values, rules) {
        const errors = {};
        
        // Validate each field against its rules
        for (const [field, fieldRules] of Object.entries(rules)) {
            const value = values[field];
            
            // Required field validation
            if (fieldRules.required && this.isEmpty(value)) {
                errors[field] = fieldRules.message || `Ce champ est obligatoire`;
                continue; // Skip other validations if required fails
            }
            
            // Skip other validations if field is empty and not required
            if (this.isEmpty(value) && !fieldRules.required) {
                continue;
            }
            
            // Minimum length validation
            if (fieldRules.minLength && value.length < fieldRules.minLength) {
                errors[field] = fieldRules.message || 
                    `Ce champ doit contenir au moins ${fieldRules.minLength} caractères`;
                continue;
            }
            
            // Maximum length validation
            if (fieldRules.maxLength && value.length > fieldRules.maxLength) {
                errors[field] = fieldRules.message || 
                    `Ce champ ne doit pas dépasser ${fieldRules.maxLength} caractères`;
                continue;
            }
            
            // Email format validation
            if (fieldRules.email && !this.isValidEmail(value)) {
                errors[field] = fieldRules.message || `Adresse email invalide`;
                continue;
            }
            
            // Phone format validation
            if (fieldRules.phone && !this.isValidPhone(value)) {
                errors[field] = fieldRules.message || `Numéro de téléphone invalide`;
                continue;
            }
            
            // Pattern validation
            if (fieldRules.pattern && !fieldRules.pattern.test(value)) {
                errors[field] = fieldRules.message || `Format invalide`;
                continue;
            }
            
            // Custom validation function
            if (fieldRules.validator && typeof fieldRules.validator === 'function') {
                const isValid = fieldRules.validator(value, values);
                if (!isValid) {
                    errors[field] = fieldRules.message || `Valeur invalide`;
                    continue;
                }
            }
        }
        
        return {
            isValid: Object.keys(errors).length === 0,
            errors
        };
    }
    
    /**
     * Check if a value is empty
     * @param {*} value - Value to check
     * @returns {boolean} Whether the value is empty
     */
    isEmpty(value) {
        if (value === null || value === undefined) {
            return true;
        }
        
        if (typeof value === 'string') {
            return value.trim() === '';
        }
        
        if (Array.isArray(value)) {
            return value.length === 0;
        }
        
        if (typeof value === 'object') {
            return Object.keys(value).length === 0;
        }
        
        return false;
    }
    
    /**
     * Validate email format
     * @param {string} email - Email to validate
     * @returns {boolean} Whether the email is valid
     */
    isValidEmail(email) {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailRegex.test(email);
    }
    
    /**
     * Validate phone number format
     * @param {string} phone - Phone number to validate
     * @returns {boolean} Whether the phone number is valid
     */
    isValidPhone(phone) {
        // Simple regex for international phone numbers
        const phoneRegex = /^\+?[0-9]{10,15}$/;
        return phoneRegex.test(phone);
    }
}

// Export the validator
window.FormValidator = FormValidator;
