import heroBg from '../assets/hero-desa.png';

const PageHeaderPhoto = ({ badge, badgeIcon, title, subtitle }) => {
  return (
    <div
      className="page-header-photo"
      style={{ backgroundImage: `url(${heroBg})` }}
    >
      <div className="page-header-overlay-new">
        <div className="page-header-inner">
          {badge && (
            <div className="ph-badge">
              {badgeIcon}
              {badge}
            </div>
          )}

          <h1 className="ph-title-gradient">{title}</h1>

          {subtitle && <p>{subtitle}</p>}
        </div>
      </div>
    </div>
  );
};

export default PageHeaderPhoto;