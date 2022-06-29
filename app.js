//jshint esversion:6

const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

app.use(bodyParser.urlencoded({
  extended: true
}));

app.listen(process.env.PORT || 3000, function() {
  console.log("Server is running on port 3000.");

});

app.use(express.static("public"));

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req, res) {
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;
  const data = {
    members: [{
      email_address: email,
      //email_type: "text",
      status: "subscribed",
      merge_fields: {
        FNAME: firstName,
        LNAME: lastName,
      }
    }],
  };

  const jsonData = JSON.stringify(data);
  var url = "https://us14.api.mailchimp.com/3.0/lists/af6f207694";
  const options = {
    method: "POST",
    auth: "clay:f28825d5b8204e66511bf2da0e47541d-us14",
  };

  //Access Mailchimp
  var request = https.request(url, options, function(response) {
    response.on("data", function(responseData) {
      console.log(JSON.parse(responseData));
      if (response.statusCode === 200) {
        res.sendFile(__dirname + "/success.html");
      } else {
        res.sendFile(__dirname + "/failure.html");
      }
    });
  });
  //Send data to Mailchimp
  request.write(jsonData);
  request.end();

});

app.post("/failure.html", function(req, res) {
  res.redirect("/");
});
