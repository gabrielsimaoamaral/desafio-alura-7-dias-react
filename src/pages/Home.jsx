import React, { useEffect, useState } from 'react'
import PropTypes from "prop-types";
import { getDatabase, ref, set, onValue } from "firebase/database";
import jwtDecode from "jwt-decode"
import { App } from '../layouts/App'
import { useNavigate } from 'react-router-dom'
import * as uuid from "uuid";

export default function Home({ app }) {
  const [texto, setTexto] = useState('');
  const [mensagens, setMensagens] = useState([]);
  const navigate = useNavigate();
  const user = jwtDecode(localStorage.getItem("access-token"));

  useEffect(() => {
    onValue(ref(getDatabase(app), "alurites"), (snapshot) => {
      const data = []
      snapshot.forEach((registry) => {
        data.push({
          ...registry.val(),
          id: registry.key,
        })
      })
      setMensagens(data);
    })
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("access-token");
    navigate("/acesso")
  }

  const handleFormSubmit = (event) => {
    event.preventDefault();
    const db = getDatabase(app);
    set(ref(db, `alurites/${uuid.v4()}`), {
      texto,
      by: user.email,
      when: new Date().getTime(),
    }).then(() => setMensagens(""));
  }

  return (
    <App>
      <div className="bg-gray-100 min-h-screen w-screen">
        <header className="flex justify-between px-5 py-2 border-b bg-white">
          <div className="font-sans text-lg text-sky-500 lowercase">aluritter</div>
          <div className="font-sans text-sm text-gray-500 mr-2">{user.email}
            <button
              className="bg-red-500 text-white lowercase rounded px-2 py-1 text-sm hover:bg-red-600"
              onClick={handleLogout}
              type="button"
            >sair</button>
          </div>
        </header>

        <div className="container mx-auto p-10">
          <form onSubmit={handleFormSubmit}>
            <p className="text-sm text-gray-600 pl-2">Aluritte agora mesmo...</p>
            <div>
              <textarea
                className="border rounded w-full resize-none text-gray-500 p-5 my-2"
                maxLength={255}
                onChange={event => setTexto(event.target.value)}
                rows={3}
                value={texto}
              />
            </div>
            <div className="flex justify-between">
              {texto.length < 255
                ? <p className="text-sm text-green-600">Você ainda pode digitar {255 - texto.length} caracteres</p>
                : <p className="text-sm text-red-600">Você esgotou a quantidade de caracteres</p>
              }
              <button className="bg-sky-500 p-2 rounded text-white hover:bg-sky-600">alurittar</button>
            </div>
          </form>
          <footer className="pt-5">
            {mensagens
              .sort((m1, m2) => m2.when - m1.when)
              .map((m) => (
                <div className="border px-4 py-2 bg-white rounded mt-5 first:mt-0" key={m.id}>
                  <p className="text-gray-500 py-2 mb-5">{m.texto}</p>
                  <div className="flex justify-between">
                    <span className="text-sm text-sky-500">{m.by}</span>
                    <time className="text-xs text-gray-500">{new Date(m.when).toLocaleString()}</time>
                  </div>
                </div>
              ))}
          </footer>
        </div>
      </div>
    </App>
  )
}

Home.propTypes = {
  app: PropTypes.any.isRequired,
}