import { HttpHeaders } from "@angular/common/http";

export type HttpResponse<T> = {
    body: BodyType<T>;
    headers: HttpHeaders;
    status: number;
    statusText: string;
    url: string;
};

export type BodyType<T> = {
    code: number;
    message: string;
    data: T;
};