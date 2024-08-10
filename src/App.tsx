import "./App.css"
import {useEffect, useState} from "react";

interface MessageType {
    id: string,
    isViewed: boolean,
    username: string,
    message: string
}

export const App = () => {
    const [messages, setMessages] = useState<MessageType[]>([])
    const [inputMsg, setInputMsg] = useState("")
    const [username, setUsername] = useState("")
    const [ws, setWs] = useState<null | WebSocket>(null)

    useEffect(() => {
        const socket = new WebSocket("ws://localhost:8080")

        setWs(socket)

        socket.onmessage = (event) => {
            setMessages(JSON.parse(event.data))
        }

        socket.onerror = (err) => {
            console.log("Ошибка", err)
        }

        socket.onclose = (event) => {
            console.log("Закрылся поток", event.code, event.reason)
        }
    }, []);

    const onChangeMsg = (e) => {
        setInputMsg(e.target.value)
    }

    const sendMsg = () => {
        if(ws && ws.readyState === WebSocket.OPEN) {
            const body = {
                username,
                message: inputMsg,
                type: "new"
            }
            ws.send(JSON.stringify(body))
            setInputMsg("")
        } else {
            console.log("Сокет закрылся")
        }
    }

    const onChangeUsername = (e) => {
        setUsername(e.target.value)
    }

    const onView = (id: string) => {
        if(ws && ws.readyState === WebSocket.OPEN) {
            const body = {
                id,
                type: "view"
            }
            ws.send(JSON.stringify(body))
        } else {
            console.log("Сокет закрылся")
        }
    }

    console.log(messages)

    return (
        <div>
            <input type="text" onChange={onChangeUsername} value={username} placeholder={"Введите имя"}/>
            <div className="chat">
                <div className="message-container">
                    {messages.map((msg) => (
                         <div
                             onClick={() => onView(msg.id)}
                             key={msg.id}
                             className={`message-container__message ${msg.username === "Alex" ? "self" : ""} ${msg.isViewed ? "is-viewed" : ""}`}
                         >
                             {msg.message}
                         </div>
                    ))}
                </div>
                <div className="send">
                    <div onClick={sendMsg}> > </div>
                    <input onChange={onChangeMsg} value={inputMsg} type="text"/>
                </div>
            </div>
        </div>
    );
};
