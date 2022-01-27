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
export interface Attack {
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
export interface MeleeAttack extends Attack {
  weight: string;
  techlevel: string;
  cost: string;
  reach: string;
  parry: string;
  block: string;
}
export interface RangedAttack extends Attack {
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
export interface GurpsRoll {
  chatthing: string;
  failure: boolean;
  finaltarget: number;
  isCritFailure: boolean;
  isCritSuccess: boolean;
  isDraggable: boolean;
  loaded: boolean;
  margin: number;
  modifier: number;
  optlabel: string;
  origtarget: number;
  otf: string;
  prefix: string;
  rolls: string;
  rtotal: number;
  seventeen: boolean;
  targetmods: {
    desc: string;
    mod: string;
    modint: number;
    plus: boolean;
  }[];
  thing: string;
}

//#region registering
export interface Modifier {
  mod: number;
  desc: string;
}
interface ModifierBucket {
  addModifier(mod: number, reason: string): void;
}
declare global {
  interface Token {
    setManeuver: (maneuver?: string) => Promise<void>;
  }
}
//#endregion
type ArrayElement<ArrayType extends readonly unknown[]> = ArrayType extends readonly (infer ElementType)[]
  ? ElementType
  : never;
interface ChooserData<T extends string[]> {
  items: Record<ArrayElement<T>, string | number>[];
  headers: T;
  id: string;
}

interface PromiseFunctions<T> {
  resolve(value: T | PromiseLike<T>): void;
  reject(reason: string): void;
}
