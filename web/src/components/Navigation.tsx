import { Link, useParams } from "react-router-dom";
import type { SchemaInfo } from "../types/schema";

interface NavigationProps {
  schemas: SchemaInfo[];
}

export default function Navigation({ schemas }: NavigationProps) {
  const { schemaId } = useParams<{ schemaId: string }>();

  return (
    <nav className="w-64 bg-white shadow-lg overflow-y-auto">
      <Link
        to="/"
        className="block p-4 border-b border-gray-200 hover:bg-gray-50 transition-colors"
      >
        <h1 className="text-xl font-bold text-gray-800">Salvage Union</h1>
        <p className="text-sm text-gray-600">Data Viewer</p>
      </Link>
      <ul className="py-2">
        {schemas.map((schema) => (
          <li key={schema.id}>
            <Link
              to={`/schema/${schema.id}`}
              className={`block px-4 py-3 hover:bg-gray-100 transition-colors ${
                schemaId === schema.id
                  ? "bg-blue-50 border-l-4 border-blue-500 text-blue-700"
                  : "text-gray-700"
              }`}
            >
              <div className="font-medium">
                {schema.title.replace("Salvage Union ", "")}
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
