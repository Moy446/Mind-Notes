import React from 'react'
import './BubbleChat.css'

export default function BubbleChat(props){

    return(
        <div className={`bubble ${props.type === "send" ? "send" : "received"}`}>
            {props.text}
        </div>
    );
}