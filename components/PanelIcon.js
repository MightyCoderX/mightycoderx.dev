import { dispatchToggleMinimizeWindow } from '../lib/window-event-dispatchers.js';

const panelAppIconTemplate = document.createElement('template');

panelAppIconTemplate.innerHTML = `
    <style>
        *
        {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            user-select: none;
        }

        .panel-icon
        {
            display: grid;
            position: relative;
            height: 100%;
            overflow: hidden;
            place-items: center;
            user-select: none;
        }

        .panel-icon::after
        {
            content: '';
            position: absolute;
            width: 100%;
            height: 2px;
            bottom: 0;
            background-color: white;
        }
        
        .panel-icon:hover
        {
            background-color: #fff2;
        }

        .panel-icon:focus-visible
        {
            outline: 2px solid white;
            outline-offset: -2px;
        }

        .panel-icon .img
        {
            height: 70%;
            aspect-ratio: 1;
            background-repeat: no-repeat;
            background-size: cover;
        }
    </style>
    <div class="panel-icon" tabindex="0">
        <div class="img"></div>
    </div>
`;

export default class PanelIcon extends HTMLElement
{
    constructor()
    {
        super();

        this.shadow = this.attachShadow({mode: 'open'});
        this.shadow.appendChild(panelAppIconTemplate.content.cloneNode(true));
    }

    connectedCallback()
    {
        this.shadow.querySelector('.panel-icon .img').style.backgroundImage = `url('${this.getAttribute('icon-src')}')`;

        let panelIconElem = this.shadow.querySelector('.panel-icon');
        
        panelIconElem.title = this.getAttribute('app-desc');
        panelIconElem.addEventListener('click', () => this.toggleMinimized());
    }

    toggleMinimized()
    {
        dispatchToggleMinimizeWindow(this.getAttribute('app-name'))
    }
}

customElements.define('panel-icon', PanelIcon);

