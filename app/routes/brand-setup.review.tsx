import { useState, useEffect } from "react";
import { useNavigate } from "@remix-run/react";
import type { MetaFunction } from "@remix-run/node";

interface BasicInfo {
  brandName: string;
  logoUrl: string;
}

interface Location {
  name: string;
  cnpj: string;
  address: {
    receiver_name: string;
    city_name: string;
    city_code: string;
    state: string;
    country_name: string;
    neighborhood: string;
    street: string;
    street_type: string;
    number: string;
    zip: string;
    complement?: string;
  };
}

interface FiscalConfig {
  isDemo: boolean;
}

export const meta: MetaFunction = () => {
  return [
    { title: "Revisão | Brand Setup" },
    { name: "description", content: "Revise as informações da marca" },
  ];
};

export default function BrandSetupReview() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [basicInfo, setBasicInfo] = useState<BasicInfo | null>(null);
  const [locations, setLocations] = useState<Location[]>([]);
  const [fiscalConfig, setFiscalConfig] = useState<FiscalConfig | null>(null);

  useEffect(() => {
    const basicInfoData = sessionStorage.getItem('brandBasicInfo');
    const locationsData = sessionStorage.getItem('brandLocations');
    const fiscalConfigData = sessionStorage.getItem('brandFiscalConfig');

    if (basicInfoData) setBasicInfo(JSON.parse(basicInfoData));
    if (locationsData) setLocations(JSON.parse(locationsData));
    if (fiscalConfigData) setFiscalConfig(JSON.parse(fiscalConfigData));
  }, []);

  const handleBack = () => {
    navigate('/brand-setup/fiscal');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Here you would typically send all the data to your backend
    // For now, we'll just simulate a submission
    try {
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API call
      sessionStorage.clear(); // Clear all stored data after successful submission
      navigate('/brand-setup/success');
    } catch (error) {
      console.error('Error submitting brand setup:', error);
      setIsLoading(false);
    }
  };

  const handleEdit = (step: string) => {
    navigate('/brand-setup/' + step);
  };

  if (!basicInfo || !fiscalConfig) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-sm font-medium text-gray-500">
            Informações não encontradas. Por favor, complete os passos anteriores.
          </p>
          <button
            onClick={() => navigate('/brand-setup/basic')}
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
          >
            Voltar ao início
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-2xl">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="sm:mx-auto sm:w-full">
            <h2 className="text-center text-3xl font-extrabold text-gray-900 flex items-center justify-center">
              <svg className="w-8 h-8 mr-3 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              Revisão das Informações
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Verifique se todas as informações estão corretas antes de finalizar
            </p>
          </div>

          <div className="mt-8 space-y-12">
            {/* Basic Info Section */}
            <div className="mb-12 bg-gray-50 rounded-lg p-6 border border-gray-200 hover:border-blue-300 transition-colors duration-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h3 className="text-lg font-medium text-gray-900">Informações Básicas</h3>
                </div>
                <button
                  onClick={() => handleEdit('basic')}
                  className="inline-flex items-center text-sm text-blue-600 hover:text-blue-500"
                >
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Editar
                </button>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-white p-4 rounded-md border border-gray-100">
                  <p className="text-sm font-medium text-gray-500">Nome da Marca</p>
                  <p className="mt-1 text-sm text-gray-900 font-medium">{basicInfo.brandName}</p>
                </div>
                <div className="bg-white p-4 rounded-md border border-gray-100">
                  <p className="text-sm font-medium text-gray-500">Logo URL</p>
                  <p className="mt-1 text-sm text-gray-900 font-medium break-all">{basicInfo.logoUrl}</p>
                </div>
              </div>
            </div>

            {/* Locations Section */}
            <div className="mb-12 bg-gray-50 rounded-lg p-6 border border-gray-200 hover:border-blue-300 transition-colors duration-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <h3 className="text-lg font-medium text-gray-900">Localizações</h3>
                </div>
                <button
                  onClick={() => handleEdit('location')}
                  className="inline-flex items-center text-sm text-blue-600 hover:text-blue-500"
                >
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Editar
                </button>
              </div>
              <div className="space-y-4">
                {locations.map((location, index) => (
                  <div key={index} className="bg-white rounded-lg p-4 border border-gray-100 hover:border-gray-200 transition-colors duration-200">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 font-medium">{index + 1}</span>
                        </div>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">{location.name}</h4>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          CNPJ: {location.cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, "$1.$2.$3/$4-$5")}
                        </span>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="space-y-2">
                        <div>
                          <p className="text-gray-500 font-medium">Endereço</p>
                          <p className="text-gray-900">
                            {location.address.street_type} {location.address.street}, {location.address.number}
                          </p>
                          <p className="text-gray-900">
                            {location.address.neighborhood}
                            {location.address.complement && ` - ${location.address.complement}`}
                          </p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div>
                          <p className="text-gray-500 font-medium">Cidade/Estado</p>
                          <p className="text-gray-900">
                            {location.address.city_name} - {location.address.state}
                          </p>
                          <p className="text-gray-900">
                            CEP: {location.address.zip.replace(/^(\d{5})(\d{3})$/, "$1-$2")}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Fiscal Config Section */}
            <div className="mb-12 bg-gray-50 rounded-lg p-6 border border-gray-200 hover:border-blue-300 transition-colors duration-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  <h3 className="text-lg font-medium text-gray-900">Configuração Fiscal</h3>
                </div>
                <button
                  onClick={() => handleEdit('fiscal')}
                  className="inline-flex items-center text-sm text-blue-600 hover:text-blue-500"
                >
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Editar
                </button>
              </div>
              <div className="bg-white p-4 rounded-md border border-gray-100">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${fiscalConfig.isDemo
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-green-100 text-green-800'}`}
                >
                  <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {fiscalConfig.isDemo ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    )}
                  </svg>
                  {fiscalConfig.isDemo ? 'Conta Demo' : 'Conta Produção'}
                </span>
              </div>
            </div>

            {/* Submit Section */}
            <div className="flex items-center justify-between pt-6 border-t">
              <button
                type="button"
                onClick={handleBack}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                disabled={isLoading}
              >
                Voltar
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isLoading}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-colors duration-200"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Finalizando...
                  </>
                ) : (
                  <>
                    <svg className="w-3 h-3 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Finalizar Cadastro
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
