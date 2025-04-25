/**
 * SearchForm.js - Component for handling the expert search form
 * Manages the search form functionality, validation, and API interaction
 */
class SearchForm {
    constructor() {
        this.container = document.getElementById('search-form-container');
        this.expertTypes = {
            tech: 'Tech et innovation',
            ecommerce: 'E-commerce et retail',
            digital: 'Digital et influence',
            education: 'Éducation et formation'
        };
        
        this.subjectsByType = {
            tech: [
                { value: 'startup', label: 'Création de startup tech' },
                { value: 'product', label: 'Développement produit' },
                { value: 'ai', label: 'Intelligence artificielle' },
                { value: 'saas', label: 'SaaS et Cloud' },
                { value: 'iot', label: 'IoT et Hardware' }
            ],
            ecommerce: [
                { value: 'marketplace', label: 'Création de marketplace' },
                { value: 'dropshipping', label: 'Dropshipping' },
                { value: 'logistics', label: 'Logistique et supply chain' },
                { value: 'growth', label: 'Stratégies de croissance' },
                { value: 'omnichannel', label: 'Stratégie omnicanal' }
            ],
            digital: [
                { value: 'social', label: 'Stratégie réseaux sociaux' },
                { value: 'content', label: 'Marketing de contenu' },
                { value: 'seo', label: 'SEO et référencement' },
                { value: 'affiliate', label: 'Marketing d\'affiliation' },
                { value: 'influencer', label: 'Marketing d\'influence' }
            ],
            education: [
                { value: 'elearning', label: 'Création de plateforme e-learning' },
                { value: 'courses', label: 'Conception de cours en ligne' },
                { value: 'coaching', label: 'Programmes de coaching' },
                { value: 'certification', label: 'Certifications et accréditations' },
                { value: 'community', label: 'Gestion de communauté d\'apprentissage' }
            ]
        };
        
        this.availabilityOptions = [
            { value: 'asap', label: 'Dès que possible' },
            { value: 'this-week', label: 'Cette semaine' },
            { value: 'next-week', label: 'La semaine prochaine' },
            { value: 'this-month', label: 'Ce mois-ci' },
            { value: 'flexible', label: 'Je suis flexible' }
        ];
        
        // Event bus subscription
        EventBus.subscribe('formValidated', this.handleFormSubmission.bind(this));
        EventBus.subscribe('expertTypeSelected', this.updateSubjectsList.bind(this));
        
        this.init();
    }
    
    /**
     * Initialize the search form component
     */
    init() {
        this.render();
        this.attachEventListeners();
        
        // Initialize progress bar component
        this.progressBar = new ProgressBar({
            element: document.getElementById('progress-container'),
            steps: [
                { id: 'step-1', label: 'Type d\'expertise' },
                { id: 'step-2', label: 'Domaine' },
                { id: 'step-3', label: 'Disponibilité' }
            ],
            currentStep: 1
        });
        
        // Initialize suggestion tags component
        this.suggestionTags = new SuggestionTags({
            element: document.getElementById('suggestion-tags-container'),
            tags: Object.keys(this.expertTypes).map(key => ({
                value: key,
                label: this.expertTypes[key]
            })),
            onTagClick: this.handleTagClick.bind(this)
        });
    }
    
    /**
     * Render the search form HTML
     */
    render() {
        // Form HTML template with ARIA and proper semantics
        const template = `
            <h2 class="search-title">Trouvez votre expert entrepreneur idéal</h2>
            
            <div id="progress-container" class="progress-container"></div>
            
            <form id="expert-search-form" class="search-form" novalidate>
                <!-- Expert Type Field -->
                <div class="search-row">
                    <div class="search-field">
                        <label for="expert-type" id="expert-type-label">Type d'expertise entrepreneuriale</label>
                        <div class="select-wrapper">
                            <select 
                                id="expert-type" 
                                name="expert-type" 
                                aria-labelledby="expert-type-label"
                                aria-required="true"
                                required
                            >
                                <option value="">Sélectionnez un domaine d'expertise</option>
                                ${Object.entries(this.expertTypes).map(([value, label]) => 
                                    `<option value="${value}">${label}</option>`
                                ).join('')}
                            </select>
                        </div>
                        
                        <!-- Suggestion Tags -->
                        <div id="suggestion-tags-container" class="suggestion-tags"></div>
                        <div id="expert-type-error" class="error-message" role="alert"></div>
                    </div>
                </div>
                
                <!-- Subject Field (Dynamically Updated) -->
                <div class="search-row">
                    <div class="search-field">
                        <label for="consultation-subject" id="subject-label">Sujet de consultation</label>
                        <div class="select-wrapper">
                            <select 
                                id="consultation-subject" 
                                name="consultation-subject"
                                aria-labelledby="subject-label"
                                aria-required="true"
                                required
                                disabled
                            >
                                <option value="">Sélectionnez d'abord un type d'expertise</option>
                            </select>
                        </div>
                        <div id="subject-error" class="error-message" role="alert"></div>
                    </div>
                </div>
                
                <!-- Availability Field -->
                <div class="search-row">
                    <div class="search-field">
                        <label for="availability" id="availability-label">Disponibilité souhaitée</label>
                        <div class="select-wrapper">
                            <select 
                                id="availability" 
                                name="availability"
                                aria-labelledby="availability-label"
                                aria-required="true"
                                required
                            >
                                <option value="">Quand souhaitez-vous consulter?</option>
                                ${this.availabilityOptions.map(option => 
                                    `<option value="${option.value}">${option.label}</option>`
                                ).join('')}
                            </select>
                        </div>
                        <div id="availability-error" class="error-message" role="alert"></div>
                    </div>
                </div>
                
                <!-- Form Submission -->
                <div class="search-button-container">
                    <button 
                        type="submit" 
                        class="search-button"
                        id="search-submit"
                    >
                        Trouver mon expert
                    </button>
                </div>
            </form>
        `;
        
        // Set innerHTML after performing security checks (in a production environment)
        this.container.innerHTML = template;
    }
    
    /**
     * Attach event listeners to form elements
     */
    attachEventListeners() {
        const form = document.getElementById('expert-search-form');
        const expertTypeSelect = document.getElementById('expert-type');
        const subjectSelect = document.getElementById('consultation-subject');
        const availabilitySelect = document.getElementById('availability');
        
        // Form submission
        form.addEventListener('submit', this.handleSubmit.bind(this));
        
        // Expert type change
        expertTypeSelect.addEventListener('change', (e) => {
            const selectedType = e.target.value;
            if (selectedType) {
                EventBus.publish('expertTypeSelected', { type: selectedType });
                this.progressBar.setCurrentStep(2);
            } else {
                subjectSelect.disabled = true;
                subjectSelect.innerHTML = '<option value="">Sélectionnez d\'abord un type d\'expertise</option>';
                this.progressBar.setCurrentStep(1);
            }
        });
        
        // Subject change
        subjectSelect.addEventListener('change', (e) => {
            const selectedSubject = e.target.value;
            if (selectedSubject) {
                this.progressBar.setCurrentStep(2);
            }
        });
        
        // Availability change
        availabilitySelect.addEventListener('change', (e) => {
            const selectedAvailability = e.target.value;
            if (selectedAvailability) {
                this.progressBar.setCurrentStep(3);
            } else if (subjectSelect.value) {
                this.progressBar.setCurrentStep(2);
            }
        });
    }
    
    /**
     * Handle tag click from suggestion tags component
     * @param {Object} tag - Selected tag object
     */
    handleTagClick(tag) {
        const expertTypeSelect = document.getElementById('expert-type');
        expertTypeSelect.value = tag.value;
        
        // Trigger change event
        const event = new Event('change');
        expertTypeSelect.dispatchEvent(event);
    }
    
    /**
     * Update the subjects dropdown based on selected expert type
     * @param {Object} data - Event data containing the selected type
     */
    updateSubjectsList(data) {
        const subjectSelect = document.getElementById('consultation-subject');
        const { type } = data;
        
        if (type && this.subjectsByType[type]) {
            // Enable and populate the select
            subjectSelect.disabled = false;
            
            let options = '<option value="">Sélectionnez un sujet</option>';
            this.subjectsByType[type].forEach(subject => {
                options += `<option value="${subject.value}">${subject.label}</option>`;
            });
            
            subjectSelect.innerHTML = options;
        } else {
            // Disable and reset the select
            subjectSelect.disabled = true;
            subjectSelect.innerHTML = '<option value="">Sélectionnez d\'abord un type d\'expertise</option>';
        }
    }
    
    /**
     * Handle form submission
     * @param {Event} e - Submit event 
     */
    handleSubmit(e) {
        e.preventDefault();
        
        const form = e.target;
        const formData = new FormData(form);
        const formValues = {};
        
        // Convert FormData to object
        for (const [key, value] of formData.entries()) {
            formValues[key] = value;
        }
        
        // Validate the form
        const validator = new FormValidator();
        const validationRules = {
            'expert-type': { required: true, message: 'Veuillez sélectionner un type d\'expertise' },
            'consultation-subject': { required: true, message: 'Veuillez sélectionner un sujet de consultation' },
            'availability': { required: true, message: 'Veuillez sélectionner une disponibilité' }
        };
        
        const validationResult = validator.validate(formValues, validationRules);
        
        if (validationResult.isValid) {
            // Clear any existing error messages
            document.querySelectorAll('.error-message').forEach(el => el.textContent = '');
            
            // Form is valid, proceed with submission
            EventBus.publish('formValidated', formValues);
        } else {
            // Display validation errors
            Object.entries(validationResult.errors).forEach(([field, message]) => {
                const errorElement = document.getElementById(`${field}-error`);
                if (errorElement) {
                    errorElement.textContent = message;
                    errorElement.setAttribute('aria-hidden', 'false');
                }
            });
        }
    }
    
    /**
     * Handle successful form validation
     * @param {Object} formData - Validated form data
     */
    handleFormSubmission(formData) {
        // Show loading state
        const submitButton = document.getElementById('search-submit');
        const originalText = submitButton.textContent;
        submitButton.textContent = 'Recherche en cours...';
        submitButton.disabled = true;
        
        // In a real implementation, we would use ApiService to send the data
        ApiService.searchExperts(formData)
            .then(response => {
                // Handle successful response
                console.log('Experts found:', response);
                
                // Navigate to results page or display results
                window.location.href = `/results?query=${encodeURIComponent(JSON.stringify(formData))}`;
            })
            .catch(error => {
                // Handle error
                console.error('Error searching experts:', error);
                
                // Display error message
                const errorMessage = document.createElement('div');
                errorMessage.className = 'form-error-message';
                errorMessage.textContent = 'Une erreur est survenue lors de la recherche. Veuillez réessayer.';
                errorMessage.setAttribute('role', 'alert');
                
                const form = document.getElementById('expert-search-form');
                form.prepend(errorMessage);
            })
            .finally(() => {
                // Reset button state
                submitButton.textContent = originalText;
                submitButton.disabled = false;
            });
    }
}

// Export the component
window.SearchForm = SearchForm;
