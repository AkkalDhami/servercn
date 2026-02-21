import { ApiError } from "../../shared/errors/api-error";

//? Not found
export const notFound = () => {
  throw new ApiError(404, "Not found");
};

//? Bad request
export const badRequest = () => {
  throw ApiError.badRequest("Bad request");
};

//? Unauthorized
export const unauthorized = () => {
  throw ApiError.unauthorized("Unauthorized");
};
