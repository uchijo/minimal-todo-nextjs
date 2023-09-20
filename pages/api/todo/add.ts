import { getSession, withApiAuthRequired } from "@auth0/nextjs-auth0";
import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

export default withApiAuthRequired(async function handler(req: NextApiRequest, res: NextApiResponse) {
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
    const title: string | undefined = req.body['title'];
    if (title == undefined) {
        res.status(400).json({});
        return;
    }

    const result = await prisma.todo.create({
        data: {
            title,
            userId: user.sub,
        }
    });
    res.status(200).json(result);
    return;
});
