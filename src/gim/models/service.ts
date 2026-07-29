//Aristide
export interface ServiceRequestDto {
    nomService : any;
    abrevService : any;
    codDirect : any
}

export const emptyServiceRequestDto : ServiceRequestDto = {
    nomService : null,
    abrevService : null,
    codDirect : null
}

export interface ServiceResponseDto {
    idService : any;
    codServ : any;
    nomService : any;
    abrevService : any;
    codDirect : any;
}

export const emptyServiceResponseDto : ServiceResponseDto = {
    idService : null,
    codServ : null,
    nomService : null,
    abrevService : null,
    codDirect : null,
}