function addEventListener(event, func) {
    // KEYBOARD INPUT
    // https://developer.mozilla.org/en-US/docs/Web/API/Document/keydown_event
    // https://subscription.packtpub.com/book/web-development/9781783981182/1/ch01lvl1sec22/adding-keyboard-controls
    document.addEventListener(event, func);
}

export { addEventListener }