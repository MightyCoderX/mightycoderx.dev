import { dispatchOpenWindow } from '../lib/window-event-dispatchers.js';

const desktopIconTemplate = document.createElement('template');

desktopIconTemplate.innerHTML = `
    <style>
        *
        {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            user-select: none;
        }

        .desktop-icon
        {
            display: flex;
            flex-direction: column;
            align-items: center;
            overflow: hidden;
            /* max-height: 100%; */
            outline: none;
        }
        
        .desktop-icon:hover,
        .desktop-icon:focus
        {
            outline: 1px solid #0ffa;
            background: #0ff5;
        }
        
        .desktop-icon .img
        {
            width: 75%;
            aspect-ratio: 1;
            background-repeat: no-repeat;
            background-size: cover;
        }
        
        .desktop-icon p
        {
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;  
            font-size: 12px;
            margin-top: 5px;
            text-align: center;
            word-break: break-word;
            filter: drop-shadow(0 0 0.2rem #000);
        }
    </style>
    <div class="desktop-icon" tabindex="0">
        <div class="img"></div>
        <p></p>
    </div>
`;

export default class DesktopIcon extends HTMLElement
{
    constructor()
    {
        super();

        this.shadow = this.attachShadow({mode: 'open'});
        this.shadow.appendChild(desktopIconTemplate.content.cloneNode(true));
    }
    
    connectedCallback()
    {
        this.draggable = true;
        this.shadow.querySelector('.desktop-icon .img').style.backgroundImage = `url('${this.getAttribute('icon-src')}')`;
        this.shadow.querySelector('.desktop-icon p').textContent = this.getAttribute('label');
        this.container = this.shadow.querySelector('.desktop-icon');

        this.container.addEventListener('dblclick', e =>
        {
            dispatchOpenWindow(this.getAttribute('app-name'));
        });

        this.container.addEventListener('keypress', e =>
        {
            console.log(e);
            if(!['Enter', 'Space'].includes(e.code)) return;
            dispatchOpenWindow(this.getAttribute('app-name'));
        });
    }
}

customElements.define('desktop-icon', DesktopIcon);