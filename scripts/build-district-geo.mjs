// Build a combined subcontinent districts GeoJSON matched to akhanda district codes.
// Reads GADM (IND, PAK, BGD, NPL, LKA) + akhanda geo-index, outputs india-districts.geojson
// with properties { districtCode, name, state, country } so the map can color by kingdom.

import fs from "fs";

const COUNTRIES = [
  { cc: "IN", code: "IND", file: "/tmp/gadm_ind2.geojson", name: "India" },
  { cc: "PK", code: "PAK", file: "/tmp/gadm_PAK.geojson", name: "Pakistan" },
  { cc: "BD", code: "BGD", file: "/tmp/gadm_BGD.geojson", name: "Bangladesh" },
  { cc: "NP", code: "NPL", file: "/tmp/gadm_NPL.geojson", name: "Nepal" },
  { cc: "LK", code: "LKA", file: "/tmp/gadm_LKA.geojson", name: "Sri Lanka" },
];

// Strip diacritics + normalize: lowercase, remove non-alphanumerics, drop "and"/"&"
// Also strip parentheticals (e.g. "Kadapa(YSR)" -> "Kadapa") and common suffixes.
function norm(s) {
  if (!s) return "";
  return s
    .replace(/\([^)]*\)/g, "") // strip parentheticals
    .replace(/（[^）]*）/g, "") // fullwidth parens
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // strip diacritics
    .toLowerCase()
    .replace(/&/g, "")
    .replace(/and/g, "") // remove "and" substring (GADM concatenates "NorthandMiddle")
    .replace(/[^a-z0-9]/g, "");
}

// More aggressive normalize for fuzzy fallback: drop common suffixes
function normAggr(s) {
  let n = norm(s);
  n = n
    .replace(/district$/, "")
    .replace(/islands?$/, "")
    .replace(/s$/, ""); // drop trailing s (plural)
  return n;
}

// Levenshtein distance for tiny typos
function lev(a, b) {
  const m = a.length, n = b.length;
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++)
    for (let j = 1; j <= n; j++)
      dp[i][j] = a[i - 1] === b[j - 1] ? dp[i - 1][j - 1] : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
  return dp[m][n];
}

// Load geo-index (country -> state -> [[code, name], ...])
const geoIndex = JSON.parse(fs.readFileSync("/home/z/my-project/public/data/geo-index.json", "utf8"));

// Build target list: [{ code, name, state, country }]
const targets = [];
for (const c of COUNTRIES) {
  const countryName = c.name;
  const states = geoIndex[countryName] || {};
  for (const [state, arr] of Object.entries(states)) {
    for (const [code, name] of arr) {
      targets.push({ code, name, state, country: c.cc });
    }
  }
}
console.log(`Targets (akhanda districts): ${targets.length}`);

// Build GADM lookup: normalized state+district -> feature, per country
const gadmByCountry = {};
for (const c of COUNTRIES) {
  const gj = JSON.parse(fs.readFileSync(c.file, "utf8"));
  const byKey = new Map(); // norm(state)+norm(district) -> feature
  const byDist = new Map(); // norm(district) -> [features] (for ambiguity)
  for (const f of gj.features) {
    const p = f.properties;
    const state = p.NAME_1 || "";
    const dist = p.NAME_2 || "";
    const key = norm(state) + "|" + norm(dist);
    if (!byKey.has(key)) byKey.set(key, f);
    if (!byDist.has(norm(dist))) byDist.set(norm(dist), []);
    byDist.get(norm(dist)).push(f);
  }
  gadmByCountry[c.cc] = { byKey, byDist, count: gj.features.length };
  console.log(`  ${c.cc}: ${gj.features.length} GADM features`);
}

