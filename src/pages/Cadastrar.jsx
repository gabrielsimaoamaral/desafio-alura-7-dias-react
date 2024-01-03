import React, { useState } from 'react'
import classNames from 'classnames'
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { useForm } from 'react-hook-form'
import { App } from '../layouts/App'
import { Link, useNavigate } from 'react-router-dom'

export default function Cadastrar() {
    const [requisicao, setRequisicao] = useState(false)
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm()
    const navigate = useNavigate();

    const onSubmit = ({ email, password }) => {
        setRequisicao(true);
        const auth = getAuth();
        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                localStorage.setItem("access-token", userCredential.user.accessToken);
                navigate("/");
            })
            .catch((error) => console.error(error.message))
            .finally(() => setRequisicao(false))
    }

    return (
        <App>
            <div className="flex items-center justify-center w-screen h-screen flex-col">
                <h2 className="font-sans text-3xl text-sky-500 pb-1">Aluritter</h2>
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="flex flex-col w-full lg:w-1/4 md:w-1/3 sm:w-1/2 px-10 sm:px-0"
                >
                    <div>
                        <input
                            {...register("email", {
                                required: true,
                                maxLength: 255,
                                minLength: 10,
                            })}
                            className={classNames(
                                "w-full p-2 border border-slate-400 rounded text-gray-500 placeholder-slate-400",
                                {
                                    "border-red-500": errors.email?.type === "required",
                                }
                            )}
                            type='email'
                            placeholder='email@exemplo.com'
                        />
                        {errors.email?.type === "required" ? (
                            <span className="text-xs text-red-500 pl-1">
                                Email é obrigatório
                            </span>
                        ) : null}
                        {errors.email?.type === "minLength" ? (
                            <span className="text-xs text-red-500 pl-1">
                                O email precisa ter pelo menos dez caracteres
                            </span>
                        ) : null}
                    </div>
                    <div className="mt-2.5">
                        <input
                            {...register("password", {
                                required: true,
                                maxLength: 255,
                                minLength: 8,
                            })}
                            className={classNames(
                                "w-full p-2 border border-slate-400 rounded text-gray-500 placeholder-slate-400",
                                {
                                    "border-red-500": !!errors.password,
                                }
                            )}
                            type='password'
                            placeholder='Senha'
                        />
                        {errors.password?.type === "required" ? (
                            <span className="text-xs text-red-500 pl-1">
                                Senha é obrigatória
                            </span>
                        ) : null}
                        {errors.password?.type === "minLength" ? (
                            <span className="text-xs text-red-500 pl-1">
                                A senha precisa ter pelo menos oito caracteres
                            </span>
                        ) : null}
                    </div>
                    <button
                        className={classNames(
                            "mt-5 p-2 rounded bg-emerald-500 text-slate-100",
                            {
                                "bg-slate-300": requisicao,
                                "hover:bg-emerald-600": !requisicao,
                            }
                        )}
                        disabled={requisicao}
                        type='submit'
                    >Criar uma nova conta</button>
                </form>
                <span className="text-sm mt-2 text-gray-500">
                    Já possui uma conta?{" "}
                    <Link className="text-sky-500 hover:underline" to="/acesso">
                        Acesse agora!
                    </Link>
                </span>
            </div>
        </App>
    )
}
