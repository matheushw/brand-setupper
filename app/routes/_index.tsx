import type { MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";

export const meta: MetaFunction = () => {
  return [
    { title: "Painel de Operações iGlu" },
    { name: "description", content: "Painel de operações interno da iGlu" },
  ];
};

interface NavigationCardProps {
  title: string;
  description: string;
  to: string;
  icon?: React.ReactNode;
}

function NavigationCard({ title, description, to, icon }: NavigationCardProps) {
  return (
    <Link
      to={to}
      className="block w-full max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-50 transition-colors"
    >
      <div className="flex items-center gap-4">
        {icon && <div className="text-gray-500">{icon}</div>}
        <div>
          <h5 className="mb-2 text-xl font-bold tracking-tight text-gray-900">
            {title}
          </h5>
          <p className="text-gray-600">
            {description}
          </p>
        </div>
      </div>
    </Link>
  );
}

export default function Index() {
  // Clear all form states when accessing the index page
  if (typeof window !== 'undefined') {
    sessionStorage.removeItem('auth0Credentials');
    sessionStorage.removeItem('loginCredentials');
    sessionStorage.removeItem('brandBasicInfo');
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12">
          <h1 className="text-3xl font-bold text-gray-900">
            Painel de Operações
          </h1>
          <p className="mt-2 text-gray-600">
            Gerencie e configure as configurações do sistema iGlu
          </p>
        </header>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <NavigationCard
            title="Configuração de Marca"
            description="Configure e integre novas marcas à plataforma iGlu"
            to="/brand-setup/auth"
          />
          {/* Adicione mais cards de navegação conforme necessário */}
        </div>
      </div>
    </div>
  );
}
