import React from 'react'
import { useState } from 'react';
import './Chat.css'
import NameBar from './components/NameBar';
import ChatSelector from './components/ChatSelector';
import MessageField from './components/MessageField';
import BubbleChat from './components/BubbleChat';
export default function ChatPsiF(){

    return(
        <div className='chatPsiF'>
            <ChatSelector/>
            <div className='nameVarCon'>
                <NameBar img = "/src/images/pimg1.png" name = "Teisel"/>
                <div className='chatCon'>
                    <div className='chatView'>
                        <div className='bubbles'>
                            <BubbleChat text = "Claro que si, con mucho gusto lo agendo, que día?" type = "send"/>
                            <BubbleChat text = "Hola, agendeme por favor"/>
                            <BubbleChat text = "Claro que si, con mucho gusto lo agendo, que día?" type = "send"/>
                            <BubbleChat text = "Hola, agendeme por favor"/>
                            <BubbleChat text = "Claro que si, con mucho gusto lo agendo, que día?" type = "send"/>
                            <BubbleChat text = "Hola, agendeme por favor"/>
                            <BubbleChat text = "Claro que si, con mucho gusto lo agendo, que día?" type = "send"/>
                            <BubbleChat text = "Hola, agendeme por favor"/>
                            <BubbleChat text = "Claro que si, con mucho gusto lo agendo, que día?" type = "send"/>
                            <BubbleChat text = "Hola, agendeme por favor"/>
                            <BubbleChat text = "Claro que si, con mucho gusto lo agendo, que día?" type = "send"/>
                            <BubbleChat text = "Hola, agendeme por favor"/>
                            <BubbleChat text = "Claro que si, con mucho gusto lo agendo, que día?" type = "send"/>
                            <BubbleChat text = "Hola, agendeme por favor"/>
                            <BubbleChat text = "Claro que si, con mucho gusto lo agendo, que día?" type = "send"/>
                            <BubbleChat text = "Hola, agendeme por favor"/>
                            <BubbleChat text = "Claro que si, con mucho gusto lo agendo, que día?" type = "send"/>
                            <BubbleChat text = "Hola, agendeme por favor"/>
                            <BubbleChat text = "Claro que si, con mucho gusto lo agendo, que día?" type = "send"/>
                            <BubbleChat text = "Hola, agendeme por favor"/>
                        </div>
                        <div className='textBarChat'>
                            <MessageField/>
                        </div>
                    </div>
                </div>
            </div>
            
        </div>
    );
}