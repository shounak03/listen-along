import { prismaClient } from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const upvoteSchema = z.object({
    streamID: z.string(),
})

export async function  POST(req:NextRequest) {
    const session = await getServerSession();

    const user = await prismaClient.user.findUnique({
        where: {
            email: session?.user?.email ?? ""
        }
    });

    if( !user ){
        return NextResponse.json({
            message: "Unauthorized"
        },{
            status:403
        })
    }
try {
    
    const data = upvoteSchema.parse(await req.json())
    
    await prismaClient.upvote.create({
        data:{
            userId: user.id,
            streamId: data.streamID
        }
    })
} catch (error) {
    
    return NextResponse.json({
        message: "Erroe while upvoting"
    },{
        status:403
    })
}

}

