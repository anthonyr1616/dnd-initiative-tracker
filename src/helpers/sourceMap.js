export const SOURCE_FORMAT_MAP = {
  // Core rulebooks
  PHB: "Player's Handbook (2014)",
  XPHB: "Player's Handbook (2024)",
  DMG: "Dungeon Master's Guide (2014)",
  XDMG: "Dungeon Master's Guide (2024)",
  MM: "Monster Manual (2014)",
  XMM: "Monster Manual (2024)",

  // Supplements
  XGE: "Xanathar's Guide to Everything (2017)",
  TCE: "Tasha's Cauldron of Everything (2020)",
  SCAG: "Sword Coast Adventurer's Guide (2015)",
  VGM: "Volo's Guide to Monsters (2016)",
  MTF: "Mordenkainen's Tome of Foes (2018)",
  MPMM: "Mordenkainen Presents: Monsters of the Multiverse (2022)",
  FTD: "Fizban's Treasury of Dragons (2021)",
  SCC: "Strixhaven: A Curriculum of Chaos (2021)",
  SAiS: "Spelljammer: Adventures in Space (2022)",
  BAM: "Boo's Astral Menagerie (2022)",
  MOT: "Mythic Odysseys of Theros (2020)",
  GGR: "Guildmasters' Guide to Ravnica (2018)",
  ERLW: "Eberron: Rising from the Last War (2019)",
  EGW: "Explorer's Guide to Wildemount (2020)",
  AI: "Acquisitions Incorporated (2019)",
  MaBJoV: "Minsc and Boo's Journal of Villainy (2022)",

  // Adventures
  LMoP: "Lost Mine of Phandelver (2014)",
  HotDQ: "Hoard of the Dragon Queen (2014)",
  RoT: "The Rise of Tiamat (2014)",
  PotA: "Princes of the Apocalypse (2015)",
  OotA: "Out of the Abyss (2015)",
  CoS: "Curse of Strahd (2016)",
  SKT: "Storm King's Thunder (2016)",
  TftYP: "Tales from the Yawning Portal (2017)",
  ToA: "Tomb of Annihilation (2017)",
  WDH: "Waterdeep: Dragon Heist (2018)",
  WDotMM: "Waterdeep: Dungeon of the Mad Mage (2018)",
  GoS: "Ghosts of Saltmarsh (2019)",
  BGDIA: "Baldur's Gate: Descent into Avernus (2019)",
  IDRotF: "Icewind Dale: Rime of the Frostmaiden (2020)",
  KftGV: "Keys from the Golden Vault (2023)",
  PaBTSO: "Phandelver and Below: The Shattered Obelisk (2023)",
  QftIS: "Quests from the Infinite Staircase (2024)",
  VEoR: "Vecna: Eve of Ruin (2024)",
};

export function formatSource(source = "") {
  if (!source) return "";
  return SOURCE_FORMAT_MAP[source] || source;
}
