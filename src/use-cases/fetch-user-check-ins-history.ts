import type { CheckIn } from "@prisma/client";

interface FetchUserCheckInHistoryUseCaseRequest {
    userId: string
    page: number
}

interface FetchUserCheckInHistoryUseCaseResponse {
    checkIn: CheckIn[]
}

export class FetchUserCheckInHistoryUseCase{
    constructor(
        private checkInsRepository: CheckInsRepository,
    ) {}

    async execute( { userId, page }: FetchUserCheckInHistoryUseCaseRequest): Promise<FetchUserCheckInHistoryUseCaseResponse>{
        const checkIns = await this.checkInsRepository.findManyByUserId(userId, page)

        return { checkIns }
    }
}