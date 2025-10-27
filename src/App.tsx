import { useProperties } from "./hooks/useProperties";

function App() {
  const { properties, loading, error } = useProperties();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <>
      <h1>Properties: {properties.length}</h1>
      {properties.map((property) => (
        <div key={property.id}>
          <h3>{property.title}</h3>
          <p>{property.location}</p>
          <p>${property.price}</p>
          <img src={property.image} alt={property.title} />
        </div>
      ))}
    </>
  );
}

export default App;
