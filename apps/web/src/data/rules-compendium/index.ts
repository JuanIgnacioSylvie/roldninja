import { RULE_CATEGORIES } from "./categories";
import { COMBAT_RULES } from "./combat";
import { ACTION_RULES } from "./actions";
import { CONDITION_RULES } from "./conditions";
import { MAGIC_RULES } from "./magic";
import { CHECK_RULES } from "./checks";
import {
  MOVEMENT_RULES,
  WEAPON_RULES,
  REST_RULES,
  EXPLORATION_RULES,
  SOCIAL_RULES,
  HEROISM_RULES,
} from "./misc";
import { FEAT_ENTRIES } from "./feats";
import { FEAT_SUPPLEMENT_ENTRIES } from "./feats-supplement";
import { FEAT_REMAINING_ENTRIES } from "./feats-remaining";
import { SPECIES_ES_ENTRIES } from "./species-es";
import { BACKGROUNDS_ES_ENTRIES } from "./backgrounds-es";
import { CLASSES_ES_ENTRIES } from "./classes-es";
import { SUBCLASS_ENTRIES } from "./subclasses";
import { SUBCLASS_REMAINING_ENTRIES } from "./subclasses-remaining";
import { EQUIPMENT_ENTRIES } from "./equipment";
import { mergeCompendiumEntries } from "./merge";
import { BACKGROUND_SUPPLEMENT_ENTRIES } from "./backgrounds-supplement";
import {
  CHARACTER_CREATION_RULES,
  MULTICLASS_RULES,
  ENVIRONMENT_RULES,
} from "./character-creation";
import { MOUNTS_VEHICLES_RULES } from "./mounts-vehicles";
import { DMG_RULES } from "./dmg";
import { PHB_FEAT_ENTRIES } from "./generated/phb-feats";
import { PHB_SUBCLASS_ENTRIES } from "./generated/phb-subclasses";
import { PHB_GEAR_ENTRIES } from "./generated/phb-gear";
import { PHB_SPECIES_ENTRIES } from "./generated/phb-species";
import { PHB_BACKGROUND_ENTRIES } from "./generated/phb-backgrounds";
import { PHB_CLASS_ENTRIES } from "./generated/phb-classes";
import type { RulesCompendiumData } from "@/lib/rules-compendium";

const FEAT_RULES = mergeCompendiumEntries(
  PHB_FEAT_ENTRIES,
  FEAT_REMAINING_ENTRIES,
  FEAT_SUPPLEMENT_ENTRIES,
  FEAT_ENTRIES,
);
const SPECIES_RULES = mergeCompendiumEntries(PHB_SPECIES_ENTRIES, SPECIES_ES_ENTRIES);
const CLASS_RULES = mergeCompendiumEntries(PHB_CLASS_ENTRIES, CLASSES_ES_ENTRIES);
const SUBCLASS_RULES = mergeCompendiumEntries(
  PHB_SUBCLASS_ENTRIES,
  SUBCLASS_ENTRIES,
  SUBCLASS_REMAINING_ENTRIES,
);
const EQUIPMENT_RULES = mergeCompendiumEntries(EQUIPMENT_ENTRIES, PHB_GEAR_ENTRIES);
const BACKGROUND_RULES = mergeCompendiumEntries(
  PHB_BACKGROUND_ENTRIES,
  BACKGROUNDS_ES_ENTRIES,
  BACKGROUND_SUPPLEMENT_ENTRIES,
);

export const RULES_COMPENDIUM: RulesCompendiumData = {
  version: 3,
  categories: RULE_CATEGORIES,
  rules: [
    ...COMBAT_RULES,
    ...ACTION_RULES,
    ...CONDITION_RULES,
    ...MAGIC_RULES,
    ...CHECK_RULES,
    ...MOVEMENT_RULES,
    ...WEAPON_RULES,
    ...REST_RULES,
    ...EXPLORATION_RULES,
    ...SOCIAL_RULES,
    ...HEROISM_RULES,
    ...CHARACTER_CREATION_RULES,
    ...MULTICLASS_RULES,
    ...ENVIRONMENT_RULES,
    ...MOUNTS_VEHICLES_RULES,
    ...FEAT_RULES,
    ...SUBCLASS_RULES,
    ...EQUIPMENT_RULES,
    ...SPECIES_RULES,
    ...BACKGROUND_RULES,
    ...CLASS_RULES,
    ...DMG_RULES,
  ],
};

export function getRuleById(id: string) {
  return RULES_COMPENDIUM.rules.find((r) => r.id === id);
}

export function getRelatedRules(id: string) {
  const rule = getRuleById(id);
  if (!rule?.related?.length) return [];
  return rule.related.map(getRuleById).filter((r): r is NonNullable<typeof r> => !!r);
}
