﻿import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AlertService, UserService, DictService, AuthenticationService } from '../_services/index';
import { User, CodeValue } from '../_models/index';
import {SelectItem} from 'primeng/primeng'
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime.js';
import { Observable }    from 'rxjs/Observable';
import { EmptyObservable } from 'rxjs/observable/EmptyObservable';
import { FormsModule, FormBuilder, FormGroup, EmailValidator, NG_VALIDATORS, Validator }     from '@angular/forms';

@Component({
    templateUrl: 'user-register.component.html'
})

export class UserRegisterComponent implements OnInit {

    user: User = new User;
    loading: boolean = false;

    roles: SelectItem[] = [];
    offices: SelectItem[] = [];
    ranks: SelectItem[] = [];
    agreements: SelectItem[] = [];

    showRoles: boolean = false;
    showOffices: boolean = false;
    showRanks: boolean = false;
    showAgreements: boolean = false;

    staff: User[];
    representatives: User[];
    suggestedCompanies: string[];
    company: string;
    operator: User;

    constructor(
        private router: Router,
        private userService: UserService,
        private alertService: AlertService,
        private dictService: DictService,
        private authService: AuthenticationService) {

        this.user.roleCode = ['EN'];
        this.user.officeCode = 'WAW';
        this.user.isActive = 'Y';
    }

    ngOnInit():void {
        this.dictService.init();
        this.authService.userAsObs.subscribe(user => this.removeRoles(user));

        this.dictService.getOfficesObs().subscribe((offices:CodeValue[]) => this.mapToOffices(offices));
        this.userService.getVentureRepresentatives().subscribe(representatives => this.representatives = representatives);

        this.mapToRanks(this.dictService.getRanks());
        this.mapToAgreements(this.dictService.getAgreements());

        this.authService.userAsObs.subscribe(user => this.fillStaff(user));
    }

    private fillStaff(user:User):void {
        this.userService.getManagedUsers(user.roleCode, false).subscribe(staff => this.staff = staff);
    }

    register() {
        this.loading = true;

        this.user.company = this.company;

        if (this.user.isFromPool == 'Y' && this.operator.roleCode.indexOf('PR') == -1) {
            this.user.projectFactor = 0.8;
        } 

        this.userService.create(this.user)
            .subscribe(
                data => {
                    this.alertService.success('Pomyślnie dodano nowego użytkownika '+this.user.email, true);
                    this.router.navigate(['']); //navigate home
                },
                error => {
                    this.alertService.error('Nie udalo się dodać użytkownika' +error);
                    this.loading = false;
                });
    }

    private mapToRoles(pairs:CodeValue[]):void {
        this.showRoles = this.mapToSelectItem(pairs, this.roles);
    }

    private mapToOffices(pairs:CodeValue[]):void {
        this.showOffices = this.mapToSelectItem(pairs, this.offices);
    }

    private mapToRanks(pairs:CodeValue[]):void {
        this.showRanks = this.mapToSelectItem(pairs, this.ranks);
    }

    private mapToAgreements(pairs:CodeValue[]):void {
        this.showAgreements = this.mapToSelectItem(pairs, this.agreements);
    }

    private mapToSelectItem(pairs:CodeValue[], ref: SelectItem[]):boolean {
        for(let pair of pairs) {
            ref.push({label: pair.paramChar, value: pair.code});
        }
        return true;
    }

    public showProjectFactor() {
        return this.user && this.operator && this.user.isFromPool === 'Y' && this.operator.roleCode.indexOf('PR') > -1;
    }

    suggestCompany(event) {
        let suggestedCompanies: string[] = [];
        let queryIgnoreCase: string = event.query ? event.query.toLowerCase(): event.query;

        if (this.user.roleCode.indexOf('VE') > -1 && this.representatives && this.representatives.length > 0) {
            console.log('all ' + JSON.stringify(this.representatives));
            for (let r of this.representatives) {
                if (r.company && r.company.toLowerCase().indexOf(queryIgnoreCase) > -1 && suggestedCompanies.indexOf(r.company) == -1) {
                    suggestedCompanies.push(r.company);
                }
            }
        }
        if (this.user.roleCode.indexOf('VE') == -1 && this.staff && this.staff.length > 0) {
            console.log('all ' + JSON.stringify(this.staff));
            for (let s of this.staff) {
                if (s.company && s.company.toLowerCase().indexOf(queryIgnoreCase) > -1 && suggestedCompanies.indexOf(s.company) == -1) {
                    suggestedCompanies.push(s.company);
                }
            }
        }
        this.suggestedCompanies = suggestedCompanies;
        console.log('suggestedCompanies: ' + JSON.stringify(this.suggestedCompanies));
    }

    private removeRoles(user:User):void {
        if (user) {
            this.operator = user;
            console.log('Operator '+JSON.stringify(this.operator));
            if (this.operator.roleCode.indexOf('PR') == -1 ) {
                let roles: CodeValue[] = this.dictService.getRoles();
                let allowedRoles: CodeValue[] = [];
                for (let role of roles) {
                    if (role.code !== 'PR') {
                        allowedRoles.push(role);
                    }
                }
                this.mapToRoles(allowedRoles);

            } else {
                this.mapToRoles(this.dictService.getRoles());
            }
        }
    }

}
