import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { User, Timesheet } from '../_models/index';
import { TimesheetService, ToolsService, AlertService } from '../_services/index';

@Component({
    selector: 'user-attendance-register',
    templateUrl: './user-attendance-register.component.html',
    styleUrls: ['./user-attendance-register.component.css']
})
export class UserAttendanceRegisterComponent implements OnInit {

    @Input() user:User;

    public displayBreakDialog: boolean;
    public totalBreakInMinutes: number;

    private _timesheet: Timesheet;
    get timesheet(): Timesheet {
        return this._timesheet;
    }

    private _unregisteredExits: string[];
    get unregisteredExits():string[] {
        return this._unregisteredExits;
    }


    constructor(private timesheetService:TimesheetService,
                private toolsService: ToolsService,
                private alertService: AlertService) {
        this.totalBreakInMinutes = this.toolsService.DEFAULT_BREAK;
    }

    ngOnInit() {
        this._unregisteredExits = [];

        let today:Date = this.toolsService.getCurrentDateDayOperation(0);

        let sToday: string = this.toolsService.formatDate(today, 'yyyy-MM-dd');

        let checkFromDate = this.toolsService.getCurrentDateDayOperation(-24) // 3 weeks + 1 weekend

        let sFrom: string = this.toolsService.formatDate(checkFromDate, 'yyyy-MM-dd');

        this.timesheetService.getByIdAndDates(this.user.id, sFrom, sToday)
            .subscribe((timesheets:Timesheet[]) => this.checkUser(timesheets, sToday));
    }

    public isSetFrom():boolean {
        return this._timesheet.from && this._timesheet.from.substr(11,8) != "00:00:00";
    }

    public isSetTo():boolean {
        return this._timesheet.to && this._timesheet.to.substr(11,8) != "00:00:00";
    }


    public registerFrom():void {
        console.log("From!");
        this.timesheetService.upsertAttendanceFrom(this.user.id)
            .subscribe(result => this.updateTimesheet(result));
    }

    public registerTo():void {
        console.log("To!");
        this.timesheetService.upsertAttendanceTo(this.user.id)
            .subscribe(result => this.calculateBreak(result));
    }

    public registerBreak(): void {
        console.log("register break!");
        this.timesheetService.upsertAttendanceBreak(this.user.id, this.totalBreakInMinutes)
            .subscribe(result => this.updateTimesheet(result));
    }

    public addBreak():void {
        this.displayBreakDialog = true;
    }

    private checkUser(timesheets:Timesheet[], sToday:string):void {
        for (let timesheet of timesheets) {
            if (timesheet.personId === this.user.id) {
                if (timesheet.from && timesheet.from.startsWith(sToday)) {
                    this._timesheet = timesheet;
                    this.totalBreakInMinutes = timesheet.break ? +timesheet.break : this.toolsService.DEFAULT_BREAK;
                } else if (this.checkExitNotRegistered(timesheet)) {
                    this._unregisteredExits.push(timesheet.from.substring(0, 10));
                }
                console.log("Find user timesheet "+JSON.stringify(timesheet));
            } else {
                this.alertService.error('Zly raport czasu pracy, szukano dla '+this.user.id+', znaleziono dla '+timesheet.personId+'!')
                return
            }
        }

        if (!this._timesheet) {
            console.log('Brak czasu pracy dla '+this.user.id)
        }
    }

    private checkExitNotRegistered(timesheet: Timesheet): boolean {
        return timesheet.isLeave === 'N' && timesheet.usedTime === 0 && !timesheet.from.endsWith('00:00:00');
    }

    private updateTimesheet(result:any):Timesheet {
        if ((result.updated === 1 || result.created === 1) && result.timesheet) {
            this._timesheet = result.timesheet;
            return result.timesheet;
        } else {
            console.log("Something went wrong when from or to "+JSON.stringify(result));
            this.alertService.error("Nie udalo sie zaktualizować danych o twoim czasie pracy!");
        }
        this.displayBreakDialog = false;
        return null;
    }

  private calculateBreak(result:any):void {
    let timesheet: Timesheet = this.updateTimesheet(result);
    if (timesheet) {
      let from: string = timesheet.from+':00';
      let to: string = timesheet.to+':00';

      let fromDate: Date = this.toolsService.parseDate(from);
      let toDate: Date = this.toolsService.parseDate(to);
      let interval: number = toDate.getTime() - fromDate.getTime();

      if (interval > 0 && interval < this.toolsService.FOUR_HOURS && +timesheet.break == this.totalBreakInMinutes) {
        console.log(`Reducing break from def ${this.totalBreakInMinutes} min to 0 as work time's less then 4h - ${JSON.stringify(timesheet)}...`);
        this.timesheetService.upsertAttendanceBreak(this.user.id, 0)
                .subscribe(result => this.updateTimesheet(result));
      }
    }
  }
}
