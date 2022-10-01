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
  category: string;
}

export enum ConstructionStatus {
  None,
  Confirmed
}

export interface CreateConstruction {
  category: string;
  structure: string;
  city: string;
  latitude: number;
  longitude: number;
  architecture: string;
  constructionYear: number;
  link: string;
  images: FileList;
  fullName: string;
  email: string;
  phone: string;
  description: string;
}
