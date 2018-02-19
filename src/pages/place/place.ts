import { Component } from '@angular/core';
import { NavParams } from 'ionic-angular';
import { Place } from '../../models/place';
import { ViewController } from 'ionic-angular';
import { PlacesService } from '../../services/places';

@Component({
  selector: 'page-place',
  templateUrl: 'place.html',
})
export class PlacePage {

  place: Place;
  index: number;

  constructor(private navParams: NavParams, private viewCtrl: ViewController, private placesService: PlacesService) {
    this.place = this.navParams.get('place');
    this.index = this.navParams.get('index');
  }

  onClose() {
    this.viewCtrl.dismiss({reload: false});
  }

  onDelete(){
    this.placesService.deletePlace(this.index);
    this.viewCtrl.dismiss({reload: true});
  }

}
