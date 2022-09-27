import {ContructionImage} from "./ContructionImage";
import {ContactPerson} from "./ContactPerson";

export interface Construction {
  id: string;
  structure: string;
  city: string;
  latitude: number;
  longitude: number;
  architecture: string;
  constructionYear: number;
  link: string;
  confirmationToken: string;
  status: ConstructionStatus;
  images: ContructionImage[];
  contactPerson: ContactPerson;
  contactPersonId: string;
  description: string;
}

export enum ConstructionStatus {
  None,
  Confirmed
}

export interface CreateConstruction {
  structure: string;
  city: string;
  latitude: number;
  longitude: number;
  architecture: string;
  constructionYear: number;
  link: string;
  images: ContructionImage[];
  fullName: string;
  email: string;
  phone: string;
}
