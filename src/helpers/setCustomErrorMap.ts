import { z } from 'zod';

// Note: don't append punctuation. It will be appended automatically.

export const setCustomErrorMap = () => {
  const customErrorMap: z.ZodErrorMap = (issue, ctx) => {
    if (issue.code === z.ZodIssueCode.too_small) {
      if (issue.type === 'string') {
        if (issue.inclusive) {
          return { message: `Minimum ${issue.minimum} characters` };
        } else {
          return { message: `Must be over ${issue.minimum} characters` };
        }
      }
    }
    if (issue.code === z.ZodIssueCode.too_big) {
      if (issue.type === 'string') {
        if (issue.inclusive) {
          return { message: `Maximum ${issue.maximum} characters` };
        } else {
          return { message: `Must be under ${issue.maximum} characters` };
        }
      }
    }
    return { message: ctx.defaultError };
  };

  z.setErrorMap(customErrorMap);
};
