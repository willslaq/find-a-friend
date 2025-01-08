import { Pet, Prisma } from "@prisma/client";

export interface PetsRepository {
    create(data: Prisma.PetCreateInput): Promise<Pet>;
    findById(id: string): Promise<Pet | null>;
    findByUserId(userId: string): Promise<Pet[] | null>;
    deleteAllByUserId(userId: string): Promise<void>;
    delete(id: string): Promise<void>;
    save(data: Pet): Promise<Pet>;
    countByUserId(userId: string): Promise<number>;
}