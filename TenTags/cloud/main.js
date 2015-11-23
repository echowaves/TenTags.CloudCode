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
