import PanelIcon from './PanelIcon.js';
import DraggableWindow from './DraggableWindow.js';

export default class Application
{
    constructor(name, desc, iconSrc, url)
    {
        this.name = name;
        this.desc = desc;
        this.iconSrc = iconSrc;
        this.url = url;
    }

    createWindow(panelApps, windowOverlay)
    {
        this.panelIcon = new PanelIcon();
        this.panelIcon.setAttribute('icon-src', this.iconSrc);
        this.panelIcon.setAttribute('app-name', this.name);
        this.panelIcon.setAttribute('app-desc', this.desc);
        panelApps.appendChild(this.panelIcon);

        this.window = new DraggableWindow();
        this.window.setAttribute('window-title', this.name);
        this.window.setAttribute('content-url', this.url);
        const iconRect = this.panelIcon.getBoundingClientRect();
        this.window.setAttribute('minimize-origin', `${iconRect.x + iconRect.width/2} ${iconRect.y + iconRect.height/2}`);

        windowOverlay.appendChild(this.window);
        
        this.window.addEventListener('close', () =>
        {
            this.panelIcon.remove();
            this.panelIcon = null;
            this.window = null;
            delete this;
        });
    }
}