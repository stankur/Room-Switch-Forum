var mongoose = require("mongoose");
var accomodationInfoSchemaGenerator = require("./embeddedDocuments/residenceGeneralInfo");

var RoomSchema = accomodationInfoSchemaGenerator(true);

module.exports = mongoose.model("Room", RoomSchema);
