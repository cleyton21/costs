import React, { useEffect, useState } from 'react';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue, remove, update } from 'firebase/database';
import firebaseConfig from '../../firebase.config.js';
import styles from './Projects.module.css';
import LinkButton from '../layout/LinkButton';
import Message from '../layout/Message';
import Container from '../layout/Container';
import ProjectCard from '../Project/ProjectCard';
import Loading from '../layout/Loading';
import { useNavigate } from 'react-router-dom';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

function Projects() {
    const [projects, setProjects] = useState([]);
    const [removeLoading, setRemoveLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [projectMessage, setProjectMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const projectsRef = ref(database, 'projects');
        onValue(projectsRef, (snapshot) => {
            const data = snapshot.val();
            const projectsArray = data ? Object.keys(data).map(key => ({ id: key, ...data[key] })) : [];
            setProjects(projectsArray);
            setRemoveLoading(true);
        }, (error) => {
            console.log(error);
        });
    }, []);

    const removeProject = (id) => {
        const projectRef = ref(database, `projects/${id}`);
        remove(projectRef)
            .then(() => {
                setProjects((prevProjects) => prevProjects.filter(project => project.id !== id));
                setProjectMessage('Projeto removido com sucesso!');
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const editProject = (id) => {
        navigate(`/project/${id}`);
    };

    return (
        <div className={styles.project_container}>
            <div className={styles.title_container}>
                <h1>Meus Projetos</h1>
                <LinkButton to="/newproject" text="Criar Projeto" />
            </div>
            {message && <Message type="success" msg={message} />} 
            {projectMessage && <Message type="success" msg={projectMessage} />}
            <Container customClass="start">
                {projects.length > 0 && 
                    projects.map((project) => (
                        <ProjectCard 
                            key={project.id} 
                            id={project.id} 
                            name={project.name} 
                            budget={project.budget} 
                            category={project.category ? project.category.name : 'Sem Categoria'} 
                            handleRemove={removeProject}
                            handleEdit={editProject}
                        />
                    ))
                }
                {!removeLoading && <Loading />}
                {removeLoading && projects.length === 0 && (
                    <p>Não há projetos cadastrados!</p>
                )}
            </Container>
        </div>
    )
}

export default Projects;