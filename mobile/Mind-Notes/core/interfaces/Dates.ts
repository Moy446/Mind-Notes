export interface PatientList {
    success:         boolean;
    nombresUsuarios: NombresUsuario[];
}

export interface NombresUsuario {
    _id:                 string;
    idVinculacion:       string;
    idPsicologo:         string;
    idPaciente:          string;
    nombrePsicologo:     string;
    nombrePaciente:      string;
    fotoPerfilPsicologo: string;
    fotoPerfilPaciente:  string;
}

export interface formatedPatientList {
    id: string;
    nombre: string;
    img: string;
}

export interface infoCita {
    idUsuario: string;
    nombre: string;
    fechaCita: string;
    horaInicio: string;
    horaFin: string;
}