import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MicrophoneIcon } from "../icons";
import { supabase } from "../services/supabase";

function Login() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

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

            navigate("/")
        } catch (err) {
            setErrors({ email: "Error al iniciar sesión" });
        } finally {
            setLoading(false);
        }
    };

    const inputClass = (field) =>
        `w-full px-4 py-3 rounded-2xl border text-sm outline-none transition-all duration-200 shadow-sm
        ${errors[field]
            ? "border-red-400 bg-red-50 focus:ring-2 focus:ring-red-200"
            : "border-gray-200 bg-white focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
        }`;

    return (
        <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-sky-50 via-white to-indigo-100 px-4 py-10">
            <div className="pointer-events-none absolute right-0 top-0 h-72 w-72 -translate-x-1/3 translate-y-1/3 rounded-full bg-sky-200 opacity-40 blur-3xl"></div>
            <div className="pointer-events-none absolute left-0 bottom-0 h-64 w-64 -translate-y-1/3 translate-x-1/4 rounded-full bg-indigo-200 opacity-30 blur-3xl"></div>

            <div className="relative mx-auto w-full max-w-lg">
                <div className="rounded-[2rem] bg-white/95 p-8 shadow-2xl shadow-slate-300/30 ring-1 ring-slate-200 backdrop-blur-xl">
                    <div className="flex flex-col items-center gap-3 text-center mb-8">
                        <div className="inline-flex items-center gap-2 rounded-full bg-sky-50 px-4 py-2 text-sky-700 shadow-sm ring-1 ring-sky-100">
                            <MicrophoneIcon className="text-sky-600" size={24} />
                            <span className="text-sm font-semibold uppercase tracking-[0.2em]">Habla Bien IA</span>
                        </div>
                        <div>
                            <h1 className="text-3xl font-semibold text-slate-900">Iniciar Sesión</h1>
                            <p className="mt-2 text-sm text-slate-500">Accede a tus ejercicios de oratoria y métricas personalizadas.</p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} noValidate className="space-y-5">
                        <div className="space-y-2">
                            <label htmlFor="email" className="text-sm font-medium text-slate-700">
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

                        <div className="space-y-2">
                            <label htmlFor="password" className="text-sm font-medium text-slate-700">
                                Contraseña
                            </label>
                            <div className="relative">
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    autoComplete="current-password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                    className={inputClass("password")}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((prev) => !prev)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-slate-500 hover:text-slate-800"
                                >
                                    {showPassword ? "Ocultar" : "Mostrar"}
                                </button>
                            </div>
                            {errors.password && (
                                <span className="text-xs text-red-500">{errors.password}</span>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-sky-500 to-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-500/10 transition duration-200 hover:scale-[1.01] hover:shadow-sky-500/20 disabled:cursor-not-allowed disabled:opacity-70"
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

                    <div className="mt-6 flex items-center justify-between text-sm text-slate-500">
                        <span>¿No tienes cuenta?</span>
                        <Link to="/register" className="font-semibold text-sky-600 hover:text-sky-700">
                            Regístrate aquí
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;
