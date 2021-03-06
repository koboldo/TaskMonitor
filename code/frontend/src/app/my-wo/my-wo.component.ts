import { Component, OnInit } from '@angular/core';
import { Observable, Subscriber } from 'rxjs';


import { User, RelatedItem, Order, WorkType, CodeValue } from '../_models/index';
import { WOService, RelatedItemService, UserService, DictService, AlertService, WorkTypeService, AuthenticationService, ToolsService } from '../_services/index';
import { MenuItem } from 'primeng/primeng';
//add comment
import { Comments, commentAsSimpleString, commentAsString, commentAdd,DisplayTextCommentAsString } from '../_models/comment';
import {forkJoin} from "rxjs/index";
//end add comment

@Component({
    selector: 'app-my-wo',
    templateUrl: './my-wo.component.html',
    styleUrls: ['./my-wo.component.css']
})
export class MyWoComponent implements OnInit {

    engineer: User;
    engineers:User[] = [];

    orders:Order[];
    selectedOrder:Order;
    editedOrder:Order;

    items:MenuItem[] = [];

    displayFinishDialog: boolean;
    displayDetailsDialog: boolean;
    
    //add comment
    newComment: string;
    displayAddComment: boolean;
    commentOrder:Order;
    displayChangeStatusDialog:boolean;
    cols: any;
    priceTimeout: any;
    priceFilter: number;


    constructor(private woService:WOService,
                private userService:UserService,
                public workTypeService:WorkTypeService,
                private dictService:DictService,
                private alertService:AlertService,
                private authSerice:AuthenticationService,
                private toolsService: ToolsService
    ) {
    }

    ngOnInit() {
        this.authSerice.userAsObs.subscribe(user => this.saveAndSearch(user));

        forkJoin([this.workTypeService.getWorkTypes(), this.userService.getEngineers()]).subscribe(responseList => {
                console.log(`Fork Join ${responseList.length}...`);
                console.log("WorkTypes :"+JSON.stringify(responseList[0]));
                this.engineers = responseList[1];
                this.search();
              }
          );

        this.items = [
            {label: 'Zakończ zlecenie', icon: 'fa fa-check', command: (event) => this.finishWork()},
            {label: 'Dodaj komentarz', icon: 'fa fa-pencil-square-o',  command: (event) => this.addComment()},
        ];
        this.cols = [
            { field: 'workNo', header: 'Zlecenie' , sortable: true,class:"width-50 text-center"},        
            { field: 'statusCode', header: 'Status', sortable: true,  class:"width-100 text-center", statusCode:true, icon:true},        
            { field: 'type', header: 'Typ', sortable:true, type:true, class:"width-135 text-center"},
            { field: 'complexityCode', header: 'Złożoność', sortable:true, complexity:true, icon:true,class:"width-50 text-center" },
            { field: 'mdCapex', header: 'CAPEX', sortable:true, class:"width-100 text-center" },
            { field: 'price', header: 'Cena', sortable:true, class:"width-80 text-right", price:true},
            { field: 'isFromPool', header: 'Pula' , sortable:true, filter:true, isFromPool:true, icon:true, class:"width-50 text-center"},
            { field: 'sComments', header: 'Komentarz', sortable:true ,  class:"width-100 ", comment:true,icon:true},
            { field: 'description', header: 'Opis', sortable:true, class:"width-100 text-center" },
            { field: 'lastModDate', header: 'Modyfikacja.' , sortable:true,  class:"width-100 text-center" },
            { field: 'creationDate', header: 'Dodano', sortable:true , class:"width-100 text-center"},
            { field: 'itemNo', header: 'Numer obiektu' , sortable:true,  class:"width-125 text-center"},
            //hidden
            { field: 'status', header: 'statusSearch', hidden: true},
            { field: 'type', header: 'typeSearch' , hidden: true},
            { field: 'itemBuildingType', header: 'Typ obiektu', hidden:true},
            { field: 'itemConstructionCategory', header: 'Konstrukcja', hidden:true},
            { field: 'itemAddress', header: 'Adres', hidden:true},
            { field: 'itemDescription', header: 'Opis obiektu', hidden:true},        
            { field: 'none',excludeGlobalFilter: true, button:true ,details: true, icone:true, class:"width-35 text-center"},
        ]
    }
    
