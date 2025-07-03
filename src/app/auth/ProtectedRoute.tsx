import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

interface DecodedToken {
  role: "admin" | "vendor" | "customer";
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.replace("/auth"); // Redirect to login page if no token is found
      return;
    }

    try {
      const decoded: DecodedToken = jwtDecode(token);
      switch (decoded.role) {
        case "admin":
          router.replace("/admin");
          break;
        case "vendor":
          router.replace("/vendor");
          break;
        case "customer":
          router.replace("/customer");
          break;
        default:
          router.replace("/auth");
      }
    } catch (error) {
      console.error("Invalid token", error);
      router.replace("/auth");
    }
  }, [router]);

  return <>{children}</>;
};

export default ProtectedRoute;