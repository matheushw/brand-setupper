import type { MetaFunction } from "@remix-run/node";
import { useNavigate } from "@remix-run/react";
import { useState } from "react";
import { validateCNPJ } from "~/utils/validations";
import InputMask from "react-input-mask";

export const meta: MetaFunction = () => {
  return [
    { title: "Configuração de Marca - iGlu" },
    { name: "description", content: "Configure uma nova marca na plataforma iGlu" },
  ];
};

interface Address {
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
  complement: string;
}

interface Location {
  name: string;
  address: Address;
  cnpj: string;
}

interface FormErrors {
  name?: string;
  cnpj?: string;
  address?: {
    receiver_name?: string;
    city_name?: string;
    city_code?: string;
    state?: string;
    neighborhood?: string;
    street?: string;
    street_type?: string;
    number?: string;
    zip?: string;
  };
  general?: string;
}

export default function BrandSetupLocation() {
  const navigate = useNavigate();
  const [locations, setLocations] = useState<Location[]>(() => {
    const saved = sessionStorage.getItem('brandLocations');
    return saved ? JSON.parse(saved) : [];
  });

  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const [currentLocation, setCurrentLocation] = useState<Location>({
    name: "",
    address: {
      receiver_name: "",
      city_name: "",
      city_code: "",
      state: "",
      country_name: "BRA",
      neighborhood: "",
      street: "",
      street_type: "",
      number: "",
      zip: "",
      complement: "",
    },
    cnpj: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});

  const validateLocation = (location: Location): FormErrors => {
    const newErrors: FormErrors = {};

    if (!location.name.trim()) {
      newErrors.name = "Nome da localização é obrigatório";
    }

    if (!location.cnpj.trim()) {
      newErrors.cnpj = "CNPJ é obrigatório";
    } else if (!validateCNPJ(location.cnpj)) {
      newErrors.cnpj = "CNPJ inválido";
    }

    const addressErrors: FormErrors['address'] = {};
    if (!location.address.receiver_name.trim()) addressErrors.receiver_name = "Nome do recebedor é obrigatório";
    if (!location.address.city_name.trim()) addressErrors.city_name = "Cidade é obrigatória";
    if (!location.address.city_code.trim()) addressErrors.city_code = "Código da cidade é obrigatório";
    if (!location.address.state.trim()) addressErrors.state = "Estado é obrigatório";
    if (!location.address.neighborhood.trim()) addressErrors.neighborhood = "Bairro é obrigatório";
    if (!location.address.street.trim()) addressErrors.street = "Rua é obrigatória";
    if (!location.address.number.trim()) addressErrors.number = "Número é obrigatório";
    if (!location.address.zip.trim()) addressErrors.zip = "CEP é obrigatório";

    if (Object.keys(addressErrors).length > 0) {
      newErrors.address = addressErrors;
    }

    return newErrors;
  };

  const handleInputChange = (field: string, value: string, isAddress = false) => {
    // Remove masks before saving
    const unmaskedValue = value.replace(/[^\d]/g, '');
    
    if (isAddress) {
      setCurrentLocation({
        ...currentLocation,
        address: {
          ...currentLocation.address,
          [field]: field === 'zip' ? unmaskedValue : value,
        },
      });
    } else {
      setCurrentLocation({
        ...currentLocation,
        [field]: field === 'cnpj' ? unmaskedValue : value,
      });
    }
  };

  const handleAddLocation = () => {
    const validationErrors = validateLocation(currentLocation);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const newLocations = [...locations, currentLocation];
    setLocations(newLocations);
    sessionStorage.setItem('brandLocations', JSON.stringify(newLocations));
    
    setCurrentLocation({
      name: "",
      address: {
        receiver_name: "",
        city_name: "",
        city_code: "",
        state: "",
        country_name: "BRA",
        neighborhood: "",
        street: "",
        street_type: "",
        number: "",
        zip: "",
        complement: "",
      },
      cnpj: "",
    });
    setErrors({});
  };

  const handleRemoveLocation = (index: number) => {
    const newLocations = locations.filter((_, i) => i !== index);
    setLocations(newLocations);
    sessionStorage.setItem('brandLocations', JSON.stringify(newLocations));
  };

  const handleEditLocation = (index: number) => {
    setCurrentLocation(locations[index]);
    setEditingIndex(index);
  };

  const handleUpdateLocation = () => {
    const validationErrors = validateLocation(currentLocation);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const newLocations = [...locations];
    newLocations[editingIndex!] = currentLocation;
    setLocations(newLocations);
    sessionStorage.setItem('brandLocations', JSON.stringify(newLocations));
    
    setCurrentLocation({
      name: "",
      address: {
        receiver_name: "",
        city_name: "",
        city_code: "",
        state: "",
        country_name: "BRA",
        neighborhood: "",
        street: "",
        street_type: "",
        number: "",
        zip: "",
        complement: "",
      },
      cnpj: "",
    });
    setEditingIndex(null);
    setErrors({});
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (locations.length === 0) {
      setErrors({ general: "Adicione pelo menos uma localização" });
      return;
    }
    navigate('/brand-setup/fiscal');
  };

  const handleBack = () => {
    sessionStorage.setItem('brandLocations', JSON.stringify(locations));
    navigate('/brand-setup/basic');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-semibold text-gray-900">
              Localizações da Marca
            </h2>
          </div>

          <div className="space-y-6">
            {/* Lista de localizações */}
            {locations.length > 0 && (
              <div className="space-y-4">
                {locations.map((location, index) => (
                  <div key={index} className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
                    <div className="p-6">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3">
                            <h3 className="text-lg font-semibold text-gray-900">
                              {location.name}
                            </h3>
                            <span className="px-2.5 py-0.5 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                              CNPJ: {location.cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, "$1.$2.$3/$4-$5")}
                            </span>
                          </div>
                          <div className="mt-2 grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                              <p className="text-sm text-gray-600">
                                <span className="font-medium">Endereço:</span> {location.address.street_type} {location.address.street}, {location.address.number}
                              </p>
                              <p className="text-sm text-gray-600">
                                <span className="font-medium">Bairro:</span> {location.address.neighborhood}
                              </p>
                              <p className="text-sm text-gray-600">
                                <span className="font-medium">Complemento:</span> {location.address.complement || '-'}
                              </p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm text-gray-600">
                                <span className="font-medium">Cidade:</span> {location.address.city_name} - {location.address.state}
                              </p>
                              <p className="text-sm text-gray-600">
                                <span className="font-medium">CEP:</span> {location.address.zip.replace(/^(\d{5})(\d{3})$/, "$1-$2")}
                              </p>
                              <p className="text-sm text-gray-600">
                                <span className="font-medium">Responsável:</span> {location.address.receiver_name}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEditLocation(index)}
                            className="p-2 text-gray-400 hover:text-blue-500 transition-colors"
                            title="Editar localização"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleRemoveLocation(index)}
                            className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                            title="Remover localização"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Formulário para adicionar nova localização */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {editingIndex !== null ? 'Editar Localização' : 'Adicionar Nova Localização'}
              </h3>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Nome da Localização
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={currentLocation.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className={`mt-1 block w-full px-4 py-3 bg-gray-50 border rounded-lg text-gray-900 text-base focus:outline-none focus:ring-2 transition-all ${
                      errors.name
                        ? 'border-red-300 focus:ring-red-200'
                        : 'border-gray-200 focus:ring-blue-100 hover:border-gray-300'
                    }`}
                    placeholder="Shopping Rio Design Barra"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="cnpj" className="block text-sm font-medium text-gray-700">
                    CNPJ
                  </label>
                  <InputMask
                    mask="99.999.999/9999-99"
                    type="text"
                    id="cnpj"
                    value={currentLocation.cnpj}
                    onChange={(e) => handleInputChange("cnpj", e.target.value)}
                    className={`mt-1 block w-full px-4 py-3 bg-gray-50 border rounded-lg text-gray-900 text-base focus:outline-none focus:ring-2 transition-all ${
                      errors.cnpj
                        ? 'border-red-300 focus:ring-red-200'
                        : 'border-gray-200 focus:ring-blue-100 hover:border-gray-300'
                    }`}
                    placeholder="18.841.936/0006-15"
                  />
                  {errors.cnpj && (
                    <p className="mt-1 text-sm text-red-600">{errors.cnpj}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="receiver_name" className="block text-sm font-medium text-gray-700">
                    Nome do Recebedor
                  </label>
                  <input
                    type="text"
                    id="receiver_name"
                    value={currentLocation.address.receiver_name}
                    onChange={(e) => handleInputChange("receiver_name", e.target.value, true)}
                    className={`mt-1 block w-full px-4 py-3 bg-gray-50 border rounded-lg text-gray-900 text-base focus:outline-none focus:ring-2 transition-all ${
                      errors.address?.receiver_name
                        ? 'border-red-300 focus:ring-red-200'
                        : 'border-gray-200 focus:ring-blue-100 hover:border-gray-300'
                    }`}
                    placeholder="Fulano de tal"
                  />
                  {errors.address?.receiver_name && (
                    <p className="mt-1 text-sm text-red-600">{errors.address.receiver_name}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="city_name" className="block text-sm font-medium text-gray-700">
                    Cidade
                  </label>
                  <input
                    type="text"
                    id="city_name"
                    value={currentLocation.address.city_name}
                    onChange={(e) => handleInputChange("city_name", e.target.value, true)}
                    className={`mt-1 block w-full px-4 py-3 bg-gray-50 border rounded-lg text-gray-900 text-base focus:outline-none focus:ring-2 transition-all ${
                      errors.address?.city_name
                        ? 'border-red-300 focus:ring-red-200'
                        : 'border-gray-200 focus:ring-blue-100 hover:border-gray-300'
                    }`}
                    placeholder="Rio de Janeiro"
                  />
                  {errors.address?.city_name && (
                    <p className="mt-1 text-sm text-red-600">{errors.address.city_name}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="city_code" className="block text-sm font-medium text-gray-700">
                    Código da Cidade
                  </label>
                  <input
                    type="text"
                    id="city_code"
                    value={currentLocation.address.city_code}
                    onChange={(e) => handleInputChange("city_code", e.target.value, true)}
                    className={`mt-1 block w-full px-4 py-3 bg-gray-50 border rounded-lg text-gray-900 text-base focus:outline-none focus:ring-2 transition-all ${
                      errors.address?.city_code
                        ? 'border-red-300 focus:ring-red-200'
                        : 'border-gray-200 focus:ring-blue-100 hover:border-gray-300'
                    }`}
                    placeholder="3304557"
                  />
                  {errors.address?.city_code && (
                    <p className="mt-1 text-sm text-red-600">{errors.address.city_code}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="state" className="block text-sm font-medium text-gray-700">
                    Estado
                  </label>
                  <input
                    type="text"
                    id="state"
                    value={currentLocation.address.state}
                    onChange={(e) => handleInputChange("state", e.target.value, true)}
                    className={`mt-1 block w-full px-4 py-3 bg-gray-50 border rounded-lg text-gray-900 text-base focus:outline-none focus:ring-2 transition-all ${
                      errors.address?.state
                        ? 'border-red-300 focus:ring-red-200'
                        : 'border-gray-200 focus:ring-blue-100 hover:border-gray-300'
                    }`}
                    placeholder="RJ"
                  />
                  {errors.address?.state && (
                    <p className="mt-1 text-sm text-red-600">{errors.address.state}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="neighborhood" className="block text-sm font-medium text-gray-700">
                    Bairro
                  </label>
                  <input
                    type="text"
                    id="neighborhood"
                    value={currentLocation.address.neighborhood}
                    onChange={(e) => handleInputChange("neighborhood", e.target.value, true)}
                    className={`mt-1 block w-full px-4 py-3 bg-gray-50 border rounded-lg text-gray-900 text-base focus:outline-none focus:ring-2 transition-all ${
                      errors.address?.neighborhood
                        ? 'border-red-300 focus:ring-red-200'
                        : 'border-gray-200 focus:ring-blue-100 hover:border-gray-300'
                    }`}
                    placeholder="Barra da Tijuca"
                  />
                  {errors.address?.neighborhood && (
                    <p className="mt-1 text-sm text-red-600">{errors.address.neighborhood}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="street" className="block text-sm font-medium text-gray-700">
                    Rua
                  </label>
                  <input
                    type="text"
                    id="street"
                    value={currentLocation.address.street}
                    onChange={(e) => handleInputChange("street", e.target.value, true)}
                    className={`mt-1 block w-full px-4 py-3 bg-gray-50 border rounded-lg text-gray-900 text-base focus:outline-none focus:ring-2 transition-all ${
                      errors.address?.street
                        ? 'border-red-300 focus:ring-red-200'
                        : 'border-gray-200 focus:ring-blue-100 hover:border-gray-300'
                    }`}
                    placeholder="Av. das Américas"
                  />
                  {errors.address?.street && (
                    <p className="mt-1 text-sm text-red-600">{errors.address.street}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="street_type" className="block text-sm font-medium text-gray-700">
                    Tipo de Logradouro
                  </label>
                  <input
                    type="text"
                    id="street_type"
                    value={currentLocation.address.street_type}
                    onChange={(e) => handleInputChange("street_type", e.target.value, true)}
                    className={`mt-1 block w-full px-4 py-3 bg-gray-50 border rounded-lg text-gray-900 text-base focus:outline-none focus:ring-2 transition-all ${
                      errors.address?.street_type
                        ? 'border-red-300 focus:ring-red-200'
                        : 'border-gray-200 focus:ring-blue-100 hover:border-gray-300'
                    }`}
                    placeholder="AV."
                  />
                  {errors.address?.street_type && (
                    <p className="mt-1 text-sm text-red-600">{errors.address.street_type}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="number" className="block text-sm font-medium text-gray-700">
                    Número
                  </label>
                  <input
                    type="text"
                    id="number"
                    value={currentLocation.address.number}
                    onChange={(e) => handleInputChange("number", e.target.value, true)}
                    className={`mt-1 block w-full px-4 py-3 bg-gray-50 border rounded-lg text-gray-900 text-base focus:outline-none focus:ring-2 transition-all ${
                      errors.address?.number
                        ? 'border-red-300 focus:ring-red-200'
                        : 'border-gray-200 focus:ring-blue-100 hover:border-gray-300'
                    }`}
                    placeholder="7777"
                  />
                  {errors.address?.number && (
                    <p className="mt-1 text-sm text-red-600">{errors.address.number}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="zip" className="block text-sm font-medium text-gray-700">
                    CEP
                  </label>
                  <InputMask
                    mask="99999-999"
                    type="text"
                    id="zip"
                    value={currentLocation.address.zip}
                    onChange={(e) => handleInputChange("zip", e.target.value, true)}
                    className={`mt-1 block w-full px-4 py-3 bg-gray-50 border rounded-lg text-gray-900 text-base focus:outline-none focus:ring-2 transition-all ${
                      errors.address?.zip
                        ? 'border-red-300 focus:ring-red-200'
                        : 'border-gray-200 focus:ring-blue-100 hover:border-gray-300'
                    }`}
                    placeholder="22793-081"
                  />
                  {errors.address?.zip && (
                    <p className="mt-1 text-sm text-red-600">{errors.address.zip}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="complement" className="block text-sm font-medium text-gray-700">
                    Complemento
                  </label>
                  <input
                    type="text"
                    id="complement"
                    value={currentLocation.address.complement}
                    onChange={(e) => handleInputChange("complement", e.target.value, true)}
                    className="mt-1 block w-full px-4 py-3 bg-gray-50 border rounded-lg text-gray-900 text-base focus:outline-none focus:ring-2 transition-all border-gray-200 focus:ring-blue-100 hover:border-gray-300"
                    placeholder="1º Piso"
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                {editingIndex !== null ? (
                  <div className="flex space-x-3">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingIndex(null);
                        setCurrentLocation({
                          name: "",
                          address: {
                            receiver_name: "",
                            city_name: "",
                            city_code: "",
                            state: "",
                            country_name: "BRA",
                            neighborhood: "",
                            street: "",
                            street_type: "",
                            number: "",
                            zip: "",
                            complement: "",
                          },
                          cnpj: "",
                        });
                        setErrors({});
                      }}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Cancelar
                    </button>
                    <button
                      type="button"
                      onClick={handleUpdateLocation}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Atualizar Localização
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={handleAddLocation}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Adicionar Localização
                  </button>
                )}
              </div>
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
                onClick={handleSubmit}
                className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Continuar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}