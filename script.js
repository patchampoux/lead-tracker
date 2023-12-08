class LeadTracker {
    constructor() {
        this.leads = JSON.parse(localStorage.getItem('leads')) || [];

        this.initDOMElements();
        this.addEventListeners();
        this.renderLeadsList(this.leads);
    }

    initDOMElements() {
        this.$leadInput = this.getElement('#lead-input');
        this.$saveInputBtn = this.getElement('#save-input-btn');
        this.$saveTabBtn = this.getElement('#save-tab-btn');
        this.$deleteBtn = this.getElement('#delete-btn');
        this.$leadsItemsOutlet = this.getElement('#leads-items-outlet');
        this.$leadsList = this.createLeadsList();
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

            this.$leadInput.value = '';
        }
    }

    handleSaveTab() {
        this.getCurrentTabUrl(url => this.saveLead(url));
    }

    saveLead(lead) {
        if (!this.leads.includes(lead)) {
            this.leads.push(lead);

            localStorage.setItem('leads', JSON.stringify(this.leads));

            this.renderLeadsList(this.leads);
        }
    }

    deleteAll() {
        localStorage.clear();

        this.leads = [];

        this.$leadsList.innerHTML = '';
    }

    getCurrentTabUrl(callback) {
        return chrome.tabs?.query({ active: true, currentWindow: true }, tabs => callback(tabs[0].url));
    }

    createLeadsList() {
        const ul = document.createElement('ul');
        ul.id = 'leads';

        this.$leadsItemsOutlet.appendChild(ul);

        return ul;
    }

    addLeadToUI(lead) {
        const li = document.createElement('li');
        li.innerHTML = `<a href="${lead}" target="_blank">${lead}</a>`;
        this.$leadsList.appendChild(li);
    }

    renderLeadsList(leads) {
        this.$leadsList.innerHTML = '';

        leads.forEach(lead => this.addLeadToUI(lead));
    }
}

new LeadTracker();
