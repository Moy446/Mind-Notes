import React from 'react'
import { useState, useCallback } from 'react';
import './Chat.css'
import NameBar from './components/NameBar';
import ChatSelector from './components/ChatSelector';
import MessageField from './components/MessageField';
import BubbleChat from './components/BubbleChat';
import InfoPa from './components/InfoPa';
import DeleteMenu from './components/DeleteMenu';
import SuppPa from './components/SuppPa';
import { useOutletContext } from 'react-router-dom';

export default function ChatPaF(props){

    const {qrOpen , handleOpen, uidOpen, handleOpenUID} = useOutletContext();

    const [suppOpen, setOpenSupp] = useState(false)
        
    const handleOpenSupp = useCallback(() => {
        setOpenSupp(!suppOpen)
    }, [suppOpen])

    const [infoOpen, setOpneInfo] = useState(false)
        
    const handleOpenInfo = useCallback(() => {
        setOpneInfo(!infoOpen)
    }, [infoOpen])

    const [delOpen, setOpenDel] = useState(false)
        
    const handleOpenDel = useCallback(() => {
        setOpenDel(!delOpen)
    }, [delOpen])

    const [suppInfoOpen, setOpenSuppInfo] = useState(false)
        
    const handleOpenInfoSupp = useCallback(() => {
        setOpenSuppInfo(!suppInfoOpen)
    }, [suppInfoOpen])

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
                            <MessageField suppOpen = {suppOpen} handleOpen = {handleOpenSupp} patient={true}/>  
                        </div>
                    </div>
                    <div className={infoOpen ? '' : 'hiddeInfo'}>
                        {suppInfoOpen 
                            ? <SuppPa suppInfO = {suppInfoOpen} handleSuppInfo = {handleOpenInfoSupp}/>
                            : <InfoPa img = "/src/images/pimg1.png" name = "Teisel" 
                                open = {infoOpen} handleOpen = {handleOpenInfo} 
                                del = {delOpen} handleDel = {handleOpenDel} 
                                suppInfO = {suppInfoOpen} handleSuppInfo = {handleOpenInfoSupp}
                                />
                        }
                        

                    </div>
                    <div className={delOpen ? 'showDelMenu' : 'hideSuppMenu'}>
                        <DeleteMenu title = "¿Esta seguro de eliminar al psicologo Teisel? " subtitle = "Todos los datos se perderan" del = {delOpen} handleDel = {handleOpenDel}/>
                    </div>
                </div>
            </div>
            
        </div>
    );
}