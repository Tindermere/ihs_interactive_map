import {ConstructionColor} from "../enums/ConstructionColor";

export interface Category {
  value: string;
  color?: ConstructionColor;
}

export const categories: Category[] = [
  {value: 'Aktuell', color: ConstructionColor.white},
  {value: 'Bauwerke', color: ConstructionColor.blue},
  {value: 'Rote Liste', color: ConstructionColor.red},
  {value: 'Ferien im Baudenkmal', color: ConstructionColor.yellow},
  {value: 'Kategorie XY', color: ConstructionColor.green}
];
