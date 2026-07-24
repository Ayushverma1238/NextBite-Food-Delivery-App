import { FaInbox } from "react-icons/fa";

const EmptyState = ({
  title = "No Data Available",
  description = "There is nothing to display right now.",
  icon = <FaInbox className="text-6xl text-slate-300" />,
}) => {
  return (
    <div className="flex min-h-75 w-fu flex-col items-center justify-center rounded-3xl border-2 border-dashed border-slate-200 bg-white p-8 text-center">
      <div className="mb-5">{icon}</div>

      <h3 className="text-xl font-bold text-slate-700">
        {title}
      </h3>

      <p className="mt-2 max-w-sm text-sm text-slate-500">
        {description}
      </p>
    </div>
  );
};

export default EmptyState;