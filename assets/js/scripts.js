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
});
