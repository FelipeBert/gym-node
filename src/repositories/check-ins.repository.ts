import type { CheckIn, Prisma } from "@prisma/client";

export interface CheckInsRepository {
    findManyByUserId(userId: string, page: number): Promise<CheckIn[]>
    findById(id: string): Promise<CheckIn> | null
    findByUserIdOnDate(userId: string, data: Date): Promise<CheckIn> | null
    countByUserId(userId: string): Promise<number> 
    create(data: Prisma.CheckInUncheckedCreateInput): Promise<CheckIn>
    save(checkIn: CheckIn): Promise<CheckIn>
}