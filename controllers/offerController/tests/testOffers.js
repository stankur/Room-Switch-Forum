var Offer = require("../../../models/Offer");
var testOffer1;
var testOffer2;
var testOffer3;
var testOffer4;
var testOffer5;
var testOffer6;
var testOffer7;
var testOffer8;
var testOffer9;

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
});

module.exports = {
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
