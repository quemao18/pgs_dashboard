import {Component, Input, ChangeDetectionStrategy} from '@angular/core';

@Component({
  selector: 'lbd-user-profile',
  templateUrl: './lbd-user-profile.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LbdUserProfileComponent {
  @Input()
  backgroundImage: string;

  @Input()
  avatarImage: string;

  @Input()
  name: string;

  @Input()
  username: string;

  @Input()
  email: string;

  @Input()
  about: string;

  @Input()
  phone: string;

  @Input()
  address: string;

  @Input()
  surgical: string;

  @Input()
  health: string;

  @Input()
  dob: Date;

  @Input()
  company_name: string;

  @Input()
  plan_name: string;

  @Input()
  price: number;

  @Input()
  smoker: string;

  @Input()
  transplant: string;

  @Input()
  maternity: string;
  
  @Input()
  company_logo: string;

  @Input()
  description: string;

  @Input()
  country_name: string;

  @Input()
  spouse_age: string;

  @Input()
  spouse_gender: string;
  
  @Input()
  dependents: string;

  @Input()
  age: number;

  @Input()
  dependentsAges: Array<number>;

  constructor() { }
}
