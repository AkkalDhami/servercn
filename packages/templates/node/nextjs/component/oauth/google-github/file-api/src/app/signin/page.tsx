import { GoogleAndGitHubSignin } from "@/components/auth/google-github-signin";

export default function Page() {
  return (
    <div
      className={
        "flex h-screen w-full items-center justify-center bg-neutral-950"
      }>
      <GoogleAndGitHubSignin />
    </div>
  );
}
