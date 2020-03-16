var db = firebase.firestore();

$("#submitForm").click(function(){
    console.log('something');
    var credential = {};

    credential.uid = firebase.auth().currentUser.uid;
    credential.base = $("#base").val();
    credential.token = $("#token").val();

    // Add a new document in collection "cities"
    db.collection("users").doc(credential.uid).update({
        AirTableBase: credential.base,
        AirTableToken: credential.token
    })
    .then(function() {
        console.log("Document successfully written!");
    })
    .catch(function(error) {
        console.error("Error writing document: ", error);
    });
});