    public onPriceChange(event, tt) {
        if (this.priceTimeout) {
            clearTimeout(this.priceTimeout);
        }
        this.priceTimeout = setTimeout(() => {
            tt.filter(event.value, 'price', 'gt');
        }, 250);
    }

    showChangeStatusDialog() {
        this.displayChangeStatusDialog=true;
    }

    onClose(isVisible: boolean){
        this.displayChangeStatusDialog = isVisible;
        this.search();
       }

   private addComment():void{
       this.displayAddComment=true;    
    }
    saveComment (): void{
        if (this.newComment && this.newComment.length > 0) {
            this.addCommentToOrder(this.selectedOrder,this.newComment);            
        }
        this.displayAddComment=false;
        this.newComment=null;  
    }
   private addCommentToOrder (order: Order, newComment: string) :void {
        let reason: string = "Komentarz";
        if (!order.comments) {
            order.comments = new Comments(null);
        }
        commentAdd(order.comments, reason, this.engineer, newComment);
        this.woService.updateOrder(order).subscribe(order=>this.search());
        this.alertService.info('Pomyślnie dodano komentarz do zlecenia: ' + order.workNo);
        newComment=null; 
   }

public getCancelOrHoldComment(order: Order): string {
    if (order && order.comments) {
        return DisplayTextCommentAsString(order.comments);
    } else {
        return '';
    }    
}
//end add comment

    search() {
        if (this.engineer.id) {
            this.woService.getAssignedOrders(this.engineer.id).subscribe(orders => this.orders = orders);
        } else {
            this.alertService.error("Nie można wyszukać, błąd wewnętrzny");
        }
    }

    onRowSelect(event) {
        console.log("selected row!" + JSON.stringify(this.selectedOrder));
        this.selectedOrder.assigneeFull = this.toolsService.getEngineers(this.selectedOrder.assignee, this.engineers);
    }

    private saveAndSearch(user:User):void {
        if (user === null) {
            console.log("Probably logged out");
            return;
        }

        console.log("Logged as "+JSON.stringify(user));
        this.engineer = user;
        this.search();
    }

    private finishWork():void {
        this.editedOrder = JSON.parse(JSON.stringify(this.selectedOrder));
        this.editedOrder.statusCode = "CO";
        this.editedOrder.status = this.dictService.getWorkStatus(this.editedOrder.statusCode);
        this.editedOrder.type = this.dictService.getWorkStatus(this.editedOrder.typeCode);

        this.displayFinishDialog = true;
    }

    saveOrder() {

        this.editedOrder.status = this.dictService.getWorkStatus(this.editedOrder.statusCode);
        this.editedOrder.type = this.workTypeService.getWorkTypeDescription(this.editedOrder);

        this.storeOrder(this.editedOrder);

        this.displayFinishDialog = false;
    }

    private storeOrder(order:Order):void {
        console.log("changing order!" + JSON.stringify(order));
        this.woService.updateOrder(order).subscribe(updatedOrder => this.refreshTable(updatedOrder))
    }

    private refreshTable(order:Order) {
        console.log("Refreshing table removing order " + JSON.stringify(order));

        if (order && order.id > 0) {
            let index: number = 0;
            for(let anOrder of this.orders) {
                if (anOrder.id === order.id) {
                    this.orders.splice(index, 1);
                    this.orders = JSON.parse(JSON.stringify(this.orders));
                }
                index++;
            }
            this.alertService.success("Pomyślnie zakończono zlecenie " + order.workNo);
        } else {
            this.alertService.error("Nie można bylo odświeżyć tabeli wyników, szukaj jeszcze raz");
        }
    }

}
