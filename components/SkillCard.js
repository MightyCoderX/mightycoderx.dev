const skillCardTemplate = document.createElement('template');
skillCardTemplate.innerHTML = `
    <div class="card">
        <img src="/assets/icons/">
    </div>
    <style>
        .card
        {
            width: 128px;
            aspect-ratio: 1;
        }

        .card img
        {
            height: 100%;
            border-radius: 8px;
            display: block;
        }
    </style>
`;

export default class SkillCard extends HTMLElement
{
    constructor(name)
    {
        super();

        this.setAttribute('name', name);

        this.attachShadow({ mode: 'open' });
        this.shadowRoot.append(skillCardTemplate.content.cloneNode(true));
    }

    connectedCallback()
    {
        this.shadowRoot.querySelector('.card img').src += `${this.getAttribute('name')}.svg`;
        
    }
}

customElements.define('skill-card', SkillCard);
