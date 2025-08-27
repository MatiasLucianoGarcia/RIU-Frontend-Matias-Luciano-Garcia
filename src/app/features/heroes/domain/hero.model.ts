export type HeroId = string;

export enum Universe {
    MARVEL = 'MARVEL',
    DC = 'DC',
    OTHER = 'OTHER'
}

export interface Hero {
    id: HeroId;
    name: string;
    powers?: string;
    universe: Universe;
    image?: string;
    alterEgo?: string;
    createdAt: string; 
    updatedAt: string;
}