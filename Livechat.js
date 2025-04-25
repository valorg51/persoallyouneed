/**
 * LiveChat.js - Component for handling live chat functionality
 * Provides a floating chat button and chat interface
 */
class LiveChat {
    constructor() {
        this.container = document.getElementById('live-chat-container');
        this.isOpen = false;
        this.unreadMessages = 0;
        
        // Chat state
        this.chatState = {
            messages: [],
            isConnected: false,
            agentName: null,
            agentTyping: false
        };
        
        this.init();
    }
    
    /**
     * Initialize the live chat component
     */
    init() {
        this.render();
        this.attachEventListeners();
        
        // Simulated welcome message after a short delay
        setTimeout(() => {
            this.receiveMessage({
                text: 'Bonjour ! Comment puis-je vous aider à trouver l\'expert idéal pour votre projet entrepreneurial ?',
                sender: 'agent',
                name: 'Sophie',
                timestamp: new Date()
            });
        }, 3000);
    }
    
    /**
     * Render the live chat component
     */
    render() {
        const template = `
            <div class="live-chat" id="live-chat-button" aria-label="Chat avec un conseiller">
                <i>💬</i>
                <div class="chat-tooltip">Besoin d'aide pour trouver votre expert ?</div>
                <span class="unread-badge ${this.unreadMessages > 0 ? 'visible' : ''}" aria-hidden="true">
                    ${this.unreadMessages}
                </span>
            </div>
            
            <div class="chat-window ${this.isOpen ? 'open' : ''}" id="chat-window" aria-hidden="${!this.isOpen}">
                <div class="chat-header">
                    <div class="chat-header-info">
                        <h3>Assistance ConsultationPro</h3>
                        <span class="status ${this.chatState.isConnected ? 'online' : 'offline'}">
                            ${this.chatState.isConnected ? 'En ligne' : 'Connecter à un conseiller...'}
                        </span>
                    </div>
                    <button class="close-chat" id="close-chat" aria-label="Fermer le chat">
                        ✕
                    </button>
                </div>
                
                <div class="chat-messages" id="chat-messages">
                    ${this.renderMessages()}
                </div>
                
                <div class="chat-typing ${this.chatState.agentTyping ? 'visible' : ''}" id="typing-indicator">
                    ${this.chatState.agentName || 'Le conseiller'} est en train d'écrire...
                </div>
                
                <div class="chat-input">
                    <form id="chat-form">
                        <input 
                            type="text" 
                            id="chat-message" 
                            placeholder="Écrivez votre message..." 
                            aria-label="Message"
                            autocomplete="off"
                        >
                        <button type="submit" aria-label="Envoyer">
                            <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" fill="none">
                                <path d="M22 2L11 13M22 2L15 22L11 13L2 9L22 2Z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </button>
                    </form>
                </div>
            </div>
        `;
        
        this.container.innerHTML = template;
    }
    
    /**
     * Render chat messages
     * @returns {string} HTML for chat messages
     */
    renderMessages() {
        if (this.chatState.messages.length === 0) {
            return `
                <div class="welcome-message">
                    <h4>Bienvenue sur ConsultationPro</h4>
                    <p>Notre équipe est là pour vous aider à trouver l'expert entrepreneur idéal pour votre projet.</p>
                </div>
            `;
        }
        
        return this.chatState.messages.map(message => {
            const isAgent = message.sender === 'agent';
            const formattedTime = this.formatTime(message.timestamp);
            
            return `
                <div class="message ${isAgent ? 'agent' : 'user'}">
                    ${isAgent ? `<div class="agent-name">${message.name}</div>` : ''}
                    <div class="message-text">${message.text}</div>
                    <div class="message-time">${formattedTime}</div>
                </div>
            `;
        }).join('');
    }
    
    /**
     * Format timestamp to HH:MM format
     * @param {Date} timestamp - Timestamp to format
     * @returns {string} Formatted time string
     */
    formatTime(timestamp) {
        const date = new Date(timestamp);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    
    /**
     * Attach event listeners
     */
    attachEventListeners() {
        // Chat button click
        const chatButton = document.getElementById('live-chat-button');
        chatButton.addEventListener('click', () => this.toggleChat());
        
        // Close button click
        const closeButton = document.getElementById('close-chat');
        closeButton.addEventListener('click', (e) => {
            e.preventDefault();
            this.toggleChat(false);
        });
        
        // Form submission
        const chatForm = document.getElementById('chat-form');
        chatForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const messageInput = document.getElementById('chat-message');
            const message = messageInput.value.trim();
            
            if (message) {
                this.sendMessage(message);
                messageInput.value = '';
                messageInput.focus();
            }
        });
        
