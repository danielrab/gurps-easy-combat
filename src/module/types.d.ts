interface EncumbranceLevel {
  key: string;
  level: number;
  dodge: number;
  weight: number;
  move: number;
  currentdodge: number;
  currentflight: number;
  currentmove: number;
  currentmovedisplay: number;
}
interface RecourceTracker {
  name: string;
  value: number;
  min: number;
  max: number;
  points: number;
}
interface HitLocation {
  import: string;
  dr: string;
  equipment: string;
  penalty: string;
  roll: string;
  where: string;
}
interface Attribute {
  dr: number;
  import: number;
  value: number;
  points: number;
  dtype: 'Number';
}
interface BaseSkill {
  name: string;
  notes: string;
  pageref: string;
  contains: Record<string, never>;
  points: number;
  import: string;
  uuid: string;
  level: number;
}
interface Skill extends BaseSkill {
  type: string;
  relativelevel: string;
  parentuuid: string;
}
interface Spell extends BaseSkill {
  class: string;
  college: string;
  cost: string;
  maintain: string;
  duration: string;
  resist: string;
  casttime: string;
  difficulty: string;
  parentuuid: string;
}
interface Attack {
  name: string;
  contains: Record<string, never>;
  notes: string;
  pageref: string;
  import: string;
  damage: string;
  st: string;
  mode: string;
  level: number;
}
interface MeleeAttack extends Attack {
  weight: string;
  techlevel: string;
  cost: string;
  reach: string;
  parry: string;
  block: string;
}
interface RangedAttack extends Attack {
  acc: string;
  ammo: string;
  bulk: string;
  legalityclass: string;
  range: string;
  rcl: string;
  rof: string;
  shots: string;
}
interface Advantage {
  name: string;
  notes: string;
  pageref: string;
  contains: Record<string, Advantage>;
  points: number;
  userdesc: string;
  note: string;
  uuid: string;
  parentuuid: string;
}
interface Reaction {
  modifier: string;
  situation: string;
}
interface Note {
  notes: string;
  pageref: string;
  contains: Record<string, never>;
  uuid: string;
  parentuuid: string;
}
interface Item {
  name: string;
  notes: string;
  pageref: string;
  contains: Record<string, Item>;
  equipped: boolean;
  carried: boolean;
  count: number;
  cost: number;
  weight: number;
  location: string;
  techlevel: string;
  legalityclass: string;
  categories: string;
  costsum: number;
  weightsum: number;
  uses: string;
  maxuses: string;
  ignoreImportQty: boolean;
  uuid: string;
  parentuuid: string;
  collapsed: Record<string, never>;
}
// the way Actor.data.data looks
interface ActorDataPropertiesData {
  attributes: {
    ST: Attribute;
    DX: Attribute;
    IQ: Attribute;
    HT: Attribute;
    WILL: Attribute;
    PER: Attribute;
  };
  HP: {
    value: number;
    min: number;
    max: number;
    points: number;
  };
  FP: {
    value: number;
    min: number;
    max: number;
    points: number;
  };
  dodge: {
    value: number;
    enc_level: number;
  };
  basicmove: {
    value: string;
    points: number;
  };
  basicspeed: {
    value: string;
    points: number;
  };
  parry: number;
  currentmove: number;
  thrust: string;
  swing: string;
  frightcheck: number;
  hearing: number;
  tastesmell: number;
  vision: number;
  touch: number;
  languages: Record<string, never>;
  money: Record<string, never>;
  totalpoints: {
    attributes: number;
    ads: number;
    disads: number;
    quirks: number;
    skills: number;
    spells: number;
    total: number;
    unspent: number;
    race: number;
  };
  liftingmoving: {
    basiclift: string;
    carryonback: string;
    onehandedlift: string;
    runningshove: string;
    shiftslightly: string;
    shove: string;
    twohandedelift: string;
    twohandedlift: string;
  };
  additionalresources: {
    bodyplan: string;
    tracker: Record<string, RecourceTracker>;
    importname: string;
    importversion: string;
    importpath: string;
  };
  conditions: {
    maneuver: string;
  };
  conditionalinjury: {
    RT: {
      value: number;
      points: number;
    };
    injury: {
      severity: string;
      daystoheal: number;
    };
  };
  migrationversion: string;
  lastImport: string;
  currentdodge: number;
  skills: Record<string, Skill>;
  traits: {
    race: string;
    height: string;
    weight: string;
    age: string;
    title: string;
    player: string;
    createdon: string;
    modifiedon: string;
    religion: string;
    birthday: string;
    hand: string;
    sizemod: string;
    techlevel: string;
    appearance: string;
    gender: string;
    eyes: string;
    hair: string;
    skin: string;
  };
  melee: Record<string, MeleeAttack>;
  ranged: Record<string, RangedAttack>;
  spells: Record<string, Spell>;
  ads: Record<string, Advantage>;
  reactions: Record<string, Reaction>;
  encumbrance: Record<string, EncumbranceLevel>;
  notes: Record<string, Note>;
  equipment: {
    carried: Record<string, Item>;
    other: Record<string, Item>;
  };
  hitlocations: Record<string, HitLocation>;
  currentflight: number;
  equippedparry: number;
  equippedblock: number;
  eqtsummary: {
    eqtcost: number;
    eqtlbs: number;
    othercost: number;
  };
}

//#region registering
interface ActorDataProperties {
  type: 'character';
  data: ActorDataPropertiesData;
}
declare global {
  interface DataConfig {
    Actor: ActorDataProperties;
  }
}
//#endregion
type NestedDict<T> = Record<string, Record<string, T>>;
export { MeleeAttack, RangedAttack, NestedDict };
