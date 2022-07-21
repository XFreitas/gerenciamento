let ejs = require('ejs');

module.exports = {
    formDropDown: (name, options, selected = null, extra) => ejs.render(`<select name="${name}" ${extra}>\n` +
        `${options.map((element) => `<option value="${element.value}" ${(element.value == selected) ? 'selected' : ''}>${element.text}</option>`).join('')}\n` +
        `</select>`),
}

