interface AppError {
    status: number;
    code: string;
    message: string | undefined;
    stack: string | undefined;
}

const isServerError = (err: any): err is AppError => true;

const NotFound = () => <AppError> {
    status: 404,
    code: 'NOT_FOUND'
};

const Error = {
    NotFound
};

export {
    AppError,
    isServerError,
    Error
};
