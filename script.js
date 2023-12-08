class LeadTracker {
    constructor() {
        this.leads = JSON.parse(localStorage.getItem('leads')) || [];

        this.$leads = null;

        this.initDOMElements();
        this.addEventListeners();
        this.updateLeadsUI();
    }

    initDOMElements() {
        this.$leadInput = this.getElement('#lead-input');
        this.$saveInputBtn = this.getElement('#save-input-btn');
        this.$deleteBtn = this.getElement('#delete-btn');
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
        this.$deleteBtn?.addEventListener('click', () => this.deleteAll());
    }

    saveLead() {
        const inputValue = this.$leadInput.value;

        if (inputValue) {
            this.leads.push(inputValue);

            localStorage.setItem('leads', JSON.stringify(this.leads));

            this.$leadInput.value = '';

            this.updateLeadsUI();
        }
    }

    deleteAll() {
        localStorage.clear();

        this.leads = [];

        this.updateLeadsUI();
    }

    updateLeadsUI() {
        if (this.leads.length >= 1) {
            if (!this.$leads) {
                const ul = document.createElement('ul');
                ul.id = 'leads';

                this.$deleteBtn.after(ul);

                this.$leads = document.querySelector('#leads');
            }

            const listItems = this.leads
                .map(
                    lead => `
                        <li>
                            <a href="${lead}" target="_blank">${lead}</a>
                        </li>
                    `
                )
                .join('');

            this.$leads.innerHTML = listItems;
        } else {
            if (this.$leads) {
                this.$leads.remove();
            }
        }
    }
}

new LeadTracker();
