import { useProperties } from "./hooks/useProperties";
import PropertyList from "./components/PropertyList/PropertyList";
import Spinner from "./components/Spinner/Spinner";

function App() {
  const { properties, isLoading, error } = useProperties();
  if (isLoading) return <Spinner />;
  if (error) return <div>Error: {error}</div>;
  return <PropertyList properties={properties} />;
}

export default App;
