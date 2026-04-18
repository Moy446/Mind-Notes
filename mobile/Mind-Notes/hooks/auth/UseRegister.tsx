import React from 'react'

const UseRegister = () => {

    //Función de expresion regular para validar contraseña
    const validarPassword = (password:string) => {
        const regex =  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&'.#"/+-])[A-Za-z\d@$!%*?&'.#"/+-]{8,}$/;
        return regex.test(password);
    }
    
    return{
        validarPassword,
    }
}

export default UseRegister