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

    Element.prototype.mask = function (mask, options = {}) {
        Inputmask(mask, options).mask(this);
    }

    Element.prototype.serializeObject = function () {
        if (this.tagName.toLowerCase() == 'form') {
            const children = this.querySelectorAll('[name]:not(:disabled)');

            const isUpload = this.getAttribute('enctype') === 'multipart/form-data';

            if (isUpload) {
                return new FormData(this);
            }

            const formData = {};

            children.forEach(child => {
                if (child.type == 'checkbox') {
                    if (child.checked) {
                        formData[child.name] = child.value;
                    }
                }
                else if (child.type == 'radio') {
                    if (child.checked) {
                        formData[child.name] = child.value;
                    }
                } else if (child.value != '') {
                    formData[child.name] = child.value;
                }
            });

            return formData;
        }

        return null;
    }

    String.prototype.toHtml = function () {
        var parser = new DOMParser();
        var doc = parser.parseFromString(this, 'text/html');
        return doc.body.firstChild;
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
                buttonSubmit.disabled = true;

                const buttonSubmitHTML = buttonSubmit.innerHTML;

                buttonSubmit.innerHTML = '<i class="fas fa-pulse fa-spinner"></i> Salvando...';

                const data = form.serializeObject();
                const method = form.getAttribute("method");

                form.querySelectorAll('[name]').forEach(input => {
                    input.disabled = true;
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

                            if (Element.hasOwnProperty.call(options, 'success')) {
                                options.success(response.data);
                            }
                            if (options.hideModal == true) {
                                setTimeout(() => {
                                    crudModal.hide();
                                }, 1100);
                            }
                        }
                    })
                    .catch(function (error) {
                        const response = error.response;
                        form.alertModal(msgByStatus(response), response.status);
                    })
                    .finally(function () {
                        buttonSubmit.disabled = false;
                        buttonSubmit.innerHTML = buttonSubmitHTML;

                        form.querySelectorAll('[name]').forEach(input => {
                            input.disabled = false;
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
                        tableElement.querySelectorAll(`tfoot tr input`).forEach((input, index) => {
                            ajaxParams[`columnsSearch${index}`] = "";
                            if (input.value) {
                                ajaxParams[`columnsSearch${index}`] = input.value;
                                table.isSearching = true;
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
                document.querySelector('.dt-wrapper .dt-top').appendChild(divDTSearch);

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
