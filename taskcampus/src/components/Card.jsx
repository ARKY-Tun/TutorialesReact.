const Card = ({ titulo, children }) => {
    return (
        <section className="card">
            {titulo && <h2 className="section-title">{titulo}</h2>}
            {children}
        </section>
    );
};

export default Card;