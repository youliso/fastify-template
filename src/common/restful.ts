export function Success<T>(data?: T): { status: number; data: T; time: number } {
  return {
    status: 200,
    data,
    time: Date.now()
  };
}

export function Error<T>(data?: T): { status: number; data: T; time: number } {
  return {
    status: 400,
    data,
    time: Date.now()
  };
}
