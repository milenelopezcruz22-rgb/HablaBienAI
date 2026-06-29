import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { MicrophoneIcon } from "../icons";
import { useAuth } from "../context/AuthContext";

function PasswordInput({ value, onChange, error, placeholder, name, autoComplete, inputClass }) {
    const [show, setShow] = useState(false);
    return (
        <div className="relative">
            <input type={show ? "text" : "password"} name={name} autoComplete={autoComplete}
                value={value} onChange={onChange}
                placeholder={placeholder} className={inputClass(name)} />
            <button type="button" onClick={() => setShow(!show)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                {show ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                        <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                    </svg>
                )}
            </button>
        </div>
    );
}

function LoginForm({ onSuccess }) {
    const { login } = useAuth();
    const [form, setForm] = useState({ email: "", password: "" });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const validate = () => {
        const e = {};
        if (!form.email.trim()) e.email = "El correo es requerido";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Correo inválido";
        if (!form.password) e.password = "La contraseña es requerida";
        else if (form.password.length < 6) e.password = "Mínimo 6 caracteres";
        return e;
    };

    const handleSubmit = async (ev) => {
        ev.preventDefault();
        const v = validate();
        if (Object.keys(v).length) { setErrors(v); return; }
        setLoading(true);
        try {
            await login(form.email, form.password);
            onSuccess();
        } catch (err) {
            setErrors({ email: err.message || "Credenciales incorrectas" });
        } finally {
            setLoading(false);
        }
    };

    const inputClass = (f) =>
        `w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all ${
            errors[f]
                ? "border-red-400 bg-red-50 focus:ring-2 focus:ring-red-200"
                : "border-gray-200 focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
        }`;

    return (
        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
            <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">Correo electrónico</label>
                <input type="email" name="email" autoComplete="email"
                    value={form.email} onChange={e => { setForm(p => ({ ...p, email: e.target.value })); setErrors(p => ({ ...p, email: "" })); }}
                    placeholder="tucorreo@ejemplo.com" className={inputClass("email")} />
                {errors.email && <span className="text-xs text-red-500 mt-0.5">{errors.email}</span>}
            </div>
            <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">Contraseña</label>
                <PasswordInput value={form.password}
                    onChange={e => { setForm(p => ({ ...p, password: e.target.value })); setErrors(p => ({ ...p, password: "" })); }}
                    placeholder="••••••••" name="password" autoComplete="current-password" error={errors.password} inputClass={inputClass} />
                {errors.password && <span className="text-xs text-red-500 mt-0.5">{errors.password}</span>}
            </div>
            <button type="submit" disabled={loading}
                className="w-full border-2 border-sky-300 text-sky-600 font-semibold py-3 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 mt-1 hover:bg-sky-50 hover:shadow-sm disabled:opacity-50 disabled:cursor-not-allowed">
                {loading ? (
                    <><svg className="animate-spin h-4 w-4 text-sky-500" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg> Ingresando...</>
                ) : "Ingresar"}
            </button>
        </form>
    );
}

function RegisterForm({ onSuccess }) {
    const { register } = useAuth();
    const [form, setForm] = useState({ nombre: "", apellido: "", email: "", password: "", confirmPassword: "" });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const validate = () => {
        const e = {};
        if (!form.nombre.trim()) e.nombre = "Requerido";
        if (!form.apellido.trim()) e.apellido = "Requerido";
        if (!form.email.trim()) e.email = "El correo es requerido";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Correo inválido";
        if (!form.password) e.password = "Requerida";
        else if (form.password.length < 6) e.password = "Mínimo 6 caracteres";
        if (!form.confirmPassword) e.confirmPassword = "Confirma tu contraseña";
        else if (form.password !== form.confirmPassword) e.confirmPassword = "No coinciden";
        return e;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(p => ({ ...p, [name]: value }));
        if (errors[name]) setErrors(p => ({ ...p, [name]: "" }));
    };

    const handleSubmit = async (ev) => {
        ev.preventDefault();
        const v = validate();
        if (Object.keys(v).length) { setErrors(v); return; }
        setLoading(true);
        try {
            await register(form.email, form.password, form.nombre, form.apellido);
            onSuccess();
        } catch (err) {
            setErrors({ email: err.message || "Error al crear la cuenta" });
        } finally {
            setLoading(false);
        }
    };

    const inputClass = (f) =>
        `w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all ${
            errors[f]
                ? "border-red-400 bg-red-50 focus:ring-2 focus:ring-red-200"
                : "border-gray-200 focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
        }`;

    return (
        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
            <div className="flex gap-3">
                <div className="flex flex-col gap-1 flex-1">
                    <label className="text-sm font-medium text-gray-700">Nombre</label>
                    <input name="nombre" type="text" value={form.nombre} onChange={handleChange} placeholder="Juan" className={inputClass("nombre")} />
                    {errors.nombre && <span className="text-xs text-red-500">{errors.nombre}</span>}
                </div>
                <div className="flex flex-col gap-1 flex-1">
                    <label className="text-sm font-medium text-gray-700">Apellido</label>
                    <input name="apellido" type="text" value={form.apellido} onChange={handleChange} placeholder="Pérez" className={inputClass("apellido")} />
                    {errors.apellido && <span className="text-xs text-red-500">{errors.apellido}</span>}
                </div>
            </div>
            <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">Correo electrónico</label>
                <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="tucorreo@ejemplo.com" className={inputClass("email")} />
                {errors.email && <span className="text-xs text-red-500">{errors.email}</span>}
            </div>
            <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">Contraseña</label>
                <PasswordInput value={form.password}
                    onChange={handleChange}
                    placeholder="••••••••" name="password" autoComplete="new-password" inputClass={inputClass} />
                {errors.password && <span className="text-xs text-red-500">{errors.password}</span>}
            </div>
            <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">Confirmar contraseña</label>
                <PasswordInput value={form.confirmPassword}
                    onChange={handleChange}
                    placeholder="••••••••" name="confirmPassword" autoComplete="new-password" inputClass={inputClass} />
                {errors.confirmPassword && <span className="text-xs text-red-500">{errors.confirmPassword}</span>}
            </div>
            <button type="submit" disabled={loading}
                className="w-full bg-gradient-to-r from-sky-400 to-blue-500 text-white hover:from-sky-500 hover:to-blue-600 disabled:from-sky-200 disabled:to-blue-200 disabled:text-sky-100 font-semibold py-3 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 mt-2 shadow-sm hover:shadow-md">
                {loading ? (
                    <><svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg> Creando cuenta...</>
                ) : "Crear Cuenta"}
            </button>
        </form>
    );
}

