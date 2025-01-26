import { RouterProvider } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./contexts/AuthContext";
import { router } from "./routes";

export default function App() {
  return (
    <AuthProvider>
      <Toaster position="top-center" />
      <RouterProvider router={router} />
    </AuthProvider>
  );
}
