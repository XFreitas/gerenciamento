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
        // if (localStorage.getItem('sb|sidebar-toggle') === 'true') {
        //     document.body.classList.toggle('sb-sidenav-toggled');
        // }
        sidebarToggle.addEventListener('click', event => {
            event.preventDefault();
            document.body.classList.toggle('sb-sidenav-toggled');
            localStorage.setItem('sb|sidebar-toggle', document.body.classList.contains('sb-sidenav-toggled'));
        });
    }

    Object.prototype.mask = function (mask, options = {}) {
        console.log('masking');
        if (typeof this.dataset.value == 'undefined') {

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
    }

    String.prototype.toHtml = function () {
        var parser = new DOMParser();
        var doc = parser.parseFromString(this, 'text/html');
        return doc.body.firstChild;
    }

    Object.prototype.loadModal = function (url) {
        this.addEventListener('hidden.bs.modal', function () {
            this.innerHTML = '<div class="modal-dialog">' +
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
        });

        const myModal = bootstrap.Modal.getOrCreateInstance(this);

        myModal.show();

        axios.get(url).then(html => {
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
            myModal.hide();
        });
    }
});
