/**
 * Mapping of semantic asset names to the image files downloaded from Figma.
 * Each file is stored in /public/figma/<sha1>.png as exported from the
 * Figma REST API (/v1/files/:key/images).
 */
const FIGMA = "/figma";

export const images = {
  // JAR portraits
  heroMarina: `${FIGMA}/6a4dd28bd2639c5649a28fed32eb4e9f32bff336.png`,      // 1512x982 — JAR at marina, warm dusk, main hero
  portraitTallNavy: `${FIGMA}/13c3d6c14ff943b2d1d3a1dd665411c0f9988903.png`, // 471x667 — JAR navy suit, wooden panel
  portraitDesk: `${FIGMA}/f4daa3b529cfcca49da5fa146cd257d0390fe6da.png`,    // 720x720 — JAR at dark desk, smiling
  portraitConstruction: `${FIGMA}/245a7958586eec68d23a6de49867fb79da202b23.png`, // 720x472 — JAR at construction site, sunset
  portraitBarCandid: `${FIGMA}/440d81be1465b057d848b8080bff4af683466d15.png`,    // 472x310 — JAR editorial candid
  portraitExpoTalk: `${FIGMA}/1208707a75ec0c76cbc83f9058a2c8047b01d50a.png`,     // 1336x598 — JAR speaking at EXPO

  // Larimar renders
  larimarNight: `${FIGMA}/2a956041d9a1d88c663e45cf470ec6aea26763a1.png`,   // 720x720 — Larimar night aerial, moon + pools
  larimarDay: `${FIGMA}/9842a5e291afb1292bc437d193e3bc1576816f4b.png`,     // 720x720 — Larimar day aerial overview
  larimarCommunity: `${FIGMA}/86c9030672643ffdece1d9f25a51cc21aaac4b38.png`, // 720x720 — Lakefront towers + people
  larimarTower: `${FIGMA}/5514b2c544c50f6aaa881d9a5ffddf3b05b2f563.png`,    // 348x537 — Single tower with palms
  larimarPergola: `${FIGMA}/dc899ba5b7eef85cf21ccb9f36a304ab0a11461f.png`,  // 472x310 — Outdoor pergola amenity
  larimarAmenity: `${FIGMA}/34335e50f5fc06b2057d1f4e52f07253aec68142.png`,  // 968x674 — Larimar amenity/render

  // Dominican territory / context
  dominicanBeach: `${FIGMA}/977e4c4b87db7e3381fc2fa83141af7f8d9333e6.png`,   // 472x310 — Dominican beach
  santoDomingoView: `${FIGMA}/d275a6d5f034ff427115d1f2c6d15f9b4cf9357c.png`, // 472x310 — Santo Domingo skyline
  expoStage: `${FIGMA}/635cf6d8dfc85b1fd08f804dd17a942336791e49.png`,       // 325x186 — event/expo

  // Article / news thumbnails (generic)
  thumb1: `${FIGMA}/01a9bd00db2f2956b2b42f5b1a3a237b1c14d066.png`,  // La Razón awards event
  thumb2: `${FIGMA}/c78f05b918882abc144b53be4a752236b39ec331.png`,
  thumb3: `${FIGMA}/244e6b06f73847eb58c286eb1a21c568df388c2f.png`,
  thumb4: `${FIGMA}/2974939b377198ff37c373acd6af72de5e69d161.png`,
  thumb5: `${FIGMA}/3a6ad6bc6937ea3494e1e8275c393f12ea823e0e.png`,
  thumb6: `${FIGMA}/75f215a3d5c0d40ee4e14d78af3e6af10e9a91c0.png`,

  // Sobre mí supporting portraits
  portraitA: `${FIGMA}/71f8b4e69046e311aa639c987447ee6530d7de71.png`,
  portraitB: `${FIGMA}/ca6e83893fcc8f72774d6ee3bafa24ca904bb620.png`,
  portraitC: `${FIGMA}/bfb27dfa0f8f8cf445f9dbd565904f68787a56af.png`,

  // Original brand photography (Dropbox shoot)
  portraitSmile: `/photos/portrait-smile.jpg`, // JAR smiling, charcoal suit, backlit shelf interior
  portraitEditorial: `/photos/portrait-editorial.jpg`, // JAR editorial serious, charcoal suit, same setting

  // Media outlet logos
  logoVozpopuli: `${FIGMA}/420a328ffa9d034d921cd471f410f99745662164.png`,
  logoMark: `${FIGMA}/ad0b059af848d3918f8c66b9bae6a81f4172cb22.png`,
} as const;

export type ImageKey = keyof typeof images;
