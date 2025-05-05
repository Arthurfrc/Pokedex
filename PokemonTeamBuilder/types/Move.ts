import { PokemonType } from "@/types/Pokemon";

export type MoveCategory = 'physical' | 'special' | 'status';

export interface Move {
    id: number;
    name: string;
    type: PokemonType;
    category: MoveCategory;
    power?: number;
    accuracy?: number;
    pp: number;
    description: string;
    isHM?: boolean;
    isTM?: boolean;
    isEggMove?: boolean;
    isTutorMove?: boolean;
    isEventMove?: boolean;
    isTransferMove?: boolean;
    isOtherMove?: boolean;
    effect?: string;
    effectChance?: number;
    priority: number;
    target: string;
    makesContact: boolean;
}