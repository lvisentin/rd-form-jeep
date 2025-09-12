"use client";

import {
  useRef,
  useEffect,
  useActionState,
  useState,
  Suspense,
  startTransition,
} from "react";
import { useSearchParams } from "next/navigation";
import { submitForm } from "./actions";
import { initialState } from "./schema";

const SubmitButton = ({ isPending }: { isPending: boolean }) => {
  return (
    <button
      type="submit"
      disabled={isPending}
      className={`py-2 px-6 ${
        isPending ? "bg-gray-500" : "bg-black hover:bg-black/90"
      } text-white font-medium rounded-lg transition duration-200`}
    >
      {isPending ? "Enviando..." : "Enviar"}
    </button>
  );
};

const LeadFormContent = () => {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction, isPending] = useActionState(
    submitForm,
    initialState
  );
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [userExists, setUserExists] = useState(false);
  const [hasCheckedEmail, setHasCheckedEmail] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Novos estados para os campos do formulário
  const [formFields, setFormFields] = useState({
    name: "",
    email: "",
    isClient: "",
    vehicleType: "",
    vehicleModel: "",
    location: "",
    timePeriod: "",
    visitDay: "",
  });

  // Atualiza campos ao digitar
  const handleFieldChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormFields((prev) => ({ ...prev, [name]: value }));
  };

  // // Busca dados do CRM ao perder o foco do email
  // const handleEmailBlur = async (e: React.FocusEvent<HTMLInputElement>) => {
  //   const email = e.target.value;
  //   if (!email || !/\S+@\S+\.\S+/.test(email)) return;
  //   setIsLoading(true);
  //   setUserExists(false);
  //   setHasCheckedEmail(false);
  //   try {
  //     const res = await fetch(
  //       `/api/check-email?email=${encodeURIComponent(email)}`
  //     );
  //     const data = await res.json();
  //     if (data && data.contacts && data.contacts.length > 0) {
  //       const contact = data.contacts[0];
  //       setUserExists(true);
  //       setFormFields((prev) => ({
  //         ...prev,
  //         name: contact.name || "",
  //         email: contact.email || email,
  //         isClient: contact.isClient || "",
  //         vehicleType: contact.vehicleType || "",
  //         vehicleModel: contact.vehicleModel || "",
  //         location: contact.location || "",
  //         timePeriod: contact.timePeriod || "",
  //         visitDay: contact.visitDay || "",
  //       }));
  //     }
  //     setHasCheckedEmail(true);
  //   } catch (err) {
  //     // erro silencioso
  //     setHasCheckedEmail(true);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  // useEffect(() => {
  //   // Check for email parameter in URL
  //   const emailParam = searchParams.get("email");
  //   if (emailParam) {
  //     setIsLoading(true);
  //     setHasCheckedEmail(false);
  //     fetch(`/api/check-email?email=${encodeURIComponent(emailParam)}`)
  //       .then((res) => res.json())
  //       .then((data) => {
  //         if (data && data.contacts && data.contacts.length > 0) {
  //           const contact = data.contacts[0];
  //           setUserExists(true);
  //           setFormFields((prev) => ({
  //             ...prev,
  //             name: contact.name || "",
  //             email: contact.email || emailParam,
  //             isClient: contact.isClient || "",
  //             vehicleType: contact.vehicleType || "",
  //             vehicleModel: contact.vehicleModel || "",
  //             location: contact.location || "",
  //             timePeriod: contact.timePeriod || "",
  //             visitDay: contact.visitDay || "",
  //           }));
  //         }
  //         setHasCheckedEmail(true);
  //       })
  //       .catch(() => {
  //         setHasCheckedEmail(true);
  //       })
  //       .finally(() => setIsLoading(false));
  //   }
  // }, [searchParams]);

  useEffect(() => {
    if (state.success && formRef.current) {
      setShowSuccessModal(true);
      formRef.current.reset();
      setFormFields({
        name: "",
        email: "",
        isClient: "",
        vehicleType: "",
        vehicleModel: "",
        location: "",
        timePeriod: "",
        visitDay: "",
      });
    }
  }, [state.success]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    setFormFields((prev) => ({
      ...prev,
      name: formData.get("name")?.toString() || "",
      email: formData.get("email")?.toString() || "",
      isClient: formData.get("isClient")?.toString() || "",
      vehicleType: formData.get("vehicleType")?.toString() || "",
      vehicleModel: formData.get("vehicleModel")?.toString() || "",
      location: formData.get("location")?.toString() || "",
      timePeriod: formData.get("timePeriod")?.toString() || "",
      visitDay: formData.get("visitDay")?.toString() || "",
    }));
    // Chama o formAction dentro de uma transição
    startTransition(() => {
      // @ts-ignore
      formAction(formData);
    });
  };

  const SuccessModal = () => {
    if (!showSuccessModal) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 relative">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                ></path>
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Formulário Enviado!
            </h3>
            <p className="text-gray-600 mb-6">
              Obrigado por receber o formulário! Te esperamos no evento!
            </p>
            <button
              onClick={() => setShowSuccessModal(false)}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Fechar
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <section className="max-w-2xl mx-auto py-10 px-4 min-h-screen">
      <SuccessModal />
      {/* Header Card */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-4 border border-gray-200">
        <h1 className="text-3xl font-bold text-center text-red-600 mb-2">
          Semana Eletrificados Toyota Sulpar
        </h1>
        <p className="text-gray-700 mb-2">
        A Semana Eletrificados Toyota está com tudo! E para sua experiência ser perfeita, queremos te conhecer um pouco melhor! Para isso, você só precisa responder algumas perguntas rápidas. Vamos lá?
        </p>
      </div>

      {isLoading && (
        <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded mb-4">
          <p className="font-medium">Carregando seus dados...</p>
          <p>Por favor, aguarde um momento.</p>
        </div>
      )}

      {userExists && !isLoading && hasCheckedEmail && (
        <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded mb-4">
          <p className="font-medium">Bem-vindo de volta!</p>
          <p>
            Encontramos seu registro anterior. Você pode revisar e atualizar
            suas informações.
          </p>
        </div>
      )}

      {state.message && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p className="font-medium">Erro</p>
          <p>{state.message}</p>
        </div>
      )}

      <form
        ref={formRef}
        className="space-y-4"
        noValidate
        onSubmit={handleSubmit}
      >
        {/* Name Field */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <label htmlFor="name" className="block font-medium mb-4">
            Qual é o seu nome <span className="text-red-600">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            className={`w-full p-2 border-b border-gray-300 focus:border-b-2 focus:border-black focus:outline-none transition-colors ${
              userExists ? "bg-gray-100" : ""
            }`}
            placeholder="Sua resposta"
            value={formFields.name}
            onChange={handleFieldChange}
            readOnly={userExists}
            onInvalid={(e) => e.preventDefault()}
          />
          {state.errors?.name && (
            <p className="text-red-500 text-sm mt-1">{state.errors.name}</p>
          )}
        </div>

        {/* Email Field */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <label htmlFor="email" className="block font-medium mb-4">
            Qual é o seu e-mail?{" "}
            <span className="text-sm">
              (Inserir o mesmo do cadastro no evento)
            </span>{" "}
            <span className="text-red-600">*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            className={`w-full p-2 border-b border-gray-300 focus:border-b-2 focus:border-black focus:outline-none transition-colors ${
              userExists ? "bg-gray-100" : ""
            }`}
            placeholder="Sua resposta"
            value={formFields.email}
            onChange={handleFieldChange}
            readOnly={userExists}
            onInvalid={(e) => e.preventDefault()}
          />
          {state.errors?.email && (
            <p className="text-red-500 text-sm mt-1">{state.errors.email}</p>
          )}
        </div>

        {/* Is Client Field */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <p className="block font-medium mb-4">
            Você já é cliente da Toyota Sulpar?{" "}
            <span className="text-red-600">*</span>
          </p>
          <div className="space-y-2">
            <label className="flex items-center p-2 hover:bg-gray-50 rounded transition">
              <input
                type="radio"
                name="isClient"
                value="Sim"
                required
                className="mr-3 h-5 w-5 bg-black border-gray-300"
                checked={formFields.isClient === "Sim"}
                onChange={handleFieldChange}
                onInvalid={(e) => e.preventDefault()}
              />
              Sim
            </label>
            <label className="flex items-center p-2 hover:bg-gray-50 rounded transition">
              <input
                type="radio"
                name="isClient"
                value="Não"
                className="mr-3 h-5 w-5 bg-black border-gray-300"
                checked={formFields.isClient === "Não"}
                onChange={handleFieldChange}
                onInvalid={(e) => e.preventDefault()}
              />
              Não
            </label>
          </div>
          {state.errors?.isClient && (
            <p className="text-red-500 text-sm mt-1">{state.errors.isClient}</p>
          )}
        </div>

        {/* Vehicle Type Field */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <p className="block font-medium mb-4">
            Que tipo de Veículo você procura?{" "}
            <span className="text-red-600">*</span>
          </p>
          <div className="space-y-2">
            <label className="flex items-center p-2 hover:bg-gray-50 rounded transition">
              <input
                type="radio"
                name="vehicleType"
                value="Novo"
                required
                className="mr-3 h-5 w-5 border-gray-300"
                checked={formFields.vehicleType === "Novo"}
                onChange={handleFieldChange}
                onInvalid={(e) => e.preventDefault()}
              />
              Novo
            </label>
            <label className="flex items-center p-2 hover:bg-gray-50 rounded transition">
              <input
                type="radio"
                name="vehicleType"
                value="Seminovo"
                className="mr-3 h-5 w-5 border-gray-300"
                checked={formFields.vehicleType === "Seminovo"}
                onChange={handleFieldChange}
                onInvalid={(e) => e.preventDefault()}
              />
              Seminovo
            </label>
          </div>
          {state.errors?.vehicleType && (
            <p className="text-red-500 text-sm mt-1">
              {state.errors.vehicleType}
            </p>
          )}
        </div>

        {/* Vehicle Model Field */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <label htmlFor="vehicleModel" className="block font-medium mb-4">
            Qual modelo Toyota você procura?
            <span className="text-red-600">*</span>
          </label>
          <div className="space-y-2">
            <select
              name="vehicleModel"
              id="vehicleModel"
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-black focus:border-black focus:outline-none"
              value={formFields.vehicleModel}
              onChange={handleFieldChange}
              onInvalid={(e) => e.preventDefault()}
            >
              <option value="" disabled>
                Selecione um modelo
              </option>
              <option value="COROLLACROSS">Corolla Cross</option>
              <option value="RAV4">RAV4</option>
              <option value="COROLLASEDAN">Corolla Sedan</option>
              <option value="OUTROTOYOTA">Outro Toyota</option>
              <option value="SEMINOVO">Seminovo</option>
            </select>
          </div>
          {state.errors?.vehicleModel && (
            <p className="text-red-500 text-sm mt-1">
              {state.errors.vehicleModel}
            </p>
          )}
        </div>

        {/* Location Field */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <label htmlFor="location" className="block font-medium mb-4">
            Você quer ser atendido em qual unidade da Sulpar?{" "}
            <span className="text-red-600">*</span>
          </label>
          <select
            id="location"
            name="location"
            required
            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-black focus:border-black focus:outline-none"
            value={formFields.location}
            onChange={handleFieldChange}
            onInvalid={(e) => e.preventDefault()}
          >
            <option value="" disabled>
              Selecione uma unidade
            </option>
            <option value="ALTODAXV">Alto da XV - Av. Nossa Senhora da Luz, 1248 - Alto da XV - Curitiba</option>
            <option value="HAUER">Hauer - Av. Marechal Floriano Peixoto, 4796 - Hauer - Curitiba</option>
            <option value="PARANAGUA">Paranaguá - Alameda Coronel Elysio Pereira, 204 - Estradinha - Paranaguá</option>
          </select>
          {state.errors?.location && (
            <p className="text-red-500 text-sm mt-1">{state.errors.location}</p>
          )}
        </div>

        {/* Time Period Field */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <p className="block font-medium mb-4">
            Você prefere nos visitar em qual período do dia?{" "}
            <span className="text-red-600">*</span>
          </p>
          <div className="space-y-2">
            <label className="flex items-center p-2 hover:bg-gray-50 rounded transition">
              <input
                type="radio"
                name="timePeriod"
                value="Manhã"
                required
                className="mr-3 h-5 w-5 border-gray-300"
                checked={formFields.timePeriod === "Manhã"}
                onChange={handleFieldChange}
                onInvalid={(e) => e.preventDefault()}
              />
              Manhã
            </label>
            <label className="flex items-center p-2 hover:bg-gray-50 rounded transition">
              <input
                type="radio"
                name="timePeriod"
                value="Tarde"
                className="mr-3 h-5 w-5 border-gray-300"
                checked={formFields.timePeriod === "Tarde"}
                onChange={handleFieldChange}
                onInvalid={(e) => e.preventDefault()}
              />
              Tarde
            </label>
          </div>
          {state.errors?.timePeriod && (
            <p className="text-red-500 text-sm mt-1">
              {state.errors.timePeriod}
            </p>
          )}
        </div>

        {/* Visit Day Field */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <label htmlFor="visitDay" className="block font-medium mb-4">
            Qual é o melhor dia para você participar do evento?{" "}
            <span className="text-red-600">*</span>
          </label>
          <select
            id="visitDay"
            name="visitDay"
            required
            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-black focus:border-black focus:outline-none"
            value={formFields.visitDay}
            onChange={handleFieldChange}
            onInvalid={(e) => e.preventDefault()}
          >
            <option value="" disabled>
              Selecione um dia
            </option>
            <option value="11/08 - Segunda-feira">11/08 - Segunda-feira</option>
            <option value="12/08 - Terça-feira">12/08 - Terça-feira</option>
            <option value="13/08 - Quarta-feira">13/08 - Quarta-feira</option>
            <option value="14/08 - Quinta-feira">14/08 - Quinta-feira</option>
            <option value="15/08 - Sexta-feira">15/08 - Sexta-feira</option>
            <option value="16/08 - Sábado">16/08 - Sábado</option>
          </select>
          {state.errors?.visitDay && (
            <p className="text-red-500 text-sm mt-1">{state.errors.visitDay}</p>
          )}
        </div>

        {/* Submit Button */}
        <div className="flex justify-between items-center mt-6 px-1">
          <div className="text-red-600 text-sm">
            * Indica uma pergunta obrigatória
          </div>
          <SubmitButton isPending={isPending} />
        </div>
      </form>

      <div className="text-center text-xs text-gray-500 mt-8 pb-4">
        <p>Este formulário não é criado nem endossado pelo Google.</p>
      </div>
    </section>
  );
};

const LoadingFallback = () => {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
    </div>
  );
};

const LeadForm = () => {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <LeadFormContent />
    </Suspense>
  );
};

export default LeadForm;
