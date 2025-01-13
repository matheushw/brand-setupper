import { useState } from "react";
import { useNavigate } from "@remix-run/react";
import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [
    { title: "Configuração Fiscal | Brand Setup" },
    { name: "description", content: "Configuração fiscal da marca" },
  ];
};

export default function BrandSetupFiscal() {
  const navigate = useNavigate();
  const [isDemo, setIsDemo] = useState(() => {
    const saved = sessionStorage.getItem('brandFiscalConfig');
    return saved ? JSON.parse(saved).isDemo : false;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sessionStorage.setItem('brandFiscalConfig', JSON.stringify({ isDemo }));
    navigate('/brand-setup/review');
  };

  const handleBack = () => {
    navigate('/brand-setup/location');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="sm:mx-auto sm:w-full sm:max-w-md">
            <h2 className="mt-2 text-center text-3xl font-extrabold text-gray-900">
              Configuração Fiscal
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Configure a integração fiscal da sua marca
            </p>
          </div>

          <form className="space-y-6 mt-8" onSubmit={handleSubmit}>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-gray-900">Conta Demo</h3>
                <p className="text-sm text-gray-500">
                  Ative para usar uma conta de demonstração para testes
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsDemo(!isDemo)}
                className={`${
                  isDemo ? 'bg-blue-600' : 'bg-gray-200'
                } relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
              >
                <span className="sr-only">Usar conta demo</span>
                <span
                  className={`${
                    isDemo ? 'translate-x-5' : 'translate-x-0'
                  } pointer-events-none relative inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200`}
                >
                  <span
                    className={`${
                      isDemo
                        ? 'opacity-0 ease-out duration-100'
                        : 'opacity-100 ease-in duration-200'
                    } absolute inset-0 h-full w-full flex items-center justify-center transition-opacity`}
                    aria-hidden="true"
                  >
                    <svg
                      className="h-3 w-3 text-gray-400"
                      fill="none"
                      viewBox="0 0 12 12"
                    >
                      <path
                        d="M4 8l2-2m0 0l2-2M6 6L4 4m2 2l2 2"
                        stroke="currentColor"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                  <span
                    className={`${
                      isDemo
                        ? 'opacity-100 ease-in duration-200'
                        : 'opacity-0 ease-out duration-100'
                    } absolute inset-0 h-full w-full flex items-center justify-center transition-opacity`}
                    aria-hidden="true"
                  >
                    <svg
                      className="h-3 w-3 text-blue-600"
                      fill="currentColor"
                      viewBox="0 0 12 12"
                    >
                      <path d="M3.707 5.293a1 1 0 00-1.414 1.414l1.414-1.414zM5 8l-.707.707a1 1 0 001.414 0L5 8zm4.707-3.293a1 1 0 00-1.414-1.414l1.414 1.414zm-7.414 2l2 2 1.414-1.414-2-2-1.414 1.414zm3.414 2l4-4-1.414-1.414-4 4 1.414 1.414z" />
                    </svg>
                  </span>
                </span>
              </button>
            </div>

            <div className="flex items-center justify-between pt-6">
              <button
                type="button"
                onClick={handleBack}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Voltar
              </button>
              <button
                type="submit"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
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
