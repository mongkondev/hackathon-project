import { Component } from '@angular/core';
import { NavController, AlertController, LoadingController } from 'ionic-angular';
import FirebaseLib from '../../services/firebaseLib';

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
        price : null
    }

    constructor(
        public navCtrl: NavController,
        public alertCtrl: AlertController,
        public loadCtrl: LoadingController
    ) {
        
        var user = firebase.auth().currentUser;
        if(!user){
            this.showSignInButton = true
        }

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
