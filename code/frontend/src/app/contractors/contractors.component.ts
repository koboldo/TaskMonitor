import { Component, OnInit, Input, Output, EventEmitter, Inject, forwardRef } from '@angular/core';
import { ToolsService, WOService, DictService, AlertService, UserService, AuthenticationService } from '../_services';
import { Order, CodeValue, commentAdd, Comments, User } from '../_models';
import { WoComponent } from '../wo/wo.component';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/primeng';

@Component({
  selector: 'app-contractors',
  templateUrl: './contractors.component.html',
  styleUrls: ['./contractors.component.css']
})
export class ContractorsComponent implements OnInit {

  items:MenuItem[] = [];

  operator:User;
  allUsers:User[] = [];
  users:User[] = [];
  selectedUser: User;


  displayUserHistoryDialog: boolean;
  filter1: string = 'EMPLOYED_ONLY';
  filter2: string = 'ALL';

  constructor(private router:Router,
              private userService:UserService,
              private alertService:AlertService,
              private dictService:DictService,
              private authService:AuthenticationService) {

      this.items = [
          {label: 'Zmień dane kontrahenta', icon: 'fa-pencil-square-o', disabled: false, command: (event) => this.change()}
      ];

  }

  ngOnInit():void {
      this.dictService.init();
      this.authService.userAsObs.subscribe(user => this.removeRolesAndGetManagedUsers(user));
  }

  public showUserHistory(event, user: User): void {
      console.log('showUserHistory... '+JSON.stringify(user));
      this.selectedUser = user;
      this.displayUserHistoryDialog=true;
  }

  public add():void {
      this.router.navigate(['/addPerson']);
  }

  onRowDblclick(event) {
      this.change();
  }

  public change():void {
      if (this.selectedUser && this.selectedUser.id) {
          this.router.navigate(['/changePerson', this.selectedUser.id]);
      } else {
          this.router.navigate(['/changePerson']);
      }
  }

  filter(input): void {
      console.log('radio clicked '+this.filter1+ ' '+JSON.stringify(input));
      //this is shame, onClick is triggerd before model is changed therefore I will rely on input...
      if (input === 'ALL') {
          this.users = this.allUsers;
      } else if (input === 'EMPLOYED_ONLY') {
          this.users = [];
          for(let user of this.allUsers) {
              if (user.isEmployed === 'Y') {
                  this.users.push(user);
              }
          }
      } else {
          this.users = [];
          console.log(input + ' unimplemented!');
      }
  }

  private removeRolesAndGetManagedUsers(user:User):void {
      if (user) {
          this.operator = user;
          this.userService.getContractors().subscribe(engineers => this.processUsers(engineers));
      }
  }

  private processUsers(engineers:User[]):void {
      this.allUsers = engineers;
      this.filter(this.filter2);
  }
}