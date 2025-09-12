'use server';

import { formSchema, SubmitResponse, FormErrors } from './schema';
import { z } from 'zod';

export async function submitForm(prevState: SubmitResponse, formData: FormData): Promise<SubmitResponse> {
  console.log('submitForm');
  const rawFormData = {
    name: formData.get('name') as string,
    email: formData.get('email') as string,
    isClient: formData.get('isClient') as string,
    vehicleType: formData.get('vehicleType') as string,
    vehicleModel: formData.get('vehicleModel') as string,
    location: formData.get('location') as string,
    timePeriod: formData.get('timePeriod') as string,
    visitDay: formData.get('visitDay') as string,
  };
  
  try {
    formSchema.parse(rawFormData);
    
    const webhookUrl = process.env.NEXT_PUBLIC_WEBHOOK_URL || '';
    
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(rawFormData),
    });
    
    if (!response.ok) {
      throw new Error('Failed to submit form data to webhook');
    }
    
    console.log('Form submitted successfully!');
    return { 
      success: true,
      errors: null,
      message: null
    };
    
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      const fieldErrors: FormErrors = {};
      
      error.errors.forEach((err) => {
        const field = err.path[0] as string;
        fieldErrors[field as keyof FormErrors] = err.message;
      });
      
      console.error('Validation error:', fieldErrors);
      return { 
        success: false, 
        errors: fieldErrors,
        message: 'Por favor, corrija os erros abaixo.'
      };
    } else {
      console.error('Error submitting form:', error);
      return { 
        success: false, 
        errors: null,
        message: 'Ocorreu um erro ao enviar o formulário.' 
      };
    }
  }
} 