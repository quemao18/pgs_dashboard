import { Http, Response } from "@angular/http";
import { Subject } from "rxjs/Subject";
import { UserService } from '../services/user.service';

import { CompleterService, CompleterData, RemoteData, CompleterItem } from 'ng2-completer';

export class CustomData extends Subject<CompleterItem[]> implements CompleterData {
    constructor(private userService: UserService, private http: Http) {
        super();
    }
    public search(term: string): void {
        //this.http.get("http://mysafeinfo.com/api/data?list=seinfeldepisodes&format=json&nm=" + term + ",contains")
        this.userService.getUsers(term)
        .map((res: Response) => {
                // Convert the result to CompleterItem[]
                let data = res.json();
                let matches: CompleterItem[] = data.map((episode: any) => this.convertToItem(episode));
                this.next(matches);
            })
            .subscribe();
    }

    public cancel() {
        // Handle cancel
    }

    public convertToItem(data: any): CompleterItem | null {
        if (!data) {
            return null;
        }
        // data will be string if an initial value is set
        return {
            title: data.name +  ' ' +  data.last,
            originalObject:  data 
          
        } as CompleterItem;
    }
}