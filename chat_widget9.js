(function() {
            console.log('Chat widget initializing...');
            if (window.N8nChatWidgetLoaded) {
                console.log('Widget already loaded, exiting.');
                return;
            }
            window.N8nChatWidgetLoaded = true;

            // Load font
            const fontElement = document.createElement('style');
            fontElement.textContent = `
                @font-face {
                    font-family: 'B Yekan';
                    src: url('https://cdn.fontiran.com/free/BYekan.woff') format('woff');
                    font-weight: normal;
                    font-style: normal;
                }
            `;
            document.head.appendChild(fontElement);

            // Widget styles
            const widgetStyles = document.createElement('style');
            widgetStyles.textContent = `
                .chat-assist-widget {
                    --chat-color-primary: var(--chat-widget-primary, #5A8CF2);
                    --chat-color-secondary: var(--chat-widget-secondary, #4267B2);
                    --chat-color-tertiary: var(--chat-widget-tertiary, #1A2A44);
                    --chat-color-light: var(--chat-widget-light, #F7F7F9);
                    --chat-color-surface: var(--chat-widget-surface, #ffffff);
                    --chat-color-text: var(--chat-widget-text, #1A2A44);
                    --chat-color-text-light: var(--chat-widget-text-light, #6b7280);
                    --chat-color-border: var(--chat-widget-border, #e5e7eb);
                    --chat-shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.1);
                    --chat-shadow-md: 0 4px 6px rgba(0, 0, 0, 0.15);
                    --chat-shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.2);
                    --chat-radius-sm: 8px;
                    --chat-radius-md: 12px;
                    --chat-radius-lg: 20px;
                    --chat-radius-full: 9999px;
                    --chat-transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    font-family: 'B Yekan', sans-serif;
                    direction: rtl;
                }
                .chat-assist-widget .chat-window {
                    position: fixed;
                    bottom: 90px;
                    z-index: 1000;
                    width: 380px;
                    height: 580px;
                    background: var(--chat-color-surface);
                    border-radius: var(--chat-radius-lg);
                    box-shadow: var(--chat-shadow-lg);
                    border: 1px solid var(--chat-color-light);
                    overflow: hidden;
                    display: none;
                    flex-direction: column;
                    transition: var(--chat-transition);
                    opacity: 0;
                    transform: translateY(20px) scale(0.95);
                }
                .chat-assist-widget .chat-window.right-side { right: 20px; }
                .chat-assist-widget .chat-window.left-side { left: 20px; }
                .chat-assist-widget .chat-window.visible {
                    display: flex;
                    opacity: 1;
                    transform: translateY(0) scale(1);
                }
                .chat-assist-widget .chat-header {
                    padding: 16px;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    background: linear-gradient(135deg, var(--chat-color-primary) 0%, var(--chat-color-secondary) 100%);
                    color: white;
                    position: relative;
                    flex-direction: row;
                }
                .chat-assist-widget .chat-header-logo {
                    width: 32px;
                    height: 32px;
                    border-radius: var(--chat-radius-sm);
                    object-fit: contain;
                    background: white;
                    padding: 4px;
                }
                .chat-assist-widget .chat-header-title {
                    font-size: 16px;
                    font-weight: 600;
                    color: white;
                }
                .chat-assist-widget .chat-close-btn {
                    position: absolute;
                    left: 16px;
                    top: 50%;
                    transform: translateY(-50%);
                    background: rgba(255, 255, 255, 0.2);
                    border: none;
                    color: white;
                    cursor: pointer;
                    padding: 4px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: var(--chat-transition);
                    font-size: 18px;
                    border-radius: var(--chat-radius-full);
                    width: 28px;
                    height: 28px;
                }
                .chat-assist-widget .chat-close-btn:hover {
                    background: rgba(255, 255, 255, 0.3);
                    transform: translateY(-50%) scale(1.1);
                }
                .chat-assist-widget .chat-welcome {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    padding: 24px;
                    text-align: center;
                    width: 100%;
                    max-width: 320px;
                }
                .chat-assist-widget .chat-welcome-title {
                    font-size: 22px;
                    font-weight: 700;
                    color: var(--chat-color-text);
                    margin-bottom: 24px;
                    line-height: 1.3;
                    text-align: center;
                }
                .chat-assist-widget .chat-start-btn {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 10px;
                    width: 100%;
                    padding: 14px 20px;
                    background: linear-gradient(135deg, var(--chat-color-primary) 0%, var(--chat-color-secondary) 100%);
                    color: white;
                    border: none;
                    border-radius: var(--chat-radius-md);
                    cursor: pointer;
                    font-size: 15px;
                    transition: var(--chat-transition);
                    font-weight: 600;
                    font-family: inherit;
                    margin-bottom: 16px;
                    box-shadow: var(--chat-shadow-md);
                }
                .chat-assist-widget .chat-start-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: var(--chat-shadow-lg);
                }
                .chat-assist-widget .chat-response-time {
                    font-size: 14px;
                    color: var(--chat-color-text-light);
                    margin: 0;
                    text-align: center;
                }
                .chat-assist-widget .chat-body {
                    display: none;
                    flex-direction: column;
                    height: 100%;
                }
                .chat-assist-widget .chat-body.active {
                    display: flex;
                }
                .chat-assist-widget .chat-messages {
                    flex: 1;
                    overflow-y: auto;
                    padding: 20px;
                    background: #f9fafb;
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                }
                .chat-assist-widget .chat-messages::-webkit-scrollbar {
                    width: 6px;
                }
                .chat-assist-widget .chat-messages::-webkit-scrollbar-track {
                    background: transparent;
                }
                .chat-assist-widget .chat-messages::-webkit-scrollbar-thumb {
                    background-color: rgba(0, 0, 0, 0.3);
                    border-radius: var(--chat-radius-full);
                }
                .chat-assist-widget .chat-bubble {
                    padding: 14px 18px;
                    border-radius: var(--chat-radius-md);
                    max-width: 85%;
                    word-wrap: break-word;
                    font-size: 14px;
                    line-height: 1.6;
                    position: relative;
                    white-space: pre-line;
                }
                .chat-assist-widget .chat-bubble.user-bubble {
                    background: linear-gradient(135deg, var(--chat-color-primary) 0%, var(--chat-color-secondary) 100%);
                    color: white;
                    align-self: flex-start;
                    border-bottom-right-radius: 4px;
                    box-shadow: var(--chat-shadow-sm);
                }
                .chat-assist-widget .chat-bubble.bot-bubble {
                    background: white;
                    color: var(--chat-color-text);
                    align-self: flex-end;
                    border-bottom-left-radius: 4px;
                    box-shadow: var(--chat-shadow-sm);
                    border: 1px solid var(--chat-color-light);
                }
                .chat-assist-widget .typing-indicator {
                    display: flex;
                    align-items: center;
                    gap: 4px;
                    padding: 14px 18px;
                    background: white;
                    border-radius: var(--chat-radius-md);
                    border-bottom-left-radius: 4px;
                    max-width: 80px;
                    align-self: flex-end;
                    box-shadow: var(--chat-shadow-sm);
                    border: 1px solid var(--chat-color-light);
                }
                .chat-assist-widget .typing-dot {
                    width: 8px;
                    height: 8px;
                    background: var(--chat-color-tertiary);
                    border-radius: var(--chat-radius-full);
                    opacity: 0.7;
                    animation: typingAnimation 1.4s infinite ease-in-out;
                }
                .chat-assist-widget .typing-dot:nth-child(1) { animation-delay: 0s; }
                .chat-assist-widget .typing-dot:nth-child(2) { animation-delay: 0.2s; }
                .chat-assist-widget .typing-dot:nth-child(3) { animation-delay: 0.4s; }
                @keyframes typingAnimation {
                    0%, 60%, 100% { transform: translateY(0); }
                    30% { transform: translateY(-4px); }
                }
                .chat-assist-widget .chat-controls {
                    padding: 16px;
                    background: var(--chat-color-surface);
                    border-top: 1px solid var(--chat-color-light);
                    display: flex;
                    gap: 10px;
                }
                .chat-assist-widget .chat-textarea {
                    flex: 1;
                    padding: 14px 16px;
                    border: 1px solid var(--chat-color-light);
                    border-radius: var(--chat-radius-md);
                    background: var(--chat-color-surface);
                    color: var(--chat-color-text);
                    resize: none;
                    font-family: inherit;
                    font-size: 14px;
                    line-height: 1.5;
                    max-height: 120px;
                    min-height: 48px;
                    transition: var(--chat-transition);
                }
                .chat-assist-widget .chat-textarea:focus {
                    outline: none;
                    border-color: var(--chat-color-primary);
                    box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.2);
                }
                .chat-assist-widget .chat-textarea::placeholder {
                    color: var(--chat-color-text-light);
                }
                .chat-assist-widget .chat-submit {
                    background: linear-gradient(135deg, var(--chat-color-primary) 0%, var(--chat-color-secondary) 100%);
                    color: white;
                    border: none;
                    border-radius: var(--chat-radius-md);
                    width: 48px;
                    height: 48px;
                    cursor: pointer;
                    transition: var(--chat-transition);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-shrink: 0;
                    box-shadow: var(--chat-shadow-sm);
                }
                .chat-assist-widget .chat-submit:hover {
                    transform: scale(1.05);
                    box-shadow: var(--chat-shadow-md);
                }
                .chat-assist-widget .chat-submit svg {
                    width: 22px;
                    height: 22px;
                }
                .chat-assist-widget .chat-launcher {
                    position: fixed;
                    bottom: 20px;
                    height: 56px;
                    border-radius: var(--chat-radius-full);
                    background: linear-gradient(135deg, var(--chat-color-primary) 0%, var(--chat-color-secondary) 100%);
                    color: white;
                    border: none;
                    cursor: pointer;
                    box-shadow: var(--chat-shadow-md);
                    z-index: 999;
                    transition: var(--chat-transition);
                    display: flex;
                    align-items: center;
                    padding: 0 20px 0 16px;
                    gap: 8px;
                    font-family: 'B Yekan', sans-serif;
                }
                .chat-assist-widget .chat-launcher.right-side { right: 20px; }
                .chat-assist-widget .chat-launcher.left-side { left: 20px; }
                .chat-assist-widget .chat-launcher:hover {
                    transform: scale(1.05);
                    box-shadow: var(--chat-shadow-lg);
                }
                .chat-assist-widget .chat-launcher svg {
                    width: 24px;
                    height: 24px;
                }
                .chat-assist-widget .chat-launcher-text {
                    font-weight: 600;
                    font-size: 15px;
                    white-space: nowrap;
                }
                .chat-assist-widget .chat-footer {
                    padding: 10px;
                    text-align: center;
                    background: var(--chat-color-surface);
                    border-top: 1px solid var(--chat-color-light);
                }
                .chat-assist-widget .chat-footer-link {
                    color: var(--chat-color-primary);
                    text-decoration: none;
                    font-size: 12px;
                    opacity: 0.8;
                    transition: var(--chat-transition);
                    font-family: inherit;
                }
                .chat-assist-widget .chat-footer-link:hover {
                    opacity: 1;
                }
                .chat-assist-widget .suggested-questions {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                    margin: 12px 0;
                    align-self: flex-end;
                    max-width: 85%;
                }
                .chat-assist-widget .suggested-question-btn {
                    background: #f3f4f6;
                    border: 1px solid var(--chat-color-light);
                    border-radius: var(--chat-radius-md);
                    padding: 10px 14px;
                    text-align: right;
                    font-size: 13px;
                    color: var(--chat-color-text);
                    cursor: pointer;
                    transition: var(--chat-transition);
                    font-family: inherit;
                    line-height: 1.4;
                }
                .chat-assist-widget .suggested-question-btn:hover {
                    background: var(--chat-color-light);
                    border-color: var(--chat-color-primary);
                }
                .chat-assist-widget .chat-link {
                    color: var(--chat-color-primary);
                    text-decoration: underline;
                    word-break: break-all;
                    transition: var(--chat-transition);
                }
                .chat-assist-widget .chat-link:hover {
                    color: var(--chat-color-secondary);
                    text-decoration: underline;
                }
                .chat-assist-widget .user-registration {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    padding: 24px;
                    text-align: center;
                    width: 100%;
                    max-width: 320px;
                    display: none;
                }
                .chat-assist-widget .user-registration.active {
                    display: block;
                }
                .chat-assist-widget .registration-title {
                    font-size: 18px;
                    font-weight: 600;
                    color: var(--chat-color-text);
                    margin-bottom: 16px;
                    line-height: 1.3;
                }
                .chat-assist-widget .registration-form {
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                    margin-bottom: 16px;
                }
                .chat-assist-widget .form-field {
                    display: flex;
                    flex-direction: column;
                    gap: 4px;
                    text-align: right;
                }
                .chat-assist-widget .form-label {
                    font-size: 14px;
                    font-weight: 500;
                    color: var(--chat-color-text);
                }
                .chat-assist-widget .form-input {
                    padding: 12px 14px;
                    border: 1px solid var(--chat-color-border);
                    border-radius: var(--chat-radius-md);
                    font-family: inherit;
                    font-size: 14px;
                    transition: var(--chat-transition);
                }
                .chat-assist-widget .form-input:focus {
                    outline: none;
                    border-color: var(--chat-color-primary);
                    box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.2);
                }
                .chat-assist-widget .form-input.error {
                    border-color: #ef4444;
                }
                .chat-assist-widget .error-text {
                    font-size: 12px;
                    color: #ef4444;
                    margin-top: 2px;
                }
                .chat-assist-widget .submit-registration {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 100%;
                    padding: 14px 20px;
                    background: linear-gradient(135deg, var(--chat-color-primary) 0%, var(--chat-color-secondary) 100%);
                    color: white;
                    border: none;
                    border-radius: var(--chat-radius-md);
                    cursor: pointer;
                    font-size: 15px;
                    transition: var(--chat-transition);
                    font-weight: 600;
                    font-family: inherit;
                    box-shadow: var(--chat-shadow-md);
                }
                .chat-assist-widget .submit-registration:hover {
                    transform: translateY(-2px);
                    box-shadow: var(--chat-shadow-lg);
                }
                .chat-assist-widget .submit-registration:disabled {
                    opacity: 0.7;
                    cursor: not-allowed;
                    transform: none;
                }
                @media (max-width: 768px) {
                    .chat-assist-widget .chat-window {
                        width: 90vw;
                        height: 70vh;
                    }
                    .chat-assist-widget .suggested-question-btn {
                        font-size: 12px;
                        padding: 8px 12px;
                    }
                }
                @media (max-width: 480px) {
                    .chat-assist-widget .chat-window {
                        width: 95vw;
                        height: 65vh;
                    }
                    .chat-assist-widget .chat-launcher {
                        height: 50px;
                        padding: 0 16px 0 12px;
                    }
                    .chat-assist-widget .suggested-question-btn {
                        font-size: 11px;
                        padding: 6px 10px;
                    }
                }
            `;
            document.head.appendChild(widgetStyles);

            // Default configuration
            const defaultSettings = {
                webhook: { url: '', route: '' },
                branding: {
                    logo: '',
                    name: '',
                    welcomeText: '',
                    responseTimeText: '',
                    poweredBy: { text: 'Powered by NadinPayam', link: 'https://nadinpayam.ir/' }
                },
                style: {
                    primaryColor: '#5A8CF2',
                    secondaryColor: '#4267B2',
                    tertiaryColor: '#1A2A44',
                    lightColor: '#F7F7F9',
                    position: 'right',
                    backgroundColor: '#ffffff',
                    fontColor: '#1A2A44',
                    textLightColor: '#6b7280',
                    borderColor: '#e5e7eb'
                },
                suggestedQuestions: []
            };

            // Merge user settings with defaults
            const settings = window.ChatWidgetConfig ? 
                {
                    webhook: { ...defaultSettings.webhook, ...window.ChatWidgetConfig.webhook },
                    branding: { ...defaultSettings.branding, ...window.ChatWidgetConfig.branding },
                    style: { 
                        ...defaultSettings.style, 
                        ...window.ChatWidgetConfig.style,
                        primaryColor: window.ChatWidgetConfig.style?.primaryColor || '#5A8CF2',
                        secondaryColor: window.ChatWidgetConfig.style?.secondaryColor || '#4267B2',
                        tertiaryColor: window.ChatWidgetConfig.style?.tertiaryColor || '#1A2A44',
                        lightColor: window.ChatWidgetConfig.style?.lightColor || '#F7F7F9',
                        textLightColor: window.ChatWidgetConfig.style?.textLightColor || '#6b7280',
                        borderColor: window.ChatWidgetConfig.style?.borderColor || '#e5e7eb'
                    },
                    suggestedQuestions: window.ChatWidgetConfig.suggestedQuestions || defaultSettings.suggestedQuestions
                } : defaultSettings;

            // Session tracking
            let conversationId = '';
            let isWaitingForResponse = false;

            // Create widget DOM structure
            const widgetRoot = document.createElement('div');
            widgetRoot.className = 'chat-assist-widget';
            
            // Apply custom colors
            widgetRoot.style.setProperty('--chat-widget-primary', settings.style.primaryColor);
            widgetRoot.style.setProperty('--chat-widget-secondary', settings.style.secondaryColor);
            widgetRoot.style.setProperty('--chat-widget-tertiary', settings.style.tertiaryColor);
            widgetRoot.style.setProperty('--chat-widget-light', settings.style.lightColor);
            widgetRoot.style.setProperty('--chat-widget-surface', settings.style.backgroundColor);
            widgetRoot.style.setProperty('--chat-widget-text', settings.style.fontColor);
            widgetRoot.style.setProperty('--chat-widget-text-light', settings.style.textLightColor);
            widgetRoot.style.setProperty('--chat-widget-border', settings.style.borderColor);

            // Create chat panel
            const chatWindow = document.createElement('div');
            chatWindow.className = `chat-window ${settings.style.position === 'left' ? 'left-side' : 'right-side'}`;
            
            // Create welcome screen with header
            const welcomeScreenHTML = `
                <div class="chat-header">
                    <img class="chat-header-logo" src="${settings.branding.logo}" alt="${settings.branding.name}">
                    <span class="chat-header-title">${settings.branding.name}</span>
                    <button class="chat-close-btn">×</button>
                </div>
                <div class="chat-welcome">
                    <h2 class="chat-welcome-title">${settings.branding.welcomeText}</h2>
                    <button class="chat-start-btn">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                        </svg>
                        شروع گفتگو
                    </button>
                    <p class="chat-response-time">${settings.branding.responseTimeText}</p>
                </div>
                <div class="user-registration">
                    <h2 class="registration-title">لطفاً اطلاعات خود را وارد کنید</h2>
                    <form class="registration-form">
                        <div class="form-field">
                            <label class="form-label" for="chat-user-name">نام</label>
                            <input type="text" id="chat-user-name" class="form-input" placeholder="نام شما" required>
                            <div class="error-text" id="name-error"></div>
                        </div>
                        <div class="form-field">
                            <label class="form-label" for="chat-user-phone">شماره موبایل</label>
                            <input type="tel" id="chat-user-phone" class="form-input" placeholder="شماره همراه شما" required>
                            <div class="error-text" id="phone-error"></div>
                        </div>
                        <button type="submit" class="submit-registration">ادامه به گفتگو</button>
                    </form>
                </div>
            `;

            // Create chat interface
            const chatInterfaceHTML = `
                <div class="chat-body">
                    <div class="chat-messages"></div>
                    <div class="chat-controls">
                        <textarea class="chat-textarea" placeholder="پیام خود را اینجا تایپ کنید..." rows="1"></textarea>
                        <button class="chat-submit">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M22 2L11 13"></path>
                                <path d="M22 2l-7 20-4-9-9-4 20-7z"></path>
                            </svg>
                        </button>
                    </div>
                    <div class="chat-footer">
                        <a class="chat-footer-link" href="${settings.branding.poweredBy.link}" target="_blank">${settings.branding.poweredBy.text}</a>
                    </div>
                </div>
            `;
            
            chatWindow.innerHTML = welcomeScreenHTML + chatInterfaceHTML;
            
            // Create toggle button
            const launchButton = document.createElement('button');
            launchButton.className = `chat-launcher ${settings.style.position === 'left' ? 'left-side' : 'right-side'}`;
            launchButton.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                </svg>
                <span class="chat-launcher-text">نیاز به کمک دارید؟</span>`;
            
            // Add elements to DOM
            widgetRoot.appendChild(chatWindow);
            widgetRoot.appendChild(launchButton);
            document.body.appendChild(widgetRoot);
            console.log('Widget DOM elements appended.');

            // Get DOM elements
            const startChatButton = chatWindow.querySelector('.chat-start-btn');
            const chatBody = chatWindow.querySelector('.chat-body');
            const messagesContainer = chatWindow.querySelector('.chat-messages');
            const messageTextarea = chatWindow.querySelector('.chat-textarea');
            const sendButton = chatWindow.querySelector('.chat-submit');
            const registrationForm = chatWindow.querySelector('.registration-form');
            const userRegistration = chatWindow.querySelector('.user-registration');
            const chatWelcome = chatWindow.querySelector('.chat-welcome');
            const nameInput = chatWindow.querySelector('#chat-user-name');
            const phoneInput = chatWindow.querySelector('#chat-user-phone');
            const nameError = chatWindow.querySelector('#name-error');
            const phoneError = chatWindow.querySelector('#phone-error');

            // Helper function to generate unique session ID
            function createSessionId() {
                console.log('Generating session ID...');
                return crypto.randomUUID();
            }

            // Create typing indicator element
            function createTypingIndicator() {
                const indicator = document.createElement('div');
                indicator.className = 'typing-indicator';
                indicator.innerHTML = `
                    <div class="typing-dot"></div>
                    <div class="typing-dot"></div>
                    <div class="typing-dot"></div>
                `;
                return indicator;
            }

            // Convert URLs to clickable links
            function linkifyText(text) {
                const urlPattern = /(\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim;
                return text.replace(urlPattern, `<a href="$1" target="_blank" rel="noopener noreferrer" class="chat-link">$1</a>`);
            }

            // Show registration form
            function showRegistrationForm() {
                console.log('Showing registration form...');
                chatWelcome.style.display = 'none';
                userRegistration.classList.add('active');
            }

            // Validate phone number
            function isValidPhoneNumber(phone) {
                const phoneRegex = /^\d{11}$/;
                return phoneRegex.test(phone);
            }

            // Handle registration form submission
            async function handleRegistration(event) {
                event.preventDefault();
                console.log('Handling registration form submission...');
                
                nameError.textContent = '';
                phoneError.textContent = '';
                nameInput.classList.remove('error');
                phoneInput.classList.remove('error');
                
                const name = nameInput.value.trim();
                const phone = phoneInput.value.trim();
                
                let isValid = true;
                
                if (!name) {
                    nameError.textContent = 'لطفاً نام خود را وارد کنید';
                    nameInput.classList.add('error');
                    isValid = false;
                }
                
                if (!phone) {
                    phoneError.textContent = 'لطفاً شماره موبایل خود را وارد کنید';
                    phoneInput.classList.add('error');
                    isValid = false;
                } else if (!isValidPhoneNumber(phone)) {
                    phoneError.textContent = 'شماره موبایل باید دقیقاً ۱۱ رقم باشد (مثال: 09123456789)';
                    phoneInput.classList.add('error');
                    isValid = false;
                }
                
                if (!isValid) return;
                
                conversationId = createSessionId();
                
                const sessionData = [{
                    action: "loadPreviousSession",
                    sessionId: conversationId,
                    route: settings.webhook.route,
                    metadata: { userId: phone, userName: name }
                }];

                try {
                    userRegistration.classList.remove('active');
                    chatBody.classList.add('active');
                    
                    const typingIndicator = createTypingIndicator();
                    messagesContainer.appendChild(typingIndicator);
                    
                    const sessionResponse = await fetch(settings.webhook.url, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(sessionData)
                    });
                    
                    const sessionResponseData = await sessionResponse.json();
                    
                    const userInfoMessage = `نام: ${name}\nشماره موبایل: ${phone}`;
                    const userInfoData = {
                        action: "sendMessage",
                        sessionId: conversationId,
                        route: settings.webhook.route,
                        chatInput: userInfoMessage,
                        metadata: { userId: phone, userName: name, isUserInfo: true }
                    };
                    
                    const userInfoResponse = await fetch(settings.webhook.url, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(userInfoData)
                    });
                    
                    const userInfoResponseData = await userInfoResponse.json();
                    
                    messagesContainer.removeChild(typingIndicator);
                    
                    // Add welcome message first
                    const botMessage = document.createElement('div');
                    botMessage.className = 'chat-bubble bot-bubble';
                    const messageText = Array.isArray(userInfoResponseData) ? 
                        userInfoResponseData[0].output : userInfoResponseData.output;
                    botMessage.innerHTML = linkifyText(messageText);
                    messagesContainer.appendChild(botMessage);
                    
                    // Then add suggested questions
                    if (settings.suggestedQuestions && Array.isArray(settings.suggestedQuestions) && settings.suggestedQuestions.length > 0) {
                        const suggestedQuestionsContainer = document.createElement('div');
                        suggestedQuestionsContainer.className = 'suggested-questions';
                        settings.suggestedQuestions.forEach(question => {
                            const questionButton = document.createElement('button');
                            questionButton.className = 'suggested-question-btn';
                            questionButton.textContent = question;
                            questionButton.addEventListener('click', () => {
                                console.log(`Suggested question clicked: ${question}`);
                                submitMessage(question);
                            });
                            suggestedQuestionsContainer.appendChild(questionButton);
                        });
                        messagesContainer.appendChild(suggestedQuestionsContainer);
                    }
                } catch (error) {
                    console.error('Registration error:', error);
                    const indicator = messagesContainer.querySelector('.typing-indicator');
                    if (indicator) {
                        messagesContainer.removeChild(indicator);
                    }
                    const errorMessage = document.createElement('div');
                    errorMessage.className = 'chat-bubble bot-bubble';
                    errorMessage.textContent = "متأسفانه نتوانستم به سرور متصل شوم. لطفاً دوباره امتحان کنید.";
                    messagesContainer.appendChild(errorMessage);
                }
            }

            // Send a message to the webhook
            async function submitMessage(messageText) {
                if (isWaitingForResponse) return;
                isWaitingForResponse = true;
                console.log(`Submitting message: ${messageText}`);
                
                const phone = phoneInput ? phoneInput.value.trim() : "";
                const name = nameInput ? nameInput.value.trim() : "";
                
                const requestData = {
                    action: "sendMessage",
                    sessionId: conversationId,
                    route: settings.webhook.route,
                    chatInput: messageText,
                    metadata: { userId: phone, userName: name }
                };

                const userMessage = document.createElement('div');
                userMessage.className = 'chat-bubble user-bubble';
                userMessage.textContent = messageText;
                messagesContainer.appendChild(userMessage);
                messagesContainer.scrollTo({ top: messagesContainer.scrollHeight, behavior: 'smooth' }); // Smooth scroll to user message
                
                const typingIndicator = createTypingIndicator();
                messagesContainer.appendChild(typingIndicator);
                messagesContainer.scrollTo({ top: messagesContainer.scrollHeight, behavior: 'smooth' }); // Smooth scroll to typing indicator

                try {
                    const response = await fetch(settings.webhook.url, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(requestData)
                    });
                    
                    const responseData = await response.json();
                    
                    messagesContainer.removeChild(typingIndicator);
                    
                    const botMessage = document.createElement('div');
                    botMessage.className = 'chat-bubble bot-bubble';
                    const responseText = Array.isArray(responseData) ? responseData[0].output : responseData.output;
                    botMessage.innerHTML = linkifyText(responseText);
                    messagesContainer.appendChild(botMessage);
                    messagesContainer.scrollTo({ top: messagesContainer.scrollHeight, behavior: 'smooth' }); // Smooth scroll to bot message
                } catch (error) {
                    console.error('Message submission error:', error);
                    messagesContainer.removeChild(typingIndicator);
                    const errorMessage = document.createElement('div');
                    errorMessage.className = 'chat-bubble bot-bubble';
                    errorMessage.textContent = "متأسفانه نتوانستم پیام شما را ارسال کنم. لطفاً دوباره امتحان کنید.";
                    messagesContainer.appendChild(errorMessage);
                    messagesContainer.scrollTo({ top: messagesContainer.scrollHeight, behavior: 'smooth' }); // Smooth scroll to error message
                } finally {
                    isWaitingForResponse = false;
                }
            }

            // Auto-resize textarea
            function autoResizeTextarea() {
                messageTextarea.style.height = 'auto';
                messageTextarea.style.height = (messageTextarea.scrollHeight > 120 ? 120 : messageTextarea.scrollHeight) + 'px';
            }

            // Event listeners
            startChatButton.addEventListener('click', showRegistrationForm);
            registrationForm.addEventListener('submit', handleRegistration);
            
            sendButton.addEventListener('click', () => {
                const messageText = messageTextarea.value.trim();
                if (messageText && !isWaitingForResponse) {
                    submitMessage(messageText);
                    messageTextarea.value = '';
                    messageTextarea.style.height = 'auto';
                }
            });
            
            messageTextarea.addEventListener('input', autoResizeTextarea);
            
            messageTextarea.addEventListener('keypress', (event) => {
                if (event.key === 'Enter' && !event.shiftKey) {
                    event.preventDefault();
                    const messageText = messageTextarea.value.trim();
                    if (messageText && !isWaitingForResponse) {
                        submitMessage(messageText);
                        messageTextarea.value = '';
                        messageTextarea.style.height = 'auto';
                    }
                }
            });
            
            launchButton.addEventListener('click', () => {
                console.log('Launcher button clicked.');
                chatWindow.classList.toggle('visible');
            });

            // Close button functionality
            const closeButtons = chatWindow.querySelectorAll('.chat-close-btn');
            closeButtons.forEach(button => {
                button.addEventListener('click', () => {
                    console.log('Close button clicked.');
                    chatWindow.classList.remove('visible');
                });
            });

            console.log('Chat widget initialization complete.');
        })();
