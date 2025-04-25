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
