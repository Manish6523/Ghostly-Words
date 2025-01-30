"use client"
import React, { useState } from 'react'
import { Card, CardContent, CardTitle } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import Autoplay from 'embla-carousel-autoplay'

const Landing = () => {
  const [message, setMessage] = useState([
    {
      "title": "Message from user123",
      "content": "Hello!",
      "received": "2 hours ago"
    },
    {
      "title": "Message from ghostlyUser",
      "content": "Hope you're having a great day!",
      "received": "5 hours ago"
    },
    {
      "title": "Message from anonymous",
      "content": "You are amazing, keep going!",
      "received": "1 day ago"
    },
    {
      "title": "Message from mysterySender",
      "content": "Don't forget to smile today :)",
      "received": "30 minutes ago"
    },
    {
      "title": "Message from secretFriend",
      "content": "Remember that you're never alone!",
      "received": "3 days ago"
    },
    {
      "title": "Message from hiddenStranger",
      "content": "I just wanted to say hi!",
      "received": "10 minutes ago"
    },
    {
      "title": "Message from unknownUser",
      "content": "You're stronger than you think!",
      "received": "6 hours ago"
    }
  ])

  return (
    <div className='h-[90vh] bg-white flex justify-center items-center'>
      <div className="containerBox sm:w-[90vw] w-[80vw] flex flex-col items-center gap-5 py-7">
        <h1 className='sm:text-4xl text-3xl text-center font-bold'>Dive into the world of GhostlyWords 👻📝</h1>
        <p className='sm:text-lg text-md text-center'>Explore GhostlyWords - where your identity is hidden</p>
        <div className="slider w-full flex justify-center items-center">
          {/*  */}
          <Carousel className="sm:w-full w-[70vw] max-w-xs" plugins={[Autoplay({ delay: 2000 })]}>
            <CarouselContent>
              {message.map((message, index) => (
                <CarouselItem key={index}>
                  <div className="p-1">
                    <Card>
                      <CardContent className="flex flex-col aspect-square items-center justify-between sm:p-6 p-2 border border-black rounded-lg">
                        <CardTitle className="text-center sm:text-lg text-md font-bold">
                          {message.title}
                        </CardTitle>
                        <span className="sm:text-4xl text-2xl text-center font-semibold">
                          {message.content}
                        </span>
                        <CardContent className="text-center">
                          {message.received}
                        </CardContent>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
          {/*  */}
        </div>
      </div>
    </div>
  )
}

export default Landing