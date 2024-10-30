import { queryKeys } from "./constants";

// 항상 일관된 query key를 유지하기 위해 작성
export const generateUserKey = (userId: number, userToken: string) => {
  return [queryKeys.user, userId, userToken];
};
