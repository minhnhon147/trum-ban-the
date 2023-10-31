export interface IPayOSResult<T> {
  code: string;
  desc: string;
  data: T;
}

export interface IPaymentLink {
  bin: string;
  accountNumber: string;
  accountName: string;
  amount: number;
  description: string;
  orderCode: number;
  paymentLinkId: string;
  status: string;
  checkoutUrl: string;
  qrCode: string;
}
