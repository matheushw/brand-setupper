import type { MetaFunction } from "@remix-run/node";
import { useNavigate } from "@remix-run/react";
import { useState } from "react";
import { validateHttpsUrl } from "~/utils/validations";

export const meta: MetaFunction = () => {
  return [
    { title: "Configuração de Marca - iGlu" },
    { name: "description", content: "Configure uma nova marca na plataforma iGlu" },
  ];
};

interface FormErrors {
  brandName?: string;
  logoUrl?: string;
}

export default function BrandSetup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(() => {
    const saved = sessionStorage.getItem('brandBasicInfo');
    return saved ? JSON.parse(saved) : {
      brandName: "",
      logoUrl: "",
    };
  });
  const [errors, setErrors] = useState<FormErrors>({});

  const validateForm = () => {
    const newErrors: FormErrors = {};

    if (!formData.brandName.trim()) {
      newErrors.brandName = "Nome da marca é obrigatório";
    }

    if (formData.logoUrl && !validateHttpsUrl(formData.logoUrl)) {
      newErrors.logoUrl = "URL deve ser HTTPS válida";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      sessionStorage.setItem('brandBasicInfo', JSON.stringify(formData));
      navigate('/brand-setup/location');
    }
  };

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    const newFormData = { ...formData, [field]: value };
    setFormData(newFormData);
    sessionStorage.setItem('brandBasicInfo', JSON.stringify(newFormData));
  };

  const handleLogoUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    // Only add https:// if the field is not empty and doesn't already have a protocol
    if (value && 
        !value.startsWith('https://') && 
        !value.startsWith('http://') && 
        // Check if we're not just backspacing the protocol
        !formData.logoUrl.startsWith(value)) {
      value = 'https://' + value;
    }
    handleInputChange('logoUrl', value);
  };

  const handleBack = () => {
    sessionStorage.setItem('brandBasicInfo', JSON.stringify(formData));
    navigate('/brand-setup/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-semibold text-gray-900">
              Informações Básicas
            </h2>
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
                onChange={(e) => handleInputChange('brandName', e.target.value)}
                className={`mt-1 block w-full px-4 py-3 bg-gray-50 border rounded-lg text-gray-900 text-base focus:outline-none focus:ring-2 transition-all ${
                  errors.brandName
                    ? 'border-red-300 focus:ring-red-200'
                    : 'border-gray-200 focus:ring-blue-100 hover:border-gray-300'
                }`}
                placeholder="Digite o nome da marca"
              />
              {errors.brandName && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.brandName}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="logoUrl"
                className="block text-sm font-medium text-gray-700"
              >
                URL do Logo
              </label>
              <div className="mt-1 relative">
                <input
                  type="text"
                  name="logoUrl"
                  id="logoUrl"
                  value={formData.logoUrl}
                  onChange={handleLogoUrlChange}
                  className={`mt-1 block w-full px-4 py-3 bg-gray-50 border rounded-lg text-gray-900 text-base focus:outline-none focus:ring-2 transition-all ${
                    errors.logoUrl
                      ? 'border-red-300 focus:ring-red-200'
                      : 'border-gray-200 focus:ring-blue-100 hover:border-gray-300'
                  }`}
                  placeholder="https://"
                />
                {errors.logoUrl && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.logoUrl}
                  </p>
                )}
              </div>
              <p className="mt-1 text-sm text-gray-500">
                URL da imagem do logo da marca (opcional)
              </p>
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
