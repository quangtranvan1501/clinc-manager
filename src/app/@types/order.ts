export type Order = {
    orderId?: string;
    patient: any;
    totalAmount: number;
    discount?: number;
    status?: string;
    orderDate?: string;
    orderService: [
        {
            service: any;
            quantity?: number;
        },
    ];
}