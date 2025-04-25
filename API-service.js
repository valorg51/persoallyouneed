/**
 * ApiService.js - Service for handling API requests
 * Provides a centralized interface for all backend API communication
 */
class ApiService {
    /**
     * Base API URL - should be environment-specific
     */
    static get baseUrl() {
        return 'https://api.consultationpro.com/v1';
    }
    
    /**
     * Create request headers with authentication if needed
     * @returns {Object} Headers object
     */
    static getHeaders() {
        const headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        };
        
        // Add authentication token if available
        const token = AuthService.getToken();
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
        
        return headers;
    }
    
    /**
     * Make a request to the API
     * @param {string} endpoint - API endpoint
     * @param {Object} options - Request options
     * @returns {Promise} Promise that resolves with the response data
     */
    static async request(endpoint, options = {}) {
        const url = `${this.baseUrl}${endpoint}`;
        
        // Default options
        const defaultOptions = {
            headers: this.getHeaders(),
            mode: 'cors',
            cache: 'no-cache',
        };
        
        // Merge options
        const requestOptions = {
            ...defaultOptions,
            ...options,
            headers: {
                ...defaultOptions.headers,
                ...(options.headers || {})
            }
        };
        
        try {
            // Add timestamp to prevent caching
            const requestUrl = options.method === 'GET' 
                ? `${url}${url.includes('?') ? '&' : '?'}_t=${Date.now()}`
                : url;
                
            const response = await fetch(requestUrl, requestOptions);
            
            // Check if response is JSON
            const contentType = response.headers.get('content-type');
            const isJson = contentType && contentType.includes('application/json');
            
            // Parse response
            const data = isJson ? await response.json() : await response.text();
            
            // Handle HTTP errors
            if (!response.ok) {
                throw {
                    status: response.status,
                    statusText: response.statusText,
                    data
                };
            }
            
            return data;
        } catch (error) {
            // Log error and rethrow
            console.error(`API request failed: ${endpoint}`, error);
            throw error;
        }
    }
    
    /**
     * Search for experts based on criteria
     * @param {Object} searchParams - Search parameters
     * @returns {Promise} Promise that resolves with the search results
     */
    static async searchExperts(searchParams) {
        // Sanitize and format search parameters
        const sanitizedParams = ValidationService.sanitizeObject(searchParams);
        
        // Map to API expected format
        const apiParams = {
            expertise_type: sanitizedParams['expert-type'],
            subject: sanitizedParams['consultation-subject'],
            availability: sanitizedParams['availability'],
        };
        
        return this.request('/experts/search', {
            method: 'POST',
            body: JSON.stringify(apiParams)
        });
    }
    
    /**
     * Get expert details by ID
     * @param {string} expertId - Expert unique identifier
     * @returns {Promise} Promise that resolves with the expert details
     */
    static async getExpertById(expertId) {
        // Validate expert ID format
        if (!ValidationService.isValidId(expertId)) {
            throw new Error('Invalid expert ID format');
        }
        
        return this.request(`/experts/${expertId}`);
    }
    
    /**
     * Create a new booking with an expert
     * @param {Object} bookingData - Booking details
     * @returns {Promise} Promise that resolves with the booking confirmation
     */
    static async createBooking(bookingData) {
        // Validate and sanitize booking data
        const validatedData = ValidationService.validateBookingData(bookingData);
        
        if (!validatedData.isValid) {
            throw new Error('Invalid booking data: ' + validatedData.errors.join(', '));
        }
        
        return this.request('/bookings', {
            method: 'POST',
            body: JSON.stringify(validatedData.data)
        });
    }
    
    /**
     * Get featured experts for homepage
     * @param {number} limit - Maximum number of experts to return
     * @returns {Promise} Promise that resolves with featured experts
     */
    static async getFeaturedExperts(limit = 6) {
        return this.request(`/experts/featured?limit=${limit}`);
    }
    
    /**
     * Get testimonials for homepage
     * @param {number} limit - Maximum number of testimonials to return
     * @returns {Promise} Promise that resolves with testimonials
     */
    static async getTestimonials(limit = 5) {
        return this.request(`/testimonials?limit=${limit}`);
    }
}

// Export the service
window.ApiService = ApiService;
