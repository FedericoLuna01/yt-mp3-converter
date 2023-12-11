import { NextResponse } from "next/server"
import ytdl from "ytdl-core"
import fs from 'fs'

export async function POST(req: Request) {
  const body = await req.json()
  const { videoUrl } = body

  try {
    // const res = ytdl(videoUrl, { filter: "audioonly" })
    // const videoInfo = await ytdl.getInfo(videoUrl)
    // const audioFormats = ytdl.filterFormats(videoInfo.formats, "audioonly")
    // const download = ytdl.downloadFromInfo(video, { filter: "audioonly" })
    // console.log(download)
    const video = await ytdl.getInfo(videoUrl)
    console.log(video.videoDetails.title)
    ytdl(videoUrl, { filter: "audioonly", quality: 'highestaudio' })
      .pipe(fs.createWriteStream(`./public/${video.videoDetails.title}.mp3`))
    return NextResponse.json({ message: "Downloaded", title: video.videoDetails.title })
  } catch (error) {
    console.log(error)
    return new NextResponse("Something went wrong", { status: 500 })
  }
}