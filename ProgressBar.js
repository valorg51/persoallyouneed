/**
 * ProgressBar.js - Component for managing multi-step form progress
 * Displays visual progress indicator for multi-step forms
 */
class ProgressBar {
    /**
     * Create a new ProgressBar instance
     * @param {Object} options - Configuration options
     * @param {HTMLElement} options.element - Container element
     * @param {Array} options.steps - Array of step objects with id and label
     * @param {number} options.currentStep - Initial active step (1-based)
     */
    constructor(options) {
        this.element = options.element;
        this.steps = options.steps || [];
        this.currentStep = options.currentStep || 1;
        this.totalSteps = this.steps.length;
        
        this.render();
        this.updateProgress();
    }
    
    /**
     * Render the progress bar component
     */
    render() {
        const template = `
            <div class="progress-bar" role="progressbar" aria-valuenow="${this.currentStep}" aria-valuemin="1" aria-valuemax="${this.totalSteps}">
                <div class="progress-fill" id="progress-fill"></div>
            </div>
            <div class="progress-steps" aria-hidden="true">
                ${this.steps.map((step, index) => `
                    <span 
                        class="progress-step ${index + 1 === this.currentStep ? 'active' : ''}" 
                        id="${step.id}"
                    >
                        ${step.label}
                    </span>
                `).join('')}
            </div>
        `;
        
        this.element.innerHTML = template;
    }
    
    /**
     * Update the progress indicator based on current step
     */
    updateProgress() {
        // Calculate progress percentage
        const progressPercentage = (this.currentStep / this.totalSteps) * 100;
        
        // Update progress fill width
        const progressFill = document.getElementById('progress-fill');
        if (progressFill) {
            progressFill.style.width = `${progressPercentage}%`;
        }
        
        // Update step indicators
        this.steps.forEach((step, index) => {
            const stepElement = document.getElementById(step.id);
            if (stepElement) {
                if (index + 1 === this.currentStep) {
                    stepElement.classList.add('active');
                } else {
                    stepElement.classList.remove('active');
                }
            }
        });
        
        // Update ARIA attributes
        const progressBar = this.element.querySelector('.progress-bar');
        if (progressBar) {
            progressBar.setAttribute('aria-valuenow', this.currentStep);
        }
    }
    
    /**
     * Set the current active step
     * @param {number} step - Step number (1-based)
     */
    setCurrentStep(step) {
        if (step >= 1 && step <= this.totalSteps) {
            this.currentStep = step;
            this.updateProgress();
            
            // Publish event for other components
            EventBus.publish('progressChanged', { step: this.currentStep });
        }
    }
    
    /**
     * Move to the next step
     * @returns {boolean} Whether the step changed
     */
    nextStep() {
        if (this.currentStep < this.totalSteps) {
            this.setCurrentStep(this.currentStep + 1);
            return true;
        }
        return false;
    }
    
    /**
     * Move to the previous step
     * @returns {boolean} Whether the step changed
     */
    prevStep() {
        if (this.currentStep > 1) {
            this.setCurrentStep(this.currentStep - 1);
            return true;
        }
        return false;
    }
}

// Export the component
window.ProgressBar = ProgressBar;
