/*!
    * Start Bootstrap - SB Admin v7.0.5 (https://startbootstrap.com/template/sb-admin)
    * Copyright 2013-2022 Start Bootstrap
    * Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-sb-admin/blob/master/LICENSE)
    */
// 
// Scripts
// 

window.addEventListener('DOMContentLoaded', event => {

    // Toggle the side navigation
    const sidebarToggle = document.body.querySelector('#sidebarToggle');
    if (sidebarToggle) {
        // Uncomment Below to persist sidebar toggle between refreshes
        if (localStorage.getItem('sb|sidebar-toggle') === 'true') {
            document.body.classList.toggle('sb-sidenav-toggled');
        }
        sidebarToggle.addEventListener('click', event => {
            event.preventDefault();
            document.body.classList.toggle('sb-sidenav-toggled');
            localStorage.setItem('sb|sidebar-toggle', document.body.classList.contains('sb-sidenav-toggled'));
        });
    }

    const activePage = document.querySelector(`#collapseLayouts > nav > a[href="${location.pathname}"]`);

    activePage.classList
        .add('active');

    document.querySelector('head > title').textContent = activePage.textContent.trim();

    String.prototype.toHtml = function () {
        var parser = new DOMParser();
        var doc = parser.parseFromString(this, 'text/html');
        return doc.body.firstChild;
    }

    Element.prototype.mask = function (mask, options = {}) {
        Inputmask(mask, options).mask(this);
    }

    Element.prototype.serializeObject = function () {
        let form = this;
        if (this.tagName.toLowerCase() !== 'form') {
            form = document.createElement('form');
            form.appendChild(this.cloneNode(true));
        }

        const isUpload = form.getAttribute('enctype') === 'multipart/form-data';

        if (isUpload) {
            return new FormData(form);
        }

        return Array
            .from(new FormData(form), e => {
                return e.map(encodeURIComponent).join('=')
            })
            .join('&');
    }

    Element.prototype.loadModal = function (url = null) {
        class HiddenModal {
            constructor(modalElement) {
                modalElement.innerHTML = '<div class="modal-dialog">' +
                    '  <div class="modal-content">' +
                    '    <div class="modal-header">' +
                    '      <h5 class="modal-title"></h5>' +
                    '    </div>' +
                    '    <div class="modal-body mx-auto">' +
                    '      <div class="spinner-border" role="status"></div>' +
                    '    </div>' +
                    '    <div class="modal-footer"></div>' +
                    '  </div>' +
                    '</div>';
            }
        }

        this.addEventListener('hidden.bs.modal', new HiddenModal(this));

        const myModal = bootstrap.Modal.getOrCreateInstance(this);

        myModal.show();

        if (url) {
            this.dataset.url = url;
        } else {
            new HiddenModal(this);
        }

        axios.get(this.dataset.url).then(html => {
            this.innerHTML = html.data;
            let scripts = this.getElementsByTagName('script');

            let range = document.createRange();
            range.setStart(this, 0);
            let string = '';
            for (let i = 0; i < scripts.length; i++) {
                let s = scripts[i];
                string += s.outerHTML;
            }
            this.appendChild(range.createContextualFragment(string));
        }).catch(error => {
            console.log(error);
            setTimeout(() => myModal.hide(), 1000);
        });
    }

    Element.prototype.alertModal = function (message, httpCode) {
        const modalBody = this.querySelector('.modal-body');

        if (modalBody) {
            if (message) {
                const title = httpCode >= 400 ? 'Erro' : (httpCode >= 300 ? 'Aviso' : 'Sucesso');
                const alertType = httpCode >= 400 ? 'danger' : 'success';
                const alertIcon = httpCode >= 400 ? 'exclamation-triangle' : 'check-circle';

                const dismissClass = httpCode >= 400 ? 'alert-dismissible fade show' : '';
                const buttonDismiss = httpCode >= 400 ? '<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>' : '';

                const alertHtml = `<div class="alert alert-${alertType} ${dismissClass}" role="alert">` +
                    `<h4 class="alert-heading"><i class="fas fa-${alertIcon} fa-fw"></i> ${title}${buttonDismiss}</h4>` +
                    `<p>${message}</p>` +
                    `</div>`;

                const divHeader = document.createElement('div');
                const divFooter = document.createElement('div');

                divHeader.innerHTML = alertHtml;
                divFooter.innerHTML = alertHtml;

                modalBody.insertBefore(divHeader, modalBody.firstChild);
                modalBody.append(divFooter);
            }
            else {
                const alert = modalBody.querySelectorAll('.alert');
                if (alert) {
                    alert.forEach(a => a.remove());
                }
            }
        }
    }

    Element.prototype.submitModal = function (options = {}) {
        if (typeof options.hideModal === 'undefined') {
            options.hideModal = true;
        }

        if (this.tagName.toLowerCase() == 'form') {
            const form = this;

            const url = form.getAttribute("action");

            form.addEventListener('submit', function (event) {
                event.preventDefault();

                console.log('submit');

                form.alertModal();

                const buttonSubmit = form.querySelector(`[type="submit"]`);
                let buttonSubmitHTML = '';
                if (buttonSubmit) {
                    buttonSubmit.disabled = true;

                    buttonSubmitHTML = buttonSubmit.innerHTML;

                    buttonSubmit.innerHTML = '<i class="fas fa-pulse fa-spinner"></i> Salvando...';
                }

                const data = form.serializeObject();
                const method = form.getAttribute("method");

                form.querySelectorAll('*').forEach(element => {
                    element.disabled = true;
                });

                axios({
                    method,
                    url,
                    data,
                })
                    .then(function (response) {
                        form.alertModal('sucesso', response.status);

                        if (response.status === 200) {
                            console.log(response.data);
                            const modalElement = document.getElementById('crud');
                            const crudModal = bootstrap.Modal.getOrCreateInstance(modalElement);

                            if (options.hideModal == true) {
                                setTimeout(() => {
                                    crudModal.hide();
                                }, 1100);
                            }

                            if (Element.hasOwnProperty.call(options, 'success')) {
                                options.success(response.data);
                            }
                        }
                    })
                    .catch(function (error) {
                        if (typeof error.response !== 'undefined') {
                            const response = error.response;
                            form.alertModal(msgByStatus(response), response.status);
                        }
                        else {
                            console.log(error);
                        }
                    })
                    .finally(function () {
                        if (buttonSubmit) {
                            buttonSubmit.disabled = false;
                            buttonSubmit.innerHTML = buttonSubmitHTML;
                        }

                        form.querySelectorAll('*').forEach(element => {
                            element.disabled = false;
                        });
                    });
            });
        }
    }

    Element.prototype.serverProcessing = function (options = {}) {
        const tableElement = this;

        import('/node_modules/@jstable/jstable/dist/jstable.min.js')
            .then(() => {
                const headElement = document.querySelector(`head`),
                    createdLinkElement = document.createElement('link');

                createdLinkElement.rel = 'stylesheet';
                createdLinkElement.href = '/node_modules/@jstable/jstable/dist/jstable.css';

                headElement.appendChild(createdLinkElement);

                let ajaxParams = {};
                if (Object.hasOwnProperty.call(options, 'ajaxParams')) {
                    ajaxParams = options.ajaxParams;
                }

                const jsTableOptions = {
                    perPage: 10,
                    searchable: false,
                    addQueryParams: false,
                    ajaxParams,
                    serverSide: true,
                    labels: {
                        placeholder: "Procure...",
                        perPage: "Exibindo {select} registros por página",
                        noRows: "Nenhum registro encontrado",
                        info: "Exibindo {start} até {end} de {rows} registro(s)",
                        loading: "Processando...",
                        infoFiltered: "Exibindo {start} até {end} de {rows} registro(s) (filtrado de {rowsTotal} registros)"
                    },
                    ...options,
                };

                const table = new JSTable(tableElement, jsTableOptions);

                const divDTSearch = document.createElement('div');
                divDTSearch.className = 'dt-search';

                const colsSearchFunction = e => {
                    e.preventDefault();
                    table.isSearching = false;
                    if (e.keyCode == 13) {
                        tableElement.querySelectorAll(`tfoot tr > *`).forEach((child, index) => {
                            ajaxParams[`columnsSearch${index}`] = "";
                            const input = child.querySelector(`input`);
                            if (input) {
                                if (input.value) {
                                    ajaxParams[`columnsSearch${index}`] = input.value;
                                    table.isSearching = true;
                                }
                            }
                        });

                        if (inputDTSearch.value) {
                            table.search(inputDTSearch.value);
                        } else {
                            table.searchQuery = "";
                            table.update();
                        }
                    }
                };

                const inputDTSearch = document.createElement('input');
                inputDTSearch.className = 'dt-input';
                inputDTSearch.placeholder = 'Procure...';
                inputDTSearch.type = 'text';
                inputDTSearch.onkeyup = colsSearchFunction;

                divDTSearch.appendChild(inputDTSearch);
                tableElement
                    .closest('.dt-wrapper')
                    .querySelector('.dt-top')
                    .appendChild(divDTSearch);

                tableElement.querySelectorAll('tfoot tr > *').forEach((element, i) => {
                    if (element.tagName == 'TH') {
                        const index = i + 1;
                        const placeholder = tableElement.querySelector(`thead tr > *:nth-child(${index})`).textContent;
                        const input = document.createElement('input');
                        input.className = 'dt-input';
                        input.placeholder = placeholder;
                        input.type = 'text';
                        input.onkeyup = colsSearchFunction;
                        input.style = 'width: 100%';
                        element.appendChild(input);
                    }
                });

                tableElement.JSTable = table;

                table.on('update', () => tableElement.dispatchEvent(new Event('render')));
            });
    }

    Element.prototype.axiosAutoComplete = function (url, options = {}) {
        const inp = this;
        inp.parentNode.classList.add('autocomplete');

        if (typeof options.minChars === 'undefined') {
            options.minChars = 1;
        }

        /*the autocomplete function takes two arguments,
        the text field element and an array of possible autocompleted values:*/
        var currentFocus, timeout;
        /*execute a function when someone writes in the text field:*/
        inp.addEventListener("input", function (e) {
            const self = this;
            var a, b, i, val = self.value
            /*close any already open lists of autocompleted values*/
            closeAllLists();
            if (val.length >= options.minChars) {
                clearTimeout(timeout);
                timeout = setTimeout(function () {
                    if (val) {
                        axios.get(url, { params: { keyword: val } })
                            .then(response => {
                                const arr = response.data;
                                /*close any already open lists of autocompleted values*/
                                closeAllLists();
                                if (!val) { return false; }
                                currentFocus = -1;
                                /*create a DIV element that will contain the items (values):*/
                                a = document.createElement("DIV");
                                a.setAttribute("id", self.id + "autocomplete-list");
                                a.setAttribute("class", "autocomplete-items");
                                /*append the DIV element as a child of the autocomplete container:*/
                                self.parentNode.appendChild(a);
                                /*for each item in the array...*/
                                if (typeof options.onOpen === 'function' && arr.length > 0) {
                                    options.onOpen();
                                }
                                arr.forEach(function (item) {
                                    /*check if the item starts with the same letters as the text field value:*/
                                    if (item.value.substr(0, val.length).toUpperCase() == val.toUpperCase()) {
                                        /*create a DIV element for each matching element:*/
                                        b = document.createElement("DIV");
                                        /*make the matching letters bold:*/
                                        b.innerHTML = "<strong>" + item.value.substr(0, val.length) + "</strong>";
                                        b.innerHTML += item.value.substr(val.length);
                                        /*insert a input field that will hold the current array item's value:*/
                                        b.innerHTML += "<input type='hidden' value='" + item.value + "'>";
                                        /*execute a function when someone clicks on the item value (DIV element):*/
                                        b.addEventListener("click", function (e) {
                                            /*insert the value for the autocomplete text field:*/
                                            inp.value = this.getElementsByTagName("input")[0].value;
                                            if (typeof options.onSelect === 'function') {
                                                options.onSelect(item);
                                            }
                                            /*close the list of autocompleted values,
                                            (or any other open lists of autocompleted values:*/
                                            closeAllLists();
                                        });
                                        a.appendChild(b);
                                    }
                                });
                            })
                            .catch(error => {
                                closeAllLists();
                                console.log(error);
                            });
                    }
                }, 500);
            }
        });
        /*execute a function presses a key on the keyboard:*/
        inp.addEventListener("keydown", function (e) {
            var x = document.getElementById(this.id + "autocomplete-list");
            if (x) x = x.getElementsByTagName("div");
            if (e.keyCode == 40) {
                /*If the arrow DOWN key is pressed,
                increase the currentFocus variable:*/
                currentFocus++;
                /*and and make the current item more visible:*/
                addActive(x);
            } else if (e.keyCode == 38) { //up
                /*If the arrow UP key is pressed,
                decrease the currentFocus variable:*/
                currentFocus--;
                /*and and make the current item more visible:*/
                addActive(x);
            } else if (e.keyCode == 13) {
                /*If the ENTER key is pressed, prevent the form from being submitted,*/
                e.preventDefault();
                if (currentFocus > -1) {
                    /*and simulate a click on the "active" item:*/
                    if (x) x[currentFocus].click();
                }
            }
        });
        function addActive(x) {
            /*a function to classify an item as "active":*/
            if (!x) return false;
            /*start by removing the "active" class on all items:*/
            removeActive(x);
            if (currentFocus >= x.length) currentFocus = 0;
            if (currentFocus < 0) currentFocus = (x.length - 1);
            /*add class "autocomplete-active":*/
            x[currentFocus].classList.add("autocomplete-active");
        }
        function removeActive(x) {
            /*a function to remove the "active" class from all autocomplete items:*/
            for (var i = 0; i < x.length; i++) {
                x[i].classList.remove("autocomplete-active");
            }
        }
        function closeAllLists(elmnt) {
            /*close all autocomplete lists in the document,
            except the one passed as an argument:*/
            var x = document.getElementsByClassName("autocomplete-items");
            for (var i = 0; i < x.length; i++) {
                if (elmnt != x[i] && elmnt != inp) {
                    x[i].parentNode.removeChild(x[i]);
                }
            }
        }
        /*execute a function when someone clicks in the document:*/
        document.addEventListener("click", function (e) {
            closeAllLists(e.target);
        });
    }
});

