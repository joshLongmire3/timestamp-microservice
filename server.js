//server.js
//forked from ltegman/timestamp-microservice-api

//the path module is required to get the 
//name of the current dir, if want index.html
//to be served will need this
var path = require('path');

//the moment library is best for 
//parsing times and dates
//(use as a wrapper to js's built
//  in Date() module     )
//npm install moment --save
//the save fixes ur package.json for u
const moment = require('moment');

//it is an express app after all !
const express = require('express');
const app = express();

//makes the response layout 
//a little nicer
app.set('json spaces', 2);

//get the port the app starts up serving on...
// process.env.PORT lets the port be set by Heroku/c9:
//.set('port', (process.env.PORT || 5000)); <- one way
//or can do var port = ...
//https://docs.c9.io/docs/run-an-application
//NOTE: Currently $PORT defaults to 8080 but this may change in the future!
var port = process.env.PORT || 8080;

//if you want an index.html page to be served when there are
//no routes passed by the request (sent to '/' only or nada)
//add the path to the dir with index.html file into express.static()
app.use(express.static(path.join(__dirname, 'public')));

//if client sends a get request to /'anything' but /index.html we will fall into
//this tub and parse what they sent
app.get('/:timestamp', function (request, response) {
  
  //It's important that you set the Content-Type header to application/json, too:
  //http://stackoverflow.com/questions/19696240/proper-way-to-return-json-using-node-or-express
  //http://stackoverflow.com/questions/23751914/how-can-i-set-response-header-on-express-js-assets
  response.set('Content-Type', 'application/json');
  
  //time must exactly match the format: fullNameMonth digitsOfDay, fourDigitYear
  //to be able to pass the first if() check....(January 10, 1992)
  //we make it strict in this way by adding true as 3rd param
  //must use D not DD else it will fail on single digit dates!!!!
  //ie:  January 1, 2012 will fail with DD
  var time = moment(request.params.timestamp, 'MMMM D, YYYY', true);
  
  //if the format didn' match above exactly 
  if (!time.isValid()){
    //https://coderwall.com/p/exrbag/use-momentjs-to-parse-unix-timestamps
    //using moment.unix() tells moment we are making a unix timestamp...
    //if what we pass in doesn't match being a timestamp exactly this 
    //will be invalid (strictness invloked with .unix() function in momentjs)
    time = moment.unix(request.params.timestamp);
  }
  
  
  //Note:express's response.json({ a: 1 }); sets the 
  //type properly (json.stringify() is called) for us!
  
  //if it wasn't a valid unix timestamp either
  //then the passed param wasn't a valid timestamp for
  //our microservice
  if (!time.isValid()) {
    //so we return a json object to the client
    //with the values of null
    //need a return statement here to fix
    //Error: Cant set headers after they are sent
    return response.json({
      'humanReadable': null,
      'unix': null
    });
    //otherwise as we are in nodejs async land we 
    //call this first response.json then while this
    //one is going we move on and call the 2nd as well!!
    //it still workd before tho b/c the first call would finish before
    //the second leaving the second trying to go after the first went 
    //and the 2nd the errs out with: err: can't set .....
  }
  
  //if here we have a valid timestamp
  //and can set the fields using moment magic
  //to easily format the fields
  response.json({
    'humanReadable': time.format('MMMM DD, YYYY'),
    'unix': time.format('X')
  });
  
});


//app.listen(app.get('port'), () => {
  //.log(`Server listening on port ${app.get('port')}`);
//});
//or 
//original express example version:
//app.listen(port, function () {
//  console.log('Example app listening on port' + port);
//});

//make sure the app is running and listening for connections
//on the proper port!
app.listen(port, function () {
  console.log('timestamp microservice listening on port ' + port);
});