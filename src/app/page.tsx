"use client";
import Cookie from 'js-cookie'
import { useRouter } from "next/navigation";
import React, { useEffect, useRef } from "react";
import { authService } from "@/services";
import toast, { Toaster } from 'react-hot-toast';

export default function Login() {
  const usernameRef = useRef("");
  const passwordRef = useRef("");
  const router = useRouter();
  const handleForm = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (usernameRef.current && passwordRef.current) {
      const data={
        username: usernameRef.current,
        password: passwordRef.current
      }
      const result = await authService.authentication(data)
      if (result.statusCode === 404) {
        toast.error(result.message, {
          duration: 2000,
          position: 'bottom-center',
        });
      }
      
      if(result.role) {
        Cookie.set('AUTH', JSON.stringify(result));

        if(result.role.name === 'Administrator') {
          router.push('/dashboard')
        }
      }

      if (result?.error) {
        console.log(result.error);
      }
    }
  };
  useEffect(() => {
    const auth = Cookie.get('AUTH')
    if (auth) {
      const cookieStore = JSON.parse(auth);
      const isLogged = cookieStore
      if(isLogged.role.name === 'Administrator') {
        router.push('/dashboard')
      }
    }else{
      router.push('/')
    }
  })
  return (
    <>
      {/*
        This example requires updating your template:

        ```
        <html class="h-full bg-white">
        <body class="h-full">
        ```
      */}
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Car Center
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-6" onSubmit={handleForm}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                Nombre de usuario
              </label>
              <div className="mt-2">
                <input
                  onChange={(e) => (usernameRef.current = e.target.value)}
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  required
                  className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                  Contraseña
                </label>
              </div>
              <div className="mt-2">
                <input
                  onChange={(e) => (passwordRef.current = e.target.value)}
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Iniciar Sesión
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}
