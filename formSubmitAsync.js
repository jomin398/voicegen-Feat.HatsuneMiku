export function formSubmitAsync() {
    const p = new Promise((resolve) => {
        const f = document.querySelector('form');
        window._FormAct = () => {
            f.removeAttribute('action');
            delete window._FormAct;
            //document.remove();
            resolve(f);
        };
        //f.action = './oru.html';
        f.action = 'javascript:_FormAct()';
    });
    return p;
}
