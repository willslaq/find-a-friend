import { User } from "@prisma/client";
import { UsersRepository } from "../../repositories/users.repository";
import { UserAlreadyExistsError } from "../errors/user-already-exists-error";
import bcrypt from "bcryptjs";

interface RegisterServiceRequest {
  name: string;
  email: string;
  address: string;
  phone: string;
  password: string;
}

export interface RegisterServiceResponse {
  user: User;
}

export class RegisterService {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    name,
    email,
    password,
    address,
    phone,
  }: RegisterServiceRequest): Promise<RegisterServiceResponse> {
    const password_hash = await bcrypt.hash(password, 6);

    const userWithSameEmail = await this.usersRepository.findByEmail(email);

    if (userWithSameEmail) {
      throw new UserAlreadyExistsError();
    }

    const user = await this.usersRepository.create({
      name,
      email,
      password_hash,
      address,
      phone,
    });

    return { user };
  }
}
