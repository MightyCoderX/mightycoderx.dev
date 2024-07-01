const contactCardTemplate = document.createElement('template');
contactCardTemplate.innerHTML = `
    <div class="card">
        <a href=""><img src="/assets/icons/"></a>
        <p></p>
        <!-- <a href="" target="_blank"></a> -->
    </div>
    <style>
        .card
        {
            display: flex;
            flex-direction: column;
            gap: 1rem;
            align-items: center;
            justify-content: space-around;
            padding: 1rem;
            box-shadow: 0 0 1rem #0007;
            border-radius: 1rem;
            position: relative;
        }

        .card img
        {
            width: 128px;
            display: block;
        }

        .card a
        {
            display: block;
            transition: 0.2s;

            &:hover
            {
                transform: scale(1.05);
            }

            &:active
            {
                opacity: 0.9;
            }
        }
    </style>
`;

export default class ContactCard extends HTMLElement
{
    constructor(contact)
    {
        super();

        this.contact = contact;

        this.attachShadow({ mode: 'open' });
        this.shadowRoot.append(contactCardTemplate.content.cloneNode(true));
    }

    connectedCallback()
    {
        this.shadowRoot.querySelector('.card img').src += `${this.contact.name.toLowerCase()}.svg`;
        this.shadowRoot.querySelector('.card p').innerHTML = this.contact.description;
        this.shadowRoot.querySelector('.card a').href = this.contact.link.url;
        this.shadowRoot.querySelector('.card a').title = this.contact.link.text;
    }
}

customElements.define('contact-card', ContactCard);
