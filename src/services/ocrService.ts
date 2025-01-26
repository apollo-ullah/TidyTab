import axios from 'axios';
import FormData from 'form-data';
import { storage } from '../config/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../config/firebase';
import { doc, updateDoc, arrayUnion } from 'firebase/firestore';

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
  receiptURL?: string;
}

async function uploadReceiptImage(file: File, tabId: string): Promise<string> {
  // Create a unique filename
  const fileExtension = file.name.split('.').pop();
  const fileName = `receipts/${tabId}/${uuidv4()}.${fileExtension}`;
  
  // Create a reference to the file location
  const storageRef = ref(storage, fileName);
  
  try {
    // Upload the file
    await uploadBytes(storageRef, file);
    
    // Get the download URL
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  } catch (error) {
    console.error('Error uploading receipt:', error);
    throw new Error('Failed to upload receipt image');
  }
}

export const processReceipt = async (file: File, tabId: string): Promise<OCRResult> => {
  try {
    // First upload the image to Firebase Storage
    const receiptURL = await uploadReceiptImage(file, tabId);

    // Process receipt with OCR
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

    // Transform the OCR response
    const ocrResult: OCRResult = {
      merchantName: data.merchantName?.data || 'Unknown Merchant',
      merchantAddress: data.merchantAddress?.data || '',
      totalCost: data.totalAmount?.data || 0,
      lineItems: (data.lineItems || []).map((item: any) => ({
        name: item.description?.data || 'Unknown Item',
        quantity: item.quantity?.data || 1,
        unitPrice: item.unitPrice?.data || 0,
        totalPrice: item.totalPrice?.data || 0
      })),
      receiptURL // Add the uploaded image URL to the result
    };

    // Add expenses to Firestore
    const tabRef = doc(db, 'tabs', tabId);
    await updateDoc(tabRef, {
      expenses: arrayUnion(...ocrResult.lineItems.map(item => ({
        description: item.name,
        amount: item.totalPrice,
        quantity: item.quantity,
        merchant: ocrResult.merchantName,
        timestamp: new Date().toISOString(),
        type: 'receipt'
      })))
    });

    return ocrResult;
  } catch (error: any) {
    console.error('Error processing receipt:', error);
    throw new Error(error.response?.data?.error || 'Failed to process receipt');
  }
};