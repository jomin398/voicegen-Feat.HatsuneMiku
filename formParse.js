export function formParse(form) {
    const opt = {};
    const filter = arr => arr.filter(e => {
        if (e == " ") return;
        return e;
    }).map(e => e.replace('\n', '').trim()).filter(e => e).map(e => e.replace('\n', '').trim());
    for (const [index, elm] of form.querySelectorAll('input,input[type=file],select,textarea').entries()) {

        switch (elm.type) {
            case 'file':
                // let checkNotZeros = Array.from(elm.files).every(e => e.size > 0);
                // if (!checkNotZeros) throw new ReferenceError('Cannot uploaded Folder.')
                opt.data = elm.files;
                break;
            case 'checkbox':
                opt[elm.name] = elm.checked;
                break;
            case 'select-one':
                opt[elm.name] = [
                    elm.options[elm.selectedIndex].value,
                    elm.options[elm.selectedIndex].text
                ];
                break;
            case 'textarea':
                opt[elm.name] = filter(elm.value.split(','))
                break;
            case 'number':
            case 'password':
            case 'color':
            case 'text':
                opt[elm.name] = elm.value ?? elm.placeholder ?? null;
                break;
            case 'radio':
                if (elm.checked) opt[elm.name] = elm.id;
                break;
            default:
                console.log(elm.tagName)
                break;
        }
    }
    return opt;
}