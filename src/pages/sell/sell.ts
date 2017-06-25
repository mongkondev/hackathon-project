import { Component } from '@angular/core';
import { NavController, AlertController, LoadingController } from 'ionic-angular';
import FirebaseLib from '../../services/firebaseLib';
import { Http, Headers, Response } from '@angular/http';
declare var _;

declare var firebase;
declare var $;

@Component({
    selector: 'page-sell',
    templateUrl: 'sell.html'
})
export class SellPage {

    public showSignInButton = false
    public images = []
    public data:any = {
        title : null,
        description : null,
        price : null,
        location : null,
        latlng : null,
    }

    constructor(
        public navCtrl: NavController,
        public alertCtrl: AlertController,
        public loadCtrl: LoadingController,
        public http:Http,
    ) {
        
        var user = firebase.auth().currentUser;
        if(!user){
            this.showSignInButton = true
        }

        this.getLocation();
        console.log(this.data);

    }
    getLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(this.showPosition);
        } else { 
                let alert = this.alertCtrl.create({
                    title: 'Alert',
                    subTitle: 'Geolocation is not supported by this browser.',
                    buttons: ['OK']
                });
                alert.present();
        }
    }

    showPosition(position) {
        this.getGeocode(position.coords.latitude+","+position.coords.longitud);
    }

    getGeocode(latlng){

        //return new Promise((resolve, reject) => {

            let url = 'https://maps.googleapis.com/maps/api/geocode/json?latlng='+latlng+'&sensor=true&language=th&region=TH&key=AIzaSyACgG6fqREwXMyCRYi1no8i_xS8HECFsC8'

            // var observabe = this.http.get(url)
            // .map(res => res.json())
            // .subscribe(
            // res=>{

            //     let resultObj = {}

            //     if(res.results[0]){

            //         if(res.results[0].address_components){

            //             _.each(res.results[0].address_components, address_component=>{

            //                 var hasStreetNumber = _.find(address_component.types, o=>o=="street_number")

            //                 if(hasStreetNumber){
            //                     if(resultObj['address.address']) return
            //                     return resultObj['address.address'] = address_component.long_name.split(" ")[0]
            //                 }

            //                 var hasRoute = _.find(address_component.types, o=>o=="route")

            //                 if(hasRoute){

            //                     if(resultObj['address.street']) return
            //                     return resultObj['address.street'] = address_component.long_name
            //                 }

            //                 if(_.isString(address_component.long_name)){

            //                     var hasSubDistrict = address_component.long_name.substring(0, 4)=="ตำบล" || address_component.long_name.substring(0, 4)=="แขวง"

            //                     if(hasSubDistrict){
            //                         if(resultObj['address.sub_district']) return
            //                         return resultObj['address.sub_district'] = address_component.long_name
            //                     }

            //                     var hasDistrict = address_component.long_name.substring(0, 5)=="อำเภอ" || address_component.long_name.substring(0, 3)=="เขต"

            //                     if(hasDistrict){
            //                         if(resultObj['address.district']) return
            //                         return resultObj['address.district'] = address_component.long_name
            //                     }

            //                 }

            //                 var hasProvince = _.find(address_component.types, o=>o=="administrative_area_level_1")

            //                 if(hasProvince){
            //                     if(resultObj['address.province']) return
            //                     return resultObj['address.province'] = address_component.long_name
            //                 }

            //                 var hasPostalCode = _.find(address_component.types, o=>o=="postal_code")

            //                 if(hasPostalCode){
            //                     if(resultObj['address.zipcode']) return
            //                     return resultObj['address.zipcode'] = address_component.long_name
            //                 }


            //             })

                        
            //         }

            //     }

            //     resolve(resultObj)
            //     this.data.location=resultObj;
            //     this.data.latlng = latlng;

            // },
            // err=>{

            //     reject()

            // })

            $.ajax({
                url: url,
                type: 'default GET (Other values: POST)',
                dataType: 'default: Intelligent Guess (Other values: xml, json, script, or html)',
                data: {param1: 'value1'},
            })
            .done(function(data) {
                let res = data.json()
                let resultObj = {}

                if(res.results[0]){

                    if(res.results[0].address_components){

                        _.each(res.results[0].address_components, address_component=>{

                            var hasStreetNumber = _.find(address_component.types, o=>o=="street_number")

                            if(hasStreetNumber){
                                if(resultObj['address.address']) return
                                return resultObj['address.address'] = address_component.long_name.split(" ")[0]
                            }

                            var hasRoute = _.find(address_component.types, o=>o=="route")

                            if(hasRoute){

                                if(resultObj['address.street']) return
                                return resultObj['address.street'] = address_component.long_name
                            }

                            if(_.isString(address_component.long_name)){

                                var hasSubDistrict = address_component.long_name.substring(0, 4)=="ตำบล" || address_component.long_name.substring(0, 4)=="แขวง"

                                if(hasSubDistrict){
                                    if(resultObj['address.sub_district']) return
                                    return resultObj['address.sub_district'] = address_component.long_name
                                }

                                var hasDistrict = address_component.long_name.substring(0, 5)=="อำเภอ" || address_component.long_name.substring(0, 3)=="เขต"

                                if(hasDistrict){
                                    if(resultObj['address.district']) return
                                    return resultObj['address.district'] = address_component.long_name
                                }

                            }

                            var hasProvince = _.find(address_component.types, o=>o=="administrative_area_level_1")

                            if(hasProvince){
                                if(resultObj['address.province']) return
                                return resultObj['address.province'] = address_component.long_name
                            }

                            var hasPostalCode = _.find(address_component.types, o=>o=="postal_code")

                            if(hasPostalCode){
                                if(resultObj['address.zipcode']) return
                                return resultObj['address.zipcode'] = address_component.long_name
                            }


                        })

                        
                    }

                }
                this.data.location=resultObj;
                this.data.latlng = latlng;
            })
            .fail(function() {
                console.log("error")
            })
            .always(function() {
                console.log("complete")
            })

        //})

    }
    deleteFile(key){
        
        let confirm = this.alertCtrl.create({
			title: 'Confirm Delete',
			buttons: [
				{
					text: 'Cancel',
					handler: () => {
						
					}
				},
				{
					text: 'OK',
					handler: () => {

						this.images.splice(key, 1);

					}
				}
			]
		});

		confirm.present();
    }

    arrayToGrid(array, col_num){

        var data = [];

        var row = 0;
        var col = 0;

        array.forEach( (d, index) => {
            
            if(data[row] == undefined) data[row] = [];
            
            d._index = index;
            data[row][col] = d;

            col++; 

            if(col > col_num-1){
                col = 0;
                row++;
            }

        });

        return data;

    }

    addPicture(){
        $('#file').trigger('click')
    }

    onChangeFileInput(event: Event) {

        var el : any;
		el = event.target;
        var p = [];

        for (var i = 0; i < el.files.length; i++) {
            p.push(new Promise((resolve, reject) => {

                    var file = el.files[i];
                    var reader = new FileReader();
                    reader.readAsDataURL(file);

                    reader.onloadend = (e) => {

                        var target;
                        target = e.target;

                        let obj = {data:target.result, type: file.type, name: file.name}

                        this.images.push(obj)

                        resolve(obj)

                    }

            }));
        }

        Promise.all(p).then(values => {

            /*var storageRef = firebase.storage().ref();
            var mountainsRef = storageRef.child('mountains.jpg');

            mountainsRef.putString(message, 'data_url').then(function(snapshot) {
                console.log('Uploaded a data_url string!');
            });*/

        })

    }

    save(){

        let loading = this.loadCtrl.create()
        loading.present()

        let imagesUrl = []

        FirebaseLib.uploadFile(this.images).then(res=>{

            loading.dismiss()

            res.forEach(image => {

                imagesUrl.push(image.metadata.downloadURLs[0])

            });

            this.data.images = imagesUrl

            FirebaseLib.addProduct(this.data)

            let alert = this.alertCtrl.create({
                title: 'Success',
                subTitle: 'Add product success.',
                buttons: ['OK']
            });
            alert.present();

            this.reset()

        })

    }

    reset(){
        this.images = []
        this.data = {
            title : null,
            description : null,
            price : null
        }
    }

    signIn(){

        FirebaseLib.signInGoogle().then((result) => {

            this.showSignInButton = false
            var user = result.user;
            
            let alert = this.alertCtrl.create({
                title: 'Wellcome',
                subTitle: 'Wellcome ' + user.displayName,
                buttons: ['OK']
            });
            alert.present();
            
            this.showSignInButton = false
            
        })
    }

}
