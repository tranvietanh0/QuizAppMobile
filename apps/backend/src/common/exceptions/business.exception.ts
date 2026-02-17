import { HttpException, HttpStatus } from "@nestjs/common";

/**
 * Custom exception for business logic errors
 */
export class BusinessException extends HttpException {
  constructor(
    message: string,
    errorCode?: string,
    statusCode: HttpStatus = HttpStatus.BAD_REQUEST
  ) {
    super(
      {
        statusCode,
        message,
        errorCode: errorCode || "BUSINESS_ERROR",
        error: "Business Error",
      },
      statusCode
    );
  }
}

/**
 * Exception for when a resource is not found
 */
export class ResourceNotFoundException extends HttpException {
  constructor(resource: string, identifier?: string) {
    const message = identifier
      ? `${resource} with identifier '${identifier}' not found`
      : `${resource} not found`;

    super(
      {
        statusCode: HttpStatus.NOT_FOUND,
        message,
        errorCode: "RESOURCE_NOT_FOUND",
        error: "Not Found",
      },
      HttpStatus.NOT_FOUND
    );
  }
}

/**
 * Exception for duplicate resource
 */
export class DuplicateResourceException extends HttpException {
  constructor(resource: string, field: string) {
    super(
      {
        statusCode: HttpStatus.CONFLICT,
        message: `${resource} with this ${field} already exists`,
        errorCode: "DUPLICATE_RESOURCE",
        error: "Conflict",
      },
      HttpStatus.CONFLICT
    );
  }
}

/**
 * Exception for invalid credentials
 */
export class InvalidCredentialsException extends HttpException {
  constructor() {
    super(
      {
        statusCode: HttpStatus.UNAUTHORIZED,
        message: "Invalid email or password",
        errorCode: "INVALID_CREDENTIALS",
        error: "Unauthorized",
      },
      HttpStatus.UNAUTHORIZED
    );
  }
}

/**
 * Exception for expired or invalid token
 */
export class InvalidTokenException extends HttpException {
  constructor(tokenType: string = "Token") {
    super(
      {
        statusCode: HttpStatus.UNAUTHORIZED,
        message: `${tokenType} is invalid or has expired`,
        errorCode: "INVALID_TOKEN",
        error: "Unauthorized",
      },
      HttpStatus.UNAUTHORIZED
    );
  }
}
