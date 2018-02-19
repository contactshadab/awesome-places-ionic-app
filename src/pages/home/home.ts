import { Component } from '@angular/core';
import { AddPlacePage } from '../add-place/add-place';
import { PlacesService } from '../../services/places';
import { Place } from '../../models/place';
import { ModalController } from 'ionic-angular/components/modal/modal-controller';
import { PlacePage } from '../place/place';
import { OnInit } from '@angular/core/src/metadata/lifecycle_hooks';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage implements OnInit {

  addPlacePage = AddPlacePage;
  places: Place[];
  constructor(private placesService: PlacesService,
              private modalCtrl: ModalController) {

  }

  ngOnInit(){
    this.placesService.fetchPlaces()
      .then((places: Place[]) => {
        this.places = places;
      })
      .catch((error) => {
        console.log(error);
      })
  }

  ionViewWillEnter(){
    this.places = this.placesService.getPlaces();
  }

  onOpenPlace(place: Place, index: number){
    const modal = this.modalCtrl.create(PlacePage, {place: place, index: index})
    modal.present();
    modal.onDidDismiss((data) => {
      if(data && data.reload)
        this.places = this.placesService.getPlaces();
    })
  }

}
