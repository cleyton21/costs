import { parse, v4 as uuidv4 } from 'uuid';
import styles from './Project.module.css';
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue, update } from 'firebase/database';
import firebaseConfig from '../../firebase.config.js';

import Loading from '../layout/Loading';
import Container from '../layout/Container';
import ProjectForm from '../Project/ProjectForm';
import Message from '../layout/Message';
import ServiceForm from '../service/ServiceForm';
import ServiceCard from '../service/ServiceCard';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

function Project() {
    const { id } = useParams();
    const [project, setProject] = useState({});
    const [services, setServices] = useState([]);
    const [showProjectForm, setShowProjectForm] = useState(false);
    const [showServiceForm, setShowServiceForm] = useState(false);
    const [message, setMessage] = useState();
    const [type, setType] = useState();

    useEffect(() => {
        const projectRef = ref(database, 'projects');
        onValue(projectRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                console.log("Project data:", data); // Adicione este log para verificar os dados
                setProject(data);
                setServices(data.services || []);
            } else {
                console.log("No data available");
            }
        }, (error) => {
            console.error("Error fetching project data:", error);
        });
    }, [id]);

    const editPost = (project) => {
        setMessage('');

        if (project.budget < project.cost) {
            setMessage('O orçamento não pode ser menor que o total gasto!');
            setType('error');
            return false;
        }

        const projectRef = ref(database, `projects/${project.id}`);
        update(projectRef, project)
            .then(() => {
                setProject(project);
                setShowProjectForm(false);
                setMessage('Projeto atualizado!');
                setType('success');
            })
            .catch((error) => {
                console.error("Error updating project:", error);
            });
    };

    const createService = (project) => {
        setMessage('');

        let lastService = project.services[project.services.length - 1];
        lastService.id = uuidv4();

        const lastServiceCost = lastService.cost;
        const newCost = parseFloat(project.cost) + parseFloat(lastServiceCost);

        if (newCost > parseFloat(project.budget)) {
            setMessage('Orçamento ultrapassado, verifique o valor do serviço!');
            setType('error');
            project.services.pop();
            return false;
        }

        project.cost = newCost;

        const projectRef = ref(database, `projects/${project.id}`);
        update(projectRef, project)
            .then(() => {
                setShowServiceForm(false);
            })
            .catch((error) => {
                console.error("Error updating project with new service:", error);
            });
    };

    const removeService = (id, cost) => {
        setMessage('');

        const servicesUpdated = project.services.filter((service) => service.id !== id);
        const projectUpdated = { ...project, services: servicesUpdated, cost: parseFloat(project.cost) - parseFloat(cost) };

        const projectRef = ref(database, `projects/${projectUpdated.id}`);
        update(projectRef, projectUpdated)
            .then(() => {
                setProject(projectUpdated);
                setServices(servicesUpdated);
                setMessage('Serviço removido com sucesso!');
                setType('success');
            })
            .catch((error) => {
                console.error("Error removing service:", error);
            });
    };

    const toggleProjectForm = () => {
        setShowProjectForm(!showProjectForm);
    };

    const toggleServiceForm = () => {
        setShowServiceForm(!showServiceForm);
    };

    return (
        <>
            {project.name ? (
                <div className={styles.project_details}>
                    <Container customClass="column">
                        {message && <Message type={type} msg={message} />}
                        <div className={styles.details_container}>
                            <h1>Projeto: {project.name}</h1>
                            <button className={styles.btn} onClick={toggleProjectForm}>
                                {!showProjectForm ? 'Editar projeto' : 'Fechar'}
                            </button>
                            {!showProjectForm ? (
                                <div className={styles.project_info}>
                                    <p>
                                        <span>Categoria:</span> {project.category.name}
                                    </p>
                                    <p>
                                        <span>Total de Orçamento:</span> R${project.budget}
                                    </p>
                                    <p>
                                        <span>Total Utilizado:</span> R${project.cost}
                                    </p>
                                </div>
                            ) : (
                                <div className={styles.project_info}>
                                    <ProjectForm handleSubmit={editPost} btnText="Editar Projeto" projectData={project} />
                                </div>
                            )}
                        </div>
                        <div className={styles.service_form_container}>
                            <h2>Adicione um serviço:</h2>
                            <button className={styles.btn} onClick={toggleServiceForm}>
                                {!showServiceForm ? 'Adicionar serviço' : 'Fechar'}
                            </button>
                            <div className={styles.project_info}>
                                {showServiceForm && (
                                    <ServiceForm handleSubmit={createService} btnText="Adicionar Serviço" projectData={project} />
                                )}
                            </div>
                        </div>
                        <h2>Serviços</h2>
                        <Container customClass="start">
                            {services.length > 0 &&
                                services.map((service) => (
                                    <ServiceCard
                                        id={service.id}
                                        name={service.name}
                                        cost={service.cost}
                                        description={service.description}
                                        key={service.id}
                                        handleRemove={removeService}
                                    />
                                ))}
                            {services.length === 0 && <p>Não foram encontrados serviços!</p>}
                        </Container>
                    </Container>
                </div>
            ) : (
                <Loading />
            )}
        </>
    );
}

export default Project;