export function Success<T>(data?: T): { status: number; data: T | undefined; time: number } {
  return {
    status: 200,
    data,
    time: Date.now()
  };
}

export function Error<T>(data?: T): { status: number; data: T | undefined; time: number } {
  return {
    status: 400,
    data,
    time: Date.now()
  };
}
