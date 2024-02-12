import { NextResponse } from 'next/server'
import { createBoardDto } from './dto'
import { prisma } from '@/core/prisma'

export async function GET() {
  const boards = await prisma.boards.findMany()

  if (!boards || boards.length === 0) {
    return NextResponse.json({
      error: 'No boards found',
      status: 404,
    })
  }
  return NextResponse.json(boards)
}

export async function POST(req: Request) {
  const bodyRaw = await req.json()

  const bodyValidate = createBoardDto.safeParse(bodyRaw)

  console.log('bodyValidate', bodyValidate)

  if (!bodyValidate.success) {
    return NextResponse.json(bodyValidate.error.issues, {
      status: 400,
    })
  }

  const { title } = bodyValidate.data

  console.log(title)

  const newBoard = await prisma.boards.create({
    data: {
      title,
    },
  })

  return NextResponse.json(newBoard, { status: 201 })
}
