/**
 * EventBus.js - Simple publish/subscribe pattern implementation
 * Facilitates communication between decoupled components
 */
class EventBus {
    static #subscribers = new Map();
    
    /**
     * Subscribe to an event
     * @param {string} event - Event name
     * @param {Function} callback - Callback function when event is published
     * @returns {Function} Unsubscribe function
     */
    static subscribe(event, callback) {
        if (!this.#subscribers.has(event)) {
            this.#subscribers.set(event, new Set());
        }
        
        const subscribers = this.#subscribers.get(event);
        subscribers.add(callback);
        
        // Return unsubscribe function
        return () => {
            subscribers.delete(callback);
            if (subscribers.size === 0) {
                this.#subscribers.delete(event);
            }
        };
    }
    
    /**
     * Publish an event
     * @param {string} event - Event name
     * @param {*} data - Data to pass to subscribers
     */
    static publish(event, data = undefined) {
        if (!this.#subscribers.has(event)) {
            return;
        }
        
        // Execute all callbacks for this event
        const subscribers = this.#subscribers.get(event);
        subscribers.forEach(callback => {
            try {
                callback(data);
            } catch (error) {
                console.error(`Error in event subscriber for "${event}":`, error);
            }
        });
    }
    
    /**
     * Check if an event has subscribers
     * @param {string} event - Event name
     * @returns {boolean} Whether the event has subscribers
     */
    static hasSubscribers(event) {
        return this.#subscribers.has(event) && this.#subscribers.get(event).size > 0;
    }
    
    /**
     * Clear all subscribers for an event
     * @param {string} event - Event name
     */
    static clear(event) {
        if (this.#subscribers.has(event)) {
            this.#subscribers.delete(event);
        }
    }
    
    /**
     * Clear all subscribers for all events
     */
    static clearAll() {
        this.#subscribers.clear();
    }
}

// Export the event bus
window.EventBus = EventBus;
