import { useQuery, useMutation, QueryClient } from '@tanstack/react-query';
import { apiRequest, getQueryFn } from '@/lib/queryClient';
import { CurrencyPair, ExpirationTime, SignalData } from '@/lib/types';

export const queryClient = new QueryClient();

// Hook para buscar estatísticas
export function useStatistics<T = any>() {
  return useQuery<T>({
    queryKey: ['/api/statistics'],
    queryFn: getQueryFn({ on401: "returnNull" }),
  });
}

// Hook para gerar um novo sinal
export function useGenerateSignal() {
  return useMutation({
    mutationFn: async ({ 
      currencyPair, 
      expirationMinutes 
    }: { 
      currencyPair: string,
      expirationMinutes: number
    }) => {
      const response = await apiRequest(
        'POST',
        '/api/signals/generate',
        { currencyPair, expirationMinutes }
      );
      return await response.json();
    },
    onSuccess: () => {
      // Invalidar consultas relacionadas após gerar um novo sinal
      queryClient.invalidateQueries({ queryKey: ['/api/signals/recent'] });
      queryClient.invalidateQueries({ queryKey: ['/api/statistics'] });
    },
  });
}

// Hook para buscar sinais recentes
export function useRecentSignals(limit: number = 10) {
  return useQuery({
    queryKey: ['/api/signals/recent', limit],
    queryFn: getQueryFn({ on401: "returnNull" }),
  });
}

// Hook para enviar um depoimento
export function useSubmitTestimonial() {
  return useMutation({
    mutationFn: async ({ 
      userId, 
      content, 
      rating 
    }: { 
      userId: number,
      content: string,
      rating: number
    }) => {
      const response = await apiRequest(
        'POST',
        '/api/testimonials',
        { userId, content, rating }
      );
      return await response.json();
    },
    onSuccess: () => {
      // Invalidar consulta de depoimentos após adicionar um novo
      queryClient.invalidateQueries({ queryKey: ['/api/testimonials'] });
    },
  });
}

// Hook para buscar depoimentos aprovados
export function useTestimonials<T = any>(limit: number = 10) {
  return useQuery<T>({
    queryKey: ['/api/testimonials', limit],
    queryFn: getQueryFn({ on401: "returnNull" }),
  });
}

// Interface para a resposta da API
interface SignalResponse {
  id?: number;
  direction?: 'up' | 'down';
  entryTime?: string;
  result?: string;
  [key: string]: any;
}

// Hook para simular a geração de sinais (client-side)
export function useClientSignalGeneration() {
  const generateMutation = useGenerateSignal();

  const generateSignal = async (
    currencyPair: CurrencyPair,
    expirationTime: ExpirationTime
  ): Promise<SignalData> => {
    // Adicionar um atraso artificial de 2 segundos para dar a impressão
    // de que o algoritmo está processando dados complexos
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    try {
      // Tentar usar a API do backend
      const response = await generateMutation.mutateAsync({
        currencyPair: currencyPair.value,
        expirationMinutes: expirationTime.value,
      }) as SignalResponse;
      
      // Calcular hora de entrada 1-2 minutos no futuro
      const now = new Date();
      const futureMinutes = Math.random() < 0.5 ? 1 : 2;
      const entryTime = new Date(now.getTime() + futureMinutes * 60 * 1000);
      
      return {
        currencyPair,
        expirationTime,
        // Usar tempo futuro calculado em vez do retornado pela API
        entryTime: entryTime.toISOString(),
        direction: response.direction || (Math.random() > 0.5 ? 'up' : 'down'),
      };
    } catch (error) {
      console.error('Erro ao usar API, usando geração local:', error);
      
      // Fallback para geração local caso a API falhe
      const direction = Math.random() > 0.5 ? 'up' : 'down';
      
      // Calcular hora de entrada 1-2 minutos no futuro
      const now = new Date();
      const futureMinutes = Math.random() < 0.5 ? 1 : 2;
      const entryTime = new Date(now.getTime() + futureMinutes * 60 * 1000);
      
      return {
        currencyPair,
        expirationTime,
        entryTime: entryTime.toISOString(),
        direction,
      };
    }
  };

  return {
    generateSignal,
    isLoading: generateMutation.isPending,
  };
}