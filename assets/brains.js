/* global firebase */
/* global moment */
// Initialize Firebase
$(function() { //Document Ready Begin


    var config = {
        apiKey: "AIzaSyCoRgsJXAXHG6eofsBnYKPfgwQtnvYPAdE",
        authDomain: "traintime-7d544.firebaseapp.com",
        databaseURL: "https://traintime-7d544.firebaseio.com",
        projectId: "traintime-7d544",
        storageBucket: "traintime-7d544.appspot.com",
        messagingSenderId: "551517302854"
    };
    firebase.initializeApp(config);

    var database = firebase.database();
    var currentTime = moment();
    $("p").text(currentTime);


    $("#searchBTN").on("click", function(event) {
        event.preventDefault();

        var name = $("#train-input").val().trim();
        var dest = $("#destination-input").val().trim();
        var firstTime = $("#first-train-time").val().trim();
        console.log("FIRST TRAIN TIME: " + firstTime); //(It's grabbing the correct time)
        var freq = $("#train-frequency").val().trim();

        database.ref().push({
            name: name,
            dest: dest,
            firstTime: firstTime,
            freq: freq,
            timeAdded: firebase.database.ServerValue.TIMESTAMP


        });


        var form = document.getElementById("trainInfo");
        form.reset();
        alert("Train Successfully Added!");
        return false;

    });



    database.ref().on("child_added", function(snapshot) {

        // "s" is for saved as in Saved Data

        var sName = snapshot.val().name;
        var sDest = snapshot.val().dest;
        var sFirstTime = snapshot.val().firstTime;
        var sFreq = snapshot.val().freq;

        console.log("Name: " + sName);
        console.log("Destination: " + sDest);
        console.log("First Train Time: " + sFirstTime); //When it comes out of firebase, It is undefined???
        console.log("Frequency: " + sFreq);


        // sFreq = parseInt(sFreq);


        var trainTime = moment(sFirstTime, "HH:mm").subtract(1, "years");
        console.log("Train time: " + trainTime);

        var timeConvert = moment(trainTime, "HH:mm").subtract(1, "years");
        var timeDiff = moment().diff(moment(timeConvert), "minutes");
        console.log("Difference in time: " + timeDiff);

        var timeRemaining = timeDiff % sFreq;
        console.log("Time remaining: " + timeRemaining);

        var minsAway = sFreq - timeRemaining;
        console.log("Minutes until next train: " + minsAway);

        var nextTrain = moment().add(minsAway, "minutes").format("HH:mm A");
        // console.log("Arrival Time: " + nextTrain.format("HH:mm A"));




        var newRow = $("<tr>");

        newRow.append($("<td>").text(sName))
            .append($("<td>").text(sDest))
            .append($("<td>").text(sFreq))
            .append($("<td>").text(nextTrain))
            .append($("<td>").text(minsAway));



        $("#inputValues").prepend(newRow);


    });


}); //Document Ready End