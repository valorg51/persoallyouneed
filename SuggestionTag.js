/**
 * SuggestionTags.js - Component for managing clickable suggestion tags
 * Allows users to quickly select predefined options through tag interface
 */
class SuggestionTags {
    /**
     * Create a new SuggestionTags instance
     * @param {Object} options - Configuration options
     * @param {HTMLElement} options.element - Container element
     * @param {Array} options.tags - Array of tag objects with value and label
     * @param {Function} options.onTagClick - Callback function when tag is clicked
     */
    constructor(options) {
        this.element = options.element;
        this.tags = options.tags || [];
        this.onTagClick = options.onTagClick || function() {};
        this.activeTag = null;
        
        this.render();
        this.attachEventListeners();
    }
    
    /**
     * Render the suggestion tags component
     */
    render() {
        this.element.innerHTML = this.tags.map(tag => `
            <span 
                class="suggestion-tag" 
                data-value="${tag.value}" 
                role="button"
                tabindex="0"
                aria-pressed="${this.activeTag === tag.value ? 'true' : 'false'}"
            >
                ${tag.label}
            </span>
        `).join('');
    }
    
    /**
     * Attach event listeners to tags
     */
    attachEventListeners() {
        const tagElements = this.element.querySelectorAll('.suggestion-tag');
        
        tagElements.forEach(tag => {
            // Click event
            tag.addEventListener('click', (e) => this.handleTagClick(e));
            
            // Keyboard accessibility
            tag.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.handleTagClick(e);
                }
            });
        });
        
        // Subscribe to expert type selection events
        EventBus.subscribe('expertTypeSelected', this.updateActiveTag.bind(this));
    }
    
    /**
     * Handle tag click event
     * @param {Event} e - Click or keydown event
     */
    handleTagClick(e) {
        const target = e.currentTarget;
        const value = target.dataset.value;
        
        if (value) {
            // Find the tag object
            const tagObject = this.tags.find(tag => tag.value === value);
            if (tagObject) {
                this.setActiveTag(value);
                this.onTagClick(tagObject);
            }
        }
    }
    
    /**
     * Set the active tag
     * @param {string} value - Tag value to activate
     */
    setActiveTag(value) {
        this.activeTag = value;
        
        // Update tag states
        const tagElements = this.element.querySelectorAll('.suggestion-tag');
        tagElements.forEach(tag => {
            const tagValue = tag.dataset.value;
            
            if (tagValue === value) {
                tag.classList.add('active');
                tag.setAttribute('aria-pressed', 'true');
            } else {
                tag.classList.remove('active');
                tag.setAttribute('aria-pressed', 'false');
            }
        });
    }
    
    /**
     * Update active tag based on expert type selection event
     * @param {Object} data - Event data with selected type
     */
    updateActiveTag(data) {
        const { type } = data;
        if (type) {
            this.setActiveTag(type);
        }
    }
    
    /**
     * Clear active tag selection
     */
    clearActiveTag() {
        this.activeTag = null;
        
        // Update tag states
        const tagElements = this.element.querySelectorAll('.suggestion-tag');
        tagElements.forEach(tag => {
            tag.classList.remove('active');
            tag.setAttribute('aria-pressed', 'false');
        });
    }
}

// Export the component
window.SuggestionTags = SuggestionTags;
