const EmptyCart = () => {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
      <div className="text-8xl">🛒</div>

      <h2 className="mt-6 text-3xl font-bold text-gray-800">
        Your Cart is Empty
      </h2>

      <p className="mt-3 text-gray-500">
        Looks like you haven't added any delicious food yet.
      </p>

      <a
        href="/restaurants"
        className="mt-8 rounded-xl bg-orange-500 px-8 py-3 font-semibold text-white transition hover:bg-orange-600"
      >
        Browse Restaurants
      </a>
    </div>
  );
};

export default EmptyCart;
