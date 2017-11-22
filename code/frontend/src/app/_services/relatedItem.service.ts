﻿import { Injectable, Component, OnInit, ViewChild } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable }    from 'rxjs/Observable';

import 'rxjs/add/operator/map';

import { Order } from '../_models/order';
import { RelatedItem } from '../_models/relatedItem';
import { HttpInterceptor } from '../_services/httpInterceptor.service';
import 'rxjs/add/operator/mergeMap';

@Injectable()
export class RelatedItemService {

    constructor(private http: HttpInterceptor) {
        console.log("RelatedItemService created");
    }

    getAllItems() : Observable<RelatedItem[]> {
        return this.http.get('/api/v1/relatedItems')
            .map((response: Response) => response.json().list);
    }

    updateItem(item: RelatedItem) : Observable<RelatedItem> {
        return this.http.put('/api/v1/relatedItems/'+item.id, JSON.stringify(item))
            .map((response: Response) => response.json().updated)
            .mergeMap(updatedId => this.getItemById(item.id));
    }

    addItem(item: RelatedItem) : Observable<RelatedItem> {
        return this.http.post('/api/v1/relatedItems', JSON.stringify(item))
            .map((response: Response) => response.json().created)
            .mergeMap(createdId => this.getItemById(createdId));
    }

    // private helper methods

    private getItemById(id:number):Observable<RelatedItem> {
        return this.http.get('/api/v1/relatedItems/'+id)
            .map((response: Response) => response.json());
    }
}