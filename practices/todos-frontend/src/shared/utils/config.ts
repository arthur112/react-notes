export type AppConfig = {
  backend: {
    baseUrl: string;
  };
};

export const config: AppConfig = {
  backend: {
    baseUrl: import.meta.env.VITE_BACKEND_URL,
  },
};
