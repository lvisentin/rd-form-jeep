import { z } from 'zod';

export const formSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  email: z.string().email("Email inválido").min(1, "Email é obrigatório"),
  isClient: z.string().min(1, "Selecione uma opção"),
  vehicleType: z.string().min(1, "Selecione um tipo de veículo"),
  vehicleModel: z.string().min(1, "Selecione um modelo de veículo"),
  location: z.string().min(1, "Selecione uma unidade"),
  timePeriod: z.string().min(1, "Selecione um período"),
  visitDay: z.string().min(1, "Selecione um dia"),
});

export type FormFields = z.infer<typeof formSchema>;

export type FormErrors = {
  [key in keyof FormFields]?: string;
};

export type SubmitResponse = {
  success: boolean;
  errors: FormErrors | null;
  message: string | null;
}; 

export const initialState: SubmitResponse = {
  success: false,
  errors: null,
  message: null
};