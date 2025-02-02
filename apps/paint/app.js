let down = false;
let tools = 
{
    pen: 'pen',
    eraser: 'eraser',
    circle: 'circle'
};
let tool = tools.pen;
let color = getComputedStyle(document.body).color;

const toolbar = document.querySelector('div.toolbar');
const canvas = document.createElement('canvas');
const btnClear = document.getElementById('btnClear');
const sldSize = document.getElementById('sldSize');
const nmbSize = document.getElementById('nmbSize');
const btnPen = document.getElementById('btnPen');
const btnEraser = document.getElementById('btnEraser');
const btnCircle = document.getElementById('btnCircle');
const colorPicker = document.getElementById('colorPicker');
const btnDownload = document.getElementById('btnDownload');
const btnColors = Array.from(document.querySelectorAll('.btn-color'));

canvas.id = 'canvas';
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
document.body.prepend(canvas);

btnDownload.addEventListener('click', e =>
{
    //TODO: Fix download button
    const aElem = document.createElement('a');
    aElem.href = canvas.toDataURL();
    aElem.download = 'image.jpg';
    document.body.appendChild(aElem);
    aElem.click();
    aElem.remove();
});

let ctx = canvas.getContext('2d');
clearCanvas();
ctx.strokeStyle = getComputedStyle(document.body).color;

let size = sldSize.value;

let posX, posY;

// resizeCanvas();
// new ResizeObserver(resizeCanvas).observe(canvas);

// function resizeCanvas()
// {
//     // let newCanvas = document.createElement('canvas');
//     // newCanvas.id = 'canvas';
//     // newCanvas.width = getComputedStyle(canvas).width.replace('px', '');
//     // newCanvas.height = getComputedStyle(canvas).height.replace('px', '');
//     // canvas.remove();
//     // document.body.prepend(newCanvas);
//     // canvas = newCanvas;

//     canvas.width = getComputedStyle(canvas).width.replace('px', '');
//     canvas.height = getComputedStyle(canvas).height.replace('px', '');
// }

canvas.addEventListener('mousemove', draw);
canvas.addEventListener('touchmove', draw);

canvas.addEventListener('mousedown', mouseDown);
canvas.addEventListener('touchstart', mouseDown)

window.addEventListener('mouseup', mouseUp);
canvas.addEventListener('mouseleave', mouseUp);
window.addEventListener('touchcancel', mouseUp);
canvas.addEventListener('touchend', mouseUp);

function mouseDown(e)
{
    if(e.button != 0) return;
    toolbar.classList.add('hidden');
    down = true;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = size;

    if(tool == tools.circle)
    {
        drawCircle(posX, posY, size, color);
    }
    else
    {
        ctx.beginPath();
        ctx.moveTo(posX, posY);
        ctx.lineTo(posX, posY);
        ctx.stroke();
    }
}

function mouseUp()
{
    down = false;
    toolbar.classList.remove('hidden');
}

btnColors.forEach(btn =>
{
    btn.style.backgroundColor = btn.dataset.color;
    btn.addEventListener('click', e =>
    {
        color = ctx.strokeStyle = btn.dataset.color;
    });
});
colorPicker.addEventListener('change', e =>
{
    color = ctx.strokeStyle = e.target.value;
});

btnClear.addEventListener('click', clearCanvas);

sldSize.addEventListener('input', () =>
{
    size = sldSize.value;
    nmbSize.value = size;
});

nmbSize.addEventListener('change', () =>
{
    sldSize.value = nmbSize.value;
    size = nmbSize.value;
});

btnPen.addEventListener('click', () =>
{
    tool = tools.pen;
});
btnEraser.addEventListener('click', () =>
{
    tool = tools.eraser;
});
btnCircle.addEventListener('click', () =>
{
    tool = tools.circle;
});

document.addEventListener('keydown', e =>
{
    if(e.ctrlKey)
    { 
        if(e.key == 'x')
        {
            clearCanvas();
        }
    }   
});

function clearCanvas()
{
    ctx.fillStyle = getComputedStyle(canvas).backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = color;
}

function draw(e)
{
    ctx.lineCap = 'round';
    ctx.lineWidth = size;

    posX = e.pageX - canvas.offsetLeft;
    posY = e.pageY - canvas.offsetTop;
    
    if(down)
    {
        if(tool == tools.pen)
        {
            ctx.lineTo(posX, posY);
            ctx.stroke();
            //context.closePath();
        }
        else if(tool == tools.eraser)
        {
            let strokeStyle = ctx.strokeStyle;
            ctx.strokeStyle = getComputedStyle(canvas).backgroundColor;
            ctx.lineTo(posX, posY);
            ctx.stroke();
            ctx.strokeStyle = strokeStyle;
        }
    }
}

function drawCircle(x, y, radius, color)
{
    ctx.beginPath();
    ctx.arc(x, y, radius/2, 0, 2 * Math.PI);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.stroke();
}

