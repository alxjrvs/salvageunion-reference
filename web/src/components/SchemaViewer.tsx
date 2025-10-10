import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type { SchemaInfo, DataItem } from "../types/schema";
import DataTable from "./DataTable";

interface SchemaViewerProps {
  schemas: SchemaInfo[];
}

export default function SchemaViewer({ schemas }: SchemaViewerProps) {
  const { schemaId } = useParams<{ schemaId: string }>();
  const [data, setData] = useState<DataItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const currentSchema = schemas.find((s) => s.id === schemaId);

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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-xl">Loading data...</div>
      </div>
    );
  }

  if (error || !currentSchema) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-xl text-red-600">
          Error: {error || "Schema not found"}
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="bg-white shadow-sm border-b border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-800">
          {currentSchema.title}
        </h2>
        <p className="text-gray-600 mt-1">{currentSchema.description}</p>
      </div>
      <div className="flex-1 overflow-auto">
        <DataTable data={data} schema={currentSchema} />
      </div>
    </div>
  );
}
