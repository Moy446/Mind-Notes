import React, { useState } from 'react';
import './ChatSelector.css'
import SearchBar from './SearchBar';
import AddBtn from './AddBtn';
import ChatBox from './ChatBox';
import AddBtnsMenu from './AddBtnsMenu';

export default function ChatSelector(props){

    const [selectedId, setSelectedId] = useState(null);

    const handleSelect = (id) => {
        setSelectedId(id);
        props.onSelectChat(id);
    };

    return (
        <div className='chatselec'>
            <div className='wiwiwiCS'>
                <p className='textCS'>MindNotes</p>
                <SearchBar/>
                <div className='chatboxes'>
                    <ChatBox img = "/src/images/pimg1.png" name = "Teisel" message = "Hola, agendeme por favor" key="1" isSelected={selectedId === "1"} onSelect={() => handleSelect("1")}/>
                    <ChatBox img = "/src/images/pimg1.png" name = "Teisel" message = "Hola, agendeme por favor" key="2" isSelected={selectedId === "2"} onSelect={() => handleSelect("2")}/>
                    <ChatBox img = "/src/images/pimg1.png" name = "Teisel" message = "Hola, agendeme por favor" key="3" isSelected={selectedId === "3"} onSelect={() => handleSelect("3")}/>
                    <ChatBox img = "/src/images/pimg1.png" name = "Teisel" message = "Hola, agendeme por favor" key="4" isSelected={selectedId === "4"} onSelect={() => handleSelect("4")}/>
                    <ChatBox img = "/src/images/pimg1.png" name = "Teisel" message = "Hola, agendeme por favor" key="5" isSelected={selectedId === "5"} onSelect={() => handleSelect("5")}/>
                </div>
            </div>
            <div className='addDivCS'>
                <AddBtnsMenu qrOpen = {props.qrOpen} handleOpen = {props.handleOpen} uidOpen = {props.uidOpen} handleOpenUID = {props.handleOpenUID}/>
            </div>
        </div>
    );
}