const msgByStatus = response => {
    switch (response.status) {
        case 422:
            const message = '<p>' + response.data.errors.map(e => e.msg).join('</p><p>') + '</p>';
            return message;
        case 401:
            return 'Você não tem permissão para executar esta ação.';
        case 404:
            return 'Recurso não encontrado.';
        case 500:
            return 'Erro interno do servidor.';
        default:
            return 'Erro desconhecido.';
    }
};

const deleteById = async (url, data, callbackSuccess) => {
    try {
        const value = await swal({
            title: 'Você tem certeza?',
            text: 'Você não poderá reverter esta ação.',
            icon: 'warning',
            buttons: {
                cancel: {
                    text: "Cancelar",
                    value: null,
                    visible: true,
                    className: "",
                    closeModal: true,
                },
                confirm: {
                    text: "OK",
                    value: true,
                    visible: true,
                    className: "",
                    closeModal: true
                }
            },
            dangerMode: true,
        });
        if (value) {
            swal({
                icon: '/assets/img/loading.gif',
                buttons: false,
                closeOnClickOutside: false,
                closeOnEsc: false
            });
            const method = 'DELETE';
            const response = await axios({
                method,
                url,
                data
            });
            if (response.status === 200) {
                await swal({
                    title: 'Sucesso',
                    text: 'Registro excluído com sucesso.',
                    icon: 'success',
                    buttons: false,
                    timer: 1200,
                    closeOnClickOutside: false,
                    closeOnEsc: false
                });
                if (typeof callbackSuccess === 'function') {
                    callbackSuccess();
                }
            }
        }
    } catch (error) {
        console.log(error);
        await swal({
            title: 'Erro',
            text: `Erro ao deletar registro.`,
            content: {
                element: 'div',
                attributes: {
                    innerHTML: msgByStatus(error.response)
                }
            },
            icon: 'error'
        });
        deleteById(url, data);
    }
}

