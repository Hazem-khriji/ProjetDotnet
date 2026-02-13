import { Routes, Route } from "react-router";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Signin from "./pages/Signin";
import Properties from "./pages/Properties";
import PropertyDetails from "./pages/PropertyDetails";
import AgentInquiries from "./pages/AgentInquiries";
import AgentProperties from "./pages/AgentProperties";
import AdminLayout from "./pages/AdminLayout";
import AdminStatistics from "./pages/AdminStatistics";
import AdminProperties from "./pages/AdminProperties";
import AdminUsers from "./pages/AdminUsers";
import './index.css'

function App() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/signin" element={<Signin />} />       
            <Route path="/properties" element={<Properties />} />
            <Route path="/property/:id" element={<PropertyDetails />} />
            <Route path="/agent/inquiries" element={<AgentInquiries />} />
            <Route path="/agent/properties" element={<AgentProperties />} />
            
            {/* Admin Routes */}
            <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminStatistics />} />
                <Route path="statistics" element={<AdminStatistics />} />
                <Route path="properties" element={<AdminProperties />} />
                <Route path="users" element={<AdminUsers />} />
            </Route>
        </Routes>
    );
}

export default App;
