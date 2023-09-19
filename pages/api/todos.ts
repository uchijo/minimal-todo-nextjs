import { Todo } from "@/lib/todo";
import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

type ResponseData = {
    todos: Todo[];
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
    const rawTodos = await prisma.todo.findMany();
    res.status(200).json({ todos: rawTodos });
}
