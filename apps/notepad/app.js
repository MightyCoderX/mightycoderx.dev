const txtEditor = document.getElementById('txtEditor');
const btnSave = document.getElementById('btnSave');

txtEditor.focus();
window.addEventListener('focus', () => txtEditor.focus());

if(localStorage.getItem('notepad'))
{
    txtEditor.value = localStorage.getItem('notepad');
}

window.addEventListener('keydown', e =>
{
    console.log(e.key, e.code);
    if(e.key === 's' && e.ctrlKey)
    {
        e.preventDefault();
        save();
    }

    if(e.key === 'Tab' && !e.shiftKey)
    {
        e.preventDefault();
        let start = txtEditor.selectionStart;
        let end = txtEditor.selectionEnd;

        txtEditor.value = txtEditor.value.substring(0, start) + '\t' + txtEditor.value.substring(end);

        txtEditor.selectionStart = txtEditor.selectionEnd = start + 1;
    }
});

btnSave.addEventListener('click', save);

function save()
{
    localStorage.setItem('notepad', txtEditor.value);
}