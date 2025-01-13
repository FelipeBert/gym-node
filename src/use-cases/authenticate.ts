import type { UsersRepository } from "@/repositories/users-repository";
import { InvalidCredentiasError } from "./errors/invalid-credentials-error";
import bcrypt from "bcryptjs";
import type { User } from "@prisma/client";

interface AuthenticateUseRequest {
    email: string,
    password: string
}

interface AuthenticateUseResponse {
    user: User
}

export class AuthenticateUseCase{
    constructor(
        private userRepository: UsersRepository,
    ) {}

    async execute( { email, password }: AuthenticateUseRequest): Promise<AuthenticateUseResponse>{
        const user = await this.userRepository.findByEmail(email)

        if(!user){
            throw new InvalidCredentiasError()
        }

        const doesPasswordMatches = await bcrypt.compare(password, user.password_hash)

        if(!doesPasswordMatches){
            throw new InvalidCredentiasError()
        }

        return {user}
    }
}