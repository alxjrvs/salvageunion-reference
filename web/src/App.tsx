import { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Navigation from "./components/Navigation";
import SchemaViewer from "./components/SchemaViewer";
import ItemShowPage from "./components/ItemShowPage";
import type { SchemaIndex } from "./types/schema";

function App() {
  const [schemaIndex, setSchemaIndex] = useState<SchemaIndex | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/schemas/index.json")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load schema index");
        return res.json();
      })
      .then((data) => {
        setSchemaIndex(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl">Loading schemas...</div>
      </div>
    );
  }

  if (error || !schemaIndex) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl text-red-600">
          Error: {error || "Failed to load schemas"}
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="flex h-screen bg-gray-100">
        <Navigation schemas={schemaIndex.schemas} />
        <main className="flex-1 overflow-auto">
          <Routes>
            <Route
              path="/"
              element={
                <Navigate
                  to={`/schema/${schemaIndex.schemas[0]?.id || ""}`}
                  replace
                />
              }
            />
            <Route
              path="/schema/:schemaId"
              element={<SchemaViewer schemas={schemaIndex.schemas} />}
            />
            <Route
              path="/schema/:schemaId/item/:itemIndex"
              element={<ItemShowPage schemas={schemaIndex.schemas} />}
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
