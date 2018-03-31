
// Initialize Firebase
var config = {
    apiKey: "AIzaSyCt0O9_O9BOWKoWU7bJLIqluKWw9WiJ3zg",
    authDomain: "time-train.firebaseapp.com",
    databaseURL: "https://time-train.firebaseio.com",
    projectId: "time-train",
    storageBucket: "time-train.appspot.com",
    messagingSenderId: "554050891298"
  };

firebase.initializeApp(config);

// make vars for the database and the node that the trains will be stored in
var database = firebase.database();
var trainsNode = database.ref("trains");

// declare all the variables for the user input
let trainName, destination, firstTrainTime, frequency;
 
// Run when the user presses the submit button
$("#submit-to-db").on("click", (event) => {
    event.preventDefault();

    // grab user input data
    trainName = $("#train-name-field").val().trim();
    destination = $("#destination-field").val().trim();
    firstTrainTime = $("#first-train-time-field").val().trim();
    frequency = $("#frequency-field").val().trim();

    // put user input in object then push it to the database
    let newData = {
        train_name: trainName,
        train_destination: destination,
        train_first_time: firstTrainTime,
        train_frequency: frequency
    };

    trainsNode.push(newData);

    // clear text boxes
    $("#train-name-field").val("");
    $("#destination-field").val("");
    $("#first-train-time-field").val("");
    $("#frequency-field").val("");
});
   
trainsNode.on("child_added", (childSnapshot, prevChildKey) => {

    // grabs data from database
    trainName = childSnapshot.val().train_name;
    destination = childSnapshot.val().train_destination;
    firstTrainTime = childSnapshot.val().train_first_time;
    frequency = childSnapshot.val().train_frequency;

    // First Time (pushed back 1 year to make sure it comes before current time)
    let firstTimeConverted = moment(firstTrainTime, "HH:mm").subtract(1, "years");

    // Current Time
    let currentTime = moment();

    // Difference between the times
    let diffTime = moment().diff(moment(firstTimeConverted), "minutes");

    // Time apart (remainder)
    let tRemainder = diffTime % frequency;

    // Minute Until Train
    let tMinutesTillTrain = frequency - tRemainder;

    // Next Train
    let nextTrain = moment().add(tMinutesTillTrain, "minutes");
  
    // Add each train's data into the table
    $("#train-table > tbody").append("<tr><td>" + trainName + "</td><td>" + destination + "</td><td>" + 
    frequency + "</td><td>" + moment(nextTrain).format("hh:mm") + "</td><td>" + tMinutesTillTrain + "</td></tr>");
});