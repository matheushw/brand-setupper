import { useNavigate } from "@remix-run/react";
import { useState } from "react";

interface FormData {
  email: string;
  password: string;
  confirmPassword: string;
}

interface FormErrors {
  email?: string;
  password?: string;
  confirmPassword?: string;
}

export default function LoginPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>(() => {
    const saved = sessionStorage.getItem('loginCredentials');
    return saved ? JSON.parse(saved) : {
      email: "",
      password: "",
      confirmPassword: "",
    };
  });
  const [errors, setErrors] = useState<FormErrors>({});

  const validateForm = () => {
    const newErrors: FormErrors = {};

    if (!formData.email.trim() || !formData.email.includes("@")) {
      newErrors.email = "Email inválido";
    }

    if (!formData.password || formData.password.length < 8) {
      newErrors.password = "A senha deve ter pelo menos 8 caracteres";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "As senhas não coincidem";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      sessionStorage.setItem('loginCredentials', JSON.stringify(formData));
      navigate('/brand-setup/basic');
    }
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    const newFormData = { ...formData, [field]: value };
    setFormData(newFormData);
    sessionStorage.setItem('loginCredentials', JSON.stringify(newFormData));
  };

  const handleBack = () => {
    sessionStorage.setItem('loginCredentials', JSON.stringify(formData));
    navigate('/brand-setup/auth');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-semibold text-gray-900">
              Credenciais de Acesso
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                type="email"
                name="email"
                id="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                autoComplete="email"
                className={`mt-1 block w-full px-4 py-3 bg-gray-50 border rounded-lg text-gray-900 text-base focus:outline-none focus:ring-2 transition-all ${
                  errors.email
                    ? 'border-red-300 focus:ring-red-200'
                    : 'border-gray-200 focus:ring-blue-100 hover:border-gray-300'
                }`}
                placeholder="Digite seu email"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.email}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Senha
              </label>
              <input
                type="password"
                name="password"
                id="password"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                autoComplete="new-password"
                className={`mt-1 block w-full px-4 py-3 bg-gray-50 border rounded-lg text-gray-900 text-base focus:outline-none focus:ring-2 transition-all ${
                  errors.password
                    ? 'border-red-300 focus:ring-red-200'
                    : 'border-gray-200 focus:ring-blue-100 hover:border-gray-300'
                }`}
                placeholder="Digite sua senha"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.password}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700"
              >
                Confirmar Senha
              </label>
              <input
                type="password"
                name="confirmPassword"
                id="confirmPassword"
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                autoComplete="new-password"
                className={`mt-1 block w-full px-4 py-3 bg-gray-50 border rounded-lg text-gray-900 text-base focus:outline-none focus:ring-2 transition-all ${
                  errors.confirmPassword
                    ? 'border-red-300 focus:ring-red-200'
                    : 'border-gray-200 focus:ring-blue-100 hover:border-gray-300'
                }`}
                placeholder="Digite sua senha novamente"
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            <div className="flex justify-between pt-6">
              <button
                type="button"
                onClick={handleBack}
                className="inline-flex justify-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Voltar
              </button>
              <button
                type="submit"
                className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Continuar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
