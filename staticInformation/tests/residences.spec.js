const { expect } = require("chai");

var residences = require("../residences");

describe("residences test", () => {
	it("could get all buildings", (done) => {
		expect(residences.getAllBuildings()).to.eql([
			"Braeburn House",
			"Bartlett House",
			"Ross House",
			"MacKenzie House",
			"Hamber House",
			"Okanagan House",
			"Kootenay House",
			"Sherwood Lett House",
			"Tweedsmuir House",
			"Cariboo House",
			"Robson House",
			"Tec De Monterrey House",
			"Korea-UBC House",
			"Mawdsley House",
			"Kakiutl House",
			"Shushwap House",
			"q̓ələχən House",
			"həm̓ləsəm̓ House",
			"Nootka House",
			"Dene House",
			"Haida House",
			"Salish House",
			"c̓əsnaʔəm House",
			"Tallwood House",
			"Marine Drive 1",
			"Marine Drive 2",
			"Marine Drive 4",
			"Marine Drive 5",
			"Marine Drive 6",
			"Arbutus House",
			"Maple House",
			"Spruce House",
			"Cedar House",
			"Oak House",
			"q̓əlɬaləməcən leləm̓ (Orca House)",
			"qʷta:yθən leləm̓ (Sturgeon House)",
			"sɬewət̕ leləm̓ (Herring House)",
			"təməs leləm̓ (Sea Otter House)",
			"sqimək̓ʷ leləm̓ (Octopus House)",
			"1000 Block - Cassiar",
			"2000 Block - Monashee",
			"3000 Block - Selkirk",
			"4000 Block - Coast",
			"5000 Block - Hazelton",
			"Gage Apartments",
			"South Tower",
			"North Tower",
			"East Tower",
			"Presidents Row",
			"Acadia Park Townhouses",
			"Acadia House",
			"Sopron House",
			"Point Grey Apartments",
			"Spirit Park Apartments",
			"Acadia Park Highrise",
		]);

		done();
	});

	it("could get all residence names", () => {
		expect(residences.getResidenceNames()).to.eql([
			"Orchard Commons",
			"Place Vanier",
			"Totem Park",
			"Brock Commons – Tallwood House",
			"Exchange",
			"Fairview Crescent",
			"Fraser Hall",
			"Iona House",
			"Marine Drive",
			"Ponderosa Commons",
			"Ritsumeikan-UBC House",
			"tə šxʷhəleləm̓s tə k̓ʷaƛ̓kʷəʔaʔɬ",
			"Thunderbird",
			"Walter Gage",
			"Acadia Park",
			"Green College",
			"St. John's College",
		]);
	});

	it("could get all sessions of a certain residence Area", () => {
		expect(residences.getSessionsOf("Orchard Commons")).to.eql([
			"Winter Session",
		]);
		expect(residences.getSessionsOf("Thunderbird")).to.eql(["Year Round"]);
	});
});
