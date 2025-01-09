import { Pet, Prisma } from "@prisma/client";

export interface PetsRepository {
  create(data: Prisma.PetCreateInput): Promise<Pet>;
  findById(id: string): Promise<Pet | null>;
  findByUserId(userId: string): Promise<Pet[] | null>;
  deleteAllByUserId(userId: string): Promise<void>;
  delete(id: string): Promise<void>;
  save(data: Pet): Promise<Pet>;
  countByUserId(userId: string): Promise<number>;
  findMany(data: FindManyParams): Promise<Pet[]>;
}

export interface FindManyParams {
  species?: string;
  breed?: string;
  min_age?: number;
  max_age?: number;
  min_weight?: number;
  max_weight?: number;
  page?: number;
  limit?: number;
  sort?: "asc" | "desc";
}
