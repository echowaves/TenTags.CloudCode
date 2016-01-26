var fs = require('fs');
var layer = require('cloud/layer-parse-module/layer-module.js');
var Pusher = require('cloud/pusher-parse-module/parse.js');


var layerProviderID = 'layer:///providers/dbdb9d0a-9772-11e5-bdbe-3a8a16005a40';  // Should have the format of layer:///providers/<GUID>
var layerKeyID = 'layer:///keys/b96eef8c-989a-11e5-98d4-6ac90b000c5d';   // Should have the format of layer:///keys/<GUID>
var privateKey = fs.readFileSync('cloud/layer-parse-module/keys/layer-key.js');
layer.initialize(layerProviderID, layerKeyID, privateKey);

Parse.Cloud.define("generateToken", function(request, response) {
    var currentUser = request.user;
    if (!currentUser) throw new Error('You need to be logged in!');
    var userID = currentUser.id;
    var nonce = request.params.nonce;
    if (!nonce) throw new Error('Missing nonce parameter');
        response.success(layer.layerIdentityToken(userID, nonce));
});

var HashTag = Parse.Object.extend("HashTag");

// Check if stopId is set, and enforce uniqueness based on the stopId column.
Parse.Cloud.beforeSave("HashTag", function(request, response) {
//first delete all previousy tags associated with this post
    query = new Parse.Query(HashTag);
      var tagString = request.object.get("hashTag");
      query.equalTo("hashTag", tagString);
      query.find({
        success: function(myhashtags) {
          console.log("found " + myhashtags.length + " hashTags to delete");
          Parse.Object.destroyAll(myhashtags, {
            success: function() {
                // and now intert the new tag
                    // Create a new instance of that class.
                    var hashTag = new HashTag();
                    hashTag.set("hashTag", tagString);
                    hashTag.save();
	                response.success();
            },
            error: function(error) {
                console.error("Error deleting related HashTags " + error.code + ": " + error.message);
                response.error();
            }
          });
        },
        error: function(error) {
            console.error("Error finding related hashtags " + error.code + ": " + error.message);
            response.error();
        }
      });

});

Parse.Cloud.beforeSave("Message", function(request, response) {
  var pusher = new Pusher({
    appId: '172810',
    key: 'd0d034d3f44a78bc0ba9',
    secret: '1928a21623480753e4dc',
    encrypted: true
  });
  pusher.port = 443;

  var participants = request.object.get("participants");
  var channelName = "";

  if(participants[0] > participants[1]) {
    channelName = "channel-" + participants[1] + "-" + participants[0];
  }
  channelName = "channel-" + participants[0] + "-" + participants[1];

  pusher.trigger(channelName, 'message', {
    "message": "hello world"
  });
});
