import { Todo } from "@/lib/todo";
import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const title: string | undefined = req.body['title'];
    if (title == undefined) {
        res.status(400).json({});
        return;
    }
    const result = await prisma.todo.create({
        data: {
            title,
            completed: false,
        }
    });
    res.status(200).json(result);
    return;
}
