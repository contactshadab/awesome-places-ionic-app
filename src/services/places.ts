import { Place } from "../models/place";
import { Location } from "../models/location";
import { Storage } from '@ionic/storage';
import { Injectable } from "@angular/core";
import { File } from "@ionic-native/file";

@Injectable()
export class PlacesService {
    places: Place[] = [];

    constructor(private storage: Storage, private file: File){}

    addPlace(title: string, description: string, location: Location, imageUrl: string){
        const place = new Place(title, description, location, imageUrl);
        this.places.push(place);
        this.storage.set('places', this.places)
            .then()
            .catch(reason => {
                this.places.splice(this.places.indexOf(place), 1);
            })
    }

    getPlaces(){
        return this.places.slice();
    }

    fetchPlaces(){
        return this.storage.get('places')
            .then((places: Place[]) => {
                this.places = (places != null)? places: [];
                return this.places.slice();
            })
            .catch(reason => {
                console.log(reason);
            })
    }

    deletePlace(index: number){
        const place = this.places[index];
        this.places.splice(index, 1);
        this.storage.set('places', this.places)
            .then(() => {
                this.removeFile(place);
            })
            .catch((error) => {
                console.log(error);
                this.addPlace(place.title, place.description, place.location, place.imageUrl);
            })
    }

    private removeFile(place: Place){
        const currentName = place.imageUrl.replace(/^.*[\\\/]/, '');
        this.file.removeFile(this.file.dataDirectory, currentName)
            .then()
            .catch((error) => {
                console.log(error);
                this.addPlace(place.title, place.description, place.location, place.imageUrl);
            })
    }
}