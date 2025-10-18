"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "customer",
    restaurant_name: "", // Added for vendor/charity
    address: "", // Added for vendor/charity
    phone: "", // Added for customer/vendor/charity
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!form.name.trim()) newErrors.name = "Name is required.";
    if (form.role !== "customer" && !form.email.match(/^\S+@\S+\.\S+$/)) newErrors.email = "Enter a valid email.";
    if (form.role !== "customer" && form.password.length < 8)
      newErrors.password = "Password must be at least 8 characters.";
    if (form.role !== "customer" && (!/[A-Z]/.test(form.password) || !/[0-9]/.test(form.password)))
      newErrors.password = "Password must contain a number and uppercase letter.";
    if (form.role !== "customer" && form.password !== form.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match.";
    if (form.role !== "customer" && !form.restaurant_name.trim()) newErrors.restaurant_name = "Restaurant/Organization Name is required.";
    if (!form.phone.trim()) newErrors.phone = "Phone number is required.";

    return newErrors;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const validation = validate();
    setErrors(validation);
    if (Object.keys(validation).length === 0) {
      try {
        let payload: any = {
          name: form.name,
          role: form.role,
          phone: form.phone,
        };

        if (form.role !== "customer") {
          payload = {
            ...payload,
            email: form.email,
            password: form.password,
            restaurant_name: form.restaurant_name,
            address: form.address,
          };
        }

        // Ensure role is valid
        if (!["customer", "vendor", "admin", "charity"].includes(payload.role)) {
          throw new Error("Invalid role selected.");
        }

        // Map 'charity' role to 'admin' before sending to the backend
        if (payload.role === "charity") {
          payload.role = "admin";
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/signup`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.detail || "Signup failed");
        }

        setSubmitted(true);
        setTimeout(() => router.push("/auth"), 3000); // Redirect to login page after 3 seconds
      } catch (err: any) {
        setError(err.message);
      }
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white px-4 overflow-hidden">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8 z-10 relative">
        <h1 className="text-2xl font-bold mb-6 text-center text-blue-700">Create your CharityEats account</h1>
        {error && <p className="text-red-600 text-sm mb-4">{error}</p>}
        {submitted ? (
          <div className="text-green-700 text-center font-semibold">Account created! Please check your email to verify your account.</div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                className={`mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-black ${errors.name ? 'border-red-500' : ''}`}
                value={form.name}
                onChange={handleChange}
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? 'name-error' : undefined}
              />
              {errors.name && <p id="name-error" className="text-red-600 text-xs mt-1">{errors.name}</p>}
            </div>

            {form.role !== "customer" && (
              <>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email address</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className={`mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-black ${errors.email ? 'border-red-500' : ''}`}
                    value={form.email}
                    onChange={handleChange}
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? 'email-error' : undefined}
                  />
                  {errors.email && <p id="email-error" className="text-red-600 text-xs mt-1">{errors.email}</p>}
                </div>
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    required
                    className={`mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-black ${errors.password ? 'border-red-500' : ''}`}
                    value={form.password}
                    onChange={handleChange}
                    aria-invalid={!!errors.password}
                    aria-describedby={errors.password ? 'password-error' : undefined}
                  />
                  {errors.password && <p id="password-error" className="text-red-600 text-xs mt-1">{errors.password}</p>}
                </div>
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm Password</label>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    required
                    className={`mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-black ${errors.confirmPassword ? 'border-red-500' : ''}`}
                    value={form.confirmPassword}
                    onChange={handleChange}
                    aria-invalid={!!errors.confirmPassword}
                    aria-describedby={errors.confirmPassword ? 'confirmPassword-error' : undefined}
                  />
                  {errors.confirmPassword && <p id="confirmPassword-error" className="text-red-600 text-xs mt-1">{errors.confirmPassword}</p>}
                </div>
                <div>
                  <label htmlFor="restaurant_name" className="block text-sm font-medium text-gray-700">Restaurant/Organization Name</label>
                  <input
                    id="restaurant_name"
                    name="restaurant_name"
                    type="text"
                    required
                    className={`mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-black ${errors.restaurant_name ? 'border-red-500' : ''}`}
                    value={form.restaurant_name}
                    onChange={handleChange}
                    aria-invalid={!!errors.restaurant_name}
                    aria-describedby={errors.restaurant_name ? 'restaurant_name-error' : undefined}
                  />
                  {errors.restaurant_name && <p id="restaurant_name-error" className="text-red-600 text-xs mt-1">{errors.restaurant_name}</p>}
                </div>
                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address (Optional)</label>
                  <input
                    id="address"
                    name="address"
                    type="text"
                    className={`mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-black ${errors.address ? 'border-red-500' : ''}`}
                    value={form.address}
                    onChange={handleChange}
                    aria-invalid={!!errors.address}
                    aria-describedby={errors.address ? 'address-error' : undefined}
                  />
                  {errors.address && <p id="address-error" className="text-red-600 text-xs mt-1">{errors.address}</p>}
                </div>
              </>
            )}

            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700">Role</label>
              <select
                id="role"
                name="role"
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-black"
                value={form.role}
                onChange={handleChange}
                required
              >
                <option value="customer">Customer</option>
                <option value="vendor">Vendor</option>
                <option value="charity">Charity/Organizer</option>
              </select>
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone Number</label>
              <input
                id="phone"
                name="phone"
                type="text"
                required
                className={`mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-black ${errors.phone ? 'border-red-500' : ''}`}
                value={form.phone}
                onChange={handleChange}
                aria-invalid={!!errors.phone}
                aria-describedby={errors.phone ? 'phone-error' : undefined}
              />
              {errors.phone && <p id="phone-error" className="text-red-600 text-xs mt-1">{errors.phone}</p>}
            </div>

            <button
              type="submit"
              className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Sign up
            </button>
            <div className="text-center text-sm mt-2">
              <a href="/auth" className="text-blue-600 hover:underline">Already have an account? Sign in</a>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
