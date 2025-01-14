import bcrypt from "bcryptjs"
import { UserAlreadyExistsError } from "./errors/user-already-exists-error"
import type { Gym } from "@prisma/client"
import type { GymRepository } from "@/repositories/gyms-repository"

interface CreateGymUseCaseRequest{
    title: string
    description: string | null
    phone: string | null
    latitude: number
    longitude: number
}

interface CreateGymUseCaseResponse{
    gym:  Gym
}

export class CreateGymUseCase{
    constructor(private gymsRepository: GymRepository) {}

    async execute({title, description, phone, latitude, longitude}: CreateGymUseCaseRequest): Promise<CreateGymUseCaseResponse>{
        const gym = await this.gymsRepository.create({
            title,
            description,
            phone,
            latitude,
            longitude
        })

        return { gym }
    }
}