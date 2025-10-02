class paciente{
    /**
     *
     */
    constructor(nombre,apellido,correo,psw,edad) {
        this.nombre=nombre;
        this.apellido=apellido;
        this.correo=correo;
        this.psw=psw;
        this.edad=edad;
        super();
        
    }

    getNombre(){
        return this.nombre;
    }   
}