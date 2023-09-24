const routes = {
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
    },

    '/404':
    {
        title: 'Not Found'
    }
};

if(!location.hash.startsWith('#/'))
{
    navigate('/');
}

const path = () => location.hash.replace('#', '');
const currentRoute = () => routes[path()] ?? routes['/404'];

async function preloadPages()
{
    for(const [route, page] of Object.entries(routes))
    {
        page.content = await (await fetch(`/pages/${page?.filename ?? route + '.html'}`)).text();
    }

    console.log('pages loaded', routes);
}


window.addEventListener('DOMContentLoaded', async () =>
{
    await preloadPages();
    
    window.addEventListener('popstate', () =>
    {
        if(!location.hash.startsWith('#/'))
        {
            navigate('/');
        }

        loadPage();
    });
    
    const btnToggleMenu = document.getElementById('btnToggleMenu');
    const menuNav = document.getElementById('menuNav');

    btnToggleMenu.addEventListener('click', () => menuNav.classList.toggle('shown')); 

    const navLinks = document.querySelectorAll('a[data-route-link]');

    navLinks.forEach(navLink => navLink.addEventListener('click', e =>
    {
        e.preventDefault();

        navigate(navLink.getAttribute('href'));
    }));
    
    navigate(path());
});

async function navigate(path)
{
    history.pushState({}, '', `/#${path}`);

    document.title = currentRoute()?.title;

    const navLinks = document.querySelectorAll('nav a[data-route-link]');
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
    const route = currentRoute();

    const filePath = route.filename ? `/pages/${route.filename}` : `/pages${path()}.html`;

    main.innerHTML = route.content ?? await (await fetch(filePath)).text();
}