import styles from './Select.module.css';

function Select({ type, options, text, name, placeholder, handleOnChange, value }){
    return(
        <div className={styles.form_control}>

            <label htmlFor={name}>{text}:</label>

            <select 
                name={name} 
                id={name} 
                onChange={handleOnChange} 
                value={value || ''}
            >
                <option>Selecione uma opção</option>
                {options.map((option) => (
                    <option key={option.id} value={option.id}>
                        {option.name}
                    </option>
                ))}
            </select>
        </div>
    )
}

export default Select;