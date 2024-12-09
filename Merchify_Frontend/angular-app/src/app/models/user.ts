export interface User {
    id: number; 
    username: string;
    firstname: string;
    lastname: string; 
    user_type: 'individual' | 'company' | 'admin'; 
    number_of_purchases: number;
    address: string; 
    email: string; 
    phone: string;
    country: string; 
    image_base64: string; 
    company?: {
      id: number;
      name: string;
    } | null; 
  }
  