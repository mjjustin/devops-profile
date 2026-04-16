/**
 * Orange Bytes — LLM AI Chat Widget powered by Groq
 */

// IMPORTANT: We now point to your secure Cloudflare Worker Proxy!
// Keep this as "/api/chat" if testing locally via wrangler, or replace with your full *.workers.dev URL when deployed.
let PROXY_URL = 'https://orange-bytes-chat-proxy.orange-bytes-chat-proxy.workers.dev';

const MODEL = 'llama-3.1-8b-instant'; // Supported Lightning-fast Llama 3.1 model

class ChatWidget {
  constructor() {
    this.isOpen = false;
    this.messages = [];
    this.systemContext = this.extractWebsiteContext();
    this.init();
  }

  extractWebsiteContext() {
    // Scrape all text on the current page to feed the LLM
    const bodyText = document.body.innerText.replace(/\s+/g, ' ').trim();
    return `You are Orange Bot, the helpful AI assistant for "Orange Bytes". Orange Bytes provides AI Agents and Human Consulting (DevOps/SRE) services. 
    You are currently chatting with a visitor on the company portfolio website.
    Always be polite, concise, and professional. 
    FORMATTING RULE: Use bullet points and line-breaks when listing agents, features, or prices to make it easy to read. (Do not use heavy markdown, just new lines).
    
    CAPABILITY: You HAVE the ability to contact the team and send emails behind the scenes! If the user asks you to send an email, share contact info, or reach out to the team, you must say: "Of course! I can message the team right now. Just provide your email address in this window."
    If the user provides an email, say "Thank you! I have securely forwarded your message to the Orange Bytes team. We will be in touch shortly."
    
    If the user asks for a feature, service pricing, timeline, or contact info, reference this source content scraped from the website:
    --- BEGIN SITE CONTEXT ---
    ${bodyText.substring(0, 4000)} // Limiting to 4000 chars for prompt safety
    --- END SITE CONTEXT ---`;
  }

  init() {
    this.createWidgetHTML();
    this.bindEvents();

    // Restore history if user navigates across pages
    const savedHTML = sessionStorage.getItem('orange_chat_html');
    const savedMessages = sessionStorage.getItem('orange_chat_array');

    if (savedHTML && savedMessages) {
      this.messagesContainer.innerHTML = savedHTML;
      this.messages = JSON.parse(savedMessages);
      this.scrollToBottom();
    } else {
      // Add initial greeting only if no history exists
      setTimeout(() => {
        this.addMessage("Hi there! I'm the Orange Bytes virtual assistant. How can I help you build or automate today?", 'bot');
      }, 500);
    }
  }

  createWidgetHTML() {
    const container = document.createElement('div');
    container.className = 'chat-widget-container';
    container.innerHTML = `
      <div class="chat-widget-window" id="chatWindow" data-lenis-prevent>
        <div class="chat-widget-header">
          <div class="chat-widget-header-info">
            <div class="chat-widget-avatar">🤖</div>
            <div>
              <div class="chat-widget-title">Orange Assistant</div>
              <div class="chat-widget-subtitle">Powered by Groq Llama-3</div>
            </div>
          </div>
          <button class="chat-widget-close" id="chatClose">&times;</button>
        </div>
        <div class="chat-widget-messages" id="chatMessages" data-lenis-prevent></div>
        <div class="chat-widget-input-area">
          <input type="text" class="chat-widget-input" id="chatInput" placeholder="Ask about our services..." autocomplete="off">
          <button class="chat-widget-send" id="chatSend">🚀</button>
        </div>
      </div>
      <button class="chat-widget-button" id="chatButton">💬</button>
    `;
    document.body.appendChild(container);

    this.window = document.getElementById('chatWindow');
    this.button = document.getElementById('chatButton');
    this.closeBtn = document.getElementById('chatClose');
    this.messagesContainer = document.getElementById('chatMessages');
    this.input = document.getElementById('chatInput');
    this.sendBtn = document.getElementById('chatSend');
  }

