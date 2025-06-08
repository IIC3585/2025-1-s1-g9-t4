import { LitElement, html, css } from 'https://cdn.jsdelivr.net/gh/lit/dist@2/core/lit-core.min.js';

// Import the CSS file
const styleSheet = new CSSStyleSheet();
fetch('../styles/acordion-lit.css')
  .then(response => response.text())
  .then(text => styleSheet.replaceSync(text))
  .catch(err => console.error('Error loading CSS:', err));

class AcordionLit extends LitElement {
    static get properties() {
        return {
            singleOpen: { type: Boolean, attribute: 'single-open', reflect: true }
        };
    }

    static get styles() {
        return css``;
    }

    constructor() {
        super();
        // Adopt the external stylesheet
        this.constructor.elementStyles = [styleSheet];
        this.singleOpen = false;
    }

    render() {
        return html`
            <div class="acordion-container">
                <slot @slotchange=${this._setupAccordion}></slot>
            </div>
        `;
    }

    firstUpdated() {
        this._setupAccordion();
    }

    _setupAccordion() {
        setTimeout(() => {
            console.log('Setting up accordion');
            const items = this.querySelectorAll('.acordion-item');
            console.log('Found accordion items:', items.length);

            // Si singleOpen está activo, solo permite uno abierto, cierra los demás
            if (this.singleOpen) {
                let openedFound = false;
                items.forEach(item => {
                    const header = item.querySelector('.acordion-header');
                    const content = item.querySelector('.acordion-content');

                    if (item.hasAttribute('open') && !openedFound) {
                        openedFound = true;
                        header.classList.add('active');
                        content.classList.add('active');
                    } else {
                        header.classList.remove('active');
                        content.classList.remove('active');
                    }
                });
            } else {
                // Si no es singleOpen, abre solo los que tienen atributo 'open', cierra los demás
                items.forEach(item => {
                    const header = item.querySelector('.acordion-header');
                    const content = item.querySelector('.acordion-content');

                    if (item.hasAttribute('open')) {
                        header.classList.add('active');
                        content.classList.add('active');
                    } else {
                        header.classList.remove('active');
                        content.classList.remove('active');
                    }
                });
            }

            // Agrega los event listeners
            items.forEach((item, index) => {
                const header = item.querySelector('.acordion-header');
                if (header) {
                    header.removeEventListener('click', this._handleHeaderClick);
                    header.addEventListener('click', this._handleHeaderClick.bind(this));
                }
            });
        }, 0);
    }


    _handleHeaderClick(event) {
        const header = event.currentTarget;
        const item = header.parentElement;
        const content = item.querySelector('.acordion-content');
        console.log('Header clicked:', header);

        if (header && content) {
            // Check if this header is already active
            const isActive = header.classList.contains('active');
            console.log('Is active:', isActive);

            // Close all sections if single-open is true
            if (this.singleOpen) {
                const items = this.querySelectorAll('.acordion-item');
                items.forEach(otherItem => {
                    const otherHeader = otherItem.querySelector('.acordion-header');
                    const otherContent = otherItem.querySelector('.acordion-content');

                    if (otherHeader && otherContent) {
                        otherHeader.classList.remove('active');
                        otherContent.classList.remove('active');
                    }
                });
            }

            // Toggle current section
            if (isActive && !this.singleOpen) {
                console.log('Removing active class');
                header.classList.remove('active');
                content.classList.remove('active');
            } else {
                console.log('Adding active class');
                header.classList.add('active');
                content.classList.add('active');
            }

            console.log('Header classes after toggle:', header.className);
            console.log('Content classes after toggle:', content.className);

            // Dispatch custom event
            this._dispatchToggleEvent(item, !isActive);
        }
    }

    _dispatchToggleEvent(item, isOpen) {
        const header = item.querySelector('.acordion-header');
        const headerText = header ? header.textContent.trim() : '';

        this.dispatchEvent(new CustomEvent('acordion-toggle', {
            bubbles: true,
            composed: true,
            detail: {
                item: item,
                header: headerText,
                isOpen: isOpen
            }
        }));
    }

    // Public methods for programmatic control

    openItem(index) {
        const items = this.querySelectorAll('.acordion-item');
        if (index >= 0 && index < items.length) {
            const item = items[index];
            const header = item.querySelector('.acordion-header');
            const content = item.querySelector('.acordion-content');

            if (header && content) {
                // Close all if single-open is true
                if (this.singleOpen) {
                    items.forEach(otherItem => {
                        const otherHeader = otherItem.querySelector('.acordion-header');
                        const otherContent = otherItem.querySelector('.acordion-content');

                        if (otherHeader && otherContent) {
                            otherHeader.classList.remove('active');
                            otherContent.classList.remove('active');
                        }
                    });
                }

                header.classList.add('active');
                content.classList.add('active');

                // Dispatch custom event
                this._dispatchToggleEvent(item, true);
            }
        }
    }

    closeItem(index) {
        const items = this.querySelectorAll('.acordion-item');
        if (index >= 0 && index < items.length) {
            const item = items[index];
            const header = item.querySelector('.acordion-header');
            const content = item.querySelector('.acordion-content');

            if (header && content) {
                header.classList.remove('active');
                content.classList.remove('active');

                // Dispatch custom event
                this._dispatchToggleEvent(item, false);
            }
        }
    }

    closeAll() {
        const items = this.querySelectorAll('.acordion-item');
        items.forEach((item, index) => {
            this.closeItem(index);
        });
    }

    openAll() {
        // Only open all if single-open is false
        if (!this.singleOpen) {
            const items = this.querySelectorAll('.acordion-item');
            items.forEach((item, index) => {
                this.openItem(index);
            });
        }
    }
}

// Define the custom element
customElements.define('acordion-lit', AcordionLit);