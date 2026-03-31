
// import fetch from "node-fetch";

async function getProduct(name) {
  const cleanName = name
    .replace(/\b\.(com|net|org|io|co|International)\b/gi, "")
    .replace(/,?\s*(LLC|Inc|Ltd|Corp|International|PLC|Corporation|com)\.?/gi, "")
    .replace(/,?\s*\b(incorporated|inc|llc|ltd|limited|corp|corporation|plc|pvt|private|llp|company|co|international)\b\.?$/gi,"")
    .trim(); 
  // 1️⃣ Search entity
  const searchRes = await fetch(
    `https://www.wikidata.org/w/api.php?action=wbsearchentities&search=${encodeURIComponent(cleanName)}&language=en&format=json&limit=1`
  );

  const searchData = await searchRes.json();
  if (!searchData.search.length) return null;

  const id = searchData.search[0].id;
  console.log(id)

  //P1056

  // 2️⃣ SPARQL query
  const query = `
    SELECT ?productLabel WHERE {
      wd:${id} wdt:P1830 ?product .
      SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
    }`

console.log("Above query")
  const sparqlRes = await fetch(`https://query.wikidata.org/sparql?query=${query}&format=json`, {
    method: "GET",
    headers: {
    //   "Accept": "application/sparql+json",
    //   "Content-Type": "application/sparql-query",
      "User-Agent": "DC-URL-Metadata-Bot/1.0"
    },
    // body: query
  });
  console.log("REcived Query");
  

  if (!sparqlRes.ok) {
    throw new Error(await sparqlRes.text());
  }

  const data = await sparqlRes.json(); // ✅ read ONCE
  const productList = data.results.bindings.map(e => {
    return e.productLabel.value
  }) 
  
  return productList
}

// (async () => {
//   const products = await getProduct("Amazon International, LLC");
// })();
module.exports = getProduct
