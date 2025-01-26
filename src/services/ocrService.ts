import axios from 'axios';
import FormData from 'form-data';

const TAGGUN_API_KEY = '44eb3fa0db9611efb93deba93ee6cec4';
const TAGGUN_API_URL = 'https://api.taggun.io/api/receipt/v1/verbose/file';

export interface OCRResult {
  merchantName: string;
  merchantAddress: string;
  totalCost: number;
  lineItems: Array<{
    name: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
  }>;
}

export const processReceipt = async (file: File): Promise<OCRResult> => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('extractLineItems', 'true');
    formData.append('ocr', 'true');

    const response = await axios.post(TAGGUN_API_URL, formData, {
      headers: {
        'apikey': TAGGUN_API_KEY,
        'Accept': 'application/json',
        'Content-Type': 'multipart/form-data'
      },
      timeout: 30000,
    });

    const data = response.data;
    
    if (!data) {
      throw new Error('No OCR result returned');
    }

    // Transform the response to match our interface
    return {
      merchantName: data.merchantName?.data || 'Unknown Merchant',
      merchantAddress: data.merchantAddress?.data || '',
      totalCost: data.totalAmount?.data || 0,
      lineItems: (data.lineItems || []).map((item: any) => ({
        name: item.description?.data || 'Unknown Item',
        quantity: item.quantity?.data || 1,
        unitPrice: item.unitPrice?.data || 0,
        totalPrice: item.totalPrice?.data || 0
      }))
    };
  } catch (error: any) {
    console.error('Error processing receipt:', error);
    throw new Error(error.response?.data?.error || 'Failed to process receipt');
  }
}; 