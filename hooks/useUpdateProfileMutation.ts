import { useAuth } from "@/providers/auth";
import { UserService } from "@/services/api";
import { IUpdateUserPayload } from "@/services/user/user.types";
import { AppToast } from "@/utils/toast";
import { useMutation } from "@tanstack/react-query";

export const useUpdateProfileMutation = () => {
  const { user, login } = useAuth();
  return useMutation({
    mutationFn: (payload: IUpdateUserPayload) => {
      if (!user?.id) throw new Error("Missing user id");
      return UserService.updateUser(payload, { id: user.id });
    },
    onSuccess: async (res) => {
      if (res?.data) {
        await login(res.data);
      }
      AppToast.success(res?.message || "Profile updated");
    },
    onError: (err: any) => {
      const msg =
        err?.response?.data?.error ||
        err?.message ||
        "Unable to update profile";
      AppToast.failed(msg);
    },
  });
};
