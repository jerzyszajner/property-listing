import { initializeApp, getApps } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

const PROPERTIES_COLLECTION = "properties";
const TEST_BATCH_HOST_ID = "_test_batch_300";

const CITIES = [
  "Oslo",
  "Bergen",
  "Trondheim",
  "Stavanger",
  "Tromsø",
  "Kristiansand",
  "Drammen",
  "Ålesund",
  "Bodø",
  "Lillehammer",
];

const PROPERTY_TYPES = [
  "cabin",
  "apartment",
  "house",
  "cottage",
  "villa",
  "studio",
  "loft",
];

const PLACEHOLDER_IMAGE =
  "https://res.cloudinary.com/dfprgvvey/image/upload/v1770654386/ypci7coklo4imnk7yd3e.webp";

const AMENITY_SETS = [
  ["wifi", "full_kitchen", "coffee_maker"],
  ["wifi", "washer", "bbq_grill"],
  ["wifi", "full_kitchen", "indoor_fireplace"],
  ["wifi", "coffee_maker", "full_kitchen", "washer"],
  ["wifi", "bbq_grill", "full_kitchen"],
  ["wifi", "washer", "coffee_maker"],
];

const ATMOSPHERE_TEMPLATES = [
  "Dette er et rolig {type} i {city}, ideelt for den reisende som ønsker et uforstyrret opphold. Stedet passer godt for både jobbreise og avslappende ferie.",
  "Denne {type}en i {city} gir en varm og behagelig base for korte og lengre opphold. Perfekt for gjester som ønsker komfort i stille omgivelser.",
  "Et funksjonelt og innbydende {type} i {city} med fokus på enkel komfort. Godt egnet for gjester som vil ha en praktisk hverdag på reisen.",
  "I denne {type}en i {city} får du en balansert kombinasjon av ro og tilgjengelighet. Passer for både par, venner og små familier.",
  "Et hyggelig {type} i {city} for deg som ønsker en enkel og trygg base. Atmosfaeren er rolig og passer godt for et avslappet opphold.",
];

const FACILITIES_TEMPLATES = [
  "Boligen har {amenitiesSentence} og er tilpasset et praktisk opphold. Her er det enkelt a lage mat, slappe av og holde seg tilkoblet.",
  "Du far tilgang til {amenitiesSentence}. Losningen passer godt for baade korte og lengre opphold.",
  "Fasilitetene inkluderer {amenitiesSentence}. Alt er lagt opp for en enkel og komfortabel hverdag pa reisen.",
  "Stedet tilbyr {amenitiesSentence}, slik at oppholdet blir funksjonelt og behagelig. Sarlig nyttig for gjester som blir flere dager.",
  "Praktiske fasiliteter som {amenitiesSentence} gjor boligen lett a bruke fra dag en. God balanse mellom komfort og funksjon.",
];

const LOCATION_TEMPLATES = [
  "Eiendommen ligger i {city} med god tilgang til lokale tilbud og kollektivtransport. Omradet gir et fint utgangspunkt for bade hverdag og fritid.",
  "Beliggenheten i {city} gjor det enkelt a komme seg rundt i naeromradet. Du har kort vei til butikker, servicetilbud og aktivitetstilbud.",
  "I {city} far du en rolig base med praktisk tilgang til sentrum og transport. Omradet passer godt for gjester som vil kombinere ro og tilgjengelighet.",
  "Boligen ligger sentralt i {city}, samtidig i et område med behagelig tempo. Det gir fleksibilitet for både avslapning og aktiviteter.",
  "Fra adressen i {city} er det enkelt a utforske naeromradet. Beliggenheten passer godt for gjester som vil ha en praktisk og forutsigbar reise.",
];

const AMENITY_LABELS: Record<string, string> = {
  wifi: "wifi",
  full_kitchen: "fullt kjokken",
  coffee_maker: "kaffemaskin",
  washer: "vaskemaskin",
  bbq_grill: "BBQ-grill",
  indoor_fireplace: "innendors peis",
};

