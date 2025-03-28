export type Receipt = {
    id: string;
    receiptNumber: string;
    customerName: string;
    customerEmail?: string | null;
    customerPhone?: string | null;
    date: string | Date;
    totalAmount: number;
    amountPaid: number;
    paymentMethod?: string | null;
    paymentFor: string;
    notes?: string | null;
    currency: string;
    createdAt: string | Date;
    updatedAt?: string | Date;
  }
  
  export type ReceiptActionResponse = {
    success: boolean;
    data?: Receipt;
    error?: string;
    id?: string;
  }
  
  export type ReceiptsActionResponse = {
    success: boolean;
    data?: Receipt[];
    error?: string;
  }
  
  export type DeleteActionResponse = {
    success: boolean;
    error?: string;
  }