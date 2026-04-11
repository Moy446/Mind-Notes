
export interface PsicologoDates {
    success:         boolean;
    formattedAgenda?: FormattedAgendum[];
}

export interface FormattedAgendum {
    id:     string;
    idPaciente: string;
    nombre: string;
    img:    string;
    horaI:  string;
    horaF:  string;
    fecha:  string;
    estado: string;
}

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
    idCita?: string;
    idUsuario: string;
    nombre: string;
    fechaCita: string;
    horaInicio: string;
    horaFin: string;
}



//Paciente
export interface ListPsycologist {
    success: boolean;
    data:    Datum[];
}

export interface Datum {
    idPsicologo:         string;
    nombrePsicologo:     string;
    fotoPerfilPsicologo: string;
}
