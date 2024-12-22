import {parse, v4 as uuidv4} from 'uuid'
import styles from './Project.module.css'

import { useParams } from 'react-router-dom' // para pegar o id do projeto
import  { useState, useEffect } from 'react'

import Loading from '../layout/Loading'
import Container from '../layout/Container'
import ProjectForm from '../Project/ProjectForm'
import Message from '../layout/Message'
import ServiceForm from '../service/ServiceForm'

function Project() {    
    const { id } = useParams()
    
    const [project, setProject] = useState({})
    const [showProjectForm, setShowProjectForm] = useState(false)
    const [showServiceForm, setShowServiceForm] = useState(false)
    const [message, setMessage] = useState()
    const [Type, setType] = useState()
    
    useEffect(() => {
        setTimeout(() => {
            fetch(`http://localhost:5000/projects/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            })
                .then((resp) => resp.json())
                .then((data) => {
                    setProject(data)
                })
                .catch((err) => console.log(err))
        }, 300)
    }, [id])

    function editPost(project) {
        setMessage('')

        if (project.budget < project.cost) {
            setMessage('O orcamento nao pode ser menor que o total gasto!')
            setType('error')
            return false
        }

        fetch(`http://localhost:5000/projects/${project.id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(project),
        })
            .then((resp) => resp.json())
            .then((data) => {
                setProject(data)
                setShowProjectForm(false)
                setMessage('Projeto atualizado!')
                setType('success')
            })
            .catch((err) => console.log(err))
    }

    function createService(project) {
        setMessage('')

        //last service
        let lastService = project.services[project.services.length - 1]

        lastService.id = uuidv4()

        const lastServiceCost = lastService.cost

        const newCost = parseFloat(project.cost) + parseFloat(lastServiceCost)

        //maximum value validation
        if(newCost > parseFloat(project.budget)){
            setMessage('Orçamento ultrapassado, verifique o valor do serviço!')
            setType('error')
            project.services.pop() //remove the last service
            return false
        }

        //add service cost to project total cost
        project.cost = newCost


        //update project
        fetch(`http://localhost:5000/projects/${project.id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(project),
        })
            .then((resp) => resp.json())
            .then((data) => {
                //exibir os serviços
            })
            .catch((err) => console.log(err))
        }

    function toggleProjectForm() {
        setShowProjectForm(!showProjectForm)
    }

    function toggleServiceForm() {
        setShowServiceForm(!showServiceForm)
    }
    
    return (
        <>
            {project.name ? (
                <div className={styles.project_details}>
                    <Container customClass="column">
                        {message && <Message type={Type} msg={message}/>}
                        <div className={styles.details_container}>
                            <h1>Projeto: {project.name}</h1>
                            <button className={styles.btn} onClick={ toggleProjectForm }>
                                {!showProjectForm ? 'Editar projeto' : 'Fechar'}
                            </button>
                            {!showProjectForm ? (
                                <div className={styles.project_info}>
                                    <p>
                                        <span>Categoria:</span> {project.category.name}
                                    </p>
                                    <p>
                                        <span> Total de Orcamento:</span> R${project.budget}
                                    </p>
                                    <p>
                                        <span> Total Utilizado:</span> R${project.cost}
                                    </p>
                                </div>
                            ) : (
                                <div className={styles.project_info}>
                                   <ProjectForm 
                                    handleSubmit={editPost} 
                                    btnText={"Editar Projeto"} 
                                    projectData={project}
                                    />
                                </div>
                            )}
                        </div> 
                        <div className={styles.service_form_container}> 
                            <h2>Adicione um serviço:</h2>
                            <button className={styles.btn} onClick={ toggleServiceForm }>
                                {!showServiceForm ? 'Adicionar serviço' : 'Fechar'}
                            </button>
                            <div className={styles.project_info}>
                                {showServiceForm && 
                                    <ServiceForm
                                        handleSubmit={createService}
                                        btnText={"Adicionar Servico"}
                                        projectData={project}
                                    />
                                }
                            </div>
                        </div>
                        <h2>Servicos</h2>
                        <Container customClass="start"> 
                            <p>itens de serviços</p>
                        </Container>
                    </Container>
                </div>
            ) : (
                <Loading />
            
            )}
        </>
    )
}

export default Project