// Manual override: akhanda districts that are post-2015 splits (not in GADM 4.1)
// map them to their parent district's GADM state|district key. Value = [country, parentState, parentDistrict]
const PARENT_OVERRIDE = {
  // Arunachal Pradesh 2018 splits
  "IN-KAMLE": ["IN", "Arunachal Pradesh", "Lower Subansiri"],
  "IN-KRA-DAADI": ["IN", "Arunachal Pradesh", "Kurung Kumey"],
  "IN-LEPARADA": ["IN", "Arunachal Pradesh", "Lower Subansiri"],
  "IN-LOWER-SIANG": ["IN", "Arunachal Pradesh", "West Siang"],
  "IN-PAKKE-KESSANG": ["IN", "Arunachal Pradesh", "East Kameng"],
  "IN-SHI-YOMI": ["IN", "Arunachal Pradesh", "West Siang"],
  "IN-SIANG": ["IN", "Arunachal Pradesh", "West Siang"],
  // Assam 2015 splits
  "IN-BISWANATH": ["IN", "Assam", "Sonitpur"],
  "IN-CHARAIDEO": ["IN", "Assam", "Sivasagar"],
  "IN-HOJAI": ["IN", "Assam", "Nagaon"],
  "IN-KARBI-ANGLONG-EAST": ["IN", "Assam", "Karbi Anglong"],
  "IN-KARBI-ANGLONG-WEST": ["IN", "Assam", "Karbi Anglong"],
  "IN-MAJULI": ["IN", "Assam", "Jorhat"],
  "IN-SOUTH-SALMARA-MANKACHAR": ["IN", "Assam", "Dhubri"],
  "IN-BAJALI": ["IN", "Assam", "Barpeta"],
  "IN-TAMENGLONG-3": ["IN", "Manipur", "Tamenglong"],
  // Chhattisgarh 2020 splits
  "IN-BEMETRA": ["IN", "Chhattisgarh", "Durg"],
  "IN-DAKSHIN-BASTAR-DANTEWADA": ["IN", "Chhattisgarh", "Bastar"],
  "IN-GAURELLA-PENDRA-MARWAHI": ["IN", "Chhattisgarh", "Bilaspur"],
  "IN-SUKMA": ["IN", "Chhattisgarh", "Dantewada"],
  "IN-SURAJPUR": ["IN", "Chhattisgarh", "Surguja"],
  "IN-BALOD": ["IN", "Chhattisgarh", "Durg"],
  "IN-BALODABAZAR": ["IN", "Chhattisgarh", "Raipur"],
  "IN-MUNGELI": ["IN", "Chhattisgarh", "Bilaspur"],
  "IN-MAHASAMUND": ["IN", "Chhattisgarh", "Raipur"],
  // Bihar rename
  "IN-KAIMUR-BHABUA": ["IN", "Bihar", "Kaimur"],
  // Delhi (GADM IND has only 1 Delhi feature: NCTofDelhi|West — map all 11 districts to it)
  "IN-CENTRAL": ["IN", "NCT of Delhi", "West"],
  "IN-EAST-DEL": ["IN", "NCT of Delhi", "West"],
  "IN-NEW-DELHI": ["IN", "NCT of Delhi", "West"],
  "IN-NORTH": ["IN", "NCT of Delhi", "West"],
  "IN-NORTH-DEL": ["IN", "NCT of Delhi", "West"],
  "IN-NORTH-EAST": ["IN", "NCT of Delhi", "West"],
  "IN-NORTH-WEST": ["IN", "NCT of Delhi", "West"],
  "IN-SHAHDARA": ["IN", "NCT of Delhi", "West"],
  "IN-SOUTH": ["IN", "NCT of Delhi", "West"],
  "IN-SOUTH-DEL": ["IN", "NCT of Delhi", "West"],
  "IN-SOUTH-EAST": ["IN", "NCT of Delhi", "West"],
  "IN-SOUTH-WEST": ["IN", "NCT of Delhi", "West"],
  "IN-WEST": ["IN", "NCT of Delhi", "West"],
  // Andhra renames
  "IN-KADAPA-YSR": ["IN", "Andhra Pradesh", "Y.S.R."],
  "IN-SRI-POTTI-SRIRAMULU-NELLORE": ["IN", "Andhra Pradesh", "Nellore"],
  "IN-ALLURI-SITHARAMA-RAJU": ["IN", "Andhra Pradesh", "Visakhapatnam"],
  "IN-ANAKAPALLI": ["IN", "Andhra Pradesh", "Visakhapatnam"],
  "IN-KONA-SEEMA": ["IN", "Andhra Pradesh", "East Godavari"],
  "IN-BAUDDHA-3": ["IN", "Odisha", "Boudh"],
  // Andaman
  "IN-NICOBARS": ["IN", "Andaman and Nicobar", "Nicobar Islands"],
  "IN-NORTH-MIDDLE-ANDAMAN": ["IN", "Andaman and Nicobar", "North and Middle Andaman"],
  "IN-SOUTH-ANDAMAN": ["IN", "Andaman and Nicobar", "South Andaman"],
  // Telangana 2016 districts (map to old 10 districts)
  "IN-BHADRADRI-KOTHAGUDEM": ["IN", "Telangana", "Khammam"],
  "IN-JAGTIAL": ["IN", "Telangana", "Karimnagar"],
  "IN-JANGOAN": ["IN", "Telangana", "Warangal"],
  "IN-JAYASHANKAR-BHUPALAPALLY": ["IN", "Telangana", "Warangal"],
  "IN-JOGULAMBA-GADWAL": ["IN", "Telangana", "Mahbubnagar"],
  "IN-KAMAREDDY": ["IN", "Telangana", "Nizamabad"],
  "IN-KUMARAM-BHEEM-ASIFABAD": ["IN", "Telangana", "Adilabad"],
  "IN-MAHABUBABAD": ["IN", "Telangana", "Warangal"],
  "IN-MANCHERIAL": ["IN", "Telangana", "Adilabad"],
  "IN-MULUGU": ["IN", "Telangana", "Warangal"],
  "IN-NAGARKURNOOL": ["IN", "Telangana", "Mahbubnagar"],
  "IN-NARAYANPET": ["IN", "Telangana", "Mahbubnagar"],
  "IN-PEDDAPALLI": ["IN", "Telangana", "Karimnagar"],
  "IN-SIRICILLA": ["IN", "Telangana", "Karimnagar"],
  "IN-SURYAPET": ["IN", "Telangana", "Nalgonda"],
  "IN-VIKARABAD": ["IN", "Telangana", "Medak"],
  "IN-WANAPARTHY": ["IN", "Telangana", "Mahbubnagar"],
  "IN-WARANGAL-RURAL": ["IN", "Telangana", "Warangal"],
  "IN-WARANGAL-URBAN": ["IN", "Telangana", "Warangal"],
  "IN-YADADRI-BHUVANAGIRI": ["IN", "Telangana", "Nalgonda"],
  // UP 2018 splits
  "IN-AMETHI-2": ["IN", "Uttar Pradesh", "Amethi"],
  "IN-AYODHYA": ["IN", "Uttar Pradesh", "Faizabad"],
  "IN-BHADOHI": ["IN", "Uttar Pradesh", "Varanasi"],
  "IN-HAPUR": ["IN", "Uttar Pradesh", "Ghaziabad"],
  "IN-SAMBHAL": ["IN", "Uttar Pradesh", "Moradabad"],
  "IN-SHAMLI": ["IN", "Uttar Pradesh", "Muzaffarnagar"],
  "IN-BAGHPAT-2": ["IN", "Uttar Pradesh", "Baghpat"],
  // MP 2018 splits
  "IN-AGAR": ["IN", "Madhya Pradesh", "Shajapur"],
  "IN-MAUGANJ": ["IN", "Madhya Pradesh", "Rewa"],
  "IN-NIWARI": ["IN", "Madhya Pradesh", "Tikamgarh"],
  "IN-CHACHAURA": ["IN", "Madhya Pradesh", "Guna"],
  "IN-MAIHAR": ["IN", "Madhya Pradesh", "Satna"],
  "IN-NAGDA": ["IN", "Madhya Pradesh", "Ujjain"],
  "IN-PAWAI": ["IN", "Madhya Pradesh", "Panna"],
  "IN-SINGRAULI-2": ["IN", "Madhya Pradesh", "Singrauli"],
  // Rajasthan 2023 splits
  "IN-ANUPGARH": ["IN", "Rajasthan", "Sri Ganganagar"],
  "IN-BALOTRA": ["IN", "Rajasthan", "Barmer"],
  "IN-BEAWAR": ["IN", "Rajasthan", "Ajmer"],
  "IN-DEEG-KUMHER": ["IN", "Rajasthan", "Bharatpur"],
  "IN-DESURE": ["IN", "Rajasthan", "Chittaurgarh"],
  "IN-DIDWANA-KUCHAMAN": ["IN", "Rajasthan", "Nagaur"],
  "IN-DUDU": ["IN", "Rajasthan", "Jaipur"],
  "IN-JASWANTPURA": ["IN", "Rajasthan", "Jalore"],
  "IN-JHUNJHUNU-2": ["IN", "Rajasthan", "Jhunjhunun"],
  "IN-KARAULI-2": ["IN", "Rajasthan", "Karauli"],
  "IN-KHEENVLI": ["IN", "Rajasthan", "Alwar"],
  "IN-KOTPUTLI-BAGHERA": ["IN", "Rajasthan", "Jaipur"],
  "IN-KHACHARIYAWAS": ["IN", "Rajasthan", "Sikar"],
  "IN-MALPURA": ["IN", "Rajasthan", "Tonk"],
  "IN-NEEM-KA-THANA": ["IN", "Rajasthan", "Sikar"],
  "IN-PEESANGAN": ["IN", "Rajasthan", "Ajmer"],
  "IN-PRATAPGARH-2": ["IN", "Rajasthan", "Pratapgarh"],
  "IN-SANGOD": ["IN", "Rajasthan", "Kota"],
  "IN-SAPOTRA": ["IN", "Rajasthan", "Karauli"],
  "IN-SARDARSHAHAR": ["IN", "Rajasthan", "Churu"],
  "IN-SHIVDASPURA": ["IN", "Rajasthan", "Jaipur"],
  "IN-TIJARA": ["IN", "Rajasthan", "Alwar"],
  "IN-VEERBHAN": ["IN", "Rajasthan", "Alwar"],
  // Karnataka 2020 splits
  "IN-VIJAYANAGARA": ["IN", "Karnataka", "Bellary"],
  "IN-CHIKKABALLAPUR-2": ["IN", "Karnataka", "Chikballapur"],
  // Kerala 2016 split
  "IN-KASARGOD-2": ["IN", "Kerala", "Kasargod"],
  // TN 2020 split
  "IN-TENKASI": ["IN", "Tamil Nadu", "Tirunelveli"],
  "IN-KALLAKURICHI": ["IN", "Tamil Nadu", "Viluppuram"],
  "IN-RANIPET": ["IN", "Tamil Nadu", "Vellore"],
  "IN-TIRUPATTUR": ["IN", "Tamil Nadu", "Vellore"],
  "IN-CHENNAI-2": ["IN", "Tamil Nadu", "Chennai"],
  "IN-CUDDALORE-2": ["IN", "Tamil Nadu", "Cuddalore"],
  "IN-MADURAI-2": ["IN", "Tamil Nadu", "Madurai"],
  "IN-THANJAVUR-2": ["IN", "Tamil Nadu", "Thanjavur"],
  "IN-TIRUCHIRAPPALLI-2": ["IN", "Tamil Nadu", "Tiruchirappalli"],
  "IN-TIRUNELVELI-2": ["IN", "Tamil Nadu", "Tirunelveli"],
  "IN-TIRUPPUR-2": ["IN", "Tamil Nadu", "Tiruppur"],
  "IN-TUTICORIN-2": ["IN", "Tamil Nadu", "Thoothukudi"],
  "IN-VELLORE-2": ["IN", "Tamil Nadu", "Vellore"],
  "IN-VILLUPURAM-2": ["IN", "Tamil Nadu", "Viluppuram"],
  "IN-AVANASHI-2": ["IN", "Tamil Nadu", "Coimbatore"],
  "IN-GUDIYATTAM-2": ["IN", "Tamil Nadu", "Vellore"],
  "IN-POLUR-2": ["IN", "Tamil Nadu", "Tiruvannamalai"],
  "IN-UDUMALAIPETTAI-2": ["IN", "Tamil Nadu", "Coimbatore"],
  "IN-VANIYAMBADI-2": ["IN", "Tamil Nadu", "Vellore"],
  "IN-CHENGALPATTU": ["IN", "Tamil Nadu", "Kanchipuram"],
  "IN-GUINDY": ["IN", "Tamil Nadu", "Chennai"],
  "IN-MYLAPORE": ["IN", "Tamil Nadu", "Chennai"],
  "IN-THIRUVOTTiyur": ["IN", "Tamil Nadu", "Thiruvallur"],
  // Jharkhand
  "IN-RAMGARH-2": ["IN", "Jharkhand", "Ramgarh"],
  "IN-SIMDEGA-2": ["IN", "Jharkhand", "Simdega"],
  "IN-LATEHAR-2": ["IN", "Jharkhand", "Latehar"],
  "IN-KHUNTI-2": ["IN", "Jharkhand", "Khunti"],
  "IN-SARAIKELA-KHARSAWAN-2": ["IN", "Jharkhand", "Seraikela Kharsawan"],
  "IN-GIRIDIH-2": ["IN", "Jharkhand", "Giridih"],
  "IN-DUMKA-2": ["IN", "Jharkhand", "Dumka"],
  "IN-CHATRA-2": ["IN", "Jharkhand", "Chatra"],
  "IN-JAMTARA-2": ["IN", "Jharkhand", "Jamtara"],
  "IN-PAKUR-2": ["IN", "Jharkhand", "Pakur"],
  "IN-SAHEBGANJ-2": ["IN", "Jharkhand", "Sahibganj"],
  // Odisha
  "IN-DEOGARH-2": ["IN", "Odisha", "Deogarh"],
  "IN-NABARANGPUR-2": ["IN", "Odisha", "Nabarangpur"],
  "IN-NAYAGARH-2": ["IN", "Odisha", "Nayagarh"],
  "IN-SUBARNAPUR-2": ["IN", "Odisha", "Subarnapur"],
  "IN-BAUDHA": ["IN", "Odisha", "Boudh"],
  "IN-SONEPUR": ["IN", "Odisha", "Subarnapur"],
  // Gujarat 2013
  "IN-BOTAD": ["IN", "Gujarat", "Bhavnagar"],
  "IN-CHHOTA-UDAIPURA": ["IN", "Gujarat", "Chhota Udaipur"],
  "IN-ARAVALLI": ["IN", "Gujarat", "Sabarkantha"],
  "IN-DWARKA-2": ["IN", "Gujarat", "Jamnagar"],
  "IN-GIR-SOMNATH": ["IN", "Gujarat", "Junagadh"],
  "IN-MORBI": ["IN", "Gujarat", "Rajkot"],
  "IN-MAHISAGAR": ["IN", "Gujarat", "Panch Mahals"],
  "IN-PATAN-2": ["IN", "Gujarat", "Patan"],
  // Assam extra
  "IN-BARPETA-2": ["IN", "Assam", "Barpeta"],
  "IN-DIBRUGARH-2": ["IN", "Assam", "Dibrugarh"],
  "IN-GOLAGHAT-2": ["IN", "Assam", "Golaghat"],
  "IN-JORHAT-2": ["IN", "Assam", "Jorhat"],
  "IN-KARIMGANJ-2": ["IN", "Assam", "Karimganj"],
  "IN-LAKHIMPUR-2": ["IN", "Assam", "Lakhimpur"],
  "IN-NAGAON-2": ["IN", "Assam", "Nagaon"],
  "IN-SIBSAGAR-2": ["IN", "Assam", "Sivasagar"],
  "IN-TINSUKIA-2": ["IN", "Assam", "Tinsukia"],
  // Ladakh 2019
  "IN-LEH": ["IN", "Jammu and Kashmir", "Leh"],
  "IN-KARGIL": ["IN", "Jammu and Kashmir", "Kargil"],
  // Manipur new (GADM IND Manipur has only 9 old districts)
  "IN-PHERZAWL": ["IN", "Manipur", "Churachandpur"],
  "IN-NONEY": ["IN", "Manipur", "Tamenglong"],
  "IN-TENGNOUPAL": ["IN", "Manipur", "Chandel"],
  "IN-TENGNOUPAL-2": ["IN", "Manipur", "Chandel"],
  "IN-KAMJONG": ["IN", "Manipur", "Ukhrul"],
  "IN-JIRIBAM": ["IN", "Manipur", "Imphal East"],
  "IN-KANGPOKPI": ["IN", "Manipur", "Senapati"],
  "IN-KAKCHING": ["IN", "Manipur", "Thoubal"],
  "IN-PHERZAWL-2": ["IN", "Manipur", "Churachandpur"],
  // MP West Nimar (Khargone)
  "IN-KHARGONE-WEST-NIMAR": ["IN", "Madhya Pradesh", "West Nimar"],
  "IN-EAST-NIMAR": ["IN", "Madhya Pradesh", "East Nimar"],
  // PoK / Gilgit-Baltistan districts — akhanda lists under India but GADM has them in Pakistan
  "IN-AJK": ["PK", "Azad Kashmir", "Azad Kashmir"],
  "IN-MUZAFFARABAD-AJK": ["PK", "Azad Kashmir", "Azad Kashmir"],
  "IN-ASTORE": ["PK", "Gilgit-Baltistan", "Northern Areas"],
  "IN-DIAMER": ["PK", "Gilgit-Baltistan", "Northern Areas"],
  "IN-GHANCHE": ["PK", "Gilgit-Baltistan", "Northern Areas"],
  "IN-GHIZER": ["PK", "Gilgit-Baltistan", "Northern Areas"],
  "IN-GILGIT": ["PK", "Gilgit-Baltistan", "Northern Areas"],
  "IN-HUNZA": ["PK", "Gilgit-Baltistan", "Northern Areas"],
  "IN-KHARMANG": ["PK", "Gilgit-Baltistan", "Northern Areas"],
  "IN-NAGAR": ["PK", "Gilgit-Baltistan", "Northern Areas"],
  "IN-SHIGAR": ["PK", "Gilgit-Baltistan", "Northern Areas"],
  "IN-SKARDU": ["PK", "Gilgit-Baltistan", "Northern Areas"],
  "IN-ASTORE-2": ["PK", "Gilgit-Baltistan", "Northern Areas"],
  "IN-GHANCHE-2": ["PK", "Gilgit-Baltistan", "Northern Areas"],
  "IN-GHIZER-2": ["PK", "Gilgit-Baltistan", "Northern Areas"],
  "IN-GILGIT-2": ["PK", "Gilgit-Baltistan", "Northern Areas"],
  "IN-HUNZA-2": ["PK", "Gilgit-Baltistan", "Northern Areas"],
  "IN-KHARMANG-2": ["PK", "Gilgit-Baltistan", "Northern Areas"],
  "IN-NAGAR-2": ["PK", "Gilgit-Baltistan", "Northern Areas"],
  "IN-SHIGAR-2": ["PK", "Gilgit-Baltistan", "Northern Areas"],
  "IN-SKARDU-2": ["PK", "Gilgit-Baltistan", "Northern Areas"],
  // Telangana short-name variants (akhanda has both short and long codes)
  "IN-BHADRADRI": ["IN", "Telangana", "Khammam"],
  "IN-JANGAON": ["IN", "Telangana", "Warangal"],
  "IN-JAYASHANKAR": ["IN", "Telangana", "Warangal"],
  "IN-JOGULAMBA": ["IN", "Telangana", "Mahbubnagar"],
  "IN-KOMARAM-BHEEM": ["IN", "Telangana", "Adilabad"],
  "IN-MEDCHAL": ["IN", "Telangana", "Rangareddy"],
  "IN-NIRMAL": ["IN", "Telangana", "Adilabad"],
  "IN-RAJANNA-SIRCILLA": ["IN", "Telangana", "Karimnagar"],
  "IN-SIDDIPET": ["IN", "Telangana", "Medak"],
  "IN-YADADRI-BHONGIRI": ["IN", "Telangana", "Nalgonda"],
  "IN-MEDCHAL-MALKAJGIRI": ["IN", "Telangana", "Rangareddy"],
  "IN-RANGA-REDDY-2": ["IN", "Telangana", "Rangareddy"],
  "IN-HYDERABAD-2": ["IN", "Telangana", "Hyderabad"],
  // UP renames
  "IN-JYOTIBA-PHULE-NAGAR": ["IN", "Uttar Pradesh", "Amroha"],
  "IN-KANSHIRAM-NAGAR": ["IN", "Uttar Pradesh", "Kanshiram Nagar"],
  "IN-KHERI": ["IN", "Uttar Pradesh", "Lakhimpur Kheri"],
  "IN-MAHAMAYA-NAGAR": ["IN", "Uttar Pradesh", "Mahamaya Nagar"],
  "IN-AMETHI": ["IN", "Uttar Pradesh", "Amethi"],
  "IN-SAMBHAL-2": ["IN", "Uttar Pradesh", "Moradabad"],
  // West Bengal (GADM uses "24 Parganas", "Pashchim/Purba Medinipur", "Barddhaman")
  "IN-JHARGRAM": ["IN", "West Bengal", "Medinipur"],
  "IN-KALIMPONG": ["IN", "West Bengal", "Darjiling"],
  "IN-NORTH-TWENTY-FOUR-PARGANAS": ["IN", "West Bengal", "North 24 Parganas"],
  "IN-SOUTH-TWENTY-FOUR-PARGANAS": ["IN", "West Bengal", "South 24 Parganas"],
  "IN-PASCHIM-MEDINIPUR": ["IN", "West Bengal", "Pashchim Medinipur"],
  "IN-PURBA-MEDINIPUR": ["IN", "West Bengal", "Purba Medinipur"],
  "IN-PASCHIM-BARDDHAMAN": ["IN", "West Bengal", "Barddhaman"],
  "IN-PURBA-BARDDHAMAN": ["IN", "West Bengal", "Barddhaman"],
  "IN-ALIPURDUAR-2": ["IN", "West Bengal", "Jalpaiguri"],
  "IN-KALIMPONG-2": ["IN", "West Bengal", "Darjiling"],
  // Meghalaya 2021 splits
  "IN-EAST-JAINTIA-HILLS": ["IN", "Meghalaya", "Jaintia Hills"],
  "IN-WEST-JAINTIA-HILLS": ["IN", "Meghalaya", "Jaintia Hills"],
  "IN-EAST-KHASI-HILLS": ["IN", "Meghalaya", "East Khasi Hills"],
  "IN-NORTH-GARO-HILLS": ["IN", "Meghalaya", "North Garo Hills"],
  "IN-SOUTH-GARO-HILLS": ["IN", "Meghalaya", "South Garo Hills"],
  "IN-WEST-KHASI-HILLS": ["IN", "Meghalaya", "West Khasi Hills"],
  "IN-SOUTH-WEST-GARO-HILLS": ["IN", "Meghalaya", "South Garo Hills"],
  "IN-SOUTH-WEST-KHASI-HILLS": ["IN", "Meghalaya", "East Khasi Hills"],
  "IN-EAST-JAINTIA-HILLS-2": ["IN", "Meghalaya", "Jaintia Hills"],
  "IN-WEST-JAINTIA-HILLS-2": ["IN", "Meghalaya", "Jaintia Hills"],
  // Mizoram 2019 splits
  "IN-HNAHTHIAL": ["IN", "Mizoram", "Lunglei"],
  "IN-KHAWZAWL": ["IN", "Mizoram", "Champhai"],
  "IN-SAITUAL": ["IN", "Mizoram", "Aizawl"],
  "IN-SAITUL": ["IN", "Mizoram", "Serchhip"],
  // TN extra
  "IN-CHENGALPUTTU": ["IN", "Tamil Nadu", "Kanchipuram"],
  "IN-MAYILADUTHURAI": ["IN", "Tamil Nadu", "Nagapattinam"],
  "IN-TIRUPATHUR": ["IN", "Tamil Nadu", "Vellore"],
  "IN-TIRUPATHUR-2": ["IN", "Tamil Nadu", "Sivaganga"],

  // Mizoram
  "IN-LUNGLEI-2": ["IN", "Mizoram", "Lunglei"],
  "IN-MAMIT-2": ["IN", "Mizoram", "Mamit"],
  "IN-AIZAWL-2": ["IN", "Mizoram", "Aizawl"],
  "IN-CHAMPHAI-2": ["IN", "Mizoram", "Champhai"],
  "IN-KOLASIB-2": ["IN", "Mizoram", "Kolasib"],
  "IN-LAWNGTLAI-2": ["IN", "Mizoram", "Lawngtlai"],
  "IN-SERCHHIP-2": ["IN", "Mizoram", "Serchhip"],
  // Meghalaya 2021 splits
  "IN-EAST-KHASI-HILLS-2": ["IN", "Meghalaya", "East Khasi Hills"],
  "IN-NORTH-GARO-HILLS-2": ["IN", "Meghalaya", "North Garo Hills"],
  "IN-SOUTH-GARO-HILLS-2": ["IN", "Meghalaya", "South Garo Hills"],
  "IN-WEST-JAINTIA-HILLS-2": ["IN", "Meghalaya", "West Jaintia Hills"],
  "IN-WEST-KHASI-HILLS-2": ["IN", "Meghalaya", "West Khasi Hills"],
  // Nagaland 2017
  "IN-NIULAND": ["IN", "Nagaland", "Dimapur"],
  "IN-TSEMINYU": ["IN", "Nagaland", "Kohima"],
  "IN-CHUMOUKEDIMA": ["IN", "Nagaland", "Dimapur"],
  "IN-MON-2": ["IN", "Nagaland", "Mon"],
  "IN-ZUNHEBOTO-2": ["IN", "Nagaland", "Zunheboto"],
  "IN-PUKED": ["IN", "Nagaland", "Phek"],
  "IN-SHAMATOR": ["IN", "Nagaland", "Tuensang"],
  "IN-TUIPANG": ["IN", "Nagaland", "Tuensang"],
  "IN-Longleng-2": ["IN", "Nagaland", "Longleng"],
  "IN-KIPHIRE-2": ["IN", "Nagaland", "Kiphire"],
  "IN-NOKLAK": ["IN", "Nagaland", "Tuensang"],
  "IN-WOKHA-2": ["IN", "Nagaland", "Wokha"],
  "IN-PFUTSERO": ["IN", "Nagaland", "Phek"],
  // Punjab
  "IN-FEROZEPUR-2": ["IN", "Punjab", "Firozpur"],
  "IN-MALERKOTLA": ["IN", "Punjab", "Sangrur"],
  "IN-FAZILKA": ["IN", "Punjab", "Firozpur"],
  "IN-PATHANKOT": ["IN", "Punjab", "Gurdaspur"],
  "IN-S.A.S-NAGAR": ["IN", "Punjab", "Rupnagar"],
  // Haryana 2016
  "IN-CHARKHI-DADRI": ["IN", "Haryana", "Bhiwani"],
  // HP 2016
  "IN-SOLAN-2": ["IN", "Himachal Pradesh", "Solan"],
  // Uttarakhand
  "IN-DEHRADUN-2": ["IN", "Uttarakhand", "Dehradun"],
  "IN-HARIDWAR-2": ["IN", "Uttarakhand", "Haridwar"],
  "IN-NAINITAL-2": ["IN", "Uttarakhand", "Nainital"],
  "IN-PAURI-GARHWAL-2": ["IN", "Uttarakhand", "Pauri Garhwal"],
  "ID-KUKURMARA-3": ["IN", "Assam", "Kamrup"],
};

