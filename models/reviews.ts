import { IUser } from './user';
import { IBase } from "./base";

export type IReviews = IBase & {
  title: string;
  comment: string;
  rating: number;
  user: IUser;
  isRecommended: boolean;
  isAnonymous: boolean;
  isFeatured: boolean;
  status: string;
  reviewReply?: {
    comment: string;
    createdAt: Date;
  }
};

export type IReviewCount = {
  1: number;
  2: number;
  3: number;
  4: number;
  5: number;
  average: number;
}