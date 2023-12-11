'use client'

import * as z from "zod"
import axios from 'axios'
import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "./ui/form"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import { ArrowDownToLine } from "lucide-react"

const formSchema = z.object({
  videoUrl: z.string().min(2).max(100),
})

const VideoForm = () => {
  const [downloads, setDownloads] = useState<string[]>()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      videoUrl: "",
    },
  })

  async function onSubmit(data: z.infer<typeof formSchema>) {
    const res = await axios.post('/api/download', data)
    if (!downloads) {
      return setDownloads([res.data.title])
    }
    const values = downloads.concat(res.data.title)
    setDownloads(values)
    form.reset()
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="pb-4">
          <FormField
            control={form.control}
            name="videoUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Url</FormLabel>
                <div
                  className="flex space-x-2 items-center justify-center"
                >
                  <FormControl>
                    <Input className="w-[500px]" placeholder="https://www.youtube.com/watch?v=BTviUF-VT0U" {...field} />
                  </FormControl>
                  <Button type="submit">
                    Convertir
                  </Button>
                </div>
                <FormDescription>
                  Link del video que queres descargar.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

        </form>
      </Form>
      <div
        className="flex space-y-3 flex-col items-center justify-center"
      >
        {
          downloads && downloads.map((download) => (
            <div
              key={download}
              className="flex justify-center items-center p-2 px-6 border border-input rounded-md"
            >
              {download}
              <Button
                asChild
                className="ml-4"
                size='icon'
              >
                <a
                  href={`/${download}.mp3`}
                  download={`${download}.mp3`}
                >
                  <ArrowDownToLine className="w-5 h-5" />
                </a>
              </Button>
            </div>
          ))
        }
      </div>
    </>
  )
}

export default VideoForm