import ContactCard from '/components/ContactCard.js';

const contacts = [
    {
        name: 'GitHub',
        description: 'Check out my repos!',
        link: {
            url: 'https://github.com/MightyCoderX',
            text: 'Follow'
        } 
    },
    {
        name: 'Discord',
        description: '<b>@mightycoderx</b>',
        link: {
            url: 'https://discord.com',
            text: 'Chat'
        }
    }
];

/**
 * @param {Document} content
 */
export function init(content)
{   
    /**@type {HTMLDivElement} */
    const divContacts = document.querySelector('.contacts-grid');

    contacts.forEach(contact =>
    {
        divContacts.append(new ContactCard(contact));
    });
}
