import { RegisterService } from "./register.service";
import { describe, beforeEach, it, expect } from "vitest";
import { UserAlreadyExistsError } from "../errors/user-already-exists-error";
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users.repository";
import bcrypt from "bcryptjs";

let usersRepository: InMemoryUsersRepository;
let registerService: RegisterService;

describe("Register Service", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    registerService = new RegisterService(usersRepository);
  });

  it("should be able to register", async () => {
    const { user } = await registerService.execute({
      name: "John Doe",
      email: "johndoe@gmail.com",
      address: "123 Main St, Anytown, USA",
      phone: "123-456-7890",
      password: "123456",
    });

    expect(user.id).toEqual(expect.any(String));
  });

  it("should hash user password upon registration", async () => {
    const { user } = await registerService.execute({
      name: "John Doe",
      email: "johndoe@gmail.com",
      address: "123 Main St, Anytown, USA",
      phone: "123-456-7890",
      password: "123456",
    });

    const isPasswordCorrectlyHashed = await bcrypt.compare(
      "123456",
      user.password_hash
    );

    expect(isPasswordCorrectlyHashed).toBe(true);
  });

  it("should not be able to register with same email", async () => {
    const email = "johndoe@gmail.com";

    await registerService.execute({
      name: "John Doe",
      email: email,
      address: "123 Main St, Anytown, USA",
      phone: "123-456-7890",
      password: "123456",
    });

    await expect(() =>
      registerService.execute({
        name: "John Doe",
        email: email,
        address: "123 Main St, Anytown, USA",
        phone: "123-456-7890",
        password: "123456",
      })
    ).rejects.toBeInstanceOf(UserAlreadyExistsError);
  });
});
