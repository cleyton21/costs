import { Link } from 'react-router-dom';
import styles from './ProjectCard.module.css'

import { BsPencil, BsFillTrashFill } from 'react-icons/bs'

function ProjectCard({ id, name, budget, category, handleRemove, handleEdit }) {

    const remove = (e) => {
        e.preventDefault();
        handleRemove(id);
    }

    const edit = (e) => {
        e.preventDefault();
        handleEdit(id);
    }

    return(
        <div className={styles.project_card}>
            <h4>{name}</h4>
            <p>
                <span>Orcamento: </span> R${budget}
            </p>
            <p className={styles.category_text}>
                <span className={`${styles[category.toLowerCase()]}`}></span> {category}
            </p>
            <div className={styles.project_card_actions}>
                <Link to={`/project/${id}`} onClick={edit}>
                    <BsPencil /> Editar
                </Link>
                <button onClick={remove}>
                    <BsFillTrashFill/> Excluir
                </button>
            </div>
        </div>
    )
}

export default ProjectCard