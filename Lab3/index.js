window.elements = ['main', 'typing-test', 'result'];

const load = async (id) => {
    let element = document.getElementById(id);
    console.log(`${id} is active`);
    let response = await fetch(`./${id}.html`);
    element.innerHTML = await response.text();
    element.classList.add('active');
};

const unload = (id) => {
    let element = document.getElementById(id);
    element.classList.remove('active');
    element.innerHTML = '';
};

const observer = new MutationObserver(() => {
    elements.forEach((id) => {
        let element = document.getElementById(id);
        if (!element.classList.contains('active') && element.innerHTML) {
            unload(id);
        } else if (element.classList.contains('active') && !element.innerHTML) {
            load(id);
        }
    });
});

elements.forEach((id) => observer.observe(document.getElementById(id), { childList: true, subtree: true }));

console.log('hello from index.js');

export { load, unload };

// Console Debugging

window.loadElement = async (id) => {
    await load(id);
};
window.unloadElement = async (id) => {
    await unload(id);
};

