import { GurpsRoll, ModifierBucket } from './types';

declare global {
  const GURPS: {
    Maneuvers: any;
    LastActor: Actor;
    SetLastActor(actor: Actor): void;
    gurpslink(otf: string): string;
    executeOTF(otf: string): boolean;
    performAction(data: {
      type: 'damage';
      formula: string;
      damagetype: string;
      extdamagetype: string;
    }): Promise<boolean>;
    performAction(
      data: {
        type: 'attack';
        isMelee?: boolean;
        isRanged?: boolean;
        name: string;
      },
      actor: Actor,
    ): Promise<boolean>;
    performAction(
      data: {
        orig: 'Dodge';
        path: 'currentdodge';
        type: 'attribute';
      },
      actor: Actor,
    ): Promise<boolean>;
    performAction(
      data: {
        isMelee: true;
        name: string;
        type: 'weapon-block';
      },
      actor: Actor,
    ): Promise<boolean>;
    performAction(
      data: {
        isMelee: true;
        name: string;
        type: 'weapon-parry';
      },
      actor: Actor,
    ): Promise<boolean>;
    lastTargetedRoll: GurpsRoll;
    ModifierBucket: ModifierBucket;
  };
}
