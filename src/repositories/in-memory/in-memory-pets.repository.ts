import { Pet, Prisma } from "@prisma/client";
import { PetsRepository } from "../pets.repository";
import { randomUUID } from "crypto";
import { ResourceNotFoundError } from "@/services/errors/resource-not-found-error";

export class InMemoryPetsRepository implements PetsRepository {
    public items: Pet[] = []

    async create(data: Prisma.PetCreateInput) {
        const pet: Pet = {
            id: randomUUID(),
            age_in_month: data.age_in_month,
            breed: data.breed,
            name: data.name,
            description: data.description,
            species: data.species,
            weight: data.weight,
            created_at: new Date(),
            is_available: false,
            rescued_at: null,
            updated_at: null,
            deleted_at: null,
            user_id: null
        }

        this.items.push(pet)

        return pet
    }
    
    async findById(id: string) {
        const pet = this.items.find((item) => item.id === id)

        if (!pet) {
            return null
        }

        return pet
    }

    
    async findByUserId(userId: string) {
        const pets = this.items.filter((item) => item.user_id === userId)

        if (!pets) {
            return null
        }

        return pets
    }
    
    async delete(id: string) {
        const url = this.items.find((item) => item.id === id)

        if (!url) {
            throw new ResourceNotFoundError()
        }

        url.deleted_at = new Date()
    }

    async deleteAllByUserId(userId: string) {
        this.items.forEach((item) => {
            if (item.user_id === userId && !item.deleted_at) {
                item.deleted_at = new Date()
            }
        })
    }
    
    async save(data: Pet) {
        const index = this.items.findIndex((item) => item.id === data.id)

        if (index === -1) {
            throw new ResourceNotFoundError()
        }

        const existingPet = this.items[index]

        const updatedPet: Pet = {
            id: existingPet.id,
            age_in_month: existingPet.age_in_month,
            breed: existingPet.breed,
            name: existingPet.name,
            description: existingPet.description,
            species: existingPet.species,
            weight: existingPet.weight,
            created_at: existingPet.created_at,
            is_available: existingPet.is_available,
            rescued_at: existingPet.rescued_at,
            updated_at: new Date(),
            deleted_at: existingPet.deleted_at,
            user_id: existingPet.user_id
        }

        this.items[index] = updatedPet

        return updatedPet
    }
    
    async countByUserId(userId: string) {
        const count = this.items.filter((item) => item.user_id === userId && !item.deleted_at).length

        return count
    }

}