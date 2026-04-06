// Billing Dashboard

import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Master from "./pages/Masters";
import Customers from "./pages/Customers";
import AddCustomer from "./pages/AddCusomter";
import Items from "./pages/Items";
import AddItem from "./pages/AddItem";
import Billing from "./pages/Billing";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/master" element={<Master />} />
        <Route path="/master/customers" element={<Customers />} />
        <Route path="/master/customers/add" element={<AddCustomer />} />
        <Route path="/master/items" element={<Items />} />
        <Route path="/master/items/add" element={<AddItem />} />
        <Route path="/billing" element={<Billing />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
