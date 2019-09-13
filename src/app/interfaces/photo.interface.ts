
export const DEFAULT_X = 14.692293;
export const DEFAULT_Y = 121.097527;

export interface IPhoto {
  url: string; // url
  timestamp: Date;
  lng: number;
  lat: number;
  rating: number;
  id: string; // unique id
}

export class Photo implements IPhoto {
    constructor(
        public url: string = '~/assets/garbage.jpg',
        public timestamp: Date = new Date(),
        public lat: number = DEFAULT_X + (Math.random() * 0.8) - .4,
        public lng: number = DEFAULT_Y + (Math.random() * 0.8) - .4,
        public rating: number = -1,
        public id: string = ''
    ) {}
}
