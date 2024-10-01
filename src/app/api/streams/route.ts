import { prismaClient } from '@/lib/db';
// import { YT_REGEX } from '@/lib/utils';
// import { NextRequest, NextResponse } from 'next/server';
// import { z } from "zod"
// //@ts-ignore
// import youtubesearchapi from 'youtube-search-api'

// const CreateStreamSchema = z.object({
//     creatorId: z.string(),
//     url: z.string()
// })

// export async function POST(req: NextRequest) {
//     try {
//         const data = CreateStreamSchema.parse(await req.json());
//         const isYt = data.url.match(YT_REGEX)
//         if (!isYt) {

//             return NextResponse.json({
//                 message: "Unknown url"
//             }, {
//                 status: 411
//             })
//         }
//         const extractedId = data.url.split("?v=")[1]

//         const res = await youtubesearchapi.GetVideoDetails(extractedId)
//         console.log(res);

//         const Thumbnails = res.thumbnail.thumbnails
//         Thumbnails.sort((a: { width: number }, b: { width: number }) => a.width < b.width ? -1 : 1)

//         const stream = await prismaClient.space.create({
//             data: {

//                 userId: data.creatorId,
//                 url: data.url,
//                 extractedId,
//                 type: "Youtube",
//                 title: res.title ?? "Cant find video",
//                 smallImg: (Thumbnails > 1 ? Thumbnails[Thumbnails.length - 2].url : Thumbnails[Thumbnails.length - 1].url) ?? "https://media.istockphoto.com/id/1175435360/vector/music-note-icon-vector-illustration.jpg?s=612x612&w=0&k=20&c=R7s6RR849L57bv_c7jMIFRW4H87-FjLB8sqZ08mN0OU=",
//                 bigImg: Thumbnails[Thumbnails.length - 1].url ?? "https://media.istockphoto.com/id/1175435360/vector/music-note-icon-vector-illustration.jpg?s=612x612&w=0&k=20&c=R7s6RR849L57bv_c7jMIFRW4H87-FjLB8sqZ08mN0OU=",

//             }
//         });

//         return NextResponse.json({
//             message: "Added stream",
//             id: stream.id

//         })
//     } catch (e) {
//         console.log(e);

//         return NextResponse.json({
//             message: "Error while adding a stream"
//         }, {
//             status: 411
//         })
//     }
// }

// export async function GET(req: NextRequest) {
//     const creatorId = req.nextUrl.searchParams.get("creatorId");
//     const streams = await prismaClient.stream.findMany({
//         where: {
//             userId: creatorId ?? ""

//         }
//     })

//     return NextResponse.json({
//         streams
//     })
// }


import type { NextApiRequest, NextApiResponse } from 'next'


import { getSession } from 'next-auth/react'

export async function POST(req: NextApiRequest, res: NextApiResponse) {
  

  try {
    const session = await getSession({ req })
    if (!session || !session.user) {
      return res.status(401).json({ message: 'Unauthorized' })
    }

    const { name, description } = req.body

    if (!name || !description) {
      return res.status(400).json({ message: 'Name and description are required' })
    }

    const user = await prismaClient.user.findUnique({
      where: { email: session.user.email ?? "" },
    })

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    const space = await prismaClient.space.create({

      data: {
        name,
        description,
        creator: { connect: { id: user.id } },
        members: {
          create: {
            userId: user.id 
          },
        },
      },
    })

    const spaceUrl = `http://muSpace/space/${space.id}`

    const updatedSpace = await prismaClient.space.update({
      where: { id: space.id },
      data: { url: spaceUrl },
    })


    res.status(201).json(space)
  } catch (error) {
    console.error('Error creating space:', error)
    res.status(500).json({ message: 'Error creating space', error })
  }
}


export async function GET(req: NextApiRequest, res: NextApiResponse) {
  

  try {
    const { url } = req.query

    if (!url || typeof url !== 'string') {
      return res.status(400).json({ message: 'Invalid URL parameter' })
    }

    const space = await prismaClient.space.findUnique({
      where: { url },
      include: {
        creator: {
          select: {
            id: true,
            username: true,
            avatar: true,
          },
        },
        members: {
          select: {
            user: {
              select: {
                id: true,
                username: true,
                avatar: true,
              },
            },
          },
        },
        songs: {
          include: {
            addedBy: {
              select: {
                id: true,
                username: true,
              },
            },
            votes: {
              select: {
                id: true,
                voteType: true,
              },
            },
          },
        },
      },
    })

    if (!space) {
      return res.status(404).json({ message: 'Space not found' })
    }

    // If the space has a privateKey, remove it from the response
    // if (space.privateKey) {
    //   const { privateKey, ...spaceWithoutPrivateKey } = space
    //   return res.status(200).json(spaceWithoutPrivateKey)
    // }

    res.status(200).json(space)
  } catch (error) {
    console.error('Error fetching space:', error)
    //@ts-ignore
    res.status(500).json({ message: 'Error fetching space', error: error.message })
  }
}