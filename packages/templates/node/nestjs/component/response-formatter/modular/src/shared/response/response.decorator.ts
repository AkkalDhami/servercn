import { SetMetadata } from "@nestjs/common";

export const RESPONSE_OPTIONS_KEY = Symbol("response_options");

export type ResponseOptions = {
  message?: string;
};

export const ApiResponseConfig = (options: ResponseOptions = {}) =>
  SetMetadata(RESPONSE_OPTIONS_KEY, options);
