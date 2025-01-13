import { useState } from "react";
import { useNavigate } from "@remix-run/react";
import { validateHttpsUrl } from "~/utils/validations";

interface FormErrors {
  client_id?: string;
  client_secret?: string;
  audience?: string;
}

export default function Auth0Setup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(() => {
    const saved = sessionStorage.getItem('auth0Credentials');
    return saved ? JSON.parse(saved) : {
      client_id: "",
      client_secret: "",
      audience: "",
    };
  });
  const [errors, setErrors] = useState<FormErrors>({});

  const validateForm = () => {
    const newErrors: FormErrors = {};

    if (!formData.client_id.trim()) {
      newErrors.client_id = "Client ID é obrigatório";
    }

    if (!formData.client_secret.trim()) {
      newErrors.client_secret = "Client Secret é obrigatório";
    }

    if (!formData.audience.trim()) {
      newErrors.audience = "Audience é obrigatório";
    } else if (!validateHttpsUrl(formData.audience)) {
      newErrors.audience = "Audience deve ser uma URL HTTPS válida";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      sessionStorage.setItem('auth0Credentials', JSON.stringify(formData));
      navigate('/brand-setup/login');
    }
  };

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    const newFormData = { ...formData, [field]: value };
    setFormData(newFormData);
    sessionStorage.setItem('auth0Credentials', JSON.stringify(newFormData));
  };

  const handleAudienceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    // Only add https:// if the field is not empty and doesn't already have a protocol
    if (value && 
        !value.startsWith('https://') && 
        !value.startsWith('http://') && 
        // Check if we're not just backspacing the protocol
        !formData.audience.startsWith(value)) {
      value = 'https://' + value;
    }
    handleInputChange('audience', value);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-semibold text-gray-900">
              Credenciais Auth0
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label 
                htmlFor="client_id" 
                className="block text-sm font-medium text-gray-700"
              >
                Client ID
              </label>
              <input
                type="text"
                name="client_id"
                id="client_id"
                value={formData.client_id}
                onChange={(e) => handleInputChange('client_id', e.target.value)}
                className={`mt-1 block w-full px-4 py-3 bg-gray-50 border rounded-lg text-gray-900 text-base focus:outline-none focus:ring-2 transition-all ${
                  errors.client_id 
                    ? 'border-red-300 focus:ring-red-200' 
                    : 'border-gray-200 focus:ring-blue-100 hover:border-gray-300'
                }`}
                placeholder="Digite o Client ID do Auth0"
              />
              {errors.client_id && (
                <p className="mt-1 text-sm text-red-600">{errors.client_id}</p>
              )}
            </div>

            <div>
              <label 
                htmlFor="client_secret" 
                className="block text-sm font-medium text-gray-700"
              >
                Client Secret
              </label>
              <input
                type="password"
                name="client_secret"
                id="client_secret"
                value={formData.client_secret}
                onChange={(e) => handleInputChange('client_secret', e.target.value)}
                className={`mt-1 block w-full px-4 py-3 bg-gray-50 border rounded-lg text-gray-900 text-base focus:outline-none focus:ring-2 transition-all ${
                  errors.client_secret 
                    ? 'border-red-300 focus:ring-red-200' 
                    : 'border-gray-200 focus:ring-blue-100 hover:border-gray-300'
                }`}
                placeholder="Digite o Client Secret do Auth0"
              />
              {errors.client_secret && (
                <p className="mt-1 text-sm text-red-600">{errors.client_secret}</p>
              )}
            </div>

            <div>
              <label 
                htmlFor="audience" 
                className="block text-sm font-medium text-gray-700"
              >
                Audience
              </label>
              <div className="mt-1 relative">
                <input
                  type="text"
                  name="audience"
                  id="audience"
                  value={formData.audience}
                  onChange={handleAudienceChange}
                  className={`block w-full px-4 py-3 bg-gray-50 border rounded-lg text-gray-900 text-base focus:outline-none focus:ring-2 transition-all ${
                    errors.audience 
                      ? 'border-red-300 focus:ring-red-200' 
                      : 'border-gray-200 focus:ring-blue-100 hover:border-gray-300'
                  }`}
                  placeholder="https://"
                />
                {errors.audience && (
                  <p className="mt-1 text-sm text-red-600">{errors.audience}</p>
                )}
              </div>
              <p className="mt-1 text-sm text-gray-500">
                Exemplo: https://api.example.com
              </p>
            </div>

            <div className="flex justify-between pt-6">
              <button
                type="button"
                onClick={() => navigate('/')}
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
