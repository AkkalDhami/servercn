export default function NotFound() {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="flex items-center  text-center flex-col p-6 sm:p-12 space-y-6">
        <h1 className="text-6xl font-mono sm:text-8xl font-extrabold">404</h1>
        <h2 className="text-5xl text-muted-primary font-mono sm:text-7xl font-bold">
          Page Not Found!
        </h2>
        <p className="text-2xl font-mono text-muted-secondary sm:text-4xl font-medium">
          The page you are looking for does not exist.
        </p>
      </div>
    </div>
  );
}
