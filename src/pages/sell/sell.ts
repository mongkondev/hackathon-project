import { Component } from '@angular/core';
import { NavController, AlertController, LoadingController, Events } from 'ionic-angular';
import FirebaseLib from '../../services/firebaseLib';

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
    public loading;

    constructor(
        public navCtrl: NavController,
        public alertCtrl: AlertController,
        public loadCtrl: LoadingController,
        public event: Events
    ) {

        this.getAuth()

        this.event.subscribe("firebase:logedIn", ()=>{
            console.log("has firebase:logedIn in sell")
            this.getAuth()
        })

        //this.getLocation();

    }

    getAuth(){
        var user = firebase.auth().currentUser;
        if(!user){
            this.showSignInButton = true
        }else{
           this.showSignInButton = false 
        }
    }

    getLocation() {

        this.loading = this.loadCtrl.create()
        this.loading.present()

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position)=>{
                this.showPosition(position)
            });
        } else { 

            this.loading.dismiss()

            let alert = this.alertCtrl.create({
                title: 'Alert',
                subTitle: 'Geolocation is not supported by this browser.',
                buttons: ['OK']
            });
            alert.present();
        }
    }

    showPosition(position) {
        this.getGeocode(position.coords.latitude+","+position.coords.longitude);
    }

    clearLocation(){
        this.data.location = null
        this.data.latlng = null
    }

    getGeocode(latlng){

        //return new Promise((resolve, reject) => {

            let url = 'https://maps.googleapis.com/maps/api/geocode/json?latlng='+latlng+'&sensor=true&language=th&region=TH&key=AIzaSyACgG6fqREwXMyCRYi1no8i_xS8HECFsC8'

            $.ajax({
                url: url,
                type: 'GET',
                dataType: 'json',
            })
            .done((res) => {

                let resultObj = {}

                if(res.results[0]){

                    if(res.results[0].address_components){

                        _.each(res.results[0].address_components, address_component=>{

                            var hasStreetNumber = _.find(address_component.types, o=>o=="street_number")

                            if(hasStreetNumber){
                                if(resultObj['address.address']) return
                                return resultObj['address'] = address_component.long_name.split(" ")[0]
                            }

                            var hasRoute = _.find(address_component.types, o=>o=="route")

                            if(hasRoute){

                                if(resultObj['address.street']) return
                                return resultObj['street'] = address_component.long_name
                            }

                            if(_.isString(address_component.long_name)){

                                var hasSubDistrict = address_component.long_name.substring(0, 4)=="ตำบล" || address_component.long_name.substring(0, 4)=="แขวง"

                                if(hasSubDistrict){
                                    if(resultObj['address.sub_district']) return
                                    return resultObj['sub_district'] = address_component.long_name
                                }

                                var hasDistrict = address_component.long_name.substring(0, 5)=="อำเภอ" || address_component.long_name.substring(0, 3)=="เขต"

                                if(hasDistrict){
                                    if(resultObj['address.district']) return
                                    return resultObj['district'] = address_component.long_name
                                }

                            }

                            var hasProvince = _.find(address_component.types, o=>o=="administrative_area_level_1")

                            if(hasProvince){
                                if(resultObj['address.province']) return
                                return resultObj['province'] = address_component.long_name
                            }

                            var hasPostalCode = _.find(address_component.types, o=>o=="postal_code")

                            if(hasPostalCode){
                                if(resultObj['zipcode']) return
                                return resultObj['zipcode'] = address_component.long_name
                            }


                        })

                        
                    }

                }

                this.loading.dismiss()

                this.data.location=resultObj;
                this.data.latlng = latlng;

                console.log(resultObj, latlng)

            })

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
            this.event.publish("firebase:logedIn")
            
        })
    }

}
