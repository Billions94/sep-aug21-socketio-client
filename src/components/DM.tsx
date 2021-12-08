import { Container, Row, Col, Form, FormControl, ListGroup, ListGroupItem, Button } from 'react-bootstrap'
import { useState, useEffect, FormEvent } from "react"
import { IHome } from "../interfaces/IHome"
import IMessage from '../interfaces/IMessage'
import { UserId } from '../interfaces/UserID'
import { IUser } from '../interfaces/IUser'
import { Room } from '../interfaces/Room'
import { io } from 'socket.io-client'
import { useParams } from 'react-router-dom'

const ADDRESS = 'http://localhost:3030' // <-- address of the BACKEND PROCESS
const socket = io(ADDRESS, { transports: ['websocket'] })

const DM = ({ username, loggedIn, setLoggedIn }: IHome) => {


    const [message, setMessage] = useState('')
    const [onlineUsers, setOnlineUsers] = useState<IUser[]>([])
    const [chatHistory, setChatHistory] = useState<IMessage[]>([])
    const [userId, setUserId] = useState<UserId | undefined>('')
    console.log('we are the user id', userId)
    const { id } = useParams()


    console.log('jahsgdhvehvfzevez', onlineUsers)
    console.log('========================>', id)

    useEffect(() => {
        socket.on('directmessage', (newMessage: IMessage) => {
            setChatHistory((chatHistory) => [...chatHistory, newMessage])
        })
        fetchOnlineUsers()
    }, [])



    const handleMessageSubmit = (e: FormEvent) => {
        e.preventDefault()

        const newMessage: IMessage = {
            text: message,
            sender: username,
            socketId: socket.id,
            timestamp: Date.now(), // <-- ms expired 01/01/1970
        }

        socket.emit('dm', { message: newMessage, room: id })
        // this is sending my message to the server. I'm not receiving back my own message,
        // so I need to append it manually to my chat history.
        // but all the other connected clients are going to receive it back from the server!
        // the server is bouncing the message back to all the other clients in an event!
        // and that event is called 'message'...
        // let's set up a trap (event listener) for catching all the 'message' events
        // that all the other clients are going to receive!
        setChatHistory([...chatHistory, newMessage])
        setMessage('')
    }

    const fetchOnlineUsers = async () => {
        try {
            let response = await fetch(ADDRESS + `/online-users/` +id )
            if (response) {
                let data: { onlineUsers: IUser[] } = await response.json()
                // data is an array with all the current connected users
                setOnlineUsers(data.onlineUsers)
                console.log('=========================>', data.onlineUsers)
            } else {
                console.log('error fetching the online users')
            }
        } catch (error) {
            console.log(error)
        }
    }

    

    return (
        <Container fluid className='px-4'>
            <Row className='my-3' style={{ height: '95vh' }}>
                <Col md={10} className='d-flex flex-column justify-content-between'>
                    {/* for the main chat window */}
                    {/* 3 parts: username input, chat history, new message input */}
                    {/* TOP SECTION: USERNAME INPUT FIELD */}

                    {/* MIDDLE SECTION: CHAT HISTORY */}
                    <ListGroup>
                        {chatHistory.map((message, i) => (
                            <ListGroupItem key={i}>
                                <strong>{message.sender}</strong>
                                <span className='mx-1'> | </span>
                                <span>{message.text}</span>
                                <span className='ml-2' style={{ fontSize: '0.7rem' }}>
                                    {new Date(message.timestamp).toLocaleTimeString('en-US')}
                                </span>
                            </ListGroupItem>
                        ))}
                    </ListGroup>
                    {/* BOTTOM SECTION: NEW MESSAGE INPUT FIELD */}
                    <Form onSubmit={handleMessageSubmit}>
                        <FormControl
                            placeholder='Insert your message here'
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            disabled={!loggedIn}
                        />
                    </Form>
                </Col>
                <Col md={2} style={{ borderLeft: '2px solid black' }}>
                    {/* for the currently connected clients */}
                    <div className='mb-3'>Connected users:</div>
                    <ListGroup>
                        {
                           onlineUsers && onlineUsers.map(users => (
                            <ListGroupItem>{users.username}</ListGroupItem> 
                            ))
                        }
                    </ListGroup>
                </Col>
            </Row>
        </Container>
    )
}

export default DM