/**
 * @param {HTMLFormElement} form
 * @returns {Object} parsed form data;
 */
export default function parseform(form) {
    const opt = {};
    for (const [index, elm] of form.querySelectorAll('input,input[type=file],select').entries()) {

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
                //console.log(elm.type)
                break;
        }
    }
    return opt;
}