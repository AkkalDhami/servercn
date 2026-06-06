import { GitHubSignin } from "@/components/auth/github-signin";

export default function Page() {
  return (
    <div
      className={
        "flex h-screen w-full items-center justify-center bg-neutral-950"
      }>
      <GitHubSignin />
    </div>
  );
}
