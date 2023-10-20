import algolia from "algoliasearch";

// Connect and authenticate with your Algolia app
const client = algolia("UHTFD6421B", process.env.ALGOLIA_KEY);

// Create a new index and add a record
const petsIndex = client.initIndex("pets");

export { petsIndex };
