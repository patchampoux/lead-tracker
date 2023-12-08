class LeadTracker {
    constructor() {
        this.leads = JSON.parse(localStorage.getItem('leads')) || [];

        this.initDOMElements();
        this.addEventListeners();
        this.updateLeadsUI(this.leads);

        console.log(chrome.tabs);
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
        this.$saveInputBtn?.addEventListener('click', e => this.saveLead(e, this.$leadInput.value));
        this.$saveTabBtn?.addEventListener('click', e => this.getCurrentTabUrl(tab => this.saveLead(e, tab)));
        this.$deleteBtn?.addEventListener('click', () => this.deleteAll());
    }

    saveLead(e, value) {
        if (value) {
            this.leads.push(value);

            localStorage.setItem('leads', JSON.stringify(this.leads));

            e.target.id === 'save-input-btn' && (this.$leadInput.value = '');

            this.updateLeadsUI(this.leads);
        }
    }

    deleteAll() {
        localStorage.clear();

        this.leads = [];

        this.updateLeadsUI(this.leads);
    }

    getCurrentTabUrl(callback) {
        return chrome.tabs && chrome.tabs.query({ active: true, currentWindow: true }, tabs => callback(tabs[0].url));
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
