import React from 'react'
import './ChatSelector.css'
import SearchBar from './SearchBar';
import AddBtn from './AddBtn';
import ChatBox from './ChatBox';
import { useState } from 'react';

export default function ChatSelector(){

    const [selectedId, setSelectedId] = useState(null);

    return (
        <div className='chatselec'>
            <div className='wiwiwiCS'>
                <p className='textCS'>MindNotes</p>
                <SearchBar/>
                <div className='chatboxes'>
                    <ChatBox img = "src/images/pimg1.png" name = "Teisel" message = "Hola, agendeme por favor" key="1" isSelected={selectedId === "1"} onSelect={() => setSelectedId("1")}/>
                    <ChatBox img = "src/images/pimg1.png" name = "Teisel" message = "Hola, agendeme por favor" key="2" isSelected={selectedId === "2"} onSelect={() => setSelectedId("2")}/>
                    <ChatBox img = "src/images/pimg1.png" name = "Teisel" message = "Hola, agendeme por favor" key="3" isSelected={selectedId === "3"} onSelect={() => setSelectedId("3")}/>
                    <ChatBox img = "src/images/pimg1.png" name = "Teisel" message = "Hola, agendeme por favor" key="4" isSelected={selectedId === "4"} onSelect={() => setSelectedId("4")}/>
                    <ChatBox img = "src/images/pimg1.png" name = "Teisel" message = "Hola, agendeme por favor" key="5" isSelected={selectedId === "5"} onSelect={() => setSelectedId("5")}/>
                </div>
            </div>
            <div className='addDivCS'>
                <AddBtn num = "1"/>
            </div>
        </div>
    );
}