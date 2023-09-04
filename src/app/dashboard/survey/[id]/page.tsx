"use client";
import { surveyService } from '@/services';
import { data } from 'autoprefixer';
import Cookie, { set } from 'js-cookie'
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import toast, { Toaster } from 'react-hot-toast';
interface User {
  token: string;
}

interface Survey {
  id: string;
  fullName: string;
  identification: number;
  carModel: string;
  buyingFactors: string;
  drivingRating: number | string;
  satisfactionRating: number | string;
}

export default function EditSurvey({ params }: { params: { id: string } }) {
  const { id } = params;
  const [survey, setSurvey] = useState<Survey>({
    id: "",
    fullName: "",
    identification: 0,
    carModel: "",
    buyingFactors: "",
    drivingRating: 0,
    satisfactionRating: 0
  });
  const fullNameRef = useRef<HTMLInputElement>(null);
  const identificationRef = useRef<HTMLInputElement>(null);
  const carModelRef = useRef<HTMLInputElement>(null);
  const buyingFactorsRef = useRef<HTMLSelectElement>(null);
  const drivingRatingRefs = useRef<Array<HTMLInputElement | null>>([]);
  const satisfactionRatingRefs = useRef<Array<HTMLInputElement | null>>([]);


  const router = useRouter();

  const getUserData = () => {
    const userData = Cookie.get("AUTH");
    if (userData) {
      return JSON.parse(userData) as User;
    }
    return null;
  };

  const fetchSurvey = async () => {
    const user = getUserData();
    if (user) {
      try {
        const response = await surveyService.getSurvey(id, user.token);
        if (response.status === 200) {
          const data = await response.json();
          setSurvey(data);
        } else {
          toast.error("Error al obtener la encuesta.", {
            duration: 4000,
            position: 'bottom-center',
          });
          router.push("/");
        }
      } catch (error) {
        console.error('Error al obtener la encuesta:', error);
        toast.error("Error al obtener la encuesta.", {
          duration: 4000,
          position: 'bottom-center',
        });
        router.push("/");
      }
    }
  };

  const handleForm = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const user = getUserData();
    if (fullNameRef.current && identificationRef.current && carModelRef.current && buyingFactorsRef.current) {
      const selectedDrivingRating = drivingRatingRefs.current.find(
        (ref) => ref && ref.checked
      );
      const selectedSatisfactionRating = satisfactionRatingRefs.current.find(
        (ref) => ref && ref.checked
      );
      if (selectedDrivingRating && selectedSatisfactionRating) {
        const data: Survey = {
          id: survey.id,
          fullName: fullNameRef.current.value,
          identification: parseInt(identificationRef.current.value),
          carModel: carModelRef.current.value,
          buyingFactors: buyingFactorsRef.current.value,
          drivingRating: parseInt(selectedDrivingRating.value),
          satisfactionRating: parseInt(selectedSatisfactionRating.value),
        };
        try {
            if (user) {
              const response = await surveyService.updateSurvey(data as any, user.token);
              if (response.status === 302) {
                toast.success(response.message, {
                  duration: 4000,
                  position: 'bottom-center',
                });
              } else {
                router.push("/");
              }
            }
        
        } catch (error: any) {
          console.log(error);
          toast.error(error.message || "Error al actualizar la encuesta.", {
            duration: 4000,
            position: 'bottom-center',
          });
        }
      }
    }
  };

  const handleRatingChange = (e: React.ChangeEvent<HTMLInputElement>, ratingType: 'drivingRating' | 'satisfactionRating') => {
    const newRating = parseInt(e.target.value);
    setSurvey((prevSurvey) => ({
      ...prevSurvey,
      [ratingType]: newRating,
    }));
  };

  useEffect(() => {
    if (id && id !== survey.id) {
      fetchSurvey();
    }
  }, [id, survey.id]);

  useEffect(() => {
    setSurvey((prevSurvey) => ({
      ...prevSurvey,
      fullName: survey.fullName || "",
      identification: survey.identification || "",
      carModel: survey.carModel || "",
      buyingFactors: survey.buyingFactors || "",
    }));
  }, []);

  useEffect(() => {
    drivingRatingRefs.current = drivingRatingRefs.current.slice(0, 5).map(
      (_, i) => drivingRatingRefs.current[i] || React.createRef()
    );
    satisfactionRatingRefs.current = satisfactionRatingRefs.current.slice(0, 5).map(
      (_, i) => satisfactionRatingRefs.current[i] || React.createRef()
    );
  }, []);

  return (
    <div>
      <div className="px-4 sm:px-0">
        <h3 className="text-base font-semibold leading-7 text-gray-900">Información del cliente</h3>
        <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">Información personal del cliente.</p>
      </div>
      <form className="space-y-6" onSubmit={handleForm}>
        <div className="mt-6 border-t border-gray-100">
          <dl className="divide-y divide-gray-100">
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm font-medium leading-6 text-gray-900">Nombre completo</dt>
              <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                <div className="mt-2">
                  <input
                    ref={fullNameRef}
                    onChange={(e) => setSurvey({ ...survey, fullName: e.target.value })}
                    value={survey.fullName}
                    id="fullName"
                    name="fullName"
                    type="text"
                    autoComplete="fullName"
                    className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </dd>
            </div>
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm font-medium leading-6 text-gray-900">Numero de identificación</dt>
              <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                <div className="mt-2">
                  <input
                    ref={identificationRef}
                    onChange={(e) => setSurvey({ ...survey, identification: e.target.value })}
                    value={survey.identification}
                    id="identification"
                    name="identification"
                    type="text"
                    autoComplete="identification"
                    className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </dd>
            </div>
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm font-medium leading-6 text-gray-900">Modelo del automóvil</dt>
              <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                <div className="mt-2">
                  <input
                    ref={carModelRef}
                    onChange={(e) => setSurvey({ ...survey, carModel: e.target.value })}
                    value={survey.carModel}
                    id="car-model"
                    name="car-model"
                    type="text"
                    autoComplete="car-model"
                    className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </dd>
            </div>
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm font-medium leading-6 text-gray-900">Factores que tuvo en cuenta al comprar el automóvil</dt>
              <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                <div className="mt-2">
                  <select
                    ref={buyingFactorsRef}
                    onChange={(e) => setSurvey({ ...survey, buyingFactors: e.target.value })}
                    id="buying-factors"
                    name="buying-factors"
                    autoComplete="buying-factors"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
                  >
                    <option value="BRAND">La reputación de la marca</option>
                    <option value="FUNDING">Las opciones de financiamiento</option>
                    <option value="PERFORMANCE">El desempeño al manejarlo</option>
                    <option value="RECOMMENDATIONS">Recomendaciones de amigos o familiares</option>
                    <option value="OTHER">Otros</option>
                  </select>
                </div>
              </dd>
            </div>
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm font-medium leading-6 text-gray-900">Calificación de prueba de manejo</dt>
              <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                <div className="rating">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <input
                    key={rating}
                    ref={(el) => (drivingRatingRefs.current[rating - 1] = el)}
                    onChange={(e) => handleRatingChange(e, 'drivingRating')}
                    checked={survey.drivingRating === rating}
                    type="radio"
                    name="drivingRating"
                    className="mask mask-star"
                    value={rating}
                    />
                  ))}
                </div>
              </dd>
            </div>
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm font-medium leading-6 text-gray-900">Calificación de satisfacción</dt>
              <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
              <div className="rating">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <input
                    key={rating}
                    ref={(el) => (satisfactionRatingRefs.current[rating - 1] = el)}
                    onChange={(e) => handleRatingChange(e, 'satisfactionRating')}
                    checked={survey.satisfactionRating === rating}
                      type="radio"
                      name="satisfactionRating"
                      className="mask mask-star"
                      value={rating}
                    />
                  ))}
                </div>
              </dd>
            </div>
          </dl>
          <button
            type="submit"
            className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Guardar
          </button>
        </div>
      </form>
      <Toaster />
    </div>
  )
}