  bindEvents() {
    this.button.addEventListener('click', () => this.toggleWidget());
    this.closeBtn.addEventListener('click', () => this.toggleWidget());

    this.sendBtn.addEventListener('click', () => this.handleSend());
    this.input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') this.handleSend();
    });
  }

  toggleWidget() {
    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      this.window.classList.add('open');
      this.input.focus();
      this.button.style.transform = 'scale(0)';
    } else {
      this.window.classList.remove('open');
      this.button.style.transform = 'scale(1)';
    }
  }

  addMessage(text, sender) {
    const msgElement = document.createElement('div');
    msgElement.className = `chat-message ${sender}`;
    msgElement.textContent = text;
    this.messagesContainer.appendChild(msgElement);
    this.scrollToBottom();
    
    // Store in history for LLM Context
    if(sender !== 'bot' || this.messages.length > 0) {
        this.messages.push({ role: sender === 'bot' ? 'assistant' : 'user', content: text });
    }

    // Save state so chat persists when navigating static pages
    sessionStorage.setItem('orange_chat_html', this.messagesContainer.innerHTML);
    sessionStorage.setItem('orange_chat_array', JSON.stringify(this.messages));
  }

  showTyping() {
    const typingElement = document.createElement('div');
    typingElement.className = 'typing-indicator';
    typingElement.id = 'typingIndicator';
    typingElement.innerHTML = `<div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div>`;
    this.messagesContainer.appendChild(typingElement);
    this.scrollToBottom();
  }

  hideTyping() {
    const indicator = document.getElementById('typingIndicator');
    if (indicator) indicator.remove();
  }

  scrollToBottom() {
    this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
  }

  async handleSend() {
    const text = this.input.value.trim();
    if (!text) return;

    this.input.value = '';
    this.input.disabled = true;
    this.sendBtn.disabled = true;

    this.addMessage(text, 'user');
    this.showTyping();

    // Temporarily disabled lead capture
    // if (text.includes('@') && text.includes('.')) {
    //    this.silentLeadCapture(text);
    // }

    try {
      const response = await this.queryGroqAPI();
      this.hideTyping();
      this.addMessage(response, 'bot');
    } catch (error) {
      console.error("Groq API Error:", error);
      this.hideTyping();
      this.addMessage("I'm sorry, my neural link is currently offline. Please use the contact page to reach our team directly!", 'bot');
    }

    this.input.disabled = false;
    this.sendBtn.disabled = false;
    this.input.focus();
  }

  async queryGroqAPI() {
    const payload = {
        model: MODEL,
        messages: [
            { role: "system", content: this.systemContext },
            ...this.messages.slice(-5) // Keep last 5 messages for conversation history
        ],
        temperature: 0.7,
        max_tokens: 150
    };

    // Send to our secure Cloudflare proxy instead of Groq directly!
    const response = await fetch(PROXY_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    });

    if (!response.ok) throw new Error(`HTTP error! status: ${ response.status } `);
    
    const data = await response.json();
    return data.choices[0].message.content;
  }

  async silentLeadCapture(messageWithEmail) {
      // Silently forward leads using precise FormData (matches original contact.js behavior)
      try {
          const form = new FormData();
          form.append('email', messageWithEmail);
          form.append('message', 'Automated Lead from Chat Widget: ' + messageWithEmail);

          await fetch('https://formspree.io/f/xpznqkbr', {
              method: 'POST',
              body: form,
              headers: { 'Accept': 'application/json' }
          });
      } catch (e) {
          // Ignore passive errors for silent lead capture
      }
  }
}

// Initialize the widget robustly (handles async or late-loading scenarios)
function initChatWidget() {
  if (!window.chatWidgetInstance) {
    window.chatWidgetInstance = new ChatWidget();
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initChatWidget);
} else {
  initChatWidget();
}
