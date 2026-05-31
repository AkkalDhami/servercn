import { OAuthSignin } from "@/components/auth/oauth-signin";

export default function Page() {
  return (
    <div className={"flex bg-neutral-950 h-screen w-full items-center justify-center"}>
      <OAuthSignin />
    </div>
  );
}
