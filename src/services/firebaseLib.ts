declare var firebase;

export default {

    getProducts(){
        /*var products = firebase.database().ref('products').on('value', function(snapshot) {
        updateStarCount(postElement, snapshot.val());
        });*/
    },
    addProduct(data){

        let ps = []

        var user = firebase.auth().currentUser;

        var products = firebase.database().ref('products');

        data.created_at = firebase.database.ServerValue.TIMESTAMP

        if(data.price){
            data.price = parseInt(data.price)
        }

        data.uid = user.uid

        var newProductsKey =  products.push(data).key

        var userProducts = firebase.database().ref('userProducts/'+user.uid+'/'+newProductsKey);

        userProducts.set(true)

    },
    signInGoogle(){
        var provider = new firebase.auth.GoogleAuthProvider();
        return firebase.auth().signInWithPopup(provider);
        
        /*.then(function(result) {
            // This gives you a Google Access Token. You can use it to access the Google API.
            var token = result.credential.accessToken;
            // The signed-in user info.
            var user = result.user;
            // ...
        }).catch(function(error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // The email of the user's account used.
            var email = error.email;
            // The firebase.auth.AuthCredential type that was used.
            var credential = error.credential;
            // ...
        });*/
    },
    uploadFile(files){

        let ps = []

        var storageRef = firebase.storage().ref();
        files.forEach(file => {

            var files = file.name.split(".")

            var fileType = files[files.length-1]

            var name = new Date().getTime()+"."+fileType

            var ref = storageRef.child(name);
            ps.push(ref.putString(file.data, 'data_url'))
            
            /*ref.putString(file.data, 'data_url').then((snapshot) => {
                console.log('Uploaded a data_url string!', snapshot.value());
            });*/
        });

        return Promise.all(ps)
        
    },
    countProducts(){
        return new Promise(function(resolve, reject) {
            resolve(1)
        })
    },
    updateProfile(){

        var user = firebase.auth().currentUser;

        var userRef = firebase.database().ref('userProfile/' + user.uid)

        userRef.set({
            displayName : user.displayName,
            email : user.email
        })

        const messaging = firebase.messaging();

        messaging.requestPermission()
        .then(function() {

            console.log('Notification permission granted.');
            // TODO(developer): Retrieve an Instance ID token for use with FCM.
            // ...

            messaging.getToken()
            .then(function(currentToken) {
            if (currentToken) {
                console.log('currentToken : ', currentToken);

                var userRef = firebase.database().ref('userFcm/' + user.uid)
                userRef.set(currentToken)

                //sendTokenToServer(currentToken);
                //updateUIForPushEnabled(currentToken);
            } else {
                // Show permission request.
                console.log('No Instance ID token available. Request permission to generate one.');
                // Show permission UI.
                //updateUIForPushPermissionRequired();
                //setTokenSentToServer(false);
            }
            })
            .catch(function(err) {
            console.log('An error occurred while retrieving token. ', err);
            //showToken('Error retrieving Instance ID token. ', err);
            //setTokenSentToServer(false);
            });

        })
        .catch(function(err) {
            console.log('Unable to get permission to notify.', err);
        });
        
        /*.on('value', (snapshot) => {
            if(snapshot.val()){
                this.countProducts = Object.keys(snapshot.val()).length
            }
        });*/

    }

}