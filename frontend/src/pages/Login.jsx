import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MicrophoneIcon } from "../icons";
import { supabase } from "../services/supabase";

function Login() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const validate = () => {
        const newErrors = {};
        if (!formData.email.trim()) {
            newErrors.email = "El correo es requerido";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = "Ingresa un correo válido";
        }
        if (!formData.password) {
            newErrors.password = "La contraseña es requerida";
        } else if (formData.password.length < 6) {
            newErrors.password = "Mínimo 6 caracteres";
        }
        return newErrors;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }
        setLoading(true);

        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email: formData.email,
                password: formData.password,
            });

            if (error) {
                setErrors({ email: "Correo o contraseña incorrectos" });
                return;
            }

            navigate("/camara");
        } catch (err) {
            setErrors({ email: "Error al iniciar sesión" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-50 to-blue-100 px-4">
            <div className="w-full max-w-md">
                {/* Card */}
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    {/* Logo y título */}
                    <div className="flex flex-col items-center mb-8">
                        <div className="flex items-center gap-2 mb-2">
                            <MicrophoneIcon className="text-sky-500" size={28} />
                            <span className="text-xl font-semibold text-gray-800">Habla Bien IA</span>
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900 mt-2">Iniciar Sesión</h1>
                        <p className="text-gray-500 text-sm mt-1">Bienvenido de nuevo</p>
                    </div>

                    {/* Formulario */}
                    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
                        {/* Email */}
                        <div className="flex flex-col gap-1">
                            <label htmlFor="email" className="text-sm font-medium text-gray-700">
                                Correo electrónico
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="tucorreo@ejemplo.com"
                                className={`w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all
                                    ${errors.email
                                        ? "border-red-400 bg-red-50 focus:ring-2 focus:ring-red-200"
                                        : "border-gray-200 focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                                    }`}
                            />
                            {errors.email && (
                                <span className="text-xs text-red-500 mt-0.5">{errors.email}</span>
                            )}
                        </div>

                        {/* Contraseña */}
                        <div className="flex flex-col gap-1">
                            <label htmlFor="password" className="text-sm font-medium text-gray-700">
                                Contraseña
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="••••••••"
                                className={`w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all
                                    ${errors.password
                                        ? "border-red-400 bg-red-50 focus:ring-2 focus:ring-red-200"
                                        : "border-gray-200 focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                                    }`}
                            />
                            {errors.password && (
                                <span className="text-xs text-red-500 mt-0.5">{errors.password}</span>
                            )}
                        </div>

                        {/* Botón submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white font-semibold py-3 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 mt-1 shadow-md hover:shadow-lg"
                        >
                            {loading ? (
                                <>
                                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                    </svg>
                                    Ingresando...
                                </>
                            ) : (
                                "Ingresar"
                            )}
                        </button>
                    </form>

                    {/* Link a registro */}
                    <p className="text-center text-sm text-gray-500 mt-6">
                        ¿No tienes cuenta?{" "}
                        <Link to="/register" className="text-blue-500 font-medium hover:text-blue-700 hover:underline transition-colors">
                            Regístrate aquí
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Login;
