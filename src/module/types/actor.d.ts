import {
  Advantage,
  Attribute,
  EncumbranceLevel,
  HitLocation,
  MeleeAttack,
  RangedAttack,
  Reaction,
  RecourceTracker,
  Skill,
  Spell,
} from './types';

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
interface ActorDataProperties {
  type: 'character';
  data: ActorDataPropertiesData;
}
declare global {
  interface DataConfig {
    Actor: ActorDataProperties;
  }
  interface Actor {
    replaceManeuver: (maneuver?: string) => Promise<void>;
    getCurrentDodge(): number;
  }
}
