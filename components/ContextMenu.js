const contextMenuTemplate = document.createElement('template');

contextMenuTemplate.innerHTML = `
    <style>
        *
        {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            user-select: none;
        }

        .context-menu
        {
            position: absolute;
            top: 0;
            left: 0;
            background-color: var(--bg-color-alpha);
            backdrop-filter: var(--backdrop);
            color: #ddd;
            width: max-content;
            height: max-content;
            display: flex;
            flex-direction: column;
            list-style: none;
            overflow: hidden;
            border-radius: 0.3rem;
            font-size: 14px;
            outline: none;
        }

        .context-menu li
        {
            display: flex;
            align-items: center;
            padding: 0.5rem 0.6rem;
        }

        .context-menu li:hover
        {
            background-color: #fff2;
        }
    </style>
    <menu class="context-menu" tabindex="-1"></menu>
`;

export default class ContextMenu extends HTMLElement
{
    constructor(items, position)
    {
        super();

        this.items = items;
        this.position = position;

        this.shadow = this.attachShadow({mode: 'open'});
        this.shadow.appendChild(contextMenuTemplate.content.cloneNode(true));

        this.addEventListener('contextmenu', e => e.preventDefault());
    }

    connectedCallback()
    {
        const contextMenuElem = this.shadow.querySelector('.context-menu');
        contextMenuElem.focus();
        
        contextMenuElem.style.left = `${this.position.x}px`
        contextMenuElem.style.top = `${this.position.y}px`

        this.items.forEach(item =>
        {
            const li = document.createElement('li');
            li.innerText = item.label;
            contextMenuElem.appendChild(li);

            const callAction = async e =>
            {
                e.preventDefault();
                item.action();
                try{ this.remove(); } catch (_){}
            }
            
            li.addEventListener('click', callAction);
            li.addEventListener('contextmenu', callAction);
        });

        contextMenuElem.addEventListener('blur', () => this.remove());
    }
}

customElements.define('context-menu', ContextMenu);