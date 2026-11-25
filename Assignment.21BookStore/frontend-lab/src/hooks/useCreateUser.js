import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createUser } from '../api/user.js';

export function useCreateUser() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: createUser,

    onSuccess: (created) => {
      qc.setQueryData(['users'], (old = []) => [
        ...old,
        created,
      ]);
    },
  });
}