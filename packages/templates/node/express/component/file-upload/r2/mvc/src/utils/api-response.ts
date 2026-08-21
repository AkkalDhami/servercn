export const ApiResponse = {
  created: (res: any, message: string, data: any) => {
    return res.status(201).json({
      success: true,
      message,
      data
    });
  },

  success: (res: any, message: string, data: any, statusCode = 200) => {
    return res.status(statusCode).json({
      success: true,
      message,
      data
    });
  }
};