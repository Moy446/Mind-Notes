import React from 'react'
import { useState, useCallback } from 'react';
import './Chat.css'
import NameBar from './components/NameBar';
import ChatSelector from './components/ChatSelector';
import MessageField from './components/MessageField';
import BubbleChat from './components/BubbleChat';
import SupportMenu from './components/SupportMenu';
import InfoPsi from './components/InfoPsi';
import { useOutletContext } from 'react-router-dom';

export default function ChatPsiF(props){

    const {qrOpen , handleOpen, uidOpen, handleOpenUID} = useOutletContext();

    const [suppOpen, setOpenSupp] = useState(false)
        
    const handleOpenSupp = useCallback(() => {
        setOpenSupp(!suppOpen)
    }, [suppOpen])

    const [infoOpen, setOpneInfo] = useState(false)
        
    const handleOpenInfo = useCallback(() => {
        setOpneInfo(!infoOpen)
    }, [infoOpen])

    return(
        <div className='chatPsiF'>
            <ChatSelector qrOpen = {qrOpen} handleOpen = {handleOpen} uidOpen = {uidOpen} handleOpenUID = {handleOpenUID}/>
            <div className='nameVarCon'>
                <NameBar img = "/src/images/pimg1.png" name = "Teisel" open = {infoOpen} handleOpen={handleOpenInfo}/>
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
                            <MessageField suppOpen = {suppOpen} handleOpen = {handleOpenSupp}/>
                            <div className={suppOpen ? 'showSuppMenu' : 'hideSuppMenu'}>
                                <SupportMenu suppOpen = {suppOpen} handleOpen = {handleOpenSupp}/>
                            </div>     
                        </div>
                    </div>
                    <div className={infoOpen ? '' : 'hiddeInfo'}>
                        <InfoPsi img = "/src/images/pimg1.png" name = "Teisel" open = {infoOpen} handleOpen = {handleOpenInfo}/>
                    </div>
                </div>
            </div>
            
        </div>
    );
}