export interface ErrorData {
    type: string;
    message: string;
};

export function throwError(condition: boolean, type: string, message: string | string[]) {
    if (condition) {
        throw {
            type,
            message
        };
    };
};

export function errorType(error: ErrorData) {
    if (error.type === "Bad Request") {
        return { status: 400, message: error.message };
    };
    if (error.type === "Not Acceptable") {
        return { status: 406, message: error.message };
    };
    return { status: 500, message: "Internal Server Error" };
};