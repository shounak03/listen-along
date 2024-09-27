import { prismaClient } from '@/lib/db';
import { YT_REGEX } from '@/lib/utils';
import { NextRequest, NextResponse } from 'next/server';
import { z } from "zod"
//@ts-ignore
import youtubesearchapi from 'youtube-search-api'

const CreateStreamSchema = z.object({
    creatorId: z.string(),
    url: z.string()
})

export async function POST(req: NextRequest) {
    try {
        const data = CreateStreamSchema.parse(await req.json());
        const isYt = data.url.match(YT_REGEX)
        if (!isYt) {

            return NextResponse.json({
                message: "Unknown url"
            }, {
                status: 411
            })
        }
        const extractedId = data.url.split("?v=")[1]

        const res = await youtubesearchapi.GetVideoDetails(extractedId)
        console.log(res);
        
        const Thumbnails = res.thumbnail.thumbnails
        Thumbnails.sort((a: { width: number }, b: { width: number }) => a.width < b.width ? -1 : 1)

        const stream = await prismaClient.stream.create({
            data: {

                userId: data.creatorId,
                url: data.url,
                extractedId,
                type: "Youtube",
                title: res.title ?? "Cant find video",
                smallImg: (Thumbnails > 1 ? Thumbnails[Thumbnails.length - 2].url : Thumbnails[Thumbnails.length - 1].url) ?? "https://media.istockphoto.com/id/1175435360/vector/music-note-icon-vector-illustration.jpg?s=612x612&w=0&k=20&c=R7s6RR849L57bv_c7jMIFRW4H87-FjLB8sqZ08mN0OU=",
                bigImg: Thumbnails[Thumbnails.length - 1].url ?? "https://media.istockphoto.com/id/1175435360/vector/music-note-icon-vector-illustration.jpg?s=612x612&w=0&k=20&c=R7s6RR849L57bv_c7jMIFRW4H87-FjLB8sqZ08mN0OU=",

            }
        });

        return NextResponse.json({
            message: "Added stream",
            id: stream.id

        })
    } catch (e) {
        console.log(e);
        
        return NextResponse.json({
            message: "Error while adding a stream"
        }, {
            status: 411
        })
    }
}

export async function GET(req: NextRequest) {
    const creatorId = req.nextUrl.searchParams.get("creatorId");
    const streams = await prismaClient.stream.findMany({
        where: {
            userId: creatorId ?? ""

        }
    })

    return NextResponse.json({
        streams
    })
}
