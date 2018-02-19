import { Component } from '@angular/core';
import { NavParams } from 'ionic-angular/navigation/nav-params';
import { Location } from '../../models/location';
import { ViewController } from 'ionic-angular';

@Component({
  selector: 'page-set-location',
  templateUrl: 'set-location.html',
})
export class SetLocationPage {

  location: Location;
  marker: Location;

  constructor(public navParams: NavParams, private viewCtrl: ViewController) {
    this.location = navParams.get('location');
    if(navParams.get('isSet')){
      this.marker = this.location;
    }
  }

  onMapClick(event: any){
    console.log(event);
    this.marker = new Location(event.coords.lat, event.coords.lng);
  }

  onConfirm(){
    this.viewCtrl.dismiss({location: this.marker});
  }

  onAbort(){
    this.viewCtrl.dismiss();
  }
  

}
