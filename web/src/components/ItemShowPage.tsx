import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import type { ReactElement } from "react";
import type { SchemaInfo, DataItem } from "../types/schema";

interface ItemShowPageProps {
  schemas: SchemaInfo[];
}

export default function ItemShowPage({ schemas }: ItemShowPageProps) {
  const { schemaId, itemIndex } = useParams<{
    schemaId: string;
    itemIndex: string;
  }>();
  const navigate = useNavigate();
  const [data, setData] = useState<DataItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const currentSchema = schemas.find((s) => s.id === schemaId);
  const itemIdx = itemIndex ? parseInt(itemIndex, 10) : -1;
  const item = data[itemIdx];

  useEffect(() => {
    if (!currentSchema) {
      setError("Schema not found");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    fetch(`/${currentSchema.dataFile}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load data");
        return res.json();
      })
      .then((jsonData) => {
        setData(jsonData);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [currentSchema]);

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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (error || !currentSchema || !item) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-xl text-red-600">
          Error: {error || "Item not found"}
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-gray-50">
      <div className="bg-white shadow-sm border-b border-gray-200 p-6">
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={() => navigate(`/schema/${schemaId}`)}
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            ← Back to {currentSchema.title}
          </button>
        </div>
        <h2 className="text-3xl font-bold text-gray-800">
          {(item.name as string) || "Item Details"}
        </h2>
        <p className="text-gray-600 mt-2">{currentSchema.description}</p>
      </div>

      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
          <div className="space-y-6">
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
                  className="border-b border-gray-200 pb-6 last:border-b-0"
                >
                  <div className="font-semibold text-gray-700 mb-3 text-lg capitalize">
                    {key.replace(/([A-Z])/g, " $1").trim()}
                  </div>
                  <div className="text-gray-900 text-base">
                    {formatValue(value)}
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
