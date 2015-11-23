var HashTag = Parse.Object.extend("HashTag");

// Check if stopId is set, and enforce uniqueness based on the stopId column.
Parse.Cloud.beforeSave("HashTag", function(request, response) {
  if (!request.object.get("hashTag")) {
    response.error('A hashTag must have a value.');
  } else {
    var query = new Parse.Query(HashTag);
    query.equalTo("hashTag", request.object.get("hashTag"));
    query.first({
      success: function(object) {
        if (object) {
          response.error("A HashTag with this value already exists.");
        } else {
          response.success();
        }
      },
      error: function(error) {
        response.error("Could not validate uniqueness for this HashTag object.");
      }
    });
  }
});
