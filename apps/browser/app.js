const txtUrl = document.querySelector('input#txtUrl');
const btnBack = document.querySelector('button#back');
const btnRefresh = document.querySelector('button#refresh');
const btnForward = document.querySelector('button#forward');

const iframe = document.querySelector('iframe');

// iframe.addEventListener('load', () =>
// {
//     console.log(iframe.contentWindow.document);
//     document.title = 'Browser - ' + iframe.contentWindow.document.title;
// });


btnBack.addEventListener('click', () =>
{
    iframe.contentWindow.history.back();
});

btnRefresh.addEventListener('click', () =>
{
    iframe.contentWindow.location.reload();
});

btnForward.addEventListener('click', () =>
{
    iframe.contentWindow.history.forward();
});

txtUrl.addEventListener('keydown', e =>
{
    if(e.code == 'Enter')
    {
        iframe.src = encodeURI(txtUrl.value);
        // fetch(encodeURI(txtUrl.value), {
        //     mode: 'cors',
        //     headers: {
        //         'Access-Control-Allow-Origin':'*'
        //     }
        // })
        // .then(res => res.text())
        // .then(text =>
        // {
        //     iframe.srcdoc = text;
        // });
    }
});