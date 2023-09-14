import { HttpHeaders } from "@angular/common/http";

export const makeHeadersWithAuthField = (): null | HttpHeaders => {
    const token = localStorage.getItem('id_token');
    if (token == null) {
        return null;
    }
    const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': token
    });
    return headers;
}
