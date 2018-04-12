
function addNode(parent, x, y, w, h, isCenter = false) {
    const node = document.createElement('div');
    node.style.backgroundColor = 'rgba(0,50,255,0.9)'
    node.style.position = 'absolute';
    node.style.width = `${w}px`;
    node.style.height = `${h}px`;

    const top = isCenter ? Math.floor(y - (h * 0.5)) : y;
    const left = isCenter ? Math.floor(x - (w * 0.5)) : x;

    node.style.top = `${top}px`;
    node.style.left = `${left}px`;
    parent.appendChild(node);
}

function removeChildren(node) {
    while (node.firstChild) {
        node.removeChild(node.firstChild);
    }
}

const coords = [];
const width = 50;
const height = 70;
const dist = Math.min(width, height);

// init
const map = document.createElement('div');
map.style.backgroundColor = 'rgba(255,255,255,0.5)'
map.style.position = 'absolute';
map.style.zIndex = 999999;
map.style.width = `${width}px`;
map.style.height = `${height}px`;
document.body.appendChild(map);


// reset

function draw(coords) {

    removeChildren(map);

    coords.forEach(point => {
        const x = point.x * dist / 100;
        const y = point.y * dist / 100;
        addNode(map, x, y, dist / 10, dist / 10);
    });
}

draw([
    {x:0, y:0},
    {x:10, y:0},
    {x:20, y:0},
    {x:70, y:0},
    {x:80, y:0},
    {x:90, y:0},
    {x:0, y:10},
    {x:10, y:10},
    {x:20, y:10},
    {x:70, y:10},
    {x:80, y:10},
    {x:90, y:10},
    {x:0, y:20},
    {x:10, y:20},
    {x:20, y:20},
    {x:70, y:20},
    {x:80, y:20},
    {x:90, y:20},
    {x:0, y:30},
    {x:10, y:30},
    {x:20, y:30},
    {x:30, y:30},
    {x:60, y:30},
    {x:70, y:30},
    {x:80, y:30},
    {x:90, y:30},
    {x:0, y:60},
    {x:10, y:60},
    {x:20, y:60},
    {x:70, y:60},
    {x:80, y:60},
    {x:90, y:60},
    {x:0, y:70},
    {x:10, y:70},
    {x:20, y:70},
    {x:70, y:70},
    {x:80, y:70},
    {x:90, y:70},
    {x:0, y:80},
    {x:10, y:80},
    {x:20, y:80},
    {x:70, y:80},
    {x:80, y:80},
    {x:90, y:80},
    {x:0, y:90},
    {x:10, y:90},
    {x:20, y:90},
    {x:70, y:90},
    {x:80, y:90},
    {x:90, y:90},
    {x:0, y:100},
    {x:10, y:100},
    {x:20, y:100},
    {x:70, y:100},
    {x:80, y:100},
    {x:90, y:100},
    {x:0, y:110},
    {x:10, y:110},
    {x:80, y:110},
    {x:90, y:110},
    {x:0, y:120},
    {x:40, y:120},
    {x:50, y:120},
    {x:90, y:120},
    {x:30, y:130},
    {x:40, y:130},
    {x:50, y:130},
    {x:60, y:130},
    {x:0, y:140},
    {x:40, y:140},
    {x:50, y:140},
    {x:90, y:140},
    {x:0, y:150},
    {x:10, y:150},
    {x:80, y:150},
    {x:90, y:150},
]);