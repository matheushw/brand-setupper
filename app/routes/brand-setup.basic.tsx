import type { MetaFunction } from "@remix-run/node";
import { Link, useNavigate } from "@remix-run/react";
import { useState } from "react";
import InputMask from "react-input-mask";
import { validateCNPJ } from "~/utils/validations";

export const meta: MetaFunction = () => {
  return [
    { title: "Configuração de Marca - iGlu" },
    { name: "description", content: "Configure uma nova marca na plataforma iGlu" },
  ];
};

interface FormErrors {
  brandName?: string;
}

export default function BrandSetup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    brandName: "",
    logoUrl: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});

  const validateForm = () => {
    const newErrors: FormErrors = {};

    if (!formData.brandName.trim()) {
      newErrors.brandName = "Nome da marca é obrigatório";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      // Store data and proceed to next step
      navigate('/brand-setup/address');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <nav className="mb-8">
          <Link 
            to="/"
            className="text-gray-600 hover:text-gray-900 flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Voltar ao Painel
          </Link>
        </nav>

        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Configuração de Marca
          </h1>
          <p className="mt-2 text-gray-600">
            Configure uma nova marca para começar a usar a plataforma iGlu
          </p>
        </header>

        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-semibold text-gray-900">
              Informações Básicas
            </h2>
            <span className="text-sm text-gray-500">
              Etapa 1 de 4
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label 
                htmlFor="brandName" 
                className="block text-sm font-medium text-gray-700"
              >
                Nome da Marca
              </label>
              <input
                type="text"
                name="brandName"
                id="brandName"
                value={formData.brandName}
                onChange={(e) => setFormData(prev => ({ ...prev, brandName: e.target.value }))}
                className={`mt-1 block w-full px-4 py-3 bg-gray-50 border rounded-lg text-gray-900 text-base focus:outline-none focus:ring-2 transition-all ${
                  errors.brandName 
                    ? 'border-red-300 focus:ring-red-200' 
                    : 'border-gray-200 focus:ring-blue-100 hover:border-gray-300'
                }`}
                placeholder="Digite o nome da marca"
              />
              {errors.brandName && (
                <p className="mt-1 text-sm text-red-600">{errors.brandName}</p>
              )}
            </div>

            <div>
              <label 
                htmlFor="logoUrl" 
                className="block text-sm font-medium text-gray-700"
              >
                URL do Logo
              </label>
              <input
                type="url"
                name="logoUrl"
                id="logoUrl"
                value={formData.logoUrl}
                onChange={(e) => setFormData(prev => ({ ...prev, logoUrl: e.target.value }))}
                className="mt-1 block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 text-base focus:outline-none focus:ring-2 focus:ring-blue-100 hover:border-gray-300 transition-all"
                placeholder="https://exemplo.com/logo.png"
              />
              <p className="mt-1 text-xs text-gray-500">
                Opcional: Insira a URL da imagem do logo da marca
              </p>
            </div>

            <div className="flex justify-end pt-6">
              <button
                type="submit"
                className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Próxima Etapa
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
