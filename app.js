const routes = {
    '/':
    {
        title: 'Home',
        filename: 'home.html'
    },

    '/skills':
    {
        title: 'Skills',
        jsModule: true
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

const path = () => location.hash.replace('#', '');
const currentRoute = () => routes[path()] ?? routes['/404'];

if(!location.hash.startsWith('#/'))
{
    navigate('/');
}

async function preloadPages()
{
    const parser = new DOMParser();
    for(const [route, page] of Object.entries(routes))
    {
        page.content = parser.parseFromString(await (await fetch(`/pages/${page?.filename ?? route + '.html'}`)).text(), 'text/html');
    }

    // console.log('pages loaded', routes);
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

    main.innerHTML = route.content.innerHTML ?? await (await fetch(filePath)).text();

    if(route.jsModule)
    {
        const module = await import(`/assets/js${route.filename ? '/' + route.filename.replace('.html', '') : path()}.js`);

        module?.init?.(route.content);
    }
  
}