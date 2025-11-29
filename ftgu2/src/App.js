import Graph from './components/Graph.jsx'

function App() {

  const nodes = [
    { id: "A", color: "steelblue" },
    { id: "B" },
    { id: "C" },
    { id: "D" }
  ];

  const links = [
    { source: "A", target: "B" },
    { source: "A", target: "C" },
    { source: "B", target: "D" }
  ];

  return (
    <div className="App">
      <Graph nodes={nodes} links={links} nodeRadius={20} />
    </div>
  );
}

export default App;
