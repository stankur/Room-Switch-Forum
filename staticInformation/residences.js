var createResidence = require("./factoryFunctions/residenceCreator");

var residences = [];

residences.push(
	createResidence(
		"Orchard Commons",
		"First Year",
		["Winter Session"],
		["Connected Single Room", "Shared Room"],
		["Braeburn House", "Bartlett House"]
	)
);

residences.push(
	createResidence(
		"Place Vanier",
		"First Year",
		["Winter Session"],
		["Single Traditional Room", "Shared Room"],
		[
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
		]
	)
);

residences.push(
	createResidence(
		"Totem Park",
		"First Year",
		["Winter Session"],
		["Single Traditional Room", "Shared Room", "Connected Single Room"],
		[
			"Kakiutl House",
			"Shushwap House",
			"q̓ələχən House",
			"həm̓ləsəm̓ House",
			"Nootka House",
			"Dene House",
			"Haida House",
			"Salish House",
			"c̓əsnaʔəm House",
		]
	)
);

residences.push(
	createResidence(
		"Brock Commons – Tallwood House",
		"Upper Year",
		["Year Round"],
		["Studio Suite", "Four Bedroom Suite"],
		["Tallwood House"],
		19
	)
);

residences.push(
	createResidence(
		"Exchange",
		"Upper Year",
		["Year Round"],
		[
			"Nano Suite",
			"Studio Suite",
			"One Bedroom Suite",
			"Townhouse",
			"Two Bedroom Suite",
			"Four Bedroom Suite",
		],
		[],
		19
	)
);

residences.push(
	createResidence(
		"Fairview Crescent",
		"Upper Year",
		["Winter Session", "Summer Session"],
		["One Bedroom Suite", "Four Bedroom Suite", "Six Bedroom Suite"],
		[],
		19
	)
);

residences.push(
	createResidence(
		"Fraser Hall",
		"Upper Year",
		["Year Round"],
		["Six Bedroom Suite"],
		[],
		19
	)
);

residences.push(
	createResidence(
		"Iona House",
		"Upper Year",
		["Year Round"],
		["Studio Suite", "One Bedroom Suite", "Two Bedroom Suite"],
		[],
		19
	)
);

residences.push(
	createResidence(
		"Marine Drive",
		"Upper Year",
		["Year Round", "Winter Session"],
		[
			"Studio Suite",
			"Two Bedroom Suite",
			"Three Bedroom Suite",
			"Four Bedroom Suite",
		],
		[
			"Marine Drive 1",
			"Marine Drive 2",
			"Marine Drive 4",
			"Marine Drive 5",
			"Marine Drive 6",
		],
		19
	)
);

residences.push(
	createResidence(
		"Ponderosa Commons",
		"Upper Year",
		["Year Round", "Winter Session", "Summer Session"],
		["Studio Suite", "Two Bedroom Suite", "Four Bedroom Suite"],
		[
			"Arbutus House",
			"Maple House",
			"Spruce House",
			"Cedar House",
			"Oak House",
		],
		19
	)
);

residences.push(
	createResidence(
		"Ritsumeikan-UBC House",
		"Upper Year",
		["Winter Session"],
		["Four Bedroom Suite"],
		[],
		18
	)
);

residences.push(
	createResidence(
		"tə šxʷhəleləm̓s tə k̓ʷaƛ̓kʷəʔaʔɬ",
		"Upper Year",
		["Year Round", "Winter Session"],
		["Studio Suite", "Four Bedroom Suite"],
		[
			"q̓əlɬaləməcən leləm̓ (Orca House)",
			"qʷta:yθən leləm̓ (Sturgeon House)",
			"sɬewət̕ leləm̓ (Herring House)",
			"təməs leləm̓ (Sea Otter House)",
			"sqimək̓ʷ leləm̓ (Octopus House)",
		],
		19
	)
);

residences.push(
	createResidence(
		"Thunderbird",
		"Upper Year",
		["Year Round"],
		[
			"Studio Suite",
			"One Bedroom Suite",
			"Two Bedroom Suite",
			"Four Bedroom Suite",
		],
		[
			"1000 Block - Cassiar",
			"2000 Block - Monashee",
			"3000 Block - Selkirk",
			"4000 Block - Coast",
			"5000 Block - Hazelton",
		],
		19
	)
);

residences.push(
	createResidence(
		"Walter Gage",
		"Upper Year",
		["Winter Session"],
		["Studio Suite", "One Bedroom Suite", "Six Bedroom Suite"],
		["Gage Apartments", "South Tower", "North Tower", "East Tower"],
		19
	)
);

residences.push(
	createResidence(
		"Acadia Park",
		"Student Families",
		["Year Round"],
		[
			"One Bedroom Suite",
			"Two Bedroom Suite",
			"Three Bedroom Suite",
			"Four Bedroom Suite",
		],
		[
			"Presidents Row",
			"Acadia Park Townhouses",
			"Acadia House",
			"Sopron House",
			"Point Grey Apartments",
			"Spirit Park Apartments",
			"Acadia Park Highrise",
		]
	)
);

residences.push(
	createResidence(
		"Green College",
		"Graduate Colleges",
		["Year Round"],
		["Single Traditional Room", "Studio Suite"],
		[],
		19
	)
);

residences.push(
	createResidence(
		"St. John's College",
		"Graduate Colleges",
		["Year Round"],
		["Single Traditional Room", "One Bedroom Suite"],
		[],
		19
	)
);

var getPropertyofResidenceWithName = (residenceName, propertyName) => {
	var sampleResidence = residences[0];

	if (!Object.keys(sampleResidence).includes(propertyName)) {
		throw new Error(property + ": invalid property");
	}

	var residencesLength = residences.length;

	for (var i = 0; i < residencesLength; i++) {
		var currentResidence = residences[i];

		if (currentResidence.name === residenceName) {
			return currentResidence[propertyName];
		}
	}
};

var getResidenceNames = () => {
	var residenceNames = [];

	residences.forEach((residence) => {
		residenceNames.push(residence.name);
	});

	return residenceNames;
};

var getTypeOf = (residenceName) => {
	return getPropertyofResidenceWithName(residenceName, "type");
};

var getSessionsOf = (residenceName) => {
	return getPropertyofResidenceWithName(residenceName, "sessions");
};

var getRoomsOf = (residenceName) => {
	return getPropertyofResidenceWithName(residenceName, "rooms");
};

var getBuildingsOf = (residenceName) => {
	return getPropertyofResidenceWithName(residenceName, "buildings");
};

var getMinimumAgeOf = (residenceName) => {
	return getPropertyofResidenceWithName(residenceName, "minimumAge");
};

module.exports = {
	residences,
	getResidenceNames,
	getTypeOf,
	getSessionsOf,
	getRoomsOf,
	getBuildingsOf,
	getMinimumAgeOf,
};
