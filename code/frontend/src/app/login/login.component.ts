﻿import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { AlertService, AuthenticationService } from '../_services/index';

@Component({
    templateUrl: 'login.component.html'
})

export class LoginComponent implements OnInit {
    model: any = {};
    loading = false;
    returnUrl: string;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private authenticationService: AuthenticationService,
        private alertService: AlertService) { }

    ngOnInit() {
        // reset login status
        //this.router.navigate(['/logme']);

        this.authenticationService.logout();


        // get return url from route parameters or default to '/'
        //this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    }

    login() {
        this.loading = true;
        this.authenticationService.login(this.model.email, this.model.password)
            .subscribe(
                data => {
                    //this.router.navigate([this.returnUrl]);
                    this.router.navigate(['/']);
                },
                error => {
                    if (error.status === 403) {
                        this.alertService.error("Brak dostępu - sprawdź użykownika i hasło!");
                    } else {
                        this.alertService.error(error);
                    }
                    console.log(JSON.stringify(error));
                    this.loading = false;
                });
    }

}
