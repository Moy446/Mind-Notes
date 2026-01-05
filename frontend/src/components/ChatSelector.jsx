import React from 'react'
import './ChatSelector.css'
import SearchBar from './SearchBar';
import AddBtn from './AddBtn';
import ChatBox from './ChatBox';

export default function ChatSelector(){

    return (
        <div className='chatselec'>
            <div className='wiwiwiCS'>
                <p className='textCS'>MindNotes</p>
                <SearchBar/>
                <div className='chatboxes'>
                    <ChatBox img = "src/images/pimg1.png" name = "Teisel" message = "Hola, agendeme por favor"/>
                    <ChatBox img = "src/images/pimg1.png" name = "Teisel" message = "Hola, agendeme por favor"/>
                    <ChatBox img = "src/images/pimg1.png" name = "Teisel" message = "Hola, agendeme por favor"/>
                    <ChatBox img = "src/images/pimg1.png" name = "Teisel" message = "Hola, agendeme por favor"/>
                    <ChatBox img = "src/images/pimg1.png" name = "Teisel" message = "Hola, agendeme por favor"/>
                    <ChatBox img = "src/images/pimg1.png" name = "Teisel" message = "Hola, agendeme por favor"/>
                    <ChatBox img = "src/images/pimg1.png" name = "Teisel" message = "Hola, agendeme por favor"/>
                    <ChatBox img = "src/images/pimg1.png" name = "Teisel" message = "Hola, agendeme por favor"/>
                    <ChatBox img = "src/images/pimg1.png" name = "Teisel" message = "Hola, agendeme por favor"/>
                    <ChatBox img = "src/images/pimg1.png" name = "Teisel" message = "Hola, agendeme por favor"/>
                    <ChatBox img = "src/images/pimg1.png" name = "Teisel" message = "Hola, agendeme por favor"/>
                    <ChatBox img = "src/images/pimg1.png" name = "Teisel" message = "Hola, agendeme por favor"/>
                    <ChatBox img = "src/images/pimg1.png" name = "Teisel" message = "Hola, agendeme por favor"/>
                    <ChatBox img = "src/images/pimg1.png" name = "Teisel" message = "Hola, agendeme por favor"/>
                </div>
            </div>
            <div className='addDivCS'>
                <AddBtn num = "1"/>
            </div>
        </div>
    );
}