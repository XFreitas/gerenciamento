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

    Object.prototype.mask = function (mask, options = {}) {
        this.dataset.value = '';
        this.maxLength = mask.length;

        this.addEventListener('input', event => {
            if (typeof event.data === 'string') {
                event.target.dataset.value += event.data;
            } else {
                event.target.dataset.value = event.target.dataset.value.slice(0, -1);
            }

            let formatter = new StringMask(mask, options);
            let result = formatter.apply(event.target.dataset.value);

            event.target.value = result;
        });
    }

    Object.prototype.serializeObject = function () {
        const formData = {};
        if (this.tagName.toLowerCase() == 'form') {
            const children = this.querySelectorAll('[name]:not(:disabled)');

            children.forEach(child => {
                if (child.value != '') {
                    formData[child.name] = child.value;
                }
            });
        }

        return formData;
    }

    String.prototype.toHtml = function () {
        var parser = new DOMParser();
        var doc = parser.parseFromString(this, 'text/html');
        return doc.body.firstChild;
    }

    Object.prototype.loadModal = function (url = null) {
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

    Object.prototype.alertModal = function (message, httpCode) {
        const modalBody = this.querySelector('.modal-body');

        if (modalBody) {
            if (message) {
                const title = httpCode >= 400 ? 'Erro' : (httpCode >= 300 ? 'Aviso' : 'Sucesso');
                const alertType = httpCode >= 400 ? 'danger' : 'success';
                const alertIcon = httpCode >= 400 ? 'exclamation-triangle' : 'check-circle';

                modalBody.innerHTML = `<div class="alert alert-${alertType}" role="alert">` +
                    `<h4 class="alert-heading"><i class="fas fa-${alertIcon} fa-fw"></i> ${title}</h4>` +
                    `<p>${message}</p>` +
                    `</div>${modalBody.innerHTML}`;
            }
            else {
                const alert = modalBody.querySelector('.alert');
                if (alert) {
                    alert.remove();
                }
            }
        }
    }

    Object.prototype.submitModal = function (options = { hideModal: true }) {
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

                form.querySelectorAll('*').forEach(input => {
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

                            setTimeout(() => {
                                if (Object.hasOwnProperty.call(options, 'hideModal')) {
                                    if (options.hideModal == true) {
                                        crudModal.hide();
                                        window.location.reload();
                                    }
                                }

                                if (Object.hasOwnProperty.call(options, 'success')) {
                                    options.success(response.data);
                                }
                            }, 1100);
                        }
                    })
                    .catch(function (error) {
                        console.log(error);
                    })
                    .finally(function () {
                        buttonSubmit.disabled = false;
                        buttonSubmit.innerHTML = buttonSubmitHTML;

                        form.querySelectorAll('*').forEach(input => {
                            input.disabled = false;
                        });
                    });
            });
        }
    }
});
