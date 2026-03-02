// UUID取得
"use client"

import { useChat } from "@/hooks/useChat"
import { useState } from "react"
import { useSearchParams } from "next/navigation"

export default function ChatPage() {
const searchParams = useSearchParams()
const userId = searchParams.get("userId") ?? "" // nullを防ぐ

const { messages, sendMessage, loading, error } = useChat(userId)

const [input, setInput] = useState("")

if (!userId) {
    return <div>Invalid access. No userId found.</div>
}

const handleSend = async () => {
    if (!input.trim()) return
    await sendMessage(input)
    setInput("")
}

return (
    <div>
        <h1>Chat</h1>

        {error && <p>{error}</p>}

        {messages.map((m) => (
            <div key={m.id}>{m.content}</div>
        ))}

        <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
        />
        <button onClick={handleSend} disabled={loading}>
            Send
        </button>
    </div>
    )
}