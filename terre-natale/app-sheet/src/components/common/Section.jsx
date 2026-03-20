function Section({ title, children, className = '', headerContent }) {
  return (
    <section className={`section ${className}`}>
      <div className="section-header">
        <h2 className="section-title">{title}</h2>
        {headerContent}
      </div>
      {children}
    </section>
  );
}

export default Section;
