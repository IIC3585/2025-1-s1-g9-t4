// Define the Suscripcion component using standard Web Components
class Suscripcion extends HTMLElement {
    constructor() {
        super();

        // Create a shadow root
        this.attachShadow({ mode: 'open' });

        // Create the template
        const template = document.createElement('template');

        // Create a link element for the external stylesheet
        const linkElem = document.createElement('link');
        linkElem.setAttribute('rel', 'stylesheet');
        linkElem.setAttribute('href', '../styles/suscripcion-standard.css');

        template.innerHTML = `
            <div class="suscripcion-card">
                <div class="suscripcion-header">
                    <h3 class="suscripcion-title"></h3>
                    <div class="suscripcion-price"></div>
                    <div class="suscripcion-period"></div>
                </div>
                <div class="suscripcion-features">
                    <slot name="features"></slot>
                </div>
                <button class="suscripcion-button"></button>
            </div>
        `;

        // Append the link element to the shadow DOM
        this.shadowRoot.appendChild(linkElem);

        // Attach the template content to the shadow DOM
        this.shadowRoot.appendChild(template.content.cloneNode(true));

        // Store references to elements
        this.card = this.shadowRoot.querySelector('.suscripcion-card');
        this.titleElement = this.shadowRoot.querySelector('.suscripcion-title');
        this.priceElement = this.shadowRoot.querySelector('.suscripcion-price');
        this.periodElement = this.shadowRoot.querySelector('.suscripcion-period');
        this.buttonElement = this.shadowRoot.querySelector('.suscripcion-button');

        // Add event listener for the button
        this.buttonElement.addEventListener('click', this._handleClick.bind(this));
    }

    // Lifecycle callback when the element is added to the DOM
    connectedCallback() {
        this._updateContent();

        // Check if this is a featured plan
        if (this.hasAttribute('featured') && this.getAttribute('featured') !== 'false') {
            this.card.classList.add('featured');
        }
    }

    // Lifecycle callback when attributes change
    static get observedAttributes() {
        return ['title', 'price', 'period', 'button-text', 'featured'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue !== newValue) {
            this._updateContent();

            if (name === 'featured') {
                if (newValue !== null && newValue !== 'false') {
                    this.card.classList.add('featured');
                } else {
                    this.card.classList.remove('featured');
                }
            }
        }
    }

    // Update the content based on attributes
    _updateContent() {
        this.titleElement.textContent = this.getAttribute('title') || 'Plan';
        this.priceElement.textContent = this.getAttribute('price') || '$0';
        this.periodElement.textContent = this.getAttribute('period') || 'por mes';
        this.buttonElement.textContent = this.getAttribute('button-text') || 'Suscribirse';
    }

    // Handle button click
    _handleClick(event) {
        // Create and dispatch a custom event
        const customEvent = new CustomEvent('suscripcion-selected', {
            bubbles: true,
            composed: true,
            detail: {
                title: this.getAttribute('title'),
                price: this.getAttribute('price')
            }
        });

        this.dispatchEvent(customEvent);
    }
}

// Define the custom element
customElements.define('suscripcion-component', Suscripcion);
