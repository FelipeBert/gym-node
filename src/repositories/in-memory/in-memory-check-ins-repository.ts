import { Prisma, type CheckIn } from "@prisma/client"
import type { CheckInsRepository } from "../check-ins.repository"
import { randomUUID } from "node:crypto"
import dayjs from "dayjs"

export class InMemoryCheckInsRepository implements CheckInsRepository{
    public items: CheckIn[] = []

    async findById(id: string){
        const checkIn = this.items.find((item) => {return item.id == id})

        if(!checkIn){
            return null
        }

        return checkIn
    }

    async findByUserIdOnDate(userId: string, data: Date){
        const startOfTheDay = dayjs(data).startOf('date')
        const endOfTheDay = dayjs(data).endOf('date')

        const checkInOnSameDate = this.items.find(checkIn => {
            const checkInDate = dayjs(checkIn.created_at)
            const isOnTheSameDate = checkInDate.isAfter(startOfTheDay) && checkInDate.isBefore(endOfTheDay)

            return checkIn.user_id == userId && isOnTheSameDate
        })

        if(!checkInOnSameDate){
            return null
        }

        return checkInOnSameDate
    }

    async findManyByUserId(userId: string, page: number) {
        return this.items.filter(item => {return item.user_id == userId}).slice((page - 1) * 20, page * 20)
    }

    async countByUserId(userId: string){
        return this.items.filter(item => {return item.user_id == userId}).length
    }

    async create(data: Prisma.CheckInUncheckedCreateInput) {
        const checkIn =  {
            id: randomUUID(),
            user_id: data.user_id,
            gym_id: data.gymId,
            validate_at: data.validate_at ? new Date(data.validate_at) : null,
            created_at: new Date()
        }

        this.items.push(checkIn)

        return checkIn
    }

    async save(checkIn: CheckIn){
        const checkInIndex = this.items.findIndex(item => {return item.id == checkIn.id})

        if(checkInIndex >= 0){
            this.items[checkInIndex] = checkIn
        }

        return checkIn
    }
}