// Match each target
const matched = new Map(); // code -> feature
const unmatched = [];
for (const t of targets) {
  const g = gadmByCountry[t.country];
  if (!g) {
    unmatched.push(t);
    continue;
  }
  // 0) Manual parent override for post-2015 splits
  let feat = null;
  const ov = PARENT_OVERRIDE[t.code];
  if (ov) {
    const og = gadmByCountry[ov[0]];
    if (og) feat = og.byKey.get(norm(ov[1]) + "|" + norm(ov[2])) || null;
  }
  const nk = norm(t.state) + "|" + norm(t.name);
  const nak = norm(t.state) + "|" + normAggr(t.name);
  // 1) state + district exact normalized
  if (!feat) feat = g.byKey.get(nk);
  // 2) aggressive state + district
  if (!feat) feat = g.byKey.get(nak);
  // 3) district-only (if unique within country)
  if (!feat) {
    const cands = g.byDist.get(norm(t.name)) || g.byDist.get(normAggr(t.name));
    if (cands && cands.length === 1) feat = cands[0];
  }
  // 4) prefix match within state (e.g. "Nicobars" vs "NicobarIslands")
  if (!feat) {
    const tn = norm(t.name);
    const tan = normAggr(t.name);
    for (const [key, f] of g.byKey) {
      const [ks, kd] = key.split("|");
      if (ks !== norm(t.state)) continue;
      if (kd.length < 4) continue;
      if (kd.startsWith(tn) || tn.startsWith(kd) || kd.startsWith(tan) || tan.startsWith(kd)) {
        feat = f;
        break;
      }
    }
  }
  // 5) Levenshtein fallback within state (tolerate 1-2 char diffs)
  if (!feat) {
    const tn = norm(t.name);
    if (tn.length >= 4) {
      let best = null, bestDist = 99;
      for (const [key, f] of g.byKey) {
        const [ks, kd] = key.split("|");
        if (ks !== norm(t.state)) continue;
        if (Math.abs(kd.length - tn.length) > 2) continue;
        const d = lev(tn, kd);
        if (d < bestDist && d <= 2) { bestDist = d; best = f; }
      }
      if (best) feat = best;
    }
  }
  if (feat) {
    matched.set(t.code, feat);
  } else {
    unmatched.push(t);
  }
}
console.log(`\nMatched: ${matched.size} / ${targets.length} (${((matched.size / targets.length) * 100).toFixed(1)}%)`);
console.log(`Unmatched: ${unmatched.length}`);

// Show unmatched sample
console.log("\nUnmatched sample (first 25):");
unmatched.slice(0, 25).forEach((t) => console.log(`  ${t.code} = "${t.name}" (${t.state}, ${t.country})`));

// Build output GeoJSON: only matched features, with akhanda code as property
const out = { type: "FeatureCollection", features: [] };
for (const [code, feat] of matched) {
  const t = targets.find((x) => x.code === code);
  out.features.push({
    type: "Feature",
    properties: {
      districtCode: code,
      name: t.name,
      state: t.state,
      country: t.country,
    },
    geometry: feat.geometry,
  });
}

const outPath = "/home/z/my-project/public/data/india-districts.geojson";
fs.writeFileSync(outPath, JSON.stringify(out));
console.log(`\nWrote ${out.features.length} features to ${outPath}`);
console.log(`File size: ${(fs.statSync(outPath).size / 1024).toFixed(0)} KB`);
