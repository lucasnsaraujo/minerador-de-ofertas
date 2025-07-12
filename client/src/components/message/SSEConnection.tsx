import React, { useEffect, useState } from "react"
import { Circle, CircleHalf } from "@phosphor-icons/react"
import { useTRPCClient } from "../../lib/trpc"
import { ChatMessage } from "../../pages/ChatPage"
type Props = {
  onMessage: (message: ChatMessage) => void
}
const SSEConnection: React.FC<Props> = (props) => {
  const trpcClient = useTRPCClient()
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    const sub = trpcClient.message.sseMessages.subscribe(undefined, {
      onData: (data) => {
        setIsConnected(true)

        props.onMessage({
          id: data.id,
          message: data.message,
          createdAt: data.createdAt,
          senderId: data.id,
          sender: { name: data.name, id: data.id, image: data.image },
        })
      },
      onStarted: () => {
        setIsConnected(true)
      },

      onError: (err) => {
        console.error("Subscription error", err)
        setIsConnected(false)
      },
    })
    return () => {
      sub.unsubscribe()
    }
  }, [trpcClient, props.onMessage])
  // console.log(messages)
  return (
    <div className="flex items-center gap-2">
      {isConnected ? (
        <Circle className="w-4 h-4 text-green-500" aria-label="Connected" />
      ) : (
        <CircleHalf className="w-4 h-4 text-red-500 animate-spin" aria-label="Disconnected" />
      )}
    </div>
  )
}

export default SSEConnection
