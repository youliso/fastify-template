export function Success<T>(
  message: any,
  data?: T
): { status: number; message: string; data: T | undefined; time: number } {
  return {
    status: 200,
    message,
    data,
    time: Date.now()
  };
}

export function Error<T>(
  message: any,
  data?: T
): { status: number; message: string; data: T | undefined; time: number } {
  return {
    status: 400,
    message,
    data,
    time: Date.now()
  };
}
