const pages = {
    '/':
    {
        title: 'Home',
        filename: 'home.html'
    },

    '/skills':
    {
        title: 'Skills'
    },

    '/projects':
    {
        title: 'Projects'
    },

    '/contacts':
    {
        title: 'Contacts'
    }
};

const path = () => location.hash.replace('#', '');


window.addEventListener('loadstart', async () =>
{
    for(const [route, page] of Object.entries(pages))
    {
        page.content = await (await fetch(`/pages/${page?.filename ?? route + '.html'}`)).text();
    }
});

window.addEventListener('DOMContentLoaded', async () =>
{
    const btnToggleMenu = document.getElementById('btnToggleMenu');
    const menuNav = document.getElementById('menuNav');

    btnToggleMenu.addEventListener('click', () => menuNav.classList.toggle('shown'));

    const navLinks = document.querySelectorAll('a[data-nav-link]');

    navLinks.forEach(navLink => navLink.addEventListener('click', e =>
    {
        e.preventDefault();

        navigate(navLink.getAttribute('href'));
    }));
    
    navigate('/');
});

async function navigate(path)
{
    history.pushState({}, '', `/#${path}`);
    
    const navLinks = document.querySelectorAll('a[data-nav-link]');
    navLinks.forEach(navLink => 
    {   
        if(navLink.getAttribute('href') === path)
        {
            navLink.setAttribute('data-active', '');
        }
        else
        {
            navLink.removeAttribute('data-active');
        }
    });

    loadPage();
}

async function loadPage()
{
    const main = document.querySelector('main');
    const page = pages[path()];

    const filePath = page?.filename ? `/pages/${page.filename}` : `/pages${path()}.html`;

    main.innerHTML = page?.content ?? await (await fetch(filePath)).text();
}