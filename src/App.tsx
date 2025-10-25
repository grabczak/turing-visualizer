import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

import { Table } from "src/components/Table";
import { Tape } from "src/components/Tape";
import { store, persistor } from "src/store";

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <div className="py-8">
          <h1 className="text-center text-4xl font-bold tracking-tight">Turing Machine Visualizer</h1>
          <div className="py-4 text-center font-semibold lg:hidden">
            <h2>⚠️ Warning ⚠️</h2>
            This app is optimized for desktop screens.
            <br />
            Some features may not display correctly on mobile devices.
          </div>
          <Table />
          <Tape />
        </div>
      </PersistGate>
    </Provider>
  );
}

export default App;
