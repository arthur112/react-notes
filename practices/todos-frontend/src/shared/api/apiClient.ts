import { config } from "@utils/config";

type ApiResponse<TData> = {
  data: TData;
};

async function getErrorMessage(response: Response): Promise<string> {
  const fallback = `${response.status} ${response.statusText}`.trim();

  try {
    const body = (await response.json()) as { error?: string; message?: string };
    return body.error ?? body.message ?? fallback;
  } catch {
    return fallback;
  }
}

async function request<TData>(
  path: string,
  init: RequestInit,
): Promise<ApiResponse<TData>> {
  const response = await fetch(new URL(path, config.backend.baseUrl), {
    ...init,
    headers: {
      Accept: "application/json",
      ...init.headers,
    },
  });

  if (!response.ok) {
    throw new Error(await getErrorMessage(response));
  }

  const responseText = await response.text();

  return {
    data: responseText ? (JSON.parse(responseText) as TData) : (undefined as TData),
  };
}

export const apiClient = {
  get: <TData>(path: string, init: RequestInit = {}) =>
    request<TData>(path, { ...init, method: "GET" }),
  post: <TData, TBody>(path: string, body: TBody, init: RequestInit = {}) =>
    request<TData>(path, {
      ...init,
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
        ...init.headers,
      },
    }),
  delete: <TData = void>(path: string, init: RequestInit = {}) =>
    request<TData>(path, { ...init, method: "DELETE" }),
};