export default function AuthPage({ isModal = false, onClose }) {
    const navigate = useNavigate();
    const location = useLocation();
    const [isLogin, setIsLogin] = useState(location.pathname === "/login");
    const [animating, setAnimating] = useState(false);
    const [animClass, setAnimClass] = useState("");
    const indicatorRef = useRef(null);
    const tabsRef = useRef(null);
    const contentRef = useRef(null);

    useEffect(() => {
        const target = location.pathname === "/login";
        if (target !== isLogin) {
            setIsLogin(target);
        }
    }, [location.pathname]);

    useEffect(() => {
        if (tabsRef.current && indicatorRef.current) {
            const activeTab = tabsRef.current.children[isLogin ? 0 : 1];
            if (activeTab) {
                indicatorRef.current.style.width = `${activeTab.offsetWidth}px`;
                indicatorRef.current.style.transform = `translateX(${activeTab.offsetLeft}px)`;
            }
        }
    }, [isLogin]);

    useEffect(() => {
        if (!isModal) return;
        document.body.style.overflow = "hidden";
        return () => { document.body.style.overflow = ""; };
    }, [isModal]);

    const toggle = (login) => {
        if (animating) return;
        setAnimating(true);
        setAnimClass("animate-slide-up-out");
        setTimeout(() => {
            setIsLogin(login);
            navigate(login ? "/login" : "/register", { replace: true });
            setAnimClass("animate-slide-up-in");
            setTimeout(() => {
                setAnimClass("");
                setAnimating(false);
            }, 350);
        }, 250);
    };

    const handleSuccess = useCallback(() => {
        if (isModal) onClose?.();
        else navigate("/");
    }, [isModal, onClose, navigate]);

    const card = (isModalCard = false) => (
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="px-8 pt-8 pb-2">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                        <MicrophoneIcon className="text-sky-500" size={28} />
                        <span className="text-xl font-semibold text-gray-800">Habla Bien IA</span>
                    </div>
                    {isModalCard && (
                        <button
                            onClick={onClose}
                            className="w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                            aria-label="Cerrar"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                        </button>
                    )}
                </div>

                <div ref={tabsRef} className="relative flex border-b border-gray-200 mb-6">
                    <button onClick={() => toggle(true)}
                        className={`flex-1 pb-3 text-sm font-semibold transition-colors duration-300 relative z-10 ${isLogin ? "text-sky-600" : "text-gray-400 hover:text-gray-600"}`}>
                        Iniciar Sesión
                    </button>
                    <button onClick={() => toggle(false)}
                        className={`flex-1 pb-3 text-sm font-semibold transition-colors duration-300 relative z-10 ${!isLogin ? "text-sky-600" : "text-gray-400 hover:text-gray-600"}`}>
                        Crear Cuenta
                    </button>
                    <div ref={indicatorRef}
                        className="absolute bottom-0 h-0.5 bg-gradient-to-r from-sky-400 to-blue-500 rounded-full transition-all duration-300 ease-in-out" />
                </div>
            </div>

            <div className="relative overflow-hidden px-8 pb-8">
                <div ref={contentRef} className={animClass}>
                    {isLogin
                        ? <LoginForm onSuccess={handleSuccess} />
                        : <RegisterForm onSuccess={handleSuccess} />}
                </div>

                <div className="text-center text-sm text-gray-500 mt-6">
                    {isLogin ? (
                        <>¿No tienes cuenta?{" "}
                            <button onClick={() => toggle(false)}
                                className="text-sky-600 font-medium hover:text-sky-800 hover:underline transition-colors bg-transparent border-none cursor-pointer">
                                Regístrate aquí
                            </button>
                        </>
                    ) : (
                        <>¿Ya tienes cuenta?{" "}
                            <button onClick={() => toggle(true)}
                                className="text-sky-600 font-medium hover:text-sky-800 hover:underline transition-colors bg-transparent border-none cursor-pointer">
                                Inicia sesión
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );

    if (isModal) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-8">
                <div className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-backdrop-in" />
                <div className="relative z-10 w-full max-w-md animate-slide-up-in">
                    {card(true)}
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-50 to-blue-100 px-4 py-10">
            <div className="w-full max-w-md">
                {card(false)}
            </div>
        </div>
    );
}
