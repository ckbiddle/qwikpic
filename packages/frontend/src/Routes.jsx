import { Route, Routes } from "react-router-dom";
import Home from "./containers/Home.jsx";
import NotFound from "./containers/NotFound.jsx";

export default function Links() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      {/* Finally, catch all unmatched routes */}
      <Route path="*" element={<NotFound />} />;
    </Routes>
  );
}