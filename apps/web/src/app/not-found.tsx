export default function NotFound() {
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="flex flex-col items-center space-y-6 p-6 text-center sm:p-12">
        <h1 className="font-mono text-6xl font-extrabold sm:text-8xl">404</h1>
        <h2 className="text-muted-primary font-mono text-5xl font-bold sm:text-7xl">
          Page Not Found!
        </h2>
        <p className="text-muted-secondary font-mono text-2xl font-medium sm:text-4xl">
          The page you are looking for does not exist.
        </p>
      </div>
    </div>
  );
}
