class LeadTracker {
    constructor() {
        this.leads = [];

        this.$leads = null;

        this.initDOMElements();
        this.addEventListeners();
    }

    initDOMElements() {
        this.$leadInput = this.getElement('#lead-input');
        this.$saveInputBtn = this.getElement('#save-input-btn');
    }

    getElement(selector) {
        const $element = document.querySelector(selector);

        if (!$element) {
            console.error(`Element with selector "${selector}" not found.`);
        }
        
        return $element;
    }

    addEventListeners() {
        this.$saveInputBtn?.addEventListener('click', () => this.saveLead());
    }

    saveLead() {
        const inputValue = this.$leadInput.value;

        if (inputValue) {
            this.leads.push(inputValue);

            this.$leadInput.value = '';
            
            this.updateLeadsUI();
        }
    }

    updateLeadsUI() {
        if (this.leads.length === 1) {
            const ul = document.createElement('ul');
            ul.id = 'leads';

            this.$saveInputBtn.after(ul);

            this.$leads = document.querySelector('#leads');
        }

        const listItems = this.leads.map(lead => `
            <li>
                <a href="${lead}" target="_blank">${lead}</a>
            </li>
        `).join('');

        this.$leads.innerHTML = listItems;
    }
}

new LeadTracker();