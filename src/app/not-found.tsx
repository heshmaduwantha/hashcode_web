import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white px-5 text-center text-neutral-950">
      <div className="text-[12px] font-mono uppercase tracking-widest text-neutral-400">
        404 // NOT FOUND
      </div>
      <h1 className="mt-3 text-4xl font-extrabold tracking-tight sm:text-5xl">
        Page does not exist
      </h1>
      <p className="mt-4 text-sm text-neutral-600">
        The page you are looking for was moved or doesn&apos;t exist.
      </p>
      <Link
        href="/"
        className="mt-6 inline-flex items-center justify-center rounded-full bg-neutral-950 px-6 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-neutral-800"
      >
        Return to Home
      </Link>
    </div>
  );
}

