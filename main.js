import Application from './components/Application.js';
import ContextMenu from './components/ContextMenu.js';
import DesktopIcon from './components/DesktopIcon.js';
import StartMenuItem from './components/StartMenuItem.js'


const btnStartMenu = document.getElementById('btnStartMenu');
const btnShutdown = document.getElementById('btnShutdown');
const btnRestart = document.getElementById('btnRestart');
const menuElem = document.querySelector('.menu');
const desktop = document.querySelector('.desktop');
const windowOverlay = document.querySelector('.window-overlay');
const panelApps = document.querySelector('.panel .panel-apps');

const btnClock = document.querySelector('.panel .panel-right #clock');
setInterval(() =>
{
    btnClock.innerText = (new Date()).toLocaleTimeString();
    btnClock.title = (new Date()).toLocaleDateString();
}, 500);

/**
 * @type {Set<Application>}
 */
const applications = new Set();
let focusedWindow = 0;
let currentBgUrl = '';

if(localStorage.getItem('desktop-bg'))
{
    desktop.style.backgroundImage = `url('${localStorage.getItem('desktop-bg')}')`;
}

function openContextMenu(x, y)
{
    const contextMenu = new ContextMenu(
    [
        {
            label: 'Set Desktop Background',
            action()
            {
                const fileInput = document.createElement('input');
                fileInput.type = 'file';
                fileInput.accept = 'image/*';
                fileInput.style.display = 'none';

                document.body.appendChild(fileInput);

                fileInput.click();
                fileInput.addEventListener('input', () =>
                {
                    const image = fileInput.files[0];
                    const reader = new FileReader();
                    
                    reader.readAsDataURL(image);
                    
                    reader.addEventListener('load', () =>
                    {
                        desktop.style.backgroundImage = `url('${reader.result}')`;
                        localStorage.setItem('desktop-bg', reader.result);
                    });
                });
                fileInput.remove();

            }
        },
        {
            label: 'Set Random Background',
            action: setRandomBg
        },
        {
            label: 'Refresh',
            action: createDesktopIcons
        }
    ], { x, y });

    document.querySelector('context-menu')?.remove?.();
    document.body.appendChild(contextMenu);
}

desktop.addEventListener('contextmenu', e =>
{
    e.preventDefault();
    openContextMenu(e.clientX, e.clientY);
});

btnStartMenu.addEventListener('click', () =>
{
    if(!menuElem.classList.contains('show'))
    {
        menuElem.classList.add('show');
        menuElem.focus();
        document.addEventListener('click', e =>
        {
            if(e.target == menuElem || e.target == btnStartMenu) return;
            
            if(menuElem.classList.contains('show'))
            {
                menuElem.classList.remove('show');
            }
        });
    }
    else
    {
        menuElem.classList.remove('show');
    }
});

btnRestart.addEventListener('click', () => location.reload());
btnShutdown.addEventListener('click', () => window.close());

let consoleApp = new Application('Console', 'A basic console that logs', './apps/console/icon.svg', './apps/console/');
applications.add(consoleApp);

applications.add(new Application('Notepad', 'A basic notepad', './apps/notepad/icon.svg', './apps/notepad'));
applications.add(new Application('Browser', 'A basic web browser', './apps/browser/icon.svg', './apps/browser'));
applications.add(new Application('Paint', 'A basic painting app', './apps/paint/icon.ico', './apps/paint'));
applications.add(new Application('Debug', 'Debug app', './apps/debug/icon.svg', './apps/debug'));

applications.add(new Application('MightyCoderX', 'My website', 'https://old.mightycoderx.dev/favicon.svg', 'https://old.mightycoderx.dev'));
applications.add(new Application('MightyOS', 'this', 'https://mightycoderx.github.io/favicon.ico', './'));
// applications.add(new Application('LAN-Chat', 'My LAN Chat', 'https://mcx-lan-chat.herokuapp.com/img/icon.svg', 'https://mcx-lan-chat.herokuapp.com'));
applications.add(new Application('MusicMaker', 'Play Music and record it!', 'https://mightycoderx.github.io/MusicMaker/icon.svg', 'https://mightycoderx.github.io/MusicMaker/'));

document.addEventListener('openwindow', e =>
{
    applications.forEach(app =>
    {
        if(app.name == e.detail.appName && !app.window)
        {   
            app.createWindow(panelApps, windowOverlay);
        }
    });   
});

document.addEventListener('windowshallfocus', e =>
{
    [...applications].filter(app => app.window).map(app => app.window).forEach(w =>
    {
        w.unfocus();
    });
});

document.addEventListener('toggleminimize', e =>
{
    applications.forEach(app =>
    {
        if(app.name == e.detail.appName)
        {
            app.window.minimize();
            return;
        }
    });
});


function createDesktopIcons()
{
    desktop.innerHTML = '';
    for(let app of applications)
    {
        //TODO use the constructor of DesktopIcon instead
        let desktopIcon = new DesktopIcon();
        desktopIcon.setAttribute('icon-src', app.iconSrc);
        desktopIcon.setAttribute('label', app.name);
        desktopIcon.setAttribute('app-name', app.name);
        desktopIcon.setAttribute('title', app.desc);
        desktop.appendChild(desktopIcon);
    }
}

function createStartMenuItems()
{
    const startMenuAppList = menuElem.querySelector('.app-list');
    for(let app of applications)
    {
        let startMenuItem = new StartMenuItem();
        startMenuItem.setAttribute('app-name', app.name);
        startMenuItem.setAttribute('icon-src', app.iconSrc);
        startMenuAppList.appendChild(startMenuItem);
    }
}

createDesktopIcons();
createStartMenuItems();

if(!localStorage.getItem('desktop-bg')) setRandomBg();
async function setRandomBg()
{
    const { width, height } = screen;
    const trueWidth = width*devicePixelRatio;
    const trueHeight = height*devicePixelRatio;

    const res = await fetch(`https://source.unsplash.com/random/${trueWidth}x${trueHeight}?nature`);

    desktop.style.backgroundImage = `url(${res.url})`;

    currentBgUrl = res.url;
    
    //TODO make saving desktop bg optional
    try
    {
        localStorage.setItem('desktop-bg', res.url);
    }
    catch(err)
    {
        if(err.name === 'QuotaExceededError')
        {
            console.warn('Couldn\'t save desktop background, the url is too big for localStorage (How?)');
            return;
        }

        console.dir(err);
    }
}