export const padTo2Digits = (num: number): string => {
    return num.toString().padStart(2, '0');
}

export const removeNonNumeric = (num: any) => num.toString().replace(/[^0-9]/g, "");
export const addSepartor = (num: any) => num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");