import { Outlet, useLocation } from "@remix-run/react";

interface Step {
  id: string;
  title: string;
  description: string;
}

const steps: Step[] = [
  {
    id: "auth",
    title: "Credenciais Auth0",
    description: "Configure as credenciais"
  },
  {
    id: "basic",
    title: "Informações Básicas",
    description: "Dados básicos da marca"
  },
  {
    id: "address",
    title: "Endereço",
    description: "Localização da marca"
  },
  {
    id: "fiscal",
    title: "Configurações Fiscais",
    description: "Dados fiscais da marca"
  },
  {
    id: "review",
    title: "Revisão",
    description: "Confirme as informações"
  }
];

export default function BrandSetupLayout() {
  const location = useLocation();
  const currentStepIndex = steps.findIndex(step => location.pathname.includes(step.id));

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12">
          <nav aria-label="Progress">
            <ol role="list" className="flex items-center justify-between">
              {steps.map((step, index) => {
                const isActive = index === currentStepIndex;
                const isCompleted = index < currentStepIndex;
                const stepNumber = (index + 1).toString().padStart(2, '0');

                return (
                  <li key={step.id} className="relative w-40 flex flex-col items-center">
                    <div className="flex items-center justify-center w-full">
                      {index !== 0 && (
                        <div
                          className={`absolute h-[1px] w-full right-[50%] top-4 ${
                            isCompleted ? 'bg-blue-600' : 'bg-gray-200'
                          }`}
                        />
                      )}
                      <div
                        className={`relative z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 ${
                          isActive
                            ? 'border-blue-600 bg-white'
                            : isCompleted
                            ? 'border-blue-600 bg-blue-600'
                            : 'border-gray-300 bg-white'
                        }`}
                      >
                        <span
                          className={`text-xs font-semibold ${
                            isCompleted
                              ? 'text-white'
                              : isActive
                              ? 'text-blue-600'
                              : 'text-gray-500'
                          }`}
                        >
                          {stepNumber}
                        </span>
                      </div>
                      {index !== steps.length - 1 && (
                        <div
                          className={`absolute h-[1px] w-full left-[50%] top-4 ${
                            isCompleted ? 'bg-blue-600' : 'bg-gray-200'
                          }`}
                        />
                      )}
                    </div>
                    <div className="mt-3 flex flex-col items-center text-center">
                      <span
                        className={`text-sm font-medium ${
                          isActive ? 'text-gray-900' : 'text-gray-500'
                        }`}
                      >
                        {step.title}
                      </span>
                      <span
                        className={`mt-1 text-xs ${
                          isActive ? 'text-gray-500' : 'text-gray-400'
                        }`}
                      >
                        {step.description}
                      </span>
                    </div>
                  </li>
                );
              })}
            </ol>
          </nav>
        </div>
        <Outlet />
      </div>
    </div>
  );
}
