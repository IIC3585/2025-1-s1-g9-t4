import { LitElement, html, css } from 'https://cdn.jsdelivr.net/gh/lit/dist@2/core/lit-core.min.js';

console.log('🔥 Iniciando acordion-lit.js');
const styleSheet = new CSSStyleSheet();
fetch('../styles/acordion-lit.css')
  .then(response => response.text())
  .then(text => styleSheet.replaceSync(text))
  .catch(err => console.error('Error loading CSS:', err));

class AcordionLit extends LitElement {
  static properties = {
    singleOpen: { type: Boolean, attribute: 'single-open', reflect: true }
  };

  static styles = css``;

  constructor() {
    super();
    this.constructor.elementStyles = [styleSheet];
    this.singleOpen = false;
    this._items = [];
  }

  render() {
    return html`
      <div class="acordion-container">
        <slot id="slot" @slotchange=${this._onSlotChange}></slot>
      </div>
    `;
  }

  _onSlotChange(e) {
    console.log('[slotchange] Slot actualizado');
    const slot = e.target;
    this._items = slot.assignedElements().filter(el => el.classList.contains('acordion-item'));
    this._setupAccordion();
  }

  _setupAccordion() {
    if (!this._items.length) return;


    if (this.singleOpen) {
      let foundOpen = false;
      this._items.forEach(item => {
        const header = item.querySelector('.acordion-header');
        const content = item.querySelector('.acordion-content');

        if (item.hasAttribute('open') && !foundOpen) {
          header?.classList.add('active');
          content?.classList.add('active');
          foundOpen = true;
        } else {
          header?.classList.remove('active');
          content?.classList.remove('active');
        }

        header?.addEventListener('click', () => {
            console.log('🟢 Header clickeado:', header.textContent);
            this._handleHeaderClick(item);
        });

        
      });
    } else {
      this._items.forEach(item => {
        const header = item.querySelector('.acordion-header');
        const content = item.querySelector('.acordion-content');

        if (item.hasAttribute('open')) {
          header?.classList.add('active');
          content?.classList.add('active');
        } else {
          header?.classList.remove('active');
          content?.classList.remove('active');
        }

        header?.addEventListener('click', () => this._handleHeaderClick(item));
      });
    }
  }

  _handleHeaderClick(item) {
    const header = item.querySelector('.acordion-header');
    const content = item.querySelector('.acordion-content');
    const isActive = header?.classList.contains('active');

    if (this.singleOpen) {
      this._items.forEach(i => {
        const h = i.querySelector('.acordion-header');
        const c = i.querySelector('.acordion-content');
        h?.classList.remove('active');
        c?.classList.remove('active');
      });
    }

    if (!isActive || !this.singleOpen) {
      header?.classList.toggle('active');
      content?.classList.toggle('active');
    }

    this._dispatchToggleEvent(item, !isActive);
  }

  _dispatchToggleEvent(item, isOpen) {
    const header = item.querySelector('.acordion-header');
    const headerText = header ? header.textContent.trim() : '';

    this.dispatchEvent(new CustomEvent('acordion-toggle', {
      bubbles: true,
      composed: true,
      detail: { item, header: headerText, isOpen }
    }));
  }

  openItem(index) {
    console.log(this._items)
    if (!this._items.length) return;
    const item = this._items[index];
    if (!item) return;

    if (this.singleOpen) this.closeAll();

    const header = item.querySelector('.acordion-header');
    const content = item.querySelector('.acordion-content');
    header?.classList.add('active');
    content?.classList.add('active');
    this._dispatchToggleEvent(item, true);
  }

  closeItem(index) {
    console.log(this._items)
    if (!this._items.length) return;
    const item = this._items[index];
    if (!item) return;

    const header = item.querySelector('.acordion-header');
    const content = item.querySelector('.acordion-content');
    header?.classList.remove('active');
    content?.classList.remove('active');
    this._dispatchToggleEvent(item, false);
  }

  closeAll() {
    console.log(this._items)
    this._items.forEach((_, i) => this.closeItem(i));
  }

  openAll() {
    console.log(this._items)
    if (!this.singleOpen) {
      this._items.forEach((_, i) => this.openItem(i));
    }
  }
}

customElements.define('acordion-lit', AcordionLit);
