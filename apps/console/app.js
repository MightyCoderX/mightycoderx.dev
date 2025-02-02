window.divOut = document.querySelector('div.out');
const jsInput = document.getElementById('jsInput');

let consoleHistory = [];
let currentIndex = 0;
let index = 0;

window.addEventListener('click', () => jsInput.focus());

jsInput.focus();
window.addEventListener('focus', () => jsInput.focus());

new MutationObserver(mutations =>
{
    mutations.forEach(mutation =>
    {
        if(mutation.type == 'childList')
        {
            document.scrollingElement.scrollTo(0, document.scrollingElement.scrollHeight+100);
        }
    });
}).observe(divOut,
{
    childList: true
});

jsInput.addEventListener('keydown', e =>
{
    if(e.key == 'Enter')
    {
        if(!jsInput.value.trim()) return;

        printInput(jsInput.value);
        
        let result = undefined;

        try
        {
            result = eval("(" + jsInput.value + ")");
            printOutput('info', `<span data-return-value><span data-return-value-prefix>&lt;&middot;</span>${parseArgs(result)}</span>`, window);
        }
        catch(err)
        {
            error(err.stack);
        }
        
        consoleHistory.push(jsInput.value);
        index++;
        currentIndex = index;

        jsInput.value = '';
    }

    if(e.key == 'ArrowUp')
    {
        if(index <= 0) return;
        index--;
        jsInput.value = consoleHistory[index];
    }
    else if(e.key == 'ArrowDown')
    {
        if(index >= consoleHistory.length-1) return;
        index++;
        jsInput.value = consoleHistory[index];
    } 
    // oldConsole.log(index);
});

jsInput.addEventListener('input', e =>
{
    e.preventDefault();
    if(!jsInput.value.trim())
    {
        index = currentIndex;
    }
});




