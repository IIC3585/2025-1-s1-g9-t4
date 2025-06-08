import { LitElement, html, css } from 'https://cdn.jsdelivr.net/gh/lit/dist@2/core/lit-core.min.js';

// Import the CSS file
const styleSheet = new CSSStyleSheet();
fetch('../styles/suscripcion-lit.css')
  .then(response => response.text())
  .then(text => {
    console.log('CSS loaded successfully');
    styleSheet.replaceSync(text);
  })
  .catch(err => console.error('Error loading CSS:', err));

class SuscripcionLit extends LitElement {
    static get properties() {
        return {
            title: { type: String },
            price: { type: String },
            period: { type: String },
            buttonText: { type: String, attribute: 'button-text' },
            featured: { type: Boolean, reflect: true }
        };
    }

    static get styles() {
        return css``;
    }

    constructor() {
        super();
        // Adopt the external stylesheet
        this.constructor.elementStyles = [styleSheet];
        // Default values
        this.title = 'Plan';
        this.price = '$0';
        this.period = 'por mes';
        this.buttonText = 'Suscribirse';
        this.featured = false;
        console.log('SuscripcionLit constructor called');
    }

    connectedCallback() {
        super.connectedCallback();
        console.log('SuscripcionLit connected to the DOM');
    }

    render() {
        console.log('SuscripcionLit render method called', {
            title: this.title,
            price: this.price,
            period: this.period,
            buttonText: this.buttonText,
            featured: this.featured
        });
        return html`
            <div class="suscripcion-card ${this.featured ? 'featured' : ''}">
                <div class="suscripcion-header">
                    <h3 class="suscripcion-title">${this.title}</h3>
                    <div class="suscripcion-price">${this.price}</div>
                    <div class="suscripcion-period">${this.period}</div>
                </div>
                <div class="suscripcion-features">
                    <slot name="features"></slot>
                </div>
                <button class="suscripcion-button" @click=${this._handleClick}>${this.buttonText}</button>
            </div>
        `;
    }

    _handleClick() {
        console.log('Button clicked in SuscripcionLit component');

        // Create and dispatch a custom event
        this.dispatchEvent(new CustomEvent('suscripcion-selected', {
            bubbles: true,
            composed: true,
            detail: {
                title: this.title,
                price: this.price
            }
        }));

        // Also dispatch the event directly from the document
        document.dispatchEvent(new CustomEvent('suscripcion-selected', {
            detail: {
                title: this.title,
                price: this.price
            }
        }));

        // Log to console for debugging
        console.log('Event dispatched:', {
            title: this.title,
            price: this.price
        });
    }
}

// Define the custom element
customElements.define('suscripcion-lit', SuscripcionLit);

console.log('SuscripcionLit component registered');
