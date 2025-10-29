const IS_SERVER_SIDE = typeof window === 'undefined';


const API_BASE_URL = IS_SERVER_SIDE
  ? process.env.INTERNAL_API_BASE_URL    
  : process.env.NEXT_PUBLIC_API_BASE_URL; 

if (!API_BASE_URL) {
  console.error(
    'A variável de ambiente da API não está definida. Verifique INTERNAL_API_BASE_URL (server) e NEXT_PUBLIC_API_BASE_URL (client).'
  );
}

type ApiClientOptions = RequestInit;

export const apiClient = async (
  endpoint: string,
  options: ApiClientOptions = {}
): Promise<Response> => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultHeaders: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  const config: RequestInit = {
    ...options,
    headers: defaultHeaders,
  };

  return fetch(url, config);
};