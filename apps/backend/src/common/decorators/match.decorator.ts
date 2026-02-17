import { registerDecorator, ValidationArguments, ValidationOptions } from "class-validator";

/**
 * Custom validator decorator that checks if a property matches another property
 * Useful for password confirmation fields
 *
 * Usage:
 * @Match('password', { message: 'Passwords do not match' })
 * confirmPassword: string;
 */
export function Match(property: string, validationOptions?: ValidationOptions) {
  return (object: object, propertyName: string) => {
    registerDecorator({
      name: "match",
      target: object.constructor,
      propertyName: propertyName,
      constraints: [property],
      options: validationOptions,
      validator: {
        validate(value: unknown, args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints;
          const relatedValue = (args.object as Record<string, unknown>)[relatedPropertyName];
          return value === relatedValue;
        },
        defaultMessage(args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints;
          return `${args.property} must match ${relatedPropertyName}`;
        },
      },
    });
  };
}
