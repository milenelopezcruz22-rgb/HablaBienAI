import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MicrophoneIcon } from "../icons";
import { useAuth } from "../context/AuthContext";

function Register() {
    const navigate = useNavigate();
    const { register } = useAuth();
    const [formData, setFormData] = useState({
        nombre: "",
        apellido: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const validate = () => {
        const newErrors = {};
        if (!formData.nombre.trim()) newErrors.nombre = "El nombre es requerido";
        if (!formData.apellido.trim()) newErrors.apellido = "El apellido es requerido";
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
        if (!formData.confirmPassword) {
            newErrors.confirmPassword = "Confirma tu contraseña";
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = "Las contraseñas no coinciden";
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
            await register(formData.email, formData.password, formData.nombre, formData.apellido);
            navigate("/");
        } catch (err) {
            setErrors({ email: err.message || "Error al crear la cuenta" });
        } finally {
            setLoading(false);
        }
    };

    const inputClass = (field) =>
        `w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all
        ${errors[field]
            ? "border-red-400 bg-red-50 focus:ring-2 focus:ring-red-200"
            : "border-gray-200 focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
        }`;

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-50 to-blue-100 px-4 py-10">
            <div className="w-full max-w-md">
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    <div className="flex flex-col items-center mb-8">
                        <div className="flex items-center gap-2 mb-2">
                            <MicrophoneIcon className="text-sky-500" size={28} />
                            <span className="text-xl font-semibold text-gray-800">Habla Bien IA</span>
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900 mt-2">Crear Cuenta</h1>
                        <p className="text-gray-500 text-sm mt-1">Únete y mejora tu oratoria</p>
                    </div>

                    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
                        <div className="flex gap-3">
                            <div className="flex flex-col gap-1 flex-1">
                                <label htmlFor="nombre" className="text-sm font-medium text-gray-700">
                                    Nombre
                                </label>
                                <input
                                    id="nombre"
                                    name="nombre"
                                    type="text"
                                    autoComplete="given-name"
                                    value={formData.nombre}
                                    onChange={handleChange}
                                    placeholder="Juan"
                                    className={inputClass("nombre")}
                                />
                                {errors.nombre && (
                                    <span className="text-xs text-red-500">{errors.nombre}</span>
                                )}
                            </div>
                            <div className="flex flex-col gap-1 flex-1">
                                <label htmlFor="apellido" className="text-sm font-medium text-gray-700">
                                    Apellido
                                </label>
                                <input
                                    id="apellido"
                                    name="apellido"
                                    type="text"
                                    autoComplete="family-name"
                                    value={formData.apellido}
                                    onChange={handleChange}
                                    placeholder="Pérez"
                                    className={inputClass("apellido")}
                                />
                                {errors.apellido && (
                                    <span className="text-xs text-red-500">{errors.apellido}</span>
                                )}
                            </div>
                        </div>

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
                                className={inputClass("email")}
                            />
                            {errors.email && (
                                <span className="text-xs text-red-500">{errors.email}</span>
                            )}
                        </div>

                        <div className="flex flex-col gap-1">
                            <label htmlFor="password" className="text-sm font-medium text-gray-700">
                                Contraseña
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="new-password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="••••••••"
                                className={inputClass("password")}
                            />
                            {errors.password && (
                                <span className="text-xs text-red-500">{errors.password}</span>
                            )}
                        </div>

                        <div className="flex flex-col gap-1">
                            <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                                Confirmar contraseña
                            </label>
                            <input
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                autoComplete="new-password"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                placeholder="••••••••"
                                className={inputClass("confirmPassword")}
                            />
                            {errors.confirmPassword && (
                                <span className="text-xs text-red-500">{errors.confirmPassword}</span>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 disabled:from-blue-300 disabled:to-indigo-300 text-white font-semibold py-3 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 mt-2 shadow-md hover:shadow-lg"
                        >
                            {loading ? (
                                <>
                                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                    </svg>
                                    Creando cuenta...
                                </>
                            ) : (
                                "Crear Cuenta"
                            )}
                        </button>
                    </form>

                    <p className="text-center text-sm text-gray-500 mt-6">
                        ¿Ya tienes cuenta?{" "}
                        <Link to="/login" className="text-blue-500 font-medium hover:text-blue-700 hover:underline transition-colors">
                            Inicia sesión
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Register;
