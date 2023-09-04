"use client"
import Cookie from 'js-cookie'
import { useRouter } from 'next/navigation'
import { Fragment, useRef, useState, useEffect } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'
import { surveyService } from '@/services'
interface User {
  token: string;
}

interface Survey {
  id(id: string): void
  fullName: string;
  identification: string
  carModel: string
  buyingFactors: string
  drivingRating: number
  satisfactionRating: number
}

let user: User | null = null;
const userData = Cookie.get("AUTH")

const getSurveys = async (): Promise<Survey[]> => {
  user = JSON.parse(userData as string);
  if (user) {
    const result = await surveyService.getSurveys(user.token)
    const data = await result;
    return data;
  }
  
  return []
};

export default function Dashboard() {
  const [open, setOpen] = useState(false)

  const cancelButtonRef = useRef(null)

  const router = useRouter();
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [surveyId, setSurveyId] = useState<string>();

  const getSurvey = async (id: string) => {
    setSurveyId(id);
    setOpen(true)
  }

  const deleteSurvey = async (id: string) => {
    user = JSON.parse(userData as string);
    if (user) {
      const deleted = await surveyService.deleteSurvey(id, user.token)
      const surveys = await surveyService.getSurveys(user.token)
      setSurveys(surveys)
      setOpen(false)
    }
  }

  useEffect(() => {
    async function fetchSurveys() {
      try {
        const surveysData = await getSurveys();
        setSurveys(surveysData);
      } catch (error) {
        console.error('Error fetching surveys:', error);
      }
    }

    fetchSurveys();

    const isLogged = window.localStorage.getItem("AUTH")
    if (isLogged) router.push("/dashboard");
  }, []);

  const goToSurvey = (id: string) => {
    router.push(`/dashboard/survey/${id}`);
  };

  const generateStars = (rating: number) => {
    return Array.from({ length: rating }, (_, index) => (
      <img key={index} className="inline-block" width={15} src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0nMTkyJyBoZWlnaHQ9JzE4MCcgeG1sbnM9J2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJz48cGF0aCBmaWxsPSdibGFjaycgZD0nbTk2IDEzNy4yNjMtNTguNzc5IDQyLjAyNCAyMi4xNjMtNjguMzg5TC44OTQgNjguNDgxbDcyLjQ3Ni0uMjQzTDk2IDBsMjIuNjMgNjguMjM4IDcyLjQ3Ni4yNDMtNTguNDkgNDIuNDE3IDIyLjE2MyA2OC4zODl6JyBmaWxsLXJ1bGU9J2V2ZW5vZGQnLz48L3N2Zz4=" alt="Estrella" />
    ));
  };
  
  return (
    <>
      <Transition.Root show={open} as={Fragment}>
        <Dialog as="div" className="relative z-10" initialFocus={cancelButtonRef} onClose={setOpen}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                  <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                    <div className="sm:flex sm:items-start">
                      <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                        <ExclamationTriangleIcon className="h-6 w-6 text-red-600" aria-hidden="true" />
                      </div>
                      <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                        <Dialog.Title as="h3" className="text-base font-semibold leading-6 text-gray-900">
                          Eliminar encuesta
                        </Dialog.Title>
                        <div className="mt-2">
                          <p className="text-sm text-gray-500">
                            ¿Estas seguro que deseas eliminar la encuesta? Toda la información será eliminada. Esta acción no se puede deshacer.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                    <button
                      type="button"
                      className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                      onClick={() => deleteSurvey(surveyId as string)}
                    >
                      Eliminar
                    </button>
                    <button
                      type="button"
                      className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                      onClick={() => setOpen(false)}
                      ref={cancelButtonRef}
                    >
                      Cancel
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
      <ul role="list" className="divide-y divide-gray-100">
        {surveys.map((person) => (
          <li key={person.identification} className="flex justify-between gap-x-6 py-5">
            <div className="flex min-w-0 gap-x-4">
              <div className="min-w-0 flex-auto">
                <p className="mt-1 truncate text-xs leading-5 text-gray-900">
                  <span className="font-semibold">Nombre completo:</span>
                  <br />
                  {person.fullName}
                </p>
                <p className="mt-1 truncate text-xs leading-5 text-gray-900">
                 <span className="font-semibold">Numero de identificación:</span>
                 <br />
                 {person.identification}
                </p>
                <p className="mt-1 truncate text-xs leading-5 text-gray-900">
                  <span className="font-semibold">Modelo del automóvil:</span>
                  <br />
                  {person.carModel}
                </p>
                <p className="mt-1 truncate text-xs leading-5 text-gray-900">
                  <span className="font-semibold">Factores de compra:</span>
                  <br />
                  {person.buyingFactors}
                </p>
                <p className="mt-1 truncate text-xs leading-5 text-gray-900">
                  <span className="font-semibold">Calificación de la prueba de manejo:</span> 
                  <br />
                  {generateStars(person.drivingRating)}
                </p>
                <p className="mt-1 truncate text-xs leading-5 text-gray-900">
                  <span className="font-semibold">Calificación de satisfacción:</span> 
                  <br />
                  {generateStars(person.satisfactionRating)}
                </p>
              </div>
            </div>
            <div className="hidden shrink-0 sm:flex">
              <button className="mx-1" onClick={() => goToSurvey(person.id as unknown as string)}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                </svg>
              </button>
              <button className="mx-1" onClick={() => getSurvey(person.id as unknown as string)}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-red-500">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                </svg>
              </button>
            </div>
          </li>
        ))}
      </ul>
    </>
  )
}