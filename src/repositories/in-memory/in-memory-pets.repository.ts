import { Pet, Prisma } from "@prisma/client";
import { FindManyParams, PetsRepository } from "../pets.repository";
import { randomUUID } from "crypto";
import { ResourceNotFoundError } from "@/services/errors/resource-not-found-error";

export class InMemoryPetsRepository implements PetsRepository {
  public items: Pet[] = [];

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
      user_id: null,
    };

    this.items.push(pet);

    return pet;
  }

  async findById(id: string) {
    const pet = this.items.find((item) => item.id === id);

    if (!pet) {
      return null;
    }

    return pet;
  }

  async findByUserId(userId: string) {
    const pets = this.items.filter((item) => item.user_id === userId);

    if (!pets) {
      return null;
    }

    return pets;
  }

  async findMany({
    species,
    breed,
    min_age,
    max_age,
    min_weight,
    max_weight,
    page = 1,
    limit = 20,
    sort = "asc",
  }: FindManyParams) {
    const filteredPets = this.items
      .filter((item) => {
        return (
          (!species || item.species === species) &&
          (!breed || item.breed === breed) &&
          (!min_age || item.age_in_month >= min_age) &&
          (!max_age || item.age_in_month <= max_age) &&
          (!min_weight || item.weight >= min_weight) &&
          (!max_weight || item.weight <= max_weight) &&
          item.deleted_at === null
        );
      })
      .sort((a, b) => {
        if (sort === "asc") {
          return a.created_at.getTime() - b.created_at.getTime();
        } else {
          return b.created_at.getTime() - a.created_at.getTime();
        }
      })
      .slice((page - 1) * limit, page * limit);

    return filteredPets;
  }

  async delete(id: string) {
    const url = this.items.find((item) => item.id === id);

    if (!url) {
      throw new ResourceNotFoundError();
    }

    url.deleted_at = new Date();
  }

  async deleteAllByUserId(userId: string) {
    this.items.forEach((item) => {
      if (item.user_id === userId && !item.deleted_at) {
        item.deleted_at = new Date();
      }
    });
  }

  async save(data: Pet) {
    const index = this.items.findIndex((item) => item.id === data.id);

    if (index === -1) {
      throw new ResourceNotFoundError();
    }

    const existingPet = this.items[index];

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
      user_id: existingPet.user_id,
    };

    this.items[index] = updatedPet;

    return updatedPet;
  }

  async countByUserId(userId: string) {
    const count = this.items.filter(
      (item) => item.user_id === userId && !item.deleted_at
    ).length;

    return count;
  }
}
