// Define the Acordion component using standard Web Components
class Acordion extends HTMLElement {
    constructor() {
        super();

        // Create a shadow root
        this.attachShadow({ mode: 'open' });

        // Create the template
        const template = document.createElement('template');

        // Create a link element for the external stylesheet
        const linkElem = document.createElement('link');
        linkElem.setAttribute('rel', 'stylesheet');
        linkElem.setAttribute('href', '../styles/acordion-standard.css');

        template.innerHTML = `
            <div class="acordion-container">
                <slot></slot>
            </div>
        `;

        // Append the link element to the shadow DOM
        this.shadowRoot.appendChild(linkElem);

        // Attach the template content to the shadow DOM
        this.shadowRoot.appendChild(template.content.cloneNode(true));
    }

    // Lifecycle callback when the element is added to the DOM
    connectedCallback() {
        console.log('Acordion connected to the DOM');
        // Wait for slotted content to be available
        setTimeout(() => {
            console.log('Setting up accordion');
            this._setupAccordion();
        }, 0);
    }

    // Set up the accordion functionality
    _setupAccordion() {
        // Get all accordion items
        const items = this.querySelectorAll('.acordion-item');
        console.log('Found accordion items:', items.length);

        // Add click event listeners to headers
        items.forEach((item, index) => {
            const header = item.querySelector('.acordion-header');
            const content = item.querySelector('.acordion-content');
            console.log(`Item ${index}:`, { header, content });

            if (header && content) {
                // Add click event listener
                header.addEventListener('click', () => {
                    console.log('Header clicked:', header);
                    // Check if this header is already active
                    const isActive = header.classList.contains('active');
                    console.log('Is active:', isActive);

                    // Close all sections
                    if (this.hasAttribute('single-open') && this.getAttribute('single-open') !== 'false') {
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
                    if (isActive) {
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
                });

                // If this item has the 'open' attribute, open it by default
                if (item.hasAttribute('open') && item.getAttribute('open') !== 'false') {
                    console.log(`Opening item ${index} by default`);
                    header.classList.add('active');
                    content.classList.add('active');
                    console.log('Header classes after default open:', header.className);
                    console.log('Content classes after default open:', content.className);
                }
            }
        });
    }

    // Dispatch custom event when an accordion item is toggled
    _dispatchToggleEvent(item, isOpen) {
        const header = item.querySelector('.acordion-header');
        const headerText = header ? header.textContent.trim() : '';

        const customEvent = new CustomEvent('acordion-toggle', {
            bubbles: true,
            composed: true,
            detail: {
                item: item,
                header: headerText,
                isOpen: isOpen
            }
        });

        this.dispatchEvent(customEvent);
    }

    // Method to open a specific accordion item by index
    openItem(index) {
        const items = this.querySelectorAll('.acordion-item');
        if (index >= 0 && index < items.length) {
            const item = items[index];
            const header = item.querySelector('.acordion-header');
            const content = item.querySelector('.acordion-content');

            if (header && content) {
                // Close all if single-open is true
                if (this.hasAttribute('single-open') && this.getAttribute('single-open') !== 'false') {
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

    // Method to close a specific accordion item by index
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

    // Method to close all accordion items
    closeAll() {
        const items = this.querySelectorAll('.acordion-item');
        items.forEach((item, index) => {
            this.closeItem(index);
        });
    }

    // Method to open all accordion items
    openAll() {
        // Only open all if single-open is false
        if (!this.hasAttribute('single-open') || this.getAttribute('single-open') === 'false') {
            const items = this.querySelectorAll('.acordion-item');
            items.forEach((item, index) => {
                this.openItem(index);
            });
        }
    }
}

// Define the custom element
customElements.define('acordion', Acordion);