        // Initialize connected state after a delay (simulated connection)
        setTimeout(() => {
            this.chatState.isConnected = true;
            this.chatState.agentName = 'Sophie';
            this.updateChatHeader();
        }, 2000);
    }
    
    /**
     * Toggle chat window visibility
     * @param {boolean} [forcedState] - Force a specific state
     */
    toggleChat(forcedState) {
        const newState = forcedState !== undefined ? forcedState : !this.isOpen;
        this.isOpen = newState;
        
        const chatWindow = document.getElementById('chat-window');
        if (this.isOpen) {
            chatWindow.classList.add('open');
            chatWindow.setAttribute('aria-hidden', 'false');
            this.resetUnreadCounter();
            
            // Focus the input field when opening the chat
            setTimeout(() => {
                const input = document.getElementById('chat-message');
                if (input) input.focus();
            }, 100);
        } else {
            chatWindow.classList.remove('open');
            chatWindow.setAttribute('aria-hidden', 'true');
        }
    }
    
    /**
     * Send a message from the user
     * @param {string} text - Message text
     */
    sendMessage(text) {
        const message = {
            text: text,
            sender: 'user',
            timestamp: new Date()
        };
        
        // Add message to chat state
        this.chatState.messages.push(message);
        this.updateChatMessages();
        
        // Simulate agent typing
        this.setAgentTyping(true);
        
        // Simulate agent response after a delay
        setTimeout(() => {
            this.simulateAgentResponse(text);
        }, Math.random() * 2000 + 1000); // Random delay between 1-3 seconds
    }
    
    /**
     * Receive a message from the agent
     * @param {Object} message - Message object
     */
    receiveMessage(message) {
        // Add message to chat state
        this.chatState.messages.push(message);
        
        // Set agent name if provided in the message
        if (message.name && message.sender === 'agent') {
            this.chatState.agentName = message.name;
            this.updateChatHeader();
        }
        
        this.updateChatMessages();
        
        // If chat is closed, increment unread counter
        if (!this.isOpen) {
            this.incrementUnreadCounter();
        }
    }
    
    /**
     * Simulate agent response based on user message
     * @param {string} userMessage - User's message
     */
    simulateAgentResponse(userMessage) {
        this.setAgentTyping(false);
        
        // Simple response logic - could be expanded for more complex simulations
        let responseText = '';
        const lowerMessage = userMessage.toLowerCase();
        
        if (lowerMessage.includes('bonjour') || lowerMessage.includes('salut')) {
            responseText = 'Bonjour ! Comment puis-je vous aider aujourd\'hui ?';
        } else if (lowerMessage.includes('expert') || lowerMessage.includes('consultant')) {
            responseText = 'Nous avons plusieurs experts disponibles. Pouvez-vous me préciser votre domaine d\'activité ?';
        } else if (lowerMessage.includes('prix') || lowerMessage.includes('tarif')) {
            responseText = 'Nos tarifs varient selon l\'expert et le type de consultation. Je peux vous envoyer notre grille tarifaire par email si vous le souhaitez.';
        } else if (lowerMessage.includes('merci')) {
            responseText = 'Je vous en prie ! Y a-t-il autre chose que je puisse faire pour vous ?';
        } else {
            responseText = 'Merci pour votre message. Pour mieux vous aider, pourriez-vous me donner plus de détails sur votre projet entrepreneurial ?';
        }
        
        this.receiveMessage({
            text: responseText,
            sender: 'agent',
            name: this.chatState.agentName || 'Sophie',
            timestamp: new Date()
        });
    }
    
    /**
     * Update the chat messages display
     */
    updateChatMessages() {
        const messagesContainer = document.getElementById('chat-messages');
        messagesContainer.innerHTML = this.renderMessages();
        
        // Scroll to bottom of messages
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
    
    /**
     * Update the chat header with connection status
     */
    updateChatHeader() {
        const statusElement = document.querySelector('.chat-header .status');
        if (statusElement) {
            statusElement.className = `status ${this.chatState.isConnected ? 'online' : 'offline'}`;
            statusElement.textContent = this.chatState.isConnected ? 'En ligne' : 'Connecter à un conseiller...';
        }
    }
    
    /**
     * Set agent typing status
     * @param {boolean} isTyping - Whether agent is typing
     */
    setAgentTyping(isTyping) {
        this.chatState.agentTyping = isTyping;
        const typingIndicator = document.getElementById('typing-indicator');
        
        if (typingIndicator) {
            if (isTyping) {
                typingIndicator.classList.add('visible');
                typingIndicator.textContent = `${this.chatState.agentName || 'Le conseiller'} est en train d'écrire...`;
            } else {
                typingIndicator.classList.remove('visible');
            }
        }
    }
    
    /**
     * Increment unread messages counter
     */
    incrementUnreadCounter() {
        this.unreadMessages++;
        this.updateUnreadBadge();
    }
    
    /**
     * Reset unread messages counter
     */
    resetUnreadCounter() {
        this.unreadMessages = 0;
        this.updateUnreadBadge();
    }
    
    /**
     * Update the unread messages badge
     */
    updateUnreadBadge() {
        const badge = document.querySelector('.unread-badge');
        if (badge) {
            badge.textContent = this.unreadMessages;
            if (this.unreadMessages > 0) {
                badge.classList.add('visible');
            } else {
                badge.classList.remove('visible');
            }
        }
    }
}

// Initialize the LiveChat when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    const chatContainer = document.createElement('div');
    chatContainer.id = 'live-chat-container';
    document.body.appendChild(chatContainer);
    
    window.liveChat = new LiveChat();
});
