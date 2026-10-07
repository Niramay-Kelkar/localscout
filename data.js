/* LocalScout sample data — used as the fallback so the demo never depends on a live API. */
window.LS_DATA = {
  // Neighborhood anchors (lat, lng) used for travel-time estimates
  places: {
    "SoMa / Moscone Center": [37.7845, -122.4009],
    "Union Square": [37.7880, -122.4075],
    "Financial District": [37.7946, -122.3999],
    "Embarcadero / Ferry Building": [37.7956, -122.3935],
    "Mission District": [37.7599, -122.4148],
    "Hayes Valley": [37.7759, -122.4245],
    "North Beach": [37.8061, -122.4103],
    "Civic Center": [37.7799, -122.4167],
    "Marina District": [37.8030, -122.4368],
    "Dogpatch": [37.7577, -122.3880],
    "Nob Hill": [37.7930, -122.4161],
    "SoMa / South Park": [37.7816, -122.3938],
    "Fisherman's Wharf": [37.8080, -122.4177],
    "Castro": [37.7609, -122.4350]
  },

  // start/end are minutes after midnight
  events: [
    { id: "e1", name: "AI Founders Happy Hour", venue: "Rise Rooftop, SoMa", area: "SoMa / Moscone Center", start: 1020, end: 1170, cost: 0, tags: ["ai", "startups", "networking"], network: 95, conf: 90, url: "https://lu.ma/sf", why: "Dense mix of founders and engineers; free entry and a short walk from the conference district." },
    { id: "e2", name: "SF Product Managers Meetup", venue: "Union Square Loft", area: "Union Square", start: 1050, end: 1170, cost: 10, tags: ["product", "startups", "networking"], network: 82, conf: 84, url: "https://www.meetup.com/find/?location=us--ca--San%20Francisco", why: "Structured lightning talks followed by open mingling — easy to start conversations." },
    { id: "e3", name: "Climate Tech Sunset Mixer", venue: "Ferry Building Mezzanine", area: "Embarcadero / Ferry Building", start: 1080, end: 1230, cost: 15, tags: ["climate", "investors", "networking"], network: 78, conf: 80, url: "https://www.eventbrite.com/d/ca--san-francisco/climate-tech/", why: "Investors and operators in one room, with bay views and a relaxed pace." },
    { id: "e4", name: "VC & Founders Coffee Walk", venue: "Financial District Plaza", area: "Financial District", start: 960, end: 1080, cost: 0, tags: ["investors", "startups", "fintech"], network: 88, conf: 76, url: "https://lu.ma/sf", why: "Small-group walk with active seed investors; very high signal per minute." },
    { id: "e5", name: "Design Systems Open Studio", venue: "Hayes Valley Studio", area: "Hayes Valley", start: 1000, end: 1140, cost: 0, tags: ["design", "product", "art"], network: 70, conf: 82, url: "https://www.eventbrite.com/d/ca--san-francisco/design/", why: "Casual drop-in with designers sharing work; low pressure and welcoming to newcomers." },
    { id: "e6", name: "Open Source Hack Night", venue: "SoMa Co-working Space", area: "SoMa / South Park", start: 1080, end: 1260, cost: 0, tags: ["ai", "developer", "open source"], network: 75, conf: 88, url: "https://www.meetup.com/find/?location=us--ca--San%20Francisco", why: "Builders pairing on projects. Stay for 30 minutes or the whole night." },
    { id: "e7", name: "Fintech Fireside Chat", venue: "Embarcadero Center", area: "Financial District", start: 1065, end: 1155, cost: 20, tags: ["fintech", "investors", "networking"], network: 80, conf: 79, url: "https://www.eventbrite.com/d/ca--san-francisco/fintech/", why: "Panel plus reception, with a mix of bankers, founders and regulators." },
    { id: "e8", name: "Mission Art Walk & Gallery Night", venue: "Valencia Street Galleries", area: "Mission District", start: 1020, end: 1230, cost: 0, tags: ["art", "design", "music"], network: 55, conf: 85, url: "https://www.eventbrite.com/d/ca--san-francisco/art/", why: "Free, flexible and social. Better for culture than hard networking." },
    { id: "e9", name: "Startup Demo Hour", venue: "Dogpatch Innovation Lab", area: "Dogpatch", start: 1050, end: 1140, cost: 5, tags: ["startups", "ai", "product"], network: 72, conf: 74, url: "https://lu.ma/sf", why: "Six early-stage demos with time to chat with founders afterward." },
    { id: "e10", name: "Women in Tech Social", venue: "Nob Hill Lounge", area: "Nob Hill", start: 1080, end: 1200, cost: 12, tags: ["networking", "startups", "product"], network: 77, conf: 81, url: "https://www.eventbrite.com/d/ca--san-francisco/women-in-tech/", why: "Warm, well-hosted gathering with a strong community and a reliable turnout." },
    { id: "e11", name: "Live Jazz at the Wharf", venue: "Fisherman's Wharf Pier", area: "Fisherman's Wharf", start: 1080, end: 1230, cost: 0, tags: ["music", "art"], network: 35, conf: 72, url: "https://www.eventbrite.com/d/ca--san-francisco/music/", why: "A relaxing pick if you want to unwind instead of network." }
  ],

  restaurants: [
    { id: "r1", name: "Tadich Grill", area: "Financial District", cuisine: "Seafood", cost: 38, diets: ["pescatarian"], rating: 4.5, quick: 40, conf: 92, url: "https://www.google.com/maps/search/Tadich+Grill+San+Francisco", why: "Historic SF institution with quick, reliable service." },
    { id: "r2", name: "Bun Mee", area: "SoMa / Moscone Center", cuisine: "Vietnamese", cost: 16, diets: ["vegetarian", "vegan", "gluten-free"], rating: 4.3, quick: 20, conf: 90, url: "https://www.google.com/maps/search/Bun+Mee+San+Francisco", why: "Fast, fresh and cheap, with good vegetarian options." },
    { id: "r3", name: "Rich Table", area: "Hayes Valley", cuisine: "New American", cost: 62, diets: ["vegetarian"], rating: 4.7, quick: 60, conf: 88, url: "https://www.google.com/maps/search/Rich+Table+San+Francisco", why: "Michelin-recognized and creative. Best if you have time to sit." },
    { id: "r4", name: "Souvla", area: "Hayes Valley", cuisine: "Greek", cost: 18, diets: ["vegetarian", "gluten-free", "halal"], rating: 4.4, quick: 20, conf: 91, url: "https://www.google.com/maps/search/Souvla+San+Francisco", why: "Counter service in minutes and consistently well reviewed." },
    { id: "r5", name: "La Taqueria", area: "Mission District", cuisine: "Mexican", cost: 14, diets: ["gluten-free", "vegetarian"], rating: 4.6, quick: 20, conf: 93, url: "https://www.google.com/maps/search/La+Taqueria+San+Francisco", why: "Cult-favorite burritos that are cheap and quick." },
    { id: "r6", name: "Ferry Plaza Oyster Bar", area: "Embarcadero / Ferry Building", cuisine: "Seafood", cost: 44, diets: ["pescatarian", "gluten-free"], rating: 4.4, quick: 45, conf: 85, url: "https://www.google.com/maps/search/Ferry+Building+Oyster+Bar+San+Francisco", why: "Waterfront setting with fresh oysters, close to several evening events." },
    { id: "r7", name: "Greens Restaurant", area: "Marina District", cuisine: "Vegetarian", cost: 34, diets: ["vegetarian", "vegan", "gluten-free"], rating: 4.5, quick: 45, conf: 86, url: "https://www.google.com/maps/search/Greens+Restaurant+San+Francisco", why: "Top vegetarian kitchen with a bay-view dining room." },
    { id: "r8", name: "Shizen Vegan Sushi", area: "Mission District", cuisine: "Japanese", cost: 32, diets: ["vegan", "vegetarian"], rating: 4.5, quick: 40, conf: 84, url: "https://www.google.com/maps/search/Shizen+Vegan+Sushi+San+Francisco", why: "Plant-based sushi that's well suited to vegan diners." },
    { id: "r9", name: "Cotogna", area: "Financial District", cuisine: "Italian", cost: 48, diets: ["vegetarian"], rating: 4.6, quick: 50, conf: 87, url: "https://www.google.com/maps/search/Cotogna+San+Francisco", why: "Rustic Italian with a lively room, good for a proper meal." },
    { id: "r10", name: "Mixt", area: "Union Square", cuisine: "Salads & bowls", cost: 15, diets: ["vegetarian", "vegan", "gluten-free"], rating: 4.0, quick: 15, conf: 89, url: "https://www.google.com/maps/search/Mixt+Union+Square+San+Francisco", why: "Quick healthy lunch with almost no wait." },
    { id: "r11", name: "Zam Zam Halal Kitchen", area: "SoMa / South Park", cuisine: "Middle Eastern", cost: 17, diets: ["halal", "vegetarian"], rating: 4.2, quick: 20, conf: 80, url: "https://www.google.com/maps/search/halal+restaurant+South+Park+San+Francisco", why: "Reliable halal option within easy reach of South Park." },
    { id: "r12", name: "Tony's Pizza Napoletana", area: "North Beach", cuisine: "Pizza", cost: 28, diets: ["vegetarian"], rating: 4.5, quick: 40, conf: 86, url: "https://www.google.com/maps/search/Tonys+Pizza+Napoletana+San+Francisco", why: "Award-winning pizza with a relaxed vibe." },
    { id: "r13", name: "Burma Superstar", area: "Nob Hill", cuisine: "Burmese", cost: 26, diets: ["vegetarian", "vegan"], rating: 4.4, quick: 40, conf: 83, url: "https://www.google.com/maps/search/Burma+Superstar+San+Francisco", why: "Tea leaf salad and curries. Busy, but moves along." },
    { id: "r14", name: "Plant Cafe Organic", area: "Embarcadero / Ferry Building", cuisine: "Organic cafe", cost: 22, diets: ["vegetarian", "vegan", "gluten-free"], rating: 4.2, quick: 25, conf: 85, url: "https://www.google.com/maps/search/Plant+Cafe+Organic+Embarcadero+San+Francisco", why: "Healthy plates near the waterfront, ready fast." }
  ]
};
