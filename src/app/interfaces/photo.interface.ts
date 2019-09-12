
export const DEFAULT_X = 14.692293;
export const DEFAULT_Y = 121.097527;

export interface IPhoto {
  url: string; // url
  timestamp: Date;
  location: [number, number];
  rating: number;
}

export class Photo implements IPhoto {
    constructor(
        public url: string = '/src/assets/garbage.jpg',
        public timestamp: Date = new Date(),
        public location: [number, number] = [DEFAULT_X + Math.random() * 0.00001, DEFAULT_Y + Math.random() * 0.00001],
        public rating: number = 0
    ) {}
}