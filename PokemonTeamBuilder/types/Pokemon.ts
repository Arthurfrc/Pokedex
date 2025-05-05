export type PokemonType =
    | 'normal' | 'fire' | 'water' | 'electric' | 'grass' | 'ice'
    | 'fighting' | 'poison' | 'ground' | 'flying' | 'psychic'
    | 'bug' | 'rock' | 'ghost' | 'dragon' | 'dark' | 'steel' | 'fairy';

export type PokemonForm =
    | 'normal' | 'shiny' | 'alola' | 'galar' | 'hisui' | 'paldea'
    | 'mega' | 'gigantomax' | 'dynamax';

export type MoveLearnMethod =
    | 'level-up' | 'tm' | 'hm' | 'egg' | 'tutor' | 'event' | 'transfer'
    | 'other'; // para métodos especiais

/**
 * Interface que define a estrutura de um movimento
 */
export interface Move {
    id: number;
    name: string;
    type: string;
    category: 'Physical' | 'Special' | 'Status';
    power?: number;
    accuracy?: number;
    pp: number;
    description: string;
}

/**
 * Interface que representa as diferentes variações de sprites de um Pokémon
 */
export interface PokemonSprites {
    default: string;         // normal
    animated?: string;       // normal animado
    shiny?: string;          // shiny normal
    animatedShiny?: string;  // shiny animado
}

export interface LearnedMove {
    move: Move;
    method: MoveLearnMethod;
    level?: number; // só se for por level-up
    tmNumber?: string; // se for TM/HM, pode ser útil
    versionGroup?: string; // para diferenciar gerações
}


export interface PokemonFormData {
    name: string; // Ex: "Mega X"
    sprites: PokemonSprites;
    stats: {
        hp: number;
        attack: number;
        defense: number;
        specialAttack: number;
        specialDefense: number;
        speed: number;
    };
    // ...outros campos específicos da forma
}
/**
 * Interface que define a estrutura de um Pokémon com múltiplos sprites
 */
export interface Pokemon {
    id: number;
    name: string;
    types: string[];
    sprites: PokemonSprites;
    sprite?: string;
    forms?: PokemonFormData[]; // Outras formas (mega, gmax, etc)
    /** Movimentos aprendidos pelo Pokémon */
    moves: LearnedMove[];
}

export interface TeamMember {
    pokemon: Pokemon;
    selectedForm: PokemonForm;
    nickname?: string;
    moves: string[]; // IDs dos 4 movimentos selecionados
    item?: string;
}

export interface Team {
    id: string;
    name: string;
    members: TeamMember[];
}