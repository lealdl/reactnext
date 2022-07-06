import React, { useState } from 'react';
import Head from 'next/head';
import Script from 'next/script';
import * as yup from 'yup';

import Menu from '../components/Menu';
import Footer from '../components/Footer';

function Chamado({ data }) {

    const [content, setContent] = useState({
        nome: '',
        whatsapp: '',
        endereco: '',
        equipamento: '',
        marca: '',
        modelo: '',
        defeito: ''
    });

    const [response, setResponse] = useState({
        formSave: false,
        type: '',
        mensagem: ''
    })

    const onChangeInput = e => setContent({ ...content, [e.target.name]: e.target.value });

    const sendChamado = async e => {
        e.preventDefault();

        if (!(await validate())) return;

        setResponse({ formSave: true });

        try {
            const res = await fetch('http://localhost:8090/site-chamado/chamados', {
                method: 'POST',
                body: JSON.stringify(content),
                headers: { 'Content-Type': 'application/json' }
            });

            const responseEnv = await res.json();

            if (responseEnv.erro) {
                setResponse({
                    formSave: false,
                    type: 'error',
                    mensagem: responseEnv.mensagem
                });
            } else {
                setResponse({
                    formSave: false,
                    type: 'success',
                    mensagem: responseEnv.mensagem
                });
                setContent({
                    nome: '',
                    whatsapp: '',
                    endereco: '',
                    equipamento: '',
                    marca: '',
                    modelo: '',
                    defeito: ''
                });
            }
        } catch (err) {
            setResponse({
                formSave: false,
                type: 'error',
                mensagem: "Erro: Mensagem de contato não enviando com sucesso, tente novamente!"
            });
        }
    }

    async function validate() {
        let schema = yup.object().shape({
            nome: yup.string("Erro: Necessário preencher o campo nome!")
                .required("Erro: Necessário preencher o campo nome!"),
            whatsapp: yup.string("Erro: Necessário preencher o campo whatsapp!")
                .required("Erro: Necessário preencher o campo whatsapp!"),
            endereco: yup.string("Erro: Necessário preencher o campo endereco!")
                .required("Erro: Necessário preencher o campo endereco!"),

            equipamento: yup.string("Erro: Necessário preencher o campo equipamento!")
                .required("Erro: Necessário preencher o campo equipamento!")




        });

        try {
            await schema.validate(content);
            return true;
        } catch (err) {
            setResponse({
                type: 'error',
                mensagem: err.errors
            });
            return false;
        }
    }

    return (
        <div>
            <Head>
                <meta charSet="utf-8" />
                <meta name="robots" content="index, follow" />
                <meta name="description" content={data.dataSeo.description} />
                <meta name="author" content="Luciano D. Leal - Clinihard Sistemas" />
                <meta name="viewport" content="initial-scale=1.0, width=device-width" />
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css" />
                <title>{data.dataSeo.title}</title>
            </Head>
            <Menu />

            <section className="contact">
                <div className="max-width">
                    <h2 className="title">{data.dataContact.title_contact}</h2>
                    <div className="contact-content">
                        <div className="column left">
                            <p>{data.dataContact.desc_contact}</p>
                            <div className="icons">
                                <div className="row">
                                    <i className={data.dataContact.icon_company}></i>
                                    <div className="info">
                                        <div className="head">
                                            {data.dataContact.title_company}
                                        </div>
                                        <div className="sub-title">
                                            {data.dataContact.desc_company}
                                        </div>
                                    </div>
                                </div>

                                <div className="row">
                                    <i className={data.dataContact.icon_address}></i>
                                    <div className="info">
                                        <div className="head">
                                            {data.dataContact.title_address}
                                        </div>
                                        <div className="sub-title">
                                            {data.dataContact.desc_address}
                                        </div>
                                    </div>
                                </div>

                                <div className="row">
                                    <i className={data.dataContact.icon_email}></i>
                                    <div className="info">
                                        <div className="head">
                                            {data.dataContact.title_email}
                                        </div>
                                        <div className="sub-title">
                                            {data.dataContact.desc_email}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="column right">
                            <div className="text">
                                {data.dataContact.title_form}
                            </div>

                            {response.type === 'error' ? <p className="alert-danger">{response.mensagem}</p> : ""}
                            {response.type === 'success' ? <p className="alert-success">{response.mensagem}</p> : ""}

                            <form onSubmit={sendChamado}>
                                <div className="fields">
                                    <div className="field nome">
                                        <input type="text" name="nome" placeholder="Digite o nome" onChange={onChangeInput} value={content.nome} />
                                    </div>
                                    <div className="field whatsapp">
                                        <input type="text" name="whatsapp" placeholder="Digite o whatsapp" onChange={onChangeInput} value={content.whatsapp} />
                                    </div>
                                </div>
                                <div className="field endereco">
                                    <input type="text" name="endereco" placeholder="Digite o endereco" onChange={onChangeInput} value={content.endereco} />
                                </div>
                                <div className="field equipamento">
                                    <input type="text" name="equipamento" placeholder="Digite o equipamento" onChange={onChangeInput} value={content.equipamento} />
                                </div>
                                <div className="button-area">
                                    {response.formSave ? <button type="submit" disabled>Enviando...</button> : <button type="submit">Enviar</button>}
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </section>

            <Footer data={data.dataFooter} />

            <Script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js" strategy="beforeInteractive" />

            <Script src="custom.js" strategy="afterInteractive" />
        </div>
    );
}

export async function getServerSideProps() {
    const response = await fetch(`http://localhost:8090/site-msg_chamado/chamado`);
    const data = await response.json();
    //console.log(data);

    return { props: { data } };
}

export default Chamado;