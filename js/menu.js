function get(item) { return document.getElementById(item); }

function addEventListener(item, event, func) {
    get(item).addEventListener(event, func, false);
}

export { get, addEventListener }