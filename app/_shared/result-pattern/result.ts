export type Success<T> = { success: true; data: T }
export type Failure<E> = { success: false; error: E }
export type Result<T, E = Error> = Success<T> | Failure<E>

//wrapper and unwrapper
export function ok<T, E = never>(data: T): Result<T, E> {
    return { success: true, data };
}

export function err<E>(error: E): Result<never, E> {
    return { success: false, error };
}

//unwrapper helper
/**
 * Throws if the result is a failure.
 * Use only when you are certain the result is Ok,
 * or when a failure is truly unexpected.
 */
export function unwrap<T, E>(result: Result<T, E>): T {
    if (result.success) {
        return result.data;
    } else {
        throw result.error;
    }
}

export function unwrapOr<T, E>(result: Result<T, E>, defaultValue: T): T {
    if (result.success) {
        return result.data;
    } else {
        return defaultValue;
    }
}

export function unwrapOrElse<T, E>(result: Result<T, E>, fn: (error: E) => T): T {
    if (result.success) {
        return result.data;
    } else {
        return fn(result.error);
    }
}

export function isOk<T, E>(result: Result<T, E>): result is Success<T> {
    return result.success;
}

export function isErr<T, E>(result: Result<T, E>): result is Failure<E> {
    return !result.success;
}