import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-orange-50 px-6">
      <h1 className="text-8xl font-extrabold text-orange-500">404</h1>

      <h2 className="mt-4 text-3xl font-bold text-gray-800">Page Not Found</h2>

      <p className="mt-3 text-gray-500 text-center">
        Oops! The page you're looking for doesn't exist.
      </p>

      <Link
        to="/"
        className="mt-8 rounded-xl bg-orange-500 px-8 py-3 font-semibold text-white transition hover:bg-orange-600"
      >
        Back to Home
      </Link>
    </div>
  );
};

export default NotFound;
