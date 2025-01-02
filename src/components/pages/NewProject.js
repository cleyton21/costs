import { useNavigate } from "react-router-dom"; // para redirecionamentos
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, push } from 'firebase/database';
import firebaseConfig from '../../firebase.config.js';
import ProjectForm from "../Project/ProjectForm";
import styles from "./NewProject.module.css";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

function NewProject() {

    const navigate = useNavigate(); // para redirecionamentos

    function createPost(project) {
        // initialize cost and services
        project.cost = 0;
        project.services = [];

        const projectsRef = ref(database, 'projects');
        push(projectsRef, project)
            .then(() => {
                navigate('/projects', { state: { message: 'Projeto criado com sucesso!' } });
            })
            .catch((err) => console.log(err));
    }

    return (
        <div className={styles.newproject_container}>
            <h1>Criar Projeto</h1>
            <p>Crie seu projeto para depois adicionar os serviços</p>
            <ProjectForm handleSubmit={createPost} btnText="Criar Projeto"/>
        </div>
    );
}

export default NewProject;