/**
 * Replaces template placeholders with runtime values.
 * @param {string} template Source text template.
 * @param {Record<string, string>} values Placeholder values.
 * @return {string} Resolved template text.
 */
function fillTemplate(template: string, values: Record<string, string>): string {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => values[key] ?? "");
}

/**
 * Builds a natural-language amenities sentence from amenity keys.
 * @param {string[]} amenities Amenity keys from the seed data.
 * @return {string} Human-readable amenities sentence.
 */
function formatAmenities(amenities: string[]): string {
  const labels = amenities.map((amenity) => AMENITY_LABELS[amenity] ?? amenity);
  if (labels.length <= 1) {
    return labels[0] ?? "grunnleggende fasiliteter";
  }
  if (labels.length === 2) {
    return `${labels[0]} og ${labels[1]}`;
  }
  const leading = labels.slice(0, -1).join(", ");
  const trailing = labels[labels.length - 1];
  return `${leading} og ${trailing}`;
}

/**
 * Builds a 3-section description split with blank lines.
 * @param {number} index Zero-based listing index.
 * @param {string} type Property type.
 * @param {string} city Property city.
 * @param {string[]} amenities Amenity keys.
 * @return {string} Description in 3 sections for PropertyInfo parser.
 */
function buildDescription(
  index: number,
  type: string,
  city: string,
  amenities: string[],
): string {
  const cityLower = city.toLowerCase();
  const amenitiesSentence = formatAmenities(amenities);
  const templateValues = {
    type,
    city: cityLower,
    amenitiesSentence,
  };

  const atmosphere = fillTemplate(
    ATMOSPHERE_TEMPLATES[index % ATMOSPHERE_TEMPLATES.length],
    templateValues,
  );
  const facilities = fillTemplate(
    FACILITIES_TEMPLATES[index % FACILITIES_TEMPLATES.length],
    templateValues,
  );
  const location = fillTemplate(
    LOCATION_TEMPLATES[index % LOCATION_TEMPLATES.length],
    templateValues,
  );

  return [atmosphere, facilities, location].join("\n\n");
}

/**
 * Creates a test property object for seeding.
 * @param {number} index Zero-based index used for varied data.
 * @return {Record<string, unknown>} Property data for Firestore.
 */
function createTestProperty(index: number): Record<string, unknown> {
  const city = CITIES[index % CITIES.length];
  const type = PROPERTY_TYPES[index % PROPERTY_TYPES.length];
  const amenities = AMENITY_SETS[index % AMENITY_SETS.length];
  const description = buildDescription(index, type, city, amenities);

  return {
    hostId: TEST_BATCH_HOST_ID,
    title: `Test ${type} ${index + 1} in ${city}`,
    description,
    amenities,
    address: {
      street: `test st ${index + 1}`,
      zipCode: "0000",
      city: city.toLowerCase(),
      country: "norway",
    },
    capacity: {
      guest: 2 + (index % 6),
      bedroom: 1 + (index % 4),
    },
    price: 150 + (index * 17) % 800,
    rating: 3.5 + (index % 4) * 0.5,
    superhost: index % 7 === 0,
    image: PLACEHOLDER_IMAGE,
    host: {
      name: "test host",
      image: "",
    },
  };
}

/**
 * Seeds 300 test properties into Firestore.
 * Uses hostId "_test_batch_300" for easy deletion via delete:test script.
 */
async function seedTestProperties(): Promise<void> {
  if (!getApps().length) {
    initializeApp({ projectId: "property-listing-946a9" });
  }

  const db = getFirestore();
  const count = 300;

  console.log(`Seeding ${count} test properties (hostId: ${TEST_BATCH_HOST_ID})...`);

  const batch = db.batch();
  for (let i = 0; i < count; i++) {
    const ref = db.collection(PROPERTIES_COLLECTION).doc();
    batch.set(ref, createTestProperty(i));
  }

  await batch.commit();
  console.log(`Added ${count} test properties. Embeddings will be generated by onPropertyWrite trigger.`);
  console.log("To delete later: npm run delete:test");
}

seedTestProperties().catch((err) => {
  console.error("Seed failed:", err);
  process.exitCode = 1;
});
