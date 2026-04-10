import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import api from "../api/axios"
import axios from "axios"
import type { RegisterRequest } from "../types/auts"

export const Register = () => {
    const navigate = useNavigate()

    const [form, setForm] = useState<RegisterRequest>({
        fullName: "",
        email: "",
        tell: "",
        password: "",
    })

    const [message, setMessage] = useState("")
    const [type, setType] = useState<"success" | "error" | "">("")

    const password = form.password

    const hasMinLength = password.length >= 8
    const hasUpper = /[A-Z]/.test(password)
    const hasLower = /[a-z]/.test(password)
    const hasNumber = /[0-9]/.test(password)

    const strength = [hasMinLength, hasUpper, hasLower, hasNumber].filter(Boolean).length
    const isPasswordValid = strength === 4

    const getStrengthColor = () => {
        if (strength <= 1) return "bg-red-500"
        if (strength === 2) return "bg-orange-500"
        if (strength === 3) return "bg-yellow-400"
        return "bg-green-500"
    }

    const showPopup = (msg: string, t: "success" | "error") => {
        setMessage(msg)
        setType(t)
        setTimeout(() => {
            setMessage("")
            setType("")
        }, 3000)
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        })
    }

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!isPasswordValid) {
            showPopup("La contraseña no es segura", "error")
            return
        }

        try {
            await api.post("/user/register", form)
            showPopup("Usuario registrado correctamente", "success")
            setForm({
                fullName: "",
                email: "",
                tell: "",
                password: "",
            })
            setTimeout(() => {
                navigate("/register/VerifyEmailPage")
            }, 2000)
        } catch (error) {
            if (axios.isAxiosError(error)) {
                showPopup(
                    error.response?.data?.detail || "El usuario ya está registrado",
                    "error"
                )
            } else {
                showPopup("Error desconocido", "error")
            }
        }
    }

    return (
        <>
            {/* Popup superior - MISMO ESTILO DEL LOGIN */}
            {message && (
                <div className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 p-3 sm:p-4 rounded-2xl shadow-2xl max-w-sm w-11/12 sm:w-auto mx-2 border transition-all duration-300 ease-out animate-in slide-in-from-top-2 fade-in zoom-in ${
                    type === "success" 
                        ? "bg-green-100 text-green-800 border-green-300" 
                        : "bg-red-100 text-red-800 border-red-300"
                }`}>
                    <div className="flex items-center gap-2">
                        {type === "success" ? "✅" : "❌"}
                        <span className="font-medium text-sm">{message}</span>
                    </div>
                </div>
            )}

            {/* FONDO BLANCO - MISMO QUE LOGIN */}
            <div className="min-h-screen bg-gradient-to-br from-white via-gray-50/50 to-white flex items-center justify-center p-4 sm:p-6 lg:p-8">
                <div className="w-full max-w-sm sm:max-w-md">
                    
                    {/* Logo - MISMO ESTILO */}
                    <div className="text-center mb-6 sm:mb-8">
                        <h1 className="text-green-500 text-3xl sm:text-4xl lg:text-5xl font-black drop-shadow-sm mb-2 sm:mb-3 bg-gradient-to-r from-green-500 to-green-600 bg-clip-text text-transparent">
                            Lubix
                        </h1>
                        <p className="text-gray-600 text-sm sm:text-base lg:text-lg font-light tracking-wide">
                            Crea tu cuenta gratis
                        </p>
                    </div>

                    {/* Formulario - MISMO ESTILO */}
                    <form 
                        onSubmit={handleRegister} 
                        className="bg-white/90 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-xl hover:shadow-2xl transition-shadow duration-300 border border-gray-100 space-y-4 sm:space-y-5"
                    >
                        
                        {/* Nombre completo */}
                        <div>
                            <label className="block text-gray-800 font-semibold mb-2 sm:mb-3 text-xs sm:text-sm uppercase tracking-wider text-gray-700">
                                Nombre completo *
                            </label>
                            <input
                                name="fullName"
                                value={form.fullName}
                                onChange={handleChange}
                                className="w-full px-4 sm:px-5 py-3 sm:py-3.5 bg-gray-50/80 border border-gray-200 hover:border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200/50 focus:bg-white rounded-xl sm:rounded-2xl text-gray-900 placeholder-gray-500 text-sm sm:text-base font-medium transition-all duration-300 outline-none"
                                placeholder="Juan Pérez"
                                required
                            />
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-gray-800 font-semibold mb-2 sm:mb-3 text-xs sm:text-sm uppercase tracking-wider text-gray-700">
                                Email *
                            </label>
                            <input
                                name="email"
                                type="email"
                                value={form.email}
                                onChange={handleChange}
                                className="w-full px-4 sm:px-5 py-3 sm:py-3.5 bg-gray-50/80 border border-gray-200 hover:border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200/50 focus:bg-white rounded-xl sm:rounded-2xl text-gray-900 placeholder-gray-500 text-sm sm:text-base font-medium transition-all duration-300 outline-none"
                                placeholder="tu@email.com"
                                required
                            />
                        </div>

                        {/* Teléfono */}
                        <div>
                            <label className="block text-gray-800 font-semibold mb-2 sm:mb-3 text-xs sm:text-sm uppercase tracking-wider text-gray-700">
                                Teléfono *
                            </label>
                            <input
                                name="tell"
                                value={form.tell}
                                onChange={handleChange}
                                className="w-full px-4 sm:px-5 py-3 sm:py-3.5 bg-gray-50/80 border border-gray-200 hover:border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200/50 focus:bg-white rounded-xl sm:rounded-2xl text-gray-900 placeholder-gray-500 text-sm sm:text-base font-medium transition-all duration-300 outline-none"
                                placeholder="+1 (555) 123-4567"
                                required
                            />
                        </div>

                        {/* Contraseña con validación - ESTILO UNIFICADO */}
                        <div>
                            <label className="block text-gray-800 font-semibold mb-2 sm:mb-3 text-xs sm:text-sm uppercase tracking-wider text-gray-700">
                                Contraseña *
                            </label>
                            <input
                                type="password"
                                name="password"
                                value={form.password}
                                onChange={handleChange}
                                className="w-full px-4 sm:px-5 py-3 sm:py-3.5 bg-gray-50/80 border border-gray-200 hover:border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200/50 focus:bg-white rounded-xl sm:rounded-2xl text-gray-900 placeholder-gray-500 text-sm sm:text-base font-medium transition-all duration-300 outline-none"
                                placeholder="••••••••"
                                required
                            />

                            {/* Barra de fuerza - COMPACTA */}
                            {form.password && (
                                <div className="mt-3 sm:mt-4">
                                    <div className="h-1.5 sm:h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                                        <div
                                            className={`h-1.5 sm:h-2 rounded-full transition-all duration-500 ${getStrengthColor()}`}
                                            style={{ width: `${(strength / 4) * 100}%` }}
                                        />
                                    </div>
                                    <div className="mt-2 grid grid-cols-2 gap-1 text-xs text-gray-600 sm:text-sm">
                                        <span className={hasMinLength ? "text-green-600 font-medium" : "text-gray-500"}>8+ chars</span>
                                        <span className={hasUpper ? "text-green-600 font-medium" : "text-gray-500"}>Mayús</span>
                                        <span className={hasLower ? "text-green-600 font-medium" : "text-gray-500"}>Minús</span>
                                        <span className={hasNumber ? "text-green-600 font-medium" : "text-gray-500"}>Número</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Botón - MISMO ESTILO LOGIN */}
                        <button
                            type="submit"
                            disabled={!isPasswordValid}
                            className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 active:from-green-700 active:to-green-800 text-white font-bold py-3.5 sm:py-4 px-6 rounded-xl sm:rounded-2xl text-sm sm:text-base shadow-lg hover:shadow-xl active:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 transform disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:hover:shadow-lg"
                        >
                            {isPasswordValid ? " Crear Cuenta" : "Contraseña no válida"}
                        </button>
                    </form>

                    {/* Link login - MISMO ESTILO */}
                    <div className="mt-6 pt-5 sm:pt-6 border-t border-gray-100 text-center">
                        <p className="text-gray-600 text-xs sm:text-sm">
                            ¿Ya tienes cuenta?{' '}
                            <Link 
                                to="/login" 
                                className="text-green-600 hover:text-green-700 font-semibold hover:underline transition-all duration-200 text-sm sm:text-base decoration-2 underline-offset-4"
                            >
                                Inicia sesión
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Register