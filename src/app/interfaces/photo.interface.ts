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
        public location: [number, number] = [14.692293, 121.097527],
        public rating: number = 0
    ) {}
}