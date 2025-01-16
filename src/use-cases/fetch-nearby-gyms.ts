import type { Gym } from "@prisma/client"
import type { GymRepository } from "@/repositories/gyms-repository"

interface FetchNeabyGymsUseCaseRequest{
    userLatitude: number
    userLongitude: number
}

interface FetchNearbyGymsUseCaseResponse{
    gyms:  Gym[]
}

export class FetchNearbyGymsUseCase{
    constructor(private gymsRepository: GymRepository) {}

    async execute({ userLatitude, userLongitude }: FetchNeabyGymsUseCaseRequest): Promise<FetchNearbyGymsUseCaseResponse>{
        const gyms = await this.gymsRepository.findManyNearby({
            latitude: userLatitude,
            longitude: userLongitude
        })

        return { gyms }
    }
}