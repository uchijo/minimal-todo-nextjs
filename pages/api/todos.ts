import { Todo } from "@/lib/todo";
import { getSession, withApiAuthRequired } from "@auth0/nextjs-auth0";
import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

type ResponseData = {
    todos?: Todo[];
}

export default withApiAuthRequired(async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
    const session = await getSession(req, res);
    if (session == undefined || session == null) {
        res.status(401).json({});
        return;
    }
    const user = session.user;
    if (user.sub == undefined) {
        res.status(401).json({});
        return;
    }
    const userId = user.sub;
    const rawTodos = await prisma.todo.findMany({
        where: {
            userId: userId,
        }
    });
    console.log(rawTodos);
    res.status(200).json({ todos: rawTodos });
});
