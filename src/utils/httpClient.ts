import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

interface FederationHttpClient extends AxiosInstance {
  get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T>;
  delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T>;
  post<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T>;
  put<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T>;
}

const getEnv = (key: string) => {
  if (typeof window !== 'undefined' && (window as any)._env_) {
    return (window as any)._env_[key];
  }
  return import.meta.env[key as keyof ImportMetaEnv];
};

const config: AxiosRequestConfig = {
  baseURL: getEnv('VITE_CP_PORTAL_FEDERATION_API_URL'),
  headers: {},
};

function createHttpClient() {
  const axiosInstance = axios.create(config);

  axiosInstance.interceptors.request.use(
    config => {
      const token = sessionStorage.getItem('token');

      if (token) {
        if (config.headers) {
          config.headers.Authorization = `${token}`;
        }
      } else {
        // token 재발급?
      }

      return config;
    },
    error => {
      return Promise.reject(error);
    }
  );

  axiosInstance.interceptors.response.use(
    response => response.data,
    error => {
      if (error.code === 'ERR_CANCELED') {
        return Promise.reject(error);
      }

      if (error.response) {
        switch (error.response.status) {
          case 400:
            console.error('잘못된 요청입니다. 요청 형식을 확인해주세요.');
            break;
          case 401:
            console.error('토큰이 만료되었거나 유효하지 않습니다.');
            break;
          case 403:
            console.error(
              '접근 권한이 없습니다. 해당 리소스에 접근할 권한이 부족합니다.'
            );
            break;
          case 404:
            console.error('요청한 API 엔드포인트를 찾을 수 없습니다.');
            break;
          case 409:
            console.error(
              '리소스 충돌이 발생했습니다. 중복된 데이터가 존재합니다.'
            );
            break;
          case 500:
            console.error(`서버 오류 발생: ${error.response.status}`);
            break;
          default:
            console.error('알 수 없는 서버 오류 발생');
        }
      } else {
        console.error('서버에 응답이 없습니다. 네트워크 상태를 확인하세요.');
      }

      return Promise.reject(error);
    }
  );

  return axiosInstance;
}

export const httpClient: FederationHttpClient = createHttpClient();
