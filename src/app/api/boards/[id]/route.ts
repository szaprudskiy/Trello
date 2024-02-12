import { NextResponse } from 'next/server'
import { createBoardDto } from '../dto'
import { prisma } from '@/core/prisma'

interface UpdateBoardContext {
  params: {
    id: string
  }
}

export async function PUT(req: Request, { params }: UpdateBoardContext) {
  const { id } = params
  const bodyRaw = await req.json()

  const bodyValidate = createBoardDto.safeParse(bodyRaw)

  if (!bodyValidate.success) {
    return NextResponse.json(bodyValidate.error.issues, { status: 400 })
  }

  const findBoard = await prisma.boards.findUnique({
    where: {
      id,
    },
  })

  if (!findBoard) {
    return NextResponse.json([
      {
        code: 'not_found',
        message: 'Board not found',
      },
    ])
  }

  const updatedBoard = await prisma.boards.update({
    where: {
      id,
    },
    data: bodyValidate.data,
  })

  return NextResponse.json(updatedBoard)
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params

  const findBoard = await prisma.boards.findUnique({
    where: {
      id,
    },
  })

  if (!findBoard) {
    return NextResponse.json([
      {
        code: 'not_found',
        message: 'Board not found',
      },
    ])
  }

  await prisma.boards.delete({
    where: {
      id,
    },
  })

  return NextResponse.json(
    {},
    {
      status: 200,
    }
  )
}
