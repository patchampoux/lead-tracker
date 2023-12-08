class LeadTracker {
    constructor() {
        this.leads = JSON.parse(localStorage.getItem('leads')) || [];

        this.initDOMElements();
        this.addEventListeners();
        this.updateLeadsUI(this.leads);
    }

    initDOMElements() {
        this.$leadInput = this.getElement('#lead-input');
        this.$saveInputBtn = this.getElement('#save-input-btn');
        this.$saveTabBtn = this.getElement('#save-tab-btn');
        this.$deleteBtn = this.getElement('#delete-btn');
        this.$leadsItemsOutlet = this.getElement('#leads-items-outlet');
    }

    getElement(selector) {
        const $element = document.querySelector(selector);

        if (!$element) {
            console.error(`Element with selector "${selector}" not found.`);
        }

        return $element;
    }

    addEventListeners() {
        this.$saveInputBtn?.addEventListener('click', () => this.handleSaveInput());
        this.$saveTabBtn?.addEventListener('click', () => this.handleSaveTab());
        this.$deleteBtn?.addEventListener('click', () => this.deleteAll());
    }

    handleSaveInput() {
        const value = this.$leadInput.value;

        if (value) {
            this.saveLead(value);

            this.$leadInput.value;
        }
    }

    handleSaveTab() {
        this.getCurrentTabUrl(url => this.saveLead(url));
    }

    saveLead(lead) {
        if (!this.leads.includes(lead)) {
            this.leads.push(lead);

            localStorage.setItem('leads', JSON.stringify(this.leads));

            this.updateLeadsUI(this.leads);
        }
    }

    deleteAll() {
        localStorage.clear();

        this.leads = [];

        this.updateLeadsUI(this.leads);
    }

    getCurrentTabUrl(callback) {
        return chrome.tabs?.query({ active: true, currentWindow: true }, tabs => callback(tabs[0].url));
    }

    updateLeadsUI(leads) {
        const leadsItemsOutletHasChildren = this.$leadsItemsOutlet.children.length;

        if (leads.length >= 1) {
            if (!leadsItemsOutletHasChildren) {
                const ul = document.createElement('ul');
                ul.id = 'leads';

                this.$leadsItemsOutlet.append(ul);
            }

            const listItems = leads
                .map(
                    lead => `
                        <li>
                            <a href="${lead}" target="_blank">${lead}</a>
                        </li>
                    `
                )
                .join('');

            this.$leadsItemsOutlet.querySelector('ul').innerHTML = listItems;
        } else {
            if (leadsItemsOutletHasChildren) {
                this.$leadsItemsOutlet.textContent = '';
            }
        }
    }
}

new LeadTracker();
