//Aristide
export interface PiecesRequestDto {
    naturePiece : any;
}

export const emptyPiecesRequestDto : PiecesRequestDto = {
    naturePiece : null
}

export interface PiecesResponseDto {
    idPieces : any;
    naturePiece : any;
}

export const emptyPiecesResponseDto : PiecesResponseDto = {
    idPieces : null,
    naturePiece : null
}