'use strict';

const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

exports.sendNotification = functions.https.onRequest((req, res)=>{


    let targetUid = 'ocfzCGt3UJVt2gxBIRyllQst06l2'

    targetUid = req.body.targetUid

    let title = req.body.title
    let body = req.body.body

    const getDeviceTokensPromise = admin.database().ref(`/userFcm/${targetUid}`).once('value').then(snapshot=>{

        let token = snapshot.val()

        const payload = {
            notification: {
                title: title,
                body: body,
            }
        };

        admin.messaging().sendToDevice(token, payload).then(response => {
            console.log("sendToDevice", token, payload)
        });

        res.send('this is title to "' + targetUid + '"')

    })

})


// exports.sendFollowerNotification = functions.database.ref('/sendContact/{targetUid}').onWrite(event => {

//     const getDeviceTokensPromise = admin.database().ref(`/userFcm/${targetUid}`).once('value').then(snapshot=>{

//         console.log("userToken", snapshot.val())

//         let token = snapshot.val()

//         const payload = {
//             notification: {
//                 title: 'this is title!',
//                 body: `this is body.`,
//                 //icon: follower.photoURL
//             }
//         };

//         admin.messaging().sendToDevice(token, payload).then(response => {
//             console.log("sendToDevice", token, payload)
//         });

//     });

// });


// exports.sendFollowerNotification = functions.database.ref('/followers/{followedUid}/{followerUid}').onWrite(event => {
//   const followerUid = event.params.followerUid;
//   const followedUid = event.params.followedUid;
//   // If un-follow we exit the function.
//   if (!event.data.val()) {
//     return console.log('User ', followerUid, 'un-followed user', followedUid);
//   }
//   console.log('We have a new follower UID:', followerUid, 'for user:', followerUid);

//   // Get the list of device notification tokens.
//   const getDeviceTokensPromise = admin.database().ref(`/users/${followedUid}/notificationTokens`).once('value');

//   // Get the follower profile.
//   const getFollowerProfilePromise = admin.auth().getUser(followerUid);

//   return Promise.all([getDeviceTokensPromise, getFollowerProfilePromise]).then(results => {
//     const tokensSnapshot = results[0];
//     const follower = results[1];

//     // Check if there are any device tokens.
//     if (!tokensSnapshot.hasChildren()) {
//       return console.log('There are no notification tokens to send to.');
//     }
//     console.log('There are', tokensSnapshot.numChildren(), 'tokens to send notifications to.');
//     console.log('Fetched follower profile', follower);

//     // Notification details.
//     const payload = {
//       notification: {
//         title: 'You have a new follower!',
//         body: `${follower.displayName} is now following you.`,
//         icon: follower.photoURL
//       }
//     };

//     // Listing all tokens.
//     const tokens = Object.keys(tokensSnapshot.val());

//     // Send notifications to all tokens.
//     return admin.messaging().sendToDevice(tokens, payload).then(response => {
//       // For each message check if there was an error.
//       const tokensToRemove = [];
//       response.results.forEach((result, index) => {
//         const error = result.error;
//         if (error) {
//           console.error('Failure sending notification to', tokens[index], error);
//           // Cleanup the tokens who are not registered anymore.
//           if (error.code === 'messaging/invalid-registration-token' ||
//               error.code === 'messaging/registration-token-not-registered') {
//             tokensToRemove.push(tokensSnapshot.ref.child(tokens[index]).remove());
//           }
//         }
//       });
//       return Promise.all(tokensToRemove);
//     });
//   });
// });