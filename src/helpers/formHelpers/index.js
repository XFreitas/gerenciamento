const formHidden = (name, value = null) => `<input type="hidden" name="${name}" value="${value ?? ''}">`;

module.exports = {
    formDropDown: (name, options, selected = null, extra) => `<select name="${name}" ${extra}>\n` +
        `${options.map((element) => `<option value="${element.value}" ${(element.value == selected) ? 'selected' : ''}>${element.text}</option>`).join('')}\n` +
        `</select>`,

    formInput: (name, value = null, extra) => `<input type="text" name="${name}" value="${value ?? ''}" ${extra} autocomplete="off">`,

    formTextarea: (name, value = null, rows = 3, extra) => `<textarea name="${name}" rows="${rows}" ${extra}>${value ?? ''}</textarea>`,

    formHidden,

    formOpen: (action, method = 'post', hidden = {}, extra) => `<form action="${action}" method="${method}" ${extra}>` +
        `${typeof hidden == 'object' && hidden != null ? Object.keys(hidden).map((key) => formHidden(key, hidden[key])).join('') : ''}`,

    formClose: () => `</form>`,
}