const nArredonda = (numero, casasDecimais, formatar) => {
    if (typeof numero === 'undefined') {
        return 0;
    }

    if (typeof casasDecimais === 'undefined') {
        casasDecimais = 2;
    }

    if (typeof formatar === 'undefined') {
        formatar = false;
    }

    let aux = removeVirgulaPonto(numero.toString());

    let x = aux.split('.');

    let decimais = '';

    if (x[1]) {
        decimais = x[1].substring(0, casasDecimais);
    }

    decimais = (decimais + '0'.repeat(casasDecimais)).substring(0, casasDecimais);

    let n = x[0];

    if (formatar) {
        let negativo = n < 0;

        if (negativo) {
            n = n.substring(1);
        }

        let i = n.length;
        let newN = '';
        let j = 0;
        while (i--) {
            j++;
            newN = n[i] + newN;

            if (j == 3 && i > 0) {
                newN = '.' + newN;
                j = 0;
            }
        }

        if (negativo) {
            newN = '-' + newN;
        }

        return newN + ',' + decimais;
    }

    return parseFloat(n + '.' + decimais);
};

const removeVirgulaPonto = (valor) => {
    if (typeof valor === 'undefined') {
        return '';
    }

    // 0 000,00 => 0000.00
    valor = valor.replace(/\s/g, '');

    // 0.000.000,00 => 0000000.00
    if ((valor.indexOf(',') > -1) && (valor.indexOf('.') > -1)) {
        valor = valor.replace(/\./g, '');
        valor = valor.replace(/,/g, '.');
    }

    // 0,00 => 0.00
    if (valor.indexOf(',') > -1) {
        valor = valor.replace(/,/g, '.');
    }

    return valor;
}