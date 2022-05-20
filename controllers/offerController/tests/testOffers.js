var mongoose = require("mongoose");

var Offer = require("../../../models/Offer");
var User = require("../../../models/User");

var user1;
var user2;
var user3;
var user4;

var testOffer1;
var testOffer2;
var testOffer3;
var testOffer4;
var testOffer5;
var testOffer6;
var testOffer7;
var testOffer8;
var testOffer9;

user1 = new User({
	username: "bob1",
	password: "bob1",
});

user2 = new User({
	username: "bob2",
	password: "bob2",
});

user3 = new User({
	username: "bob3",
	password: "bob3",
});

user4 = new User({
	username: "bob4",
	password: "bob4",
});

testOffer1 = new Offer({
	numberOfPeople: 1,
	roomsWanted: 1,
	rooms: [
		{
			residenceArea: "Orchard Commons",
			generalInfo: {
				session: "Winter Session",
			},
			roomInfo: {
				room: "Connected Single Room",
				floor: 14,
				washroom: "Private",
				building: "Braeburn House",
			},
			eligibilityInfo: {
				allowedGender: "Male",
			},
		},
	],
	user: user1.id,
	additionalInformation: "contact me at my Instagram @whatever",
});

testOffer2 = new Offer({
	numberOfPeople: 1,
	roomsWanted: 1,
	rooms: [
		{
			residenceArea: "St. John's College",
			generalInfo: {
				session: "Year Round",
			},
			roomInfo: {
				room: "Single Traditional Room",
				floor: 1,
				washroom: "Private",
			},
			eligibilityInfo: {
				allowedGender: "Any",
			},
		},
	],
	user: user2.id,
	additionalInformation: "contact me at my Instagram @whatever",
});

testOffer3 = new Offer({
	numberOfPeople: 2,
	roomsWanted: 2,
	rooms: [
		{
			residenceArea: "Totem Park",
			generalInfo: {
				session: "Winter Session",
			},
			roomInfo: {
				room: "Shared Room",
				floor: 1,
				washroom: "Communal",
				building: "Nootka House",
			},
			eligibilityInfo: {
				allowedGender: "Male",
			},
		},
	],
	preference: [
		{
			residenceArea: [
				"Orchard Commons",
				"Totem Park",
				"Exchange",
				"Fraser Hall",
			],
			roomInfo: {
				floor: {
					spec: "Interval",
					criteria: [1, 9],
				},
			},
		},
	],
	user: user3.id,
	additionalInformation: "contact me at my Instagram @whatever",
});

testOffer4 = new Offer({
	numberOfPeople: 1,
	roomsWanted: 1,
	rooms: [
		{
			residenceArea: "Exchange",
			generalInfo: {
				session: "Year Round",
			},
			roomInfo: {
				room: "Studio Suite",
				floor: 10,
				washroom: "Private",
			},
			eligibilityInfo: {
				allowedGender: "Male",
			},
		},
	],
	user: user4.id,
	additionalInformation: "contact me at my Instagram @whatever",
});
testOffer5 = new Offer({
	numberOfPeople: 2,
	roomsWanted: 1,
	rooms: [
		{
			residenceArea: "Fraser Hall",
			generalInfo: {
				session: "Year Round",
			},
			roomInfo: {
				room: "Six Bedroom Suite",
				floor: 8,
				washroom: "Private",
			},
			eligibilityInfo: {
				allowedGender: "Female",
			},
		},
	],
	user: user2.id,
	additionalInformation: "contact me at my Instagram @whatever",
});
testOffer6 = new Offer({
	numberOfPeople: 1,
	roomsWanted: 1,
	rooms: [
		{
			residenceArea: "Marine Drive",
			generalInfo: {
				session: "Year Round",
			},
			roomInfo: {
				room: "Two Bedroom Suite",
				floor: 4,
				washroom: "Private",
				building: "Marine Drive 6",
			},
			eligibilityInfo: {
				allowedGender: "Female",
			},
		},
	],
	user: user3.id,
	additionalInformation: "contact me at my Instagram @whatever",
});
testOffer7 = new Offer({
	numberOfPeople: 2,
	roomsWanted: 1,
	rooms: [
		{
			residenceArea: "Ritsumeikan-UBC House",
			generalInfo: {
				session: "Winter Session",
			},
			roomInfo: {
				room: "Four Bedroom Suite",
				floor: 14,
				washroom: "Private",
			},
			eligibilityInfo: {
				allowedGender: "Any",
			},
		},
	],
	user: user4.id,
	additionalInformation: "contact me at my Instagram @whatever",
});
testOffer8 = new Offer({
	numberOfPeople: 1,
	roomsWanted: 1,
	rooms: [
		{
			residenceArea: "Thunderbird",
			generalInfo: {
				session: "Year Round",
			},
			roomInfo: {
				room: "Studio Suite",
				floor: 3,
				washroom: "Private",
				building: "1000 Block - Cassiar",
			},
			eligibilityInfo: {
				allowedGender: "Any",
			},
		},
	],
	user: user2.id,
	additionalInformation: "contact me at my Instagram @whatever",
});
testOffer9 = new Offer({
	numberOfPeople: 2,
	roomsWanted: 1,
	rooms: [
		{
			residenceArea: "Acadia Park",
			generalInfo: {
				session: "Year Round",
			},
			roomInfo: {
				room: "One Bedroom Suite",
				floor: 7,
				washroom: "Private",
				building: "Presidents Row",
			},
			eligibilityInfo: {
				allowedGender: "Any",
			},
		},
	],
	user: user3.id,
	additionalInformation: "contact me at my Instagram @whatever",
});

module.exports = {
	user1,
	user2,
	user3,
	user4,
	testOffer1,
	testOffer2,
	testOffer3,
	testOffer4,
	testOffer5,
	testOffer6,
	testOffer7,
	testOffer8,
	testOffer9,
};
