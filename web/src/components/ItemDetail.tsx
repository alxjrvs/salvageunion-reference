import type { ReactElement } from "react";
import type { DataItem } from "../types/schema";

interface ItemDetailProps {
  item: DataItem;
  onClose: () => void;
}

export default function ItemDetail({ item, onClose }: ItemDetailProps) {
  const formatValue = (value: unknown): ReactElement => {
    if (value === undefined || value === null) {
      return <span className="text-gray-400">-</span>;
    }

    if (Array.isArray(value)) {
      return (
        <ul className="list-disc list-inside space-y-1">
          {value.map((v, i) => (
            <li key={i}>{formatValue(v)}</li>
          ))}
        </ul>
      );
    }

    if (typeof value === "object") {
      return (
        <div className="ml-4 space-y-2">
          {Object.entries(value).map(([k, v]) => (
            <div key={k}>
              <span className="font-medium text-gray-700">{k}: </span>
              {formatValue(v)}
            </div>
          ))}
        </div>
      );
    }

    if (typeof value === "boolean") {
      return (
        <span className={value ? "text-green-600" : "text-red-600"}>
          {value ? "Yes" : "No"}
        </span>
      );
    }

    return <span>{String(value)}</span>;
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-xl font-bold text-gray-800">
            {(item.name as string) || "Item Details"}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
          >
            ×
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
          <div className="space-y-4">
            {Object.entries(item)
              .sort(([a], [b]) => {
                // Sort: name first, then other fields alphabetically
                if (a === "name") return -1;
                if (b === "name") return 1;
                return a.localeCompare(b);
              })
              .map(([key, value]) => (
                <div
                  key={key}
                  className="border-b border-gray-200 pb-4 last:border-b-0"
                >
                  <div className="font-semibold text-gray-700 mb-2 capitalize">
                    {key.replace(/([A-Z])/g, " $1").trim()}
                  </div>
                  <div className="text-gray-900">{formatValue(value)}</div>
                </div>
              ))}
          </div>
        </